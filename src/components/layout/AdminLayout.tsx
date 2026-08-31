import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

const adminNav = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/noticias', label: 'Notícias' },
  { to: '/admin/eventos', label: 'Eventos' },
  { to: '/admin/identidade-visual', label: 'Identidade Visual' },
  { to: '/admin/doacao', label: 'Doação' },
]

/** Layout do painel administrativo, com sidebar de navegacao. */
export function AdminLayout() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <aside className="hidden w-64 flex-col border-r border-black/5 bg-surface p-4 md:flex">
        <Link to="/admin" className="mb-6 text-lg font-bold text-primary">
          {theme.name}
        </Link>
        <nav className="flex-1 space-y-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'block rounded-theme px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-primary/10 text-primary' : 'text-ink-muted hover:text-primary',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
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
          <Link to="/admin" className="font-bold text-primary">{theme.name}</Link>
          <button onClick={handleLogout} className="text-sm font-semibold text-secondary-dark">Sair</button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
