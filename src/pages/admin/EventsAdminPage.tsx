import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { eventService } from '@/services/eventService'
import type { EventInput } from '@/types'
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

/** Cadastro rapido de eventos para alimentar o calendario publico. */
export function EventsAdminPage() {
  const [feedback, setFeedback] = useState<string | null>(null)

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
      await eventService.create(payload)
      setFeedback('Evento cadastrado com sucesso.')
      reset({ allDay: false })
    } catch {
      setError('root', { message: 'Erro ao salvar. Verifique a conexão com a API.' })
    }
  }

  return (
    <>
      <PageMeta title="Eventos (Admin)" />
      <h1 className="text-2xl font-bold text-ink">Eventos</h1>
      <p className="mt-1 text-ink-muted">Cadastre eventos que aparecerão no calendário público.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl space-y-4" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink">Título</label>
          <input id="title" {...register('title')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          {errors.title && <p className="mt-1 text-sm text-secondary-dark">{errors.title.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-ink">Local</label>
            <input id="location" {...register('location')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-ink">Categoria</label>
            <select id="category" {...register('category')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary">
              <option value="EVENTO">Evento</option>
              <option value="REUNIAO">Reunião</option>
              <option value="CAMPANHA">Campanha</option>
              <option value="OFICINA">Oficina</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink">Descrição</label>
          <textarea id="description" rows={3} {...register('description')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-ink">Início</label>
            <input id="start" type="datetime-local" {...register('start')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
            {errors.start && <p className="mt-1 text-sm text-secondary-dark">{errors.start.message}</p>}
          </div>
          <div>
            <label htmlFor="end" className="block text-sm font-medium text-ink">Término</label>
            <input id="end" type="datetime-local" {...register('end')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
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
          {isSubmitting ? 'Salvando...' : 'Cadastrar evento'}
        </button>
      </form>
    </>
  )
}
