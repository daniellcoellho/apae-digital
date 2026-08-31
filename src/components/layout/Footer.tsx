'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

export function Footer() {
  const { theme } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 bg-primary-dark text-primary-contrast">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="text-lg font-bold">{theme.name}</h2>
          <p className="mt-2 text-sm opacity-80">{theme.city}</p>
          <p className="mt-4 text-sm opacity-80">{theme.contact.address}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Navegue</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link href="/" className="hover:opacity-100">Início</Link></li>
            <li><Link href="/sobre" className="hover:opacity-100">Sobre</Link></li>
            <li><Link href="/servicos" className="hover:opacity-100">Serviços</Link></li>
            <li><Link href="/noticias" className="hover:opacity-100">Notícias</Link></li>
            <li><Link href="/contato" className="hover:opacity-100">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Atualizações</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li><Link href="/eventos" className="hover:opacity-100">Eventos</Link></li>
            <li><Link href="/transparencia" className="hover:opacity-100">Transparência</Link></li>
            <li><Link href="/parcerias" className="hover:opacity-100">Parcerias</Link></li>
            <li><Link href="/faq" className="hover:opacity-100">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">Contato</h3>
          <ul className="mt-3 space-y-2 text-sm opacity-80">
            <li>{theme.contact.email}</li>
            <li>{theme.contact.phone}</li>
          </ul>
          <Link href={theme.donationUrl ?? '/doacoes'} className="btn-secondary mt-4">
            ♥ Doe agora
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs opacity-70 sm:flex-row">
          <p>© {year} {theme.name}. Todos os direitos reservados.</p>
          <p>Feito com APAE Digital · plataforma White Label</p>
        </div>
      </div>
    </footer>
  )
}
