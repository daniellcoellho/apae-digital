'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { BlockRenderer } from '@/features/institucional/BlockRenderer'
import { getServicosContent } from '@/content/servicos'

/**
 * Atendimentos Prestados (aba Servicos), dirigido por dados por tenant.
 * Layout de pagina unica com indice de ancoras no topo e detalhe de cada servico.
 * Se o tenant nao tiver conteudo detalhado, exibe uma mensagem simples.
 */
export function ServicosPage() {
  const { theme } = useTheme()
  const content = getServicosContent(theme.tenant)

  if (!content) {
    return (
      <>
        <PageMeta title="Serviços" />
        <PageHeader title="Atendimentos Prestados" subtitle="Conheça os serviços oferecidos." />
        <div className="container-page py-16">
          <p className="text-ink-muted">Conteúdo de serviços em breve.</p>
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
                        {s.icon && <span>{s.icon}</span>}
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
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-xl">
                        {service.icon}
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
