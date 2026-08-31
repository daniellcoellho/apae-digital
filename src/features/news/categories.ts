import type { NewsCategory } from '@/types'

/**
 * Config visual das categorias de noticia.
 * Cores fixas para diferenciar os tipos, seguindo a referencia:
 * Campanhas verde, Estrutura azul, Projetos amarelo, Institucional cinza.
 */
export interface NewsCategoryStyle {
  label: string
  /** classes da tag colorida */
  tag: string
}

export const NEWS_CATEGORIES: Record<NewsCategory, NewsCategoryStyle> = {
  CAMPANHAS: {
    label: 'Campanhas',
    tag: 'bg-emerald-100 text-emerald-700',
  },
  ESTRUTURA: {
    label: 'Estrutura',
    tag: 'bg-blue-100 text-blue-700',
  },
  PROJETOS: {
    label: 'Projetos',
    tag: 'bg-amber-100 text-amber-700',
  },
  INSTITUCIONAL: {
    label: 'Institucional',
    tag: 'bg-slate-200 text-slate-700',
  },
}

export const NEWS_CATEGORY_ORDER: NewsCategory[] = [
  'CAMPANHAS',
  'ESTRUTURA',
  'PROJETOS',
  'INSTITUCIONAL',
]
