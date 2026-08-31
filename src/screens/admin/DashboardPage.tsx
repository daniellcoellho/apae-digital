'use client'

import Link from 'next/link'
import { PageMeta } from '@/components/common/PageMeta'

export function DashboardPage() {
  return (
    <>
      <PageMeta title="Painel" />
      <h1 className="text-2xl font-bold text-ink">Painel</h1>
      <p className="mt-1 text-ink-muted">Gerencie o conteúdo do site.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/noticias" className="rounded-theme border border-black/5 bg-surface p-6 shadow-sm hover:shadow-md">
          <h2 className="text-lg font-bold text-ink">📰 Notícias</h2>
          <p className="mt-1 text-sm text-ink-muted">Cadastrar, editar e publicar notícias.</p>
        </Link>
        <Link href="/admin/eventos" className="rounded-theme border border-black/5 bg-surface p-6 shadow-sm hover:shadow-md">
          <h2 className="text-lg font-bold text-ink">📅 Eventos</h2>
          <p className="mt-1 text-sm text-ink-muted">Gerenciar a agenda de eventos.</p>
        </Link>
        <Link href="/admin/identidade-visual" className="rounded-theme border border-black/5 bg-surface p-6 shadow-sm hover:shadow-md">
          <h2 className="text-lg font-bold text-ink">🎨 Identidade Visual</h2>
          <p className="mt-1 text-sm text-ink-muted">Cores, logo e tipografia da sua APAE.</p>
        </Link>
        <Link href="/admin/doacao" className="rounded-theme border border-black/5 bg-surface p-6 shadow-sm hover:shadow-md">
          <h2 className="text-lg font-bold text-ink">💛 Doação</h2>
          <p className="mt-1 text-sm text-ink-muted">Chave PIX e dados bancários.</p>
        </Link>
      </div>
    </>
  )
}
