'use client'

import { Handshake, Wrench } from 'lucide-react'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'

export function ParceriasPage() {
  return (
    <>
      <PageMeta title="Parcerias" description="Seja um parceiro e apoie a inclusão." />
      <PageHeader
        title="Parcerias e Contratação"
        subtitle="Empresas e instituições podem apoiar nossa causa e contratar serviços."
      />
      <section className="container-page grid gap-6 py-16 md:grid-cols-2">
        <article className="card p-8">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Handshake className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-ink">Seja um parceiro</h2>
          <p className="mt-2 text-ink-muted">
            Apoie projetos de inclusão com patrocínio, doações ou voluntariado.
          </p>
        </article>
        <article className="card p-8">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-ink">Contratação</h2>
          <p className="mt-2 text-ink-muted">
            Conheça produtos e serviços produzidos por nossos assistidos.
          </p>
        </article>
      </section>
    </>
  )
}
