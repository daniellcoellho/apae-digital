import type { EventCategory } from '@/types'

/**
 * Config visual das categorias de evento.
 * Cores fixas (independentes do tema) para diferenciar os tipos no calendario,
 * seguindo a referencia: Evento verde, Reuniao azul, Campanha vermelho, Oficina amarelo.
 */
export interface CategoryStyle {
  label: string
  /** cor do ponto/legenda */
  dot: string
  /** classes do chip no grid do mes */
  chip: string
  /** classes da tag na visao agenda */
  tag: string
}

export const EVENT_CATEGORIES: Record<EventCategory, CategoryStyle> = {
  EVENTO: {
    label: 'Evento',
    dot: 'bg-emerald-500',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tag: 'bg-emerald-100 text-emerald-700',
  },
  REUNIAO: {
    label: 'Reunião',
    dot: 'bg-blue-500',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    tag: 'bg-blue-100 text-blue-700',
  },
  CAMPANHA: {
    label: 'Campanha',
    dot: 'bg-red-500',
    chip: 'bg-red-50 text-red-700 border-red-200',
    tag: 'bg-red-100 text-red-700',
  },
  OFICINA: {
    label: 'Oficina',
    dot: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    tag: 'bg-amber-100 text-amber-700',
  },
}

export const CATEGORY_ORDER: EventCategory[] = ['EVENTO', 'REUNIAO', 'CAMPANHA', 'OFICINA']
