import type { ServicosContent } from './types'
import { apiunaServicos } from './apiuna'
import { localSettings } from '@/services/localSettings'

/**
 * Registro de "Atendimentos Prestados" por tenant.
 * Outra APAE = outro conteudo, zero codigo novo.
 * Futuramente: GET /api/services-content?tenant=...
 */
const registry: Record<string, ServicosContent> = {
  apiuna: apiunaServicos,
}

/** Dados base (arquivo), sem overrides. */
export function getDefaultServicosContent(tenant: string): ServicosContent | undefined {
  return registry[tenant]
}

/** Resolve o conteudo de servicos: override local (Admin) tem prioridade. */
export function getServicosContent(tenant: string): ServicosContent | undefined {
  const override = localSettings.get<ServicosContent>(tenant, 'servicos')
  return override ?? registry[tenant]
}
