'use client'

import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionHeading } from '@/components/common/SectionHeading'

const documents = [
  { title: 'Relatório anual de atividades 2025', desc: 'Prestação de contas e resultados dos atendimentos.', tag: 'RELATÓRIO' },
  { title: 'Demonstrativo financeiro 2025', desc: 'Receitas, despesas e aplicação das doações.', tag: 'FINANCEIRO' },
  { title: 'Estatuto social', desc: 'Documento constitutivo da instituição.', tag: 'INSTITUCIONAL' },
  { title: 'Certidões e registros', desc: 'CNPJ, utilidade pública e certidões negativas.', tag: 'DOCUMENTOS' },
]

export function TransparenciaPage() {
  return (
    <>
      <PageMeta title="Transparência" description="Prestação de contas, relatórios e documentos." />
      <PageHeader
        title="Transparência"
        subtitle="Acreditamos que confiança se constrói com clareza. Consulte nossos relatórios e documentos."
      />

      <section className="container-page py-16">
        <SectionHeading label="Documentos" title="Prestação de contas" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {documents.map((d) => (
            <article key={d.title} className="card flex items-start justify-between gap-4 p-6">
              <div>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {d.tag}
                </span>
                <h3 className="mt-3 font-extrabold text-ink">{d.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{d.desc}</p>
              </div>
              <button type="button" className="shrink-0 text-2xl text-primary" aria-label={`Baixar ${d.title}`}>
                ⤓
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
