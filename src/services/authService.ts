import { http } from './http'
import { tokenStorage } from './tokenStorage'
import type { AuthResponse, User } from '@/types'

/**
 * Servico de autenticacao (backend Spring Boot, JWT).
 * - login: POST /auth/login -> guarda access/refresh tokens.
 * - me: GET /auth/me -> restaura a sessao a partir do token.
 * - logout: limpa os tokens locais.
 */
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/login', { email, password })
    tokenStorage.setTokens(data.accessToken, data.refreshToken)
    return data
  },

  async me(): Promise<User> {
    const { data } = await http.get<User>('/auth/me')
    return data
  },

  logout(): void {
    tokenStorage.clear()
  },
}
