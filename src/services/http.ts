import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { tokenStorage } from './tokenStorage'
import { resolveTenantSlug } from '@/theme/themes'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

/**
 * Instancia HTTP central da aplicacao.
 * - Injeta o Bearer token (JWT) em cada requisicao.
 * - Injeta o header X-Tenant (resolvido pelo dominio/slug) para as rotas publicas
 *   que dependem do tenant (noticias, eventos). Nas rotas admin o backend usa o
 *   tenant do JWT, mas enviar o header nao atrapalha.
 * - Trata 401 tentando refresh; se falhar, limpa a sessao.
 */
export const http: AxiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

// Request: injeta Authorization e X-Tenant
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Identifica o tenant atual (por subdominio em prod, ?tenant= em dev).
  // So resolve no browser; no SSR nao ha window e o backend cai no default.
  if (typeof window !== 'undefined') {
    config.headers['X-Tenant'] = resolveTenantSlug()
  }
  return config
})

// Controle de refresh concorrente (evita multiplas chamadas de refresh)
let isRefreshing = false
let pendingQueue: Array<(token: string | null) => void> = []

function flushQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token))
  pendingQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error)
    }

    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      tokenStorage.clear()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // aguarda o refresh em andamento
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(error)
          original._retry = true
          original.headers.Authorization = `Bearer ${token}`
          resolve(http(original))
        })
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken,
      })
      const newAccess: string = data.accessToken
      const newRefresh: string | undefined = data.refreshToken

      tokenStorage.setTokens(newAccess, newRefresh ?? refreshToken)
      flushQueue(newAccess)

      original.headers.Authorization = `Bearer ${newAccess}`
      return http(original)
    } catch (refreshError) {
      flushQueue(null)
      tokenStorage.clear()
      // opcional: redirecionar para /admin/login
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
