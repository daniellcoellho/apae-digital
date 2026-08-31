import { useEffect, useMemo, useState } from 'react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { CalendarEvent } from '@/types'
import { CATEGORY_ORDER, EVENT_CATEGORIES } from './categories'
import { EventDetailsModal } from './EventDetailsModal'

interface EventCalendarProps {
  events: CalendarEvent[]
  /** chamado quando o mes visivel muda (para buscar do backend) */
  onRangeChange: (startISO: string, endISO: string) => void
}

type ViewMode = 'month' | 'agenda'

const WEEKDAYS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

/** Calendario proprio no estilo do design (sem dependencia externa de UI). */
export function EventCalendar({ events, onRangeChange }: EventCalendarProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [view, setView] = useState<ViewMode>('month')
  const [selected, setSelected] = useState<CalendarEvent | null>(null)

  // Intervalo do grid (comeca no domingo antes do dia 1 e termina no sabado apos o ultimo dia)
  const gridStart = useMemo(() => startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 }), [cursor])
  const gridEnd = useMemo(() => endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 }), [cursor])

  const days = useMemo(
    () => eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd],
  )

  // Avisa o container para (re)carregar eventos do mes visivel
  useEffect(() => {
    onRangeChange(gridStart.toISOString(), gridEnd.toISOString())
  }, [gridStart, gridEnd, onRangeChange])

  // Eventos ordenados por data
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => a.start.localeCompare(b.start)),
    [events],
  )

  // Eventos do dia
  const eventsOn = (day: Date) =>
    sortedEvents.filter((e) => isSameDay(new Date(e.start), day))

  // Eventos do mes atual (para a visao agenda)
  const monthEvents = useMemo(
    () => sortedEvents.filter((e) => isSameMonth(new Date(e.start), cursor)),
    [sortedEvents, cursor],
  )

  const goToday = () => setCursor(startOfMonth(new Date()))
  const prev = () => setCursor((c) => addMonths(c, -1))
  const next = () => setCursor((c) => addMonths(c, 1))

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Mês anterior"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-ink-muted hover:border-primary hover:text-primary"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próximo mês"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-ink-muted hover:border-primary hover:text-primary"
          >
            ›
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium text-ink-muted hover:border-primary hover:text-primary"
          >
            Hoje
          </button>
        </div>

        <h2 className="text-xl font-extrabold text-ink">
          <span className="capitalize">{format(cursor, 'MMMM', { locale: ptBR })}</span>{' '}
          <span className="text-ink-muted">{format(cursor, 'yyyy')}</span>
        </h2>

        {/* Toggle Mes / Agenda */}
        <div className="flex rounded-full bg-surface-alt p-1">
          <button
            type="button"
            onClick={() => setView('month')}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              view === 'month' ? 'bg-primary text-primary-contrast' : 'text-ink-muted hover:text-primary',
            ].join(' ')}
          >
            Mês
          </button>
          <button
            type="button"
            onClick={() => setView('agenda')}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              view === 'agenda' ? 'bg-primary text-primary-contrast' : 'text-ink-muted hover:text-primary',
            ].join(' ')}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* Visao MES */}
      {view === 'month' && (
        <div className="mt-6">
          {/* Cabecalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="px-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
                {wd}
              </div>
            ))}
          </div>

          {/* Grid dos dias */}
          <div className="mt-2 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const inMonth = isSameMonth(day, cursor)
              const dayEvents = eventsOn(day)
              const today = isToday(day)
              return (
                <div
                  key={day.toISOString()}
                  className={[
                    'min-h-[92px] rounded-2xl border p-2 sm:min-h-[112px]',
                    inMonth ? 'border-black/5 bg-surface' : 'border-transparent bg-surface-alt/40',
                  ].join(' ')}
                >
                  <div className="flex justify-end">
                    <span
                      className={[
                        'grid h-7 w-7 place-items-center rounded-full text-sm font-semibold',
                        today
                          ? 'bg-primary text-primary-contrast'
                          : inMonth
                            ? 'text-ink'
                            : 'text-ink-muted/50',
                      ].join(' ')}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map((e) => {
                      const cat = EVENT_CATEGORIES[e.category]
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelected(e)}
                          title={e.title}
                          className={`block w-full truncate rounded-full border px-2 py-0.5 text-left text-[11px] font-medium ${cat.chip}`}
                        >
                          {!e.allDay && `${format(new Date(e.start), 'HH:mm')} · `}
                          {e.title}
                        </button>
                      )
                    })}
                    {dayEvents.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setView('agenda')}
                        className="px-2 text-[11px] font-medium text-primary"
                      >
                        +{dayEvents.length - 3} mais
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Visao AGENDA */}
      {view === 'agenda' && (
        <div className="mt-6">
          {monthEvents.length === 0 ? (
            <p className="rounded-2xl bg-surface-alt px-4 py-6 text-center text-ink-muted">
              Nenhum evento neste mês.
            </p>
          ) : (
            <ul className="space-y-3">
              {monthEvents.map((e) => {
                const cat = EVENT_CATEGORIES[e.category]
                const start = new Date(e.start)
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(e)}
                      className="flex w-full items-start gap-4 rounded-2xl border border-black/5 bg-surface p-4 text-left transition-shadow hover:shadow-md"
                    >
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                        <span className="text-lg font-extrabold leading-none">{format(start, 'd')}</span>
                        <span className="text-[10px] font-semibold uppercase">
                          {format(start, 'MMM', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-ink">{e.title}</h3>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cat.tag}`}>
                            {cat.label}
                          </span>
                        </div>
                        {e.description && <p className="mt-1 text-sm text-ink-muted">{e.description}</p>}
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-muted">
                          <span>🕐 {e.allDay ? 'Dia inteiro' : format(start, 'HH:mm')}</span>
                          {e.location && <span>📍 {e.location}</span>}
                        </div>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* Legenda de categorias */}
      <div className="mt-6 flex flex-wrap gap-4 border-t border-black/5 pt-4">
        {CATEGORY_ORDER.map((key) => {
          const cat = EVENT_CATEGORIES[key]
          return (
            <span key={key} className="flex items-center gap-2 text-sm text-ink-muted">
              <span className={`h-2.5 w-2.5 rounded-full ${cat.dot}`} />
              {cat.label}
            </span>
          )
        })}
      </div>

      <EventDetailsModal event={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
