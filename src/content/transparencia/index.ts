import { localSettings } from '@/services/localSettings'

/** Documento de transparencia (prestacao de contas). */
export interface TransparencyDoc {
  title: string
  description: string
  tag: string
  /** link do arquivo (PDF etc.); opcional enquanto nao houver upload */
  url?: string
}

export interface TransparencyContent {
  intro: string
  documents: TransparencyDoc[]
}

const registry: Record<string, TransparencyContent> = {
  apiuna: {
    intro:
      'Acreditamos que confiança se constrói com clareza. Consulte nossos relatórios e documentos.',
    documents: [
      { title: 'Relatório anual de atividades 2025', description: 'Prestação de contas e resultados dos atendimentos.', tag: 'RELATÓRIO' },
      { title: 'Demonstrativo financeiro 2025', description: 'Receitas, despesas e aplicação das doações.', tag: 'FINANCEIRO' },
      { title: 'Estatuto social', description: 'Documento constitutivo da instituição.', tag: 'INSTITUCIONAL' },
      { title: 'Certidões e registros', description: 'CNPJ, utilidade pública e certidões negativas.', tag: 'DOCUMENTOS' },
    ],
  },
}

function fallback(): TransparencyContent {
  return registry.apiuna
}

export function getDefaultTransparency(tenant: string): TransparencyContent {
  return registry[tenant] ?? fallback()
}

export function getTransparency(tenant: string): TransparencyContent {
  const override = localSettings.get<TransparencyContent>(tenant, 'transparencia')
  return override ?? getDefaultTransparency(tenant)
}
