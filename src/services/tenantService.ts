import { http } from './http'
import type { BrandTheme } from '@/theme/theme.types'
import { getThemeBySlug } from '@/theme/themes'
import type { DonationInfo } from '@/content/doacoes'
import type { TransparencyContent } from '@/content/transparencia'
import type { HomeContent } from '@/content/home'
import type { ServicosContent } from '@/content/servicos/types'
import type { InstitutionalPage } from '@/content/institucional/types'

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

  // ---- Transparencia ----

  /**
   * Conteudo publico de transparencia do tenant.
   * Retorna null em erro (o chamador usa o fallback local).
   */
  async getPublicTransparency(slug: string): Promise<TransparencyContent | null> {
    try {
      const { data } = await http.get<TransparencyContent>(`/tenants/${slug}/transparency`)
      return data
    } catch {
      return null
    }
  },

  /** Conteudo de transparencia do tenant autenticado (admin). */
  async getAdminTransparency(): Promise<TransparencyContent | null> {
    try {
      const { data } = await http.get<TransparencyContent>('/admin/transparency')
      return data
    } catch {
      return null
    }
  },

  /** Cria/atualiza o conteudo de transparencia do tenant autenticado (admin). */
  async updateAdminTransparency(content: TransparencyContent): Promise<TransparencyContent> {
    const { data } = await http.put<TransparencyContent>('/admin/transparency', content)
    return data
  },

  // ---- Home (pagina inicial) ----

  /**
   * Conteudo publico da Home do tenant.
   * Retorna null em erro (o chamador usa o fallback local).
   */
  async getPublicHome(slug: string): Promise<HomeContent | null> {
    try {
      const { data } = await http.get<HomeContent>(`/tenants/${slug}/home`)
      return data
    } catch {
      return null
    }
  },

  /** Conteudo da Home do tenant autenticado (admin). */
  async getAdminHome(): Promise<HomeContent | null> {
    try {
      const { data } = await http.get<HomeContent>('/admin/home')
      return data
    } catch {
      return null
    }
  },

  /** Cria/atualiza o conteudo da Home do tenant autenticado (admin). */
  async updateAdminHome(content: HomeContent): Promise<HomeContent> {
    const { data } = await http.put<HomeContent>('/admin/home', content)
    return data
  },

  // ---- Servicos (atendimentos) ----

  /**
   * Conteudo publico de servicos do tenant.
   * Retorna null em erro/404 (o chamador usa o fallback local).
   */
  async getPublicServices(slug: string): Promise<ServicosContent | null> {
    try {
      const { data } = await http.get<ServicosContent>(`/tenants/${slug}/services`)
      return data
    } catch {
      return null
    }
  },

  /** Conteudo de servicos do tenant autenticado (admin). */
  async getAdminServices(): Promise<ServicosContent | null> {
    try {
      const { data } = await http.get<ServicosContent>('/admin/services')
      return data
    } catch {
      return null
    }
  },

  /** Cria/atualiza o conteudo de servicos do tenant autenticado (admin). */
  async updateAdminServices(content: ServicosContent): Promise<ServicosContent> {
    const { data } = await http.put<ServicosContent>('/admin/services', content)
    return data
  },

  // ---- Institucional (Sobre) ----
  // O backend envolve a lista num objeto { pages: [...] }.

  /**
   * Subpaginas institucionais publicas do tenant (ordenadas por order).
   * Retorna null em erro (o chamador usa o fallback local).
   */
  async getPublicInstitutional(slug: string): Promise<InstitutionalPage[] | null> {
    try {
      const { data } = await http.get<{ pages: InstitutionalPage[] }>(`/tenants/${slug}/institutional`)
      return data.pages ?? []
    } catch {
      return null
    }
  },

  /** Subpaginas institucionais do tenant autenticado (admin). */
  async getAdminInstitutional(): Promise<InstitutionalPage[] | null> {
    try {
      const { data } = await http.get<{ pages: InstitutionalPage[] }>('/admin/institutional')
      return data.pages ?? []
    } catch {
      return null
    }
  },

  /** Cria/atualiza as subpaginas institucionais do tenant autenticado (admin). */
  async updateAdminInstitutional(pages: InstitutionalPage[]): Promise<InstitutionalPage[]> {
    const { data } = await http.put<{ pages: InstitutionalPage[] }>('/admin/institutional', { pages })
    return data.pages ?? []
  },
}
