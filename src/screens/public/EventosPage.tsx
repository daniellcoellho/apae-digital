'use client'

import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { EventCalendar } from '@/features/events/EventCalendar'
import { useEvents } from '@/features/events/useEvents'

export function EventosPage() {
  const { events, loading, error, load } = useEvents()

  return (
    <>
      <PageMeta title="Eventos" description="Agenda de eventos e atividades." />
      <PageHeader
        title="Calendário de Eventos"
        subtitle="Acompanhe as atividades, campanhas solidárias, reuniões e oficinas da nossa entidade. Clique em um dia para ver os detalhes ou alterne para a visão de agenda."
      />

      <section className="container-page py-10">
        {error && (
          <p className="mb-4 rounded-theme bg-secondary/10 px-4 py-2 text-sm text-secondary-dark">
            {error}
          </p>
        )}
        {loading && <p className="mb-4 text-sm text-ink-muted">Carregando eventos...</p>}

        <div className="card p-4 sm:p-6">
          <EventCalendar events={events} onRangeChange={load} />
        </div>
      </section>
    </>
  )
}
