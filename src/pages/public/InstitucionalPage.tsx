import { Link, Navigate, useParams } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { useInstitutional } from '@/features/institucional/useInstitutional'
import { BlockRenderer } from '@/features/institucional/BlockRenderer'

/**
 * Pagina institucional unica (aba "Sobre"), dirigida por dados do tenant.
 * - /sobre        -> redireciona para a primeira subpagina
 * - /sobre/:slug  -> renderiza a subpagina correspondente
 * Um indice lateral lista as demais subpaginas (varia por APAE).
 */
export function InstitucionalPage() {
  const { slug } = useParams<{ slug: string }>()
  const { theme } = useTheme()
  const { pages, getPage } = useInstitutional()

  // Sem conteudo cadastrado para este tenant
  if (pages.length === 0) {
    return (
      <>
        <PageMeta title="Sobre" />
        <PageHeader title="Sobre" subtitle={`Conheça a ${theme.name}.`} />
        <div className="container-page py-16">
          <p className="text-ink-muted">Conteúdo institucional em breve.</p>
        </div>
      </>
    )
  }

  // /sobre -> primeira subpagina
  if (!slug) {
    return <Navigate to={`/sobre/${pages[0].slug}`} replace />
  }

  const page = getPage(slug)
  if (!page) {
    return <Navigate to={`/sobre/${pages[0].slug}`} replace />
  }

  return (
    <>
      <PageMeta title={page.title} description={page.subtitle} />
      <PageHeader title={page.title} subtitle={page.subtitle} />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[260px_1fr]">
        {/* Indice lateral (subpaginas do tenant) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="section-label">Institucional</p>
          <nav className="mt-4 space-y-1">
            {pages.map((p) => {
              const active = p.slug === slug
              return (
                <Link
                  key={p.slug}
                  to={`/sobre/${p.slug}`}
                  className={[
                    'block rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors',
                    active ? 'bg-primary text-primary-contrast' : 'text-ink-muted hover:bg-primary/10 hover:text-primary',
                  ].join(' ')}
                >
                  {p.title}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Conteudo da subpagina */}
        <article className="max-w-3xl">
          <BlockRenderer blocks={page.blocks} />
        </article>
      </section>
    </>
  )
}
