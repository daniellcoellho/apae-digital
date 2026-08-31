/**
 * Modelo de conteudo institucional dirigido por dados (White Label).
 *
 * A aba "Sobre" nao e uma pagina fixa: e um conjunto de subpaginas
 * (Historico, Presidente, Convenios...) que varia por APAE (tenant).
 * Cada subpagina e composta por BLOCOS, o que permite montar qualquer
 * layout de conteudo sem escrever codigo novo por APAE.
 *
 * No futuro, o backend Spring Boot serve isto via GET /api/pages?tenant=...
 * e o Admin cadastra os blocos. Por ora, os dados ficam por tenant em arquivos.
 */

/** Paragrafo de texto puro. */
export interface ParagraphBlock {
  type: 'paragraph'
  text: string
}

/** Subtitulo dentro da pagina. */
export interface HeadingBlock {
  type: 'heading'
  text: string
}

/** Lista de itens (com ou sem marcador). */
export interface ListBlock {
  type: 'list'
  title?: string
  items: string[]
  /** 'bullet' (padrao) ou 'check' (icone de check) */
  variant?: 'bullet' | 'check'
}

/** Bloco de destaque, ex: Missao / Visao. */
export interface HighlightBlock {
  type: 'highlight'
  title: string
  text: string
  icon?: string
}

/** Ficha de identificacao (chave -> valor), ex: CNPJ, Endereco. */
export interface KeyValueBlock {
  type: 'keyValue'
  title?: string
  rows: Array<{ label: string; value: string }>
}

/** Tabela de pessoas (cargo -> nome), ex: Diretoria, Conselho. */
export interface PeopleBlock {
  type: 'people'
  title?: string
  members: Array<{ role: string; name: string }>
}

/** Grade de cards (titulo + descricao), ex: Programas Pedagogicos. */
export interface CardsBlock {
  type: 'cards'
  title?: string
  cards: Array<{ title: string; description: string; icon?: string }>
}

/** Bloco de destaque de uma pessoa (ex: Presidente atual). */
export interface PersonBlock {
  type: 'person'
  name: string
  role: string
  note?: string
  photoUrl?: string
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ListBlock
  | HighlightBlock
  | KeyValueBlock
  | PeopleBlock
  | CardsBlock
  | PersonBlock

/** Uma subpagina institucional (ex: "Historico"). */
export interface InstitutionalPage {
  /** slug usado na rota: /sobre/:slug */
  slug: string
  /** rotulo no menu e no titulo */
  title: string
  /** subtitulo opcional exibido no cabecalho */
  subtitle?: string
  /** ordem no menu dropdown */
  order: number
  blocks: ContentBlock[]
}
