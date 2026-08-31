import type { ServicosContent } from './types'
import { apiunaServicos } from './apiuna'

/**
 * Registro de "Atendimentos Prestados" por tenant.
 * Outra APAE = outro conteudo, zero codigo novo.
 * Futuramente: GET /api/services-content?tenant=...
 */
const registry: Record<string, ServicosContent> = {
  apiuna: apiunaServicos,
}

export function getServicosContent(tenant: string): ServicosContent | undefined {
  return registry[tenant]
}
