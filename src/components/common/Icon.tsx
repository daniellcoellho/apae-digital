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

export function ContentIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Cmp = ICONS[name]
  if (!Cmp) return null
  return <Cmp className={className} aria-hidden />
}
