import { http } from './http'
import type { BrandTheme } from '@/theme/theme.types'
import { getThemeBySlug } from '@/theme/themes'
import type { DonationInfo } from '@/content/doacoes'

/**
 * Servico de tema (identidade visual) White Label.
 *
 * - Publico: GET /api/tenants/{slug}/theme (sem auth) — usado pelo site.
 * - Admin: GET/PUT /api/admin/theme (auth via JWT; tenant vem do token).
 *
 * O backend devolve o BrandThemeDto, que espelha o BrandTheme do front.
 * A unica diferenca de forma e que `contact` pode vir null — normalizamos.
 */

/** Garante que o objeto de contato sempre exista (o front consome sem checar). */
function normalizeTheme(dto: BrandTheme): BrandTheme {
  return {
    ...dto,
    contact: dto.contact ?? { email: '', phone: '', address: '' },
  }
}

export const tenantService = {
  /**
   * Busca o tema publico do tenant. Em caso de erro (API fora, 404),
   * cai no catalogo local como resiliencia (evita site sem estilo).
   */
  async getPublicTheme(slug: string): Promise<BrandTheme> {
    try {
      const { data } = await http.get<BrandTheme>(`/tenants/${slug}/theme`)
      return normalizeTheme(data)
    } catch {
      return getThemeBySlug(slug)
    }
  },

  /** Tema do tenant autenticado (admin). */
  async getAdminTheme(): Promise<BrandTheme> {
    const { data } = await http.get<BrandTheme>('/admin/theme')
    return normalizeTheme(data)
  },

  /** Cria/atualiza o tema do tenant autenticado (admin). */
  async updateAdminTheme(theme: BrandTheme): Promise<BrandTheme> {
    const { data } = await http.put<BrandTheme>('/admin/theme', theme)
    return normalizeTheme(data)
  },

  // ---- Doacao ----

  /**
   * Busca os dados de doacao publicos do tenant.
   * Retorna null se a APAE ainda nao configurou (backend responde 404).
   */
  async getPublicDonation(slug: string): Promise<DonationInfo | null> {
    try {
      const { data } = await http.get<DonationInfo>(`/tenants/${slug}/donation`)
      return data
    } catch {
      return null
    }
  },

  /** Dados de doacao do tenant autenticado (admin). Null se nao configurado. */
  async getAdminDonation(): Promise<DonationInfo | null> {
    try {
      const { data } = await http.get<DonationInfo>('/admin/donation')
      return data
    } catch {
      return null
    }
  },

  /** Cria/atualiza os dados de doacao do tenant autenticado (admin). */
  async updateAdminDonation(info: DonationInfo): Promise<DonationInfo> {
    const { data } = await http.put<DonationInfo>('/admin/donation', info)
    return data
  },
}
