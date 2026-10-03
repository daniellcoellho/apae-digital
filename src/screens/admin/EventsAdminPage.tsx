'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil, Trash2 } from 'lucide-react'
import { eventService } from '@/services/eventService'
import type { CalendarEvent, EventInput } from '@/types'
import { EVENT_CATEGORIES } from '@/features/events/categories'
import { PageMeta } from '@/components/common/PageMeta'

const eventSchema = z
  .object({
    title: z.string().min(3, 'Título muito curto'),
    location: z.string().optional(),
    description: z.string().optional(),
    category: z.enum(['EVENTO', 'REUNIAO', 'CAMPANHA', 'OFICINA']),
    start: z.string().min(1, 'Informe o início'),
    end: z.string().optional(),
    allDay: z.boolean(),
  })
  .refine((v) => !v.end || v.end >= v.start, {
    message: 'O término deve ser após o início',
    path: ['end'],
  })

type EventFormValues = z.infer<typeof eventSchema>

/** Converte um ISO para o formato aceito pelo input datetime-local (sem timezone). */
function isoToLocalInput(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Admin de eventos: cria, lista, edita e exclui os eventos do calendario publico. */
export function EventsAdminPage() {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { allDay: false, category: 'EVENTO' },
  })

  async function loadEvents() {
    setLoadingList(true)
    try {
      const data = await eventService.listAllAdmin()
      setEvents(data)
    } catch {
      // mantem lista vazia; o feedback de erro vem do form se necessario
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  function startEdit(ev: CalendarEvent) {
    setEditingId(ev.id)
    setFeedback(null)
    reset({
      title: ev.title,
      location: ev.location ?? '',
      description: ev.description ?? '',
      category: ev.category,
      start: isoToLocalInput(ev.start),
      end: isoToLocalInput(ev.end),
      allDay: ev.allDay,
    })
    // leva o usuario ao formulario
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setFeedback(null)
    reset({ title: '', location: '', description: '', category: 'EVENTO', start: '', end: '', allDay: false })
  }

  async function onSubmit(values: EventFormValues) {
    const payload: EventInput = {
      title: values.title,
      description: values.description || undefined,
      location: values.location || undefined,
      category: values.category,
      start: new Date(values.start).toISOString(),
      end: values.end ? new Date(values.end).toISOString() : undefined,
      allDay: values.allDay,
    }
    try {
      if (editingId) {
        await eventService.update(editingId, payload)
        setFeedback('Evento atualizado com sucesso.')
      } else {
        await eventService.create(payload)
        setFeedback('Evento cadastrado com sucesso.')
      }
      setEditingId(null)
      reset({ allDay: false, category: 'EVENTO' })
      await loadEvents()
    } catch {
      setError('root', { message: 'Erro ao salvar. Verifique a conexão com a API.' })
    }
  }

  async function handleDelete(ev: CalendarEvent) {
    if (typeof window !== 'undefined' && !window.confirm(`Excluir o evento "${ev.title}"?`)) return
    try {
      await eventService.remove(ev.id)
      if (editingId === ev.id) cancelEdit()
      setFeedback('Evento excluído.')
      await loadEvents()
    } catch {
      setFeedback('Não foi possível excluir o evento.')
    }
  }

  const inputCls = 'mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary'

  const fmtDate = (iso: string, allDay: boolean) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(allDay ? {} : { hour: '2-digit', minute: '2-digit' }),
    })
  }

  return (
    <>
      <PageMeta title="Eventos (Admin)" />
      <h1 className="text-2xl font-bold text-ink">Eventos</h1>
      <p className="mt-1 text-ink-muted">Cadastre, edite e remova eventos do calendário público.</p>

      {/* Formulario (criar ou editar) */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl space-y-4" noValidate>
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-ink">{editingId ? 'Editar evento' : 'Novo evento'}</h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm font-semibold text-ink-muted hover:text-primary">
              Cancelar edição
            </button>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink">Título</label>
          <input id="title" {...register('title')} className={inputCls} />
          {errors.title && <p className="mt-1 text-sm text-secondary-dark">{errors.title.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-ink">Local</label>
            <input id="location" {...register('location')} className={inputCls} />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-ink">Categoria</label>
            <select id="category" {...register('category')} className={inputCls}>
              <option value="EVENTO">Evento</option>
              <option value="REUNIAO">Reunião</option>
              <option value="CAMPANHA">Campanha</option>
              <option value="OFICINA">Oficina</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink">Descrição</label>
          <textarea id="description" rows={3} {...register('description')} className={inputCls} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-ink">Início</label>
            <input id="start" type="datetime-local" {...register('start')} className={inputCls} />
            {errors.start && <p className="mt-1 text-sm text-secondary-dark">{errors.start.message}</p>}
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-medium text-ink">Término</label>
            <input id="end" type="datetime-local" {...register('end')} className={inputCls} />
            {errors.end && <p className="mt-1 text-sm text-secondary-dark">{errors.end.message}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('allDay')} />
          <span className="text-sm text-ink">Dia inteiro</span>
        </label>

        {errors.root && <p className="text-sm text-secondary-dark">{errors.root.message}</p>}
        {feedback && <p className="text-sm text-primary">{feedback}</p>}

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar evento'}
        </button>
      </form>

      {/* Lista de eventos cadastrados */}
      <div className="mt-10 max-w-3xl">
        <h2 className="font-extrabold text-ink">Eventos cadastrados</h2>
        {loadingList ? (
          <p className="mt-3 text-ink-muted">Carregando...</p>
        ) : events.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-black/10 px-4 py-8 text-center text-ink-muted">
            Nenhum evento cadastrado ainda.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {events.map((ev) => {
              const cat = EVENT_CATEGORIES[ev.category]
              return (
                <li key={ev.id} className="flex items-start justify-between gap-4 rounded-2xl border border-black/5 bg-surface p-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cat?.tag ?? 'bg-primary/10 text-primary'}`}>
                        {cat?.label ?? ev.category}
                      </span>
                      <span className="text-xs text-ink-muted">{fmtDate(ev.start, ev.allDay)}</span>
                    </div>
                    <h3 className="mt-1 font-extrabold text-ink">{ev.title}</h3>
                    {ev.location && <p className="text-sm text-ink-muted">{ev.location}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => startEdit(ev)}
                      title="Editar"
                      className="rounded-lg p-2 text-ink-muted hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      onClick={() => handleDelete(ev)}
                      title="Excluir"
                      className="rounded-lg p-2 text-secondary-dark hover:bg-secondary/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
