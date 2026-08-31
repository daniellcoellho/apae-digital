import { http } from './http'
import { tokenStorage } from './tokenStorage'
import { resolveTenantSlug } from '@/theme/themes'
import type { AuthResponse, User } from '@/types'

/**
 * MODO MOCK (temporario, enquanto nao ha backend).
 * Permite entrar no Admin offline com credenciais de teste.
 *
 * Enquanto MOCK_ENABLED estiver true, as credenciais de teste logam
 * localmente sem depender de rede. Quando o backend Spring Boot existir,
 * basta definir MOCK_ENABLED = false para usar apenas o login real.
 */
const MOCK_ENABLED = true
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

function mockLogin(): AuthResponse {
  tokenStorage.setTokens(MOCK_TOKEN, MOCK_TOKEN)
  localStorage.setItem('apae.mockAuth', 'true')
  return { accessToken: MOCK_TOKEN, refreshToken: MOCK_TOKEN, user: mockUser() }
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    // Demo: as credenciais de teste logam localmente, sem chamar a API.
    if (
      MOCK_ENABLED &&
      email.trim().toLowerCase() === MOCK_EMAIL &&
      password === MOCK_PASSWORD
    ) {
      return mockLogin()
    }

    // Login real (backend Spring Boot).
    const { data } = await http.post<AuthResponse>('/auth/login', { email, password })
    tokenStorage.setTokens(data.accessToken, data.refreshToken)
    return data
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
