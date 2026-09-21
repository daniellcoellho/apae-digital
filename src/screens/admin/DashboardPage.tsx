'use client'

import Link from 'next/link'
import { Calendar, FileText, Heart, Home, Newspaper, Palette, Puzzle } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'

const panels = [
  { href: '/admin/pagina-inicial', icon: Home, title: 'Página Inicial', desc: 'Destaque principal e números de impacto.' },
  { href: '/admin/noticias', icon: Newspaper, title: 'Notícias', desc: 'Cadastrar, editar e publicar notícias.' },
  { href: '/admin/eventos', icon: Calendar, title: 'Eventos', desc: 'Gerenciar a agenda de eventos.' },
  { href: '/admin/servicos', icon: Puzzle, title: 'Serviços', desc: 'Áreas e atendimentos prestados.' },
  { href: '/admin/transparencia', icon: FileText, title: 'Transparência', desc: 'Documentos e prestação de contas.' },
  { href: '/admin/identidade-visual', icon: Palette, title: 'Identidade Visual', desc: 'Cores, logo e tipografia da sua APAE.' },
  { href: '/admin/doacao', icon: Heart, title: 'Doação', desc: 'Chave PIX e dados bancários.' },
]

export function DashboardPage() {
  return (
    <>
      <PageMeta title="Painel" />
      <h1 className="text-2xl font-bold text-ink">Painel</h1>
      <p className="mt-1 text-ink-muted">Gerencie o conteúdo do site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="rounded-theme border border-black/5 bg-surface p-6 shadow-sm hover:shadow-md"
          >
            <p.icon className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="mt-2 text-lg font-bold text-ink">{p.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{p.desc}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
