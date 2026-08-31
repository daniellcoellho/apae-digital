import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  /** papeis permitidos; se omitido, basta estar autenticado */
  roles?: UserRole[]
}

/** Protege rotas do Admin. Redireciona para login quando nao autenticado. */
export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-ink-muted">Carregando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (roles && !hasRole(...roles)) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
