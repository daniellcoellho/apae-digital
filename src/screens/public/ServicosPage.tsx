'use client'
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { BlockRenderer } from '@/features/institucional/BlockRenderer'
import { ContentIcon } from '@/components/common/Icon'
import { getDefaultServicosContent } from '@/content/servicos'
import type { ServicosContent } from '@/content/servicos/types'
import { tenantService } from '@/services/tenantService'

/**
 * Atendimentos Prestados (aba Servicos), dirigido por dados por tenant.
 * Layout de pagina unica com indice de ancoras no topo e detalhe de cada servico.
 * Busca da API; usa o conteudo local como fallback.
 */
export function ServicosPage() {
  const { theme } = useTheme()
  const [content, setContent] = useState<ServicosContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    tenantService
      .getPublicServices(theme.tenant)
      .then((data) => {
        if (active) setContent(data ?? getDefaultServicosContent(theme.tenant) ?? null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [theme.tenant])

  if (loading || !content) {
    return (
      <>
        <PageMeta title="Serviços" />
        <PageHeader title="Atendimentos Prestados" subtitle="Conheça os serviços oferecidos." />
        <div className="container-page py-16">
          <p className="text-ink-muted">{loading ? 'Carregando...' : 'Conteúdo de serviços em breve.'}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageMeta
        title="Atendimentos Prestados"
        description={`Serviços interdisciplinares e educacionais da ${theme.name}.`}
      />
      <PageHeader
        title="Atendimentos Prestados"
        subtitle="Uma proposta interdisciplinar para pessoas com deficiência intelectual e/ou múltipla e transtorno do espectro autista."
      />

      <section className="container-page py-12">
        {/* Abertura */}
        <div className="max-w-3xl">
          <BlockRenderer blocks={content.intro} />
        </div>

        {/* Indice de navegacao (ancoras) */}
        <nav aria-label="Índice de serviços" className="mt-10 rounded-3xl bg-surface-alt p-6">
          <p className="section-label">Navegue pelos atendimentos</p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {content.areas.map((area) => (
              <div key={area.id}>
                <h3 className="font-extrabold text-ink">{area.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {area.services.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-surface px-3 py-1 text-sm text-primary hover:bg-primary hover:text-primary-contrast"
                      >
                        {s.icon && <ContentIcon name={s.icon} className="h-4 w-4" />}
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Areas e servicos */}
        {content.areas.map((area) => (
          <section key={area.id} className="mt-16 scroll-mt-24" id={area.id}>
            <p className="section-label">Área</p>
            <h2 className="section-title">{area.title}</h2>
            {area.description && (
              <p className="mt-3 max-w-2xl text-ink-muted">{area.description}</p>
            )}

            <div className="mt-8 space-y-6">
              {area.services.map((service) => (
                <article
                  key={service.id}
                  id={service.id}
                  className="card scroll-mt-24 p-6 lg:p-8"
                >
                  <header className="flex items-center gap-3">
                    {service.icon && (
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10">
                        <ContentIcon name={service.icon} className="h-6 w-6 text-primary" />
                      </span>
                    )}
                    <div>
                      <h3 className="text-xl font-extrabold text-ink">{service.title}</h3>
                      {service.summary && (
                        <p className="text-sm text-ink-muted">{service.summary}</p>
                      )}
                    </div>
                  </header>

                  <div className="mt-2">
                    <BlockRenderer blocks={service.blocks} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>
    </>
  )
}
