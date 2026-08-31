import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@/types'
import { authService } from '@/services/authService'
import { tokenStorage } from '@/services/tokenStorage'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasRole: (...roles: User['role'][]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restaura a sessao ao carregar o app (se houver token valido).
  useEffect(() => {
    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await authService.me()
        setUser(me)
      } catch {
        tokenStorage.clear()
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    setUser(res.user)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const hasRole = useCallback(
    (...roles: User['role'][]) => (user ? roles.includes(user.role) : false),
    [user],
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      hasRole,
    }),
    [user, loading, login, logout, hasRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
