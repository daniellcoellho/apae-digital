// Tipos de dominio compartilhados

export type UUID = string

export interface Paginated<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// ---- Auth ----
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'

export interface User {
  id: UUID
  name: string
  email: string
  role: UserRole
  tenant: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ---- Noticias ----
export type NewsStatus = 'DRAFT' | 'PUBLISHED'

export type NewsCategory =
  | 'CAMPANHAS'
  | 'ESTRUTURA'
  | 'PROJETOS'
  | 'INSTITUCIONAL'

export interface NewsArticle {
  id: UUID
  title: string
  slug: string
  summary: string
  content: string
  coverImageUrl?: string
  category: NewsCategory
  status: NewsStatus
  publishedAt?: string // ISO
  author?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface NewsInput {
  title: string
  summary: string
  content: string
  coverImageUrl?: string
  category: NewsCategory
  status: NewsStatus
  tags: string[]
}

// ---- Eventos ----
export type EventCategory = 'EVENTO' | 'REUNIAO' | 'CAMPANHA' | 'OFICINA'

export interface CalendarEvent {
  id: UUID
  title: string
  description?: string
  location?: string
  start: string // ISO
  end?: string // ISO
  allDay: boolean
  category: EventCategory
}

export interface EventInput {
  title: string
  description?: string
  location?: string
  start: string
  end?: string
  allDay: boolean
  category: EventCategory
}
