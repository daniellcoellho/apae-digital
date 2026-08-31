import type { ContentBlock } from '@/content/institucional/types'

/**
 * Conteudo detalhado de "Atendimentos Prestados" (aba Servicos), White Label.
 * Reaproveita os mesmos blocos do institucional para descrever cada servico.
 *
 * Estrutura:
 *  ServicosContent
 *    intro: blocos de abertura
 *    areas[]: grandes areas (ex.: Saude, Educacional)
 *      services[]: cada servico com id (ancora), titulo e blocos de detalhe
 */

export interface ServiceItem {
  /** id usado como ancora no indice: #fisioterapia */
  id: string
  title: string
  /** resumo curto opcional exibido no card do indice */
  summary?: string
  icon?: string
  blocks: ContentBlock[]
}

export interface ServiceArea {
  id: string
  title: string
  description?: string
  services: ServiceItem[]
}

export interface ServicosContent {
  /** texto de abertura da pagina */
  intro: ContentBlock[]
  areas: ServiceArea[]
}
