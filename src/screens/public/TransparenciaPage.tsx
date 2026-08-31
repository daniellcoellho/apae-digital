'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionHeading } from '@/components/common/SectionHeading'
import { getTransparency } from '@/content/transparencia'
import { useSettingsVersion } from '@/hooks/useSettingsVersion'

export function TransparenciaPage() {
  const { theme } = useTheme()
  const settingsVersion = useSettingsVersion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const content = useMemo(() => getTransparency(theme.tenant), [theme.tenant, settingsVersion])

  return (
    <>
      <PageMeta title="Transparência" description="Prestação de contas, relatórios e documentos." />
      <PageHeader title="Transparência" subtitle={content.intro} />

      <section className="container-page py-16">
        <SectionHeading label="Documentos" title="Prestação de contas" />
        {content.documents.length === 0 ? (
          <p className="mt-8 text-ink-muted">Nenhum documento publicado ainda.</p>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {content.documents.map((d, i) => {
              const inner = (
                <div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    {d.tag}
                  </span>
                  <h3 className="mt-3 font-extrabold text-ink">{d.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{d.description}</p>
                </div>
              )
              return (
                <article key={i} className="card flex items-start justify-between gap-4 p-6">
                  {inner}
                  {d.url ? (
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-2xl text-primary"
                      aria-label={`Baixar ${d.title}`}
                    >
                      ⤓
                    </a>
                  ) : (
                    <span className="shrink-0 text-2xl text-ink-muted/40" title="Arquivo em breve" aria-hidden>
                      ⤓
                    </span>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
