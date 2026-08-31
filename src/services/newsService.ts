import { http } from './http'
import type { NewsArticle, NewsInput, Paginated } from '@/types'

export const newsService = {
  // Publico: lista noticias publicadas
  async listPublished(page = 0, size = 9): Promise<Paginated<NewsArticle>> {
    const { data } = await http.get<Paginated<NewsArticle>>('/news', {
      params: { page, size, status: 'PUBLISHED' },
    })
    return data
  },

  async getBySlug(slug: string): Promise<NewsArticle> {
    const { data } = await http.get<NewsArticle>(`/news/slug/${slug}`)
    return data
  },

  // Admin
  async listAll(page = 0, size = 20): Promise<Paginated<NewsArticle>> {
    const { data } = await http.get<Paginated<NewsArticle>>('/admin/news', {
      params: { page, size },
    })
    return data
  },

  async getById(id: string): Promise<NewsArticle> {
    const { data } = await http.get<NewsArticle>(`/admin/news/${id}`)
    return data
  },

  async create(input: NewsInput): Promise<NewsArticle> {
    const { data } = await http.post<NewsArticle>('/admin/news', input)
    return data
  },

  async update(id: string, input: NewsInput): Promise<NewsArticle> {
    const { data } = await http.put<NewsArticle>(`/admin/news/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/admin/news/${id}`)
  },
}
