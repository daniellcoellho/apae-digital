'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { newsService } from '@/services/newsService'
import type { NewsArticle } from '@/types'
import { PageMeta } from '@/components/common/PageMeta'
import { NEWS_CATEGORIES } from '@/features/news/categories'

export function NewsListPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    try {
      const data = await newsService.listAll()
      setArticles(data.content)
    } catch {
      setError('Não foi possível carregar as notícias (API indisponível).')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta notícia?')) return
    try {
      await newsService.remove(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert('Erro ao excluir.')
    }
  }

  return (
    <>
      <PageMeta title="Notícias (Admin)" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Notícias</h1>
        <Link href="/admin/noticias/nova" className="btn-primary">+ Nova notícia</Link>
      </div>

      {error && <p className="mt-4 rounded-theme bg-secondary/10 px-4 py-2 text-sm text-secondary-dark">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-theme border border-black/5 bg-surface">
        {loading ? (
          <p className="p-4 text-ink-muted">Carregando...</p>
        ) : articles.length === 0 ? (
          <p className="p-4 text-ink-muted">Nenhuma notícia cadastrada.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-alt text-ink-muted">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Atualizado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium text-ink">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${NEWS_CATEGORIES[a.category].tag}`}>
                      {NEWS_CATEGORIES[a.category].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={a.status === 'PUBLISHED' ? 'text-primary' : 'text-ink-muted'}>
                      {a.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {new Date(a.updatedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/noticias/${a.id}`} className="text-primary hover:underline">Editar</Link>
                    <button onClick={() => handleDelete(a.id)} className="ml-4 text-secondary-dark hover:underline">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
