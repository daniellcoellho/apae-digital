import { AxiosError } from 'axios'
import { http } from './http'
import { tokenStorage } from './tokenStorage'
import { resolveTenantSlug } from '@/theme/themes'
import type { AuthResponse, User } from '@/types'

/**
 * MODO MOCK (temporario, enquanto nao ha backend).
 * Permite entrar no Admin offline com credenciais de teste.
 * Quando o backend responder, o login real e usado automaticamente
 * e o mock so entra como fallback para as credenciais de teste.
 */
const MOCK_EMAIL = 'admin@apae.org'
const MOCK_PASSWORD = 'admin123'
const MOCK_TOKEN = 'mock.jwt.token'

function mockUser(): User {
  return {
    id: 'mock-admin',
    name: 'Administrador (demo)',
    email: MOCK_EMAIL,
    role: 'ADMIN',
    tenant: resolveTenantSlug(),
  }
}

function isApiDown(err: unknown): boolean {
  const ax = err as AxiosError
  // Sem resposta do servidor (backend fora do ar) ou 404 do endpoint inexistente.
  return !ax.response || ax.response.status === 404
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data } = await http.post<AuthResponse>('/auth/login', { email, password })
      tokenStorage.setTokens(data.accessToken, data.refreshToken)
      return data
    } catch (err) {
      // Fallback mock: so aceita as credenciais de teste quando a API esta fora.
      if (
        isApiDown(err) &&
        email.trim().toLowerCase() === MOCK_EMAIL &&
        password === MOCK_PASSWORD
      ) {
        tokenStorage.setTokens(MOCK_TOKEN, MOCK_TOKEN)
        localStorage.setItem('apae.mockAuth', 'true')
        return { accessToken: MOCK_TOKEN, refreshToken: MOCK_TOKEN, user: mockUser() }
      }
      throw err
    }
  },

  async me(): Promise<User> {
    // Restaura a sessao mock sem chamar a API.
    if (localStorage.getItem('apae.mockAuth') === 'true') {
      return mockUser()
    }
    const { data } = await http.get<User>('/auth/me')
    return data
  },

  logout(): void {
    localStorage.removeItem('apae.mockAuth')
    tokenStorage.clear()
  },
}
