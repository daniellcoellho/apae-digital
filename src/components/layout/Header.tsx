import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'

const navItems = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/noticias', label: 'Notícias' },
  { to: '/transparencia', label: 'Transparência' },
  { to: '/contato', label: 'Contato' },
]

export function Header() {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)

  const donationUrl = theme.donationUrl ?? '/doacoes'

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* Logo / Marca */}
        <Link to="/" className="flex items-center gap-3" aria-label={`${theme.name} - página inicial`}>
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-primary">
            <img
              src={theme.logoUrl}
              alt={`Logotipo ${theme.name}`}
              className="h-11 w-11 object-cover"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold text-ink">{theme.name}</span>
            <span className="block text-xs text-ink-muted">{theme.city}</span>
          </span>
        </Link>

        {/* Navegacao desktop */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-primary' : 'text-ink-muted hover:text-primary',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + menu mobile */}
        <div className="flex items-center gap-2">
          <Link to={donationUrl} className="btn-secondary hidden sm:inline-flex">
            ♥ Doe agora
          </Link>

          <button
            type="button"
            className="btn-outline px-3 py-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Navegacao mobile */}
      {open && (
        <nav id="mobile-nav" aria-label="Navegação principal (mobile)" className="border-t border-black/5 lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block rounded-theme px-3 py-2.5 text-sm font-medium',
                      isActive ? 'bg-primary/10 text-primary' : 'text-ink',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <Link to={donationUrl} className="btn-secondary w-full" onClick={() => setOpen(false)}>
                ♥ Doe agora
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
