import { useCallback, useState } from 'react'
import { eventService } from '@/services/eventService'
import type { CalendarEvent } from '@/types'

// Dados de exemplo para desenvolvimento enquanto o backend nao responde.
function mockEvents(): CalendarEvent[] {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  const at = (d: number, h = 9, min = 0) => new Date(y, m, d, h, min).toISOString()
  return [
    {
      id: 'm1',
      title: 'Bazar Solidário APAE',
      description: 'Venda de roupas, calçados e utensílios doados pela comunidade. Toda a renda é revertida para os atendimentos.',
      start: at(8, 9),
      end: at(8, 17),
      allDay: false,
      location: 'Sede da APAE — Apiúna/SC',
      category: 'CAMPANHA',
    },
    {
      id: 'm2',
      title: 'Oficina de Musicoterapia',
      description: 'Atividade aberta aos alunos e familiares, com a equipe multidisciplinar.',
      start: at(15, 14, 30),
      allDay: false,
      location: 'Sala Multissensorial',
      category: 'OFICINA',
    },
    {
      id: 'm3',
      title: 'Reunião de Pais e Responsáveis',
      description: 'Prestação de contas do semestre e planejamento das próximas atividades.',
      start: at(15, 19),
      allDay: false,
      location: 'Auditório da APAE',
      category: 'REUNIAO',
    },
    {
      id: 'm4',
      title: 'Campanha de Doações de Alimentos',
      description: 'Arrecadação de alimentos não perecíveis para as famílias assistidas.',
      start: at(22, 8),
      allDay: false,
      location: 'Praça Central de Apiúna',
      category: 'CAMPANHA',
    },
    {
      id: 'm5',
      title: 'Festa Junina da Inclusão',
      description: 'Comidas típicas, quadrilha e apresentações dos alunos. Entrada gratuita.',
      start: at(27, 17),
      allDay: false,
      location: 'Pátio da APAE',
      category: 'EVENTO',
    },
  ]
}

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (startISO: string, endISO: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await eventService.listByRange(startISO, endISO)
      setEvents(data)
    } catch {
      // Fallback amigavel em dev: mostra exemplos e sinaliza o modo offline.
      setEvents(mockEvents())
      setError('Exibindo eventos de exemplo (API indisponível).')
    } finally {
      setLoading(false)
    }
  }, [])

  return { events, loading, error, load }
}
