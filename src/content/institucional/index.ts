import type { InstitutionalPage } from './types'
import { apiunaInstitucional } from './apiuna'

/**
 * Registro de conteudo institucional por tenant.
 * Cada APAE fornece suas subpaginas. Outra APAE = outro array, zero codigo novo.
 * Futuramente substituido por GET /api/pages?tenant=... no backend.
 */
const registry: Record<string, InstitutionalPage[]> = {
  apiuna: apiunaInstitucional,
  // default: [] // uma APAE nova comeca sem paginas ate cadastrar
}

/** Retorna as subpaginas do tenant, ordenadas pelo campo order. */
export function getInstitutionalPages(tenant: string): InstitutionalPage[] {
  const pages = registry[tenant] ?? []
  return [...pages].sort((a, b) => a.order - b.order)
}

/** Busca uma subpagina especifica por slug. */
export function getInstitutionalPage(
  tenant: string,
  slug: string,
): InstitutionalPage | undefined {
  return getInstitutionalPages(tenant).find((p) => p.slug === slug)
}
