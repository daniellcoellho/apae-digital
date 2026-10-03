import {
  Activity,
  Baby,
  BookOpen,
  Brain,
  Briefcase,
  Bus,
  Eye,
  GraduationCap,
  Hand,
  HandHeart,
  HandHelping,
  Handshake,
  HeartHandshake,
  MessageCircle,
  Puzzle,
  Stethoscope,
  Target,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

/**
 * Registro de icones usados em conteudo editavel (servicos, programas, cards).
 * Substitui os emojis livres por um conjunto fixo de icones SVG.
 */
export const ICONS: Record<string, LucideIcon> = {
  atividade: Activity,
  bebe: Baby,
  livro: BookOpen,
  cerebro: Brain,
  maleta: Briefcase,
  van: Bus,
  olho: Eye,
  formatura: GraduationCap,
  mao: Hand,
  maos: HandHeart,
  apoio: HandHelping,
  parceria: Handshake,
  acolhimento: HeartHandshake,
  fala: MessageCircle,
  peca: Puzzle,
  saude: Stethoscope,
  alvo: Target,
  pessoas: Users,
  ferramenta: Wrench,
}

export const ICON_KEYS = Object.keys(ICONS)

/** Rotulos legiveis (pt-BR) para cada icone, usados nos seletores do admin. */
export const ICON_LABELS: Record<string, string> = {
  atividade: 'Atividade',
  bebe: 'Bebê',
  livro: 'Livro / Educação',
  cerebro: 'Cérebro',
  maleta: 'Trabalho / Maleta',
  van: 'Transporte / Van',
  olho: 'Visão',
  formatura: 'Formatura',
  mao: 'Mão',
  maos: 'Mãos / Doação',
  apoio: 'Apoio',
  parceria: 'Parceria',
  acolhimento: 'Acolhimento',
  fala: 'Fala / Comunicação',
  peca: 'Peça / Encaixe',
  saude: 'Saúde',
  alvo: 'Alvo / Meta',
  pessoas: 'Pessoas',
  ferramenta: 'Ferramenta',
}

/** Rotulo legivel de um icone (cai na chave se nao houver mapeamento). */
export function iconLabel(key: string): string {
  return ICON_LABELS[key] ?? key
}

export function ContentIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Cmp = ICONS[name]
  if (!Cmp) return null
  return <Cmp className={className} aria-hidden />
}
