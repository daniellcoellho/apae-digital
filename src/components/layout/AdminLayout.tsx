'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

const adminNav = [
  { to: '/admin', label: 'Painel', exact: true },
  { to: '/admin/pagina-inicial', label: 'Página Inicial' },
  { to: '/admin/noticias', label: 'Notícias' },
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/servicos', label: 'Serviços' },
  { to: '/admin/transparencia', label: 'Transparência' },
  { to: '/admin/identidade-visual', label: 'Identidade Visual' },
  { to: '/admin/doacao', label: 'Doação' },
]

/**
 * Layout do painel administrativo (client), com guarda de autenticacao.
 * Redireciona para /admin/login se nao houver sessao.
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, loading } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`)
    }
  }, [loading, isAuthenticated, router, pathname])

  function handleLogout() {
    logout()
    router.replace('/admin/login')
  }

  if (loading || !isAuthenticated) {
    return <div className="grid min-h-screen place-items-center text-ink-muted">Carregando...</div>
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <aside className="hidden w-64 flex-col border-r border-black/5 bg-surface p-4 md:flex">
        <Link href="/admin" className="mb-6 text-lg font-bold text-primary">
          {theme.name}
        </Link>
        <nav className="flex-1 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={[
                'block rounded-theme px-3 py-2 text-sm font-medium',
                isActive(item.to, item.exact) ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-primary',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-4 border-t border-black/5 pt-4">
          <p className="text-xs text-ink-muted">{user?.name}</p>
          <button onClick={handleLogout} className="mt-2 text-sm font-semibold text-secondary-dark">
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-black/5 bg-surface px-6 py-4 md:hidden">
          <Link href="/admin" className="font-bold text-primary">{theme.name}</Link>
          <button onClick={handleLogout} className="text-sm font-semibold text-secondary-dark">Sair</button>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
