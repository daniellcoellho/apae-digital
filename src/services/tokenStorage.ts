/**
 * Abstrai o armazenamento dos tokens JWT.
 * Centralizar aqui facilita trocar a estrategia depois
 * (ex.: cookie httpOnly gerido pelo backend) sem tocar no resto do app.
 */
const ACCESS_KEY = 'apae.accessToken'
const REFRESH_KEY = 'apae.refreshToken'

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY)
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY)
  },
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(ACCESS_KEY, accessToken)
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
  },
  clear(): void {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}
