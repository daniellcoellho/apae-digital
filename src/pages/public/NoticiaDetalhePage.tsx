import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { newsService } from '@/services/newsService'
import type { NewsArticle } from '@/types'
import { PageMeta } from '@/components/common/PageMeta'

export function NoticiaDetalhePage() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    let active = true
    ;(async () => {
      try {
        const data = await newsService.getBySlug(slug)
        if (active) setArticle(data)
      } catch {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [slug])

  if (loading) return <p className="container-page py-16 text-ink-muted">Carregando...</p>

  if (notFound || !article) {
    return (
      <div className="container-page py-16">
        <p className="text-ink-muted">Notícia não encontrada.</p>
        <Link to="/noticias" className="mt-4 inline-block text-sm font-semibold text-primary">← Voltar</Link>
      </div>
    )
  }

  return (
    <>
      <PageMeta title={article.title} description={article.summary} />
      <article className="container-page max-w-3xl py-12">
        <Link to="/noticias" className="text-sm font-semibold text-primary">← Notícias</Link>
        <h1 className="mt-4 text-3xl font-bold text-ink">{article.title}</h1>
        {article.publishedAt && (
          <p className="mt-2 text-sm text-ink-muted">
            {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
          </p>
        )}
        {article.coverImageUrl && (
          <img src={article.coverImageUrl} alt="" className="mt-6 w-full rounded-theme object-cover" />
        )}
        <div className="prose prose-neutral mt-6 max-w-none whitespace-pre-line text-ink">
          {article.content}
        </div>
      </article>
    </>
  )
}
