import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import type { NewsArticle } from '@/types'
import { NEWS_CATEGORIES } from './categories'

/** Card de noticia no padrao da referencia: imagem, tag, data, titulo, resumo, link. */
export function NewsCard({ article }: { article: NewsArticle }) {
  const cat = NEWS_CATEGORIES[article.category]
  const date = article.publishedAt
    ? format(new Date(article.publishedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link href={`/noticias/${article.slug}`} className="block aspect-video overflow-hidden bg-surface-alt">
        {article.coverImageUrl && (
          <img
            src={article.coverImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cat.tag}`}>
            {cat.label}
          </span>
          {date && (
            <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {date}
            </span>
          )}
        </div>

        <h2 className="mt-3 text-lg font-extrabold leading-snug text-ink">
          <Link href={`/noticias/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm text-ink-muted">{article.summary}</p>

        <Link href={`/noticias/${article.slug}`} className="mt-4 inline-block text-sm font-semibold text-primary">
          Ler notícia →
        </Link>
      </div>
    </article>
  )
}
