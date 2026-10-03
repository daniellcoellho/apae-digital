import { http } from './http'
import type { CalendarEvent, EventInput } from '@/types'

export const eventService = {
  // Publico: eventos dentro de um intervalo (usado pelo calendario)
  async listByRange(startISO: string, endISO: string): Promise<CalendarEvent[]> {
    const { data } = await http.get<CalendarEvent[]>('/events', {
      params: { start: startISO, end: endISO },
    })
    return data
  },

  async getById(id: string): Promise<CalendarEvent> {
    const { data } = await http.get<CalendarEvent>(`/events/${id}`)
    return data
  },

  // Admin: lista todos os eventos do tenant autenticado (mais recentes primeiro)
  async listAllAdmin(): Promise<CalendarEvent[]> {
    const { data } = await http.get<CalendarEvent[]>('/admin/events')
    return data
  },

  async create(input: EventInput): Promise<CalendarEvent> {
    const { data } = await http.post<CalendarEvent>('/admin/events', input)
    return data
  },

  async update(id: string, input: EventInput): Promise<CalendarEvent> {
    const { data } = await http.put<CalendarEvent>(`/admin/events/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/admin/events/${id}`)
  },
}
