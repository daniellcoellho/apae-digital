'use client'

import { useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, MapPin, X } from 'lucide-react'
import type { CalendarEvent } from '@/types'
import { EVENT_CATEGORIES } from './categories'

interface EventDetailsModalProps {
  event: CalendarEvent | null
  onClose: () => void
}

/** Modal acessivel com os detalhes do evento (fecha por Esc/backdrop). */
export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  useEffect(() => {
    if (!event) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [event, onClose])

  if (!event) return null

  const cat = EVENT_CATEGORIES[event.category]
  const start = new Date(event.start)
  const end = event.end ? new Date(event.end) : null

  const dateLabel = format(start, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
  const timeLabel = event.allDay
    ? 'Dia inteiro'
    : end
      ? `${format(start, 'HH:mm')} às ${format(end, 'HH:mm')}`
      : format(start, 'HH:mm')

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${cat.tag}`}>
            {cat.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-muted hover:text-ink"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <h2 id="event-modal-title" className="mt-3 text-xl font-extrabold text-ink">
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-2 text-ink-muted">{event.description}</p>
        )}

        <ul className="mt-5 space-y-2 text-sm text-ink">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-ink-muted" aria-hidden />
            <span className="capitalize">{dateLabel}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-ink-muted" aria-hidden />
            <span>{timeLabel}</span>
          </li>
          {event.location && (
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ink-muted" aria-hidden />
              <span>{event.location}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
