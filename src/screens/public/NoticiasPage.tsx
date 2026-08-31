'use client'

import { useMemo, useState } from 'react'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { useNewsList } from '@/features/news/useNewsList'
import { NewsCard } from '@/features/news/NewsCard'
import { NEWS_CATEGORIES, NEWS_CATEGORY_ORDER } from '@/features/news/categories'
import type { NewsCategory } from '@/types'

type Filter = 'ALL' | NewsCategory

export function NoticiasPage() {
  const { articles, loading, error } = useNewsList()
  const [filter, setFilter] = useState<Filter>('ALL')

  // Mostra apenas categorias que possuem noticias (alem de "Todas")
  const availableCategories = useMemo(() => {
    const present = new Set(articles.map((a) => a.category))
    return NEWS_CATEGORY_ORDER.filter((c) => present.has(c))
  }, [articles])

  const filtered = useMemo(
    () => (filter === 'ALL' ? articles : articles.filter((a) => a.category === filter)),
    [articles, filter],
  )

  return (
    <>
      <PageMeta title="Notícias" description="Novidades e conquistas da instituição." />
      <PageHeader title="Notícias" subtitle="Fique por dentro das novidades, campanhas e conquistas." />

      <section className="container-page py-10">
        {error && (
          <p className="mb-4 rounded-2xl bg-secondary/10 px-4 py-2 text-sm text-secondary-dark">{error}</p>
        )}

        {/* Filtro por categoria */}
        {!loading && articles.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <FilterChip active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
              Todas
            </FilterChip>
            {availableCategories.map((c) => (
              <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
                {NEWS_CATEGORIES[c].label}
              </FilterChip>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-ink-muted">Carregando notícias...</p>
        ) : filtered.length === 0 ? (
          <p className="text-ink-muted">Nenhuma notícia nesta categoria.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((n) => (
              <NewsCard key={n.id} article={n} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
        active
          ? 'bg-primary text-primary-contrast'
          : 'bg-surface-alt text-ink-muted hover:text-primary',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
