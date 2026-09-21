'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const navItems = [
  { to: '/', label: 'Início', exact: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/noticias', label: 'Notícias' },
  { to: '/transparencia', label: 'Transparência' },
  { to: '/contato', label: 'Contato' },
]

export function Header() {
  const { theme } = useTheme()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const donationUrl = theme.donationUrl ?? '/doacoes'

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        {/* Logo / Marca */}
        <Link href="/" className="flex items-center gap-3" aria-label={`${theme.name} - página inicial`}>
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
                <Link
                  href={item.to}
                  className={[
                    'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive(item.to, item.exact) ? 'text-primary' : 'text-ink-muted hover:text-primary',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + menu mobile */}
        <div className="flex items-center gap-2">
          <Link href={donationUrl} className="btn-secondary hidden items-center gap-1.5 sm:inline-flex">
            <Heart className="h-4 w-4" aria-hidden />
            Doe agora
          </Link>

          <button
            type="button"
            className="btn-outline px-3 py-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Navegacao mobile */}
      {open && (
        <nav id="mobile-nav" aria-label="Navegação principal (mobile)" className="border-t border-black/5 lg:hidden">
          <ul className="container-page flex flex-col py-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  href={item.to}
                  onClick={() => setOpen(false)}
                  className={[
                    'block rounded-theme px-3 py-2.5 text-sm font-medium',
                    isActive(item.to, item.exact) ? 'bg-primary/10 text-primary' : 'text-ink',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link href={donationUrl} className="btn-secondary flex w-full items-center justify-center gap-1.5" onClick={() => setOpen(false)}>
                <Heart className="h-4 w-4" aria-hidden />
                Doe agora
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
