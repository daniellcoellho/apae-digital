import { localSettings } from '@/services/localSettings'

/**
 * Conteudo editavel da Home por tenant (White Label).
 * Hero + numeros de impacto. Persistido localmente pelo Admin ate o backend existir.
 */

export interface HomeStat {
  value: number
  suffix: string
  label: string
  hint: string
}

/** Faixa de doacao sugerida (ex.: "R$ 30/mes" -> "Materiais para uma oficina"). */
export interface DonationTier {
  icon: string
  value: string
  desc: string
}

/** Campanha em destaque na Home (barra de progresso). */
export interface HomeCampaign {
  title: string
  raised: number
  goal: number
  donors: number
}

/** Secao de doacao da Home (texto + faixas + campanha opcional). */
export interface HomeDonation {
  label: string
  title: string
  description: string
  tiers: DonationTier[]
  campaign: HomeCampaign
}

export interface HomeContent {
  hero: {
    badge: string
    titlePrefix: string // "Cada conquista aqui começa com"
    titleHighlight: string // "alguém que apoia" (laranja)
    subtitle: string
    imageUrl: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
    floatingValue: number
    floatingLabel: string
  }
  impact: {
    label: string
    title: string
    description: string
    stats: HomeStat[]
  }
  /** Opcional para retrocompatibilidade com conteudo salvo antes desta secao. */
  donation?: HomeDonation
}

const registry: Record<string, HomeContent> = {
  apiuna: {
    hero: {
      badge: 'Apiúna - SC',
      titlePrefix: 'Cada conquista aqui começa com',
      titleHighlight: 'alguém que apoia',
      subtitle:
        'A APAE de Apiúna oferece educação, saúde e assistência social gratuitas para pessoas com deficiência intelectual e múltipla — e caminha junto com suas famílias todos os dias.',
      imageUrl:
        'https://images.unsplash.com/photo-1708686816818-2b018e0c1296?auto=format&fit=crop&w=900&q=60',
      primaryCtaLabel: 'Quero doar',
      secondaryCtaLabel: 'Ver o que está acontecendo',
      floatingValue: 312,
      floatingLabel: 'pessoas atendidas neste ano com o apoio da comunidade',
    },
    impact: {
      label: 'Nosso impacto',
      title: 'Números que são histórias de vida',
      description:
        'Atrás de cada número existe uma pessoa que passou a se comunicar, a caminhar sozinha, a estudar ou a trabalhar. E uma família que deixou de caminhar sozinha.',
      stats: [
        { value: 312, suffix: '', label: 'Pessoas atendidas por ano', hint: 'Crianças, jovens e adultos' },
        { value: 240, suffix: '', label: 'Famílias acompanhadas', hint: 'Orientação e apoio contínuo' },
        { value: 5400, suffix: '+', label: 'Atendimentos realizados', hint: 'Terapias e avaliações em 2025' },
        { value: 32, suffix: '', label: 'Anos de história', hint: 'Desde 1994 na comunidade' },
      ],
    },
    donation: {
      label: 'Doação',
      title: 'Sua doação vira transporte, terapia e futuro',
      description:
        'A APAE é uma entidade sem fins lucrativos. Doações mensais garantem a continuidade dos atendimentos gratuitos e a manutenção da estrutura.',
      tiers: [
        { icon: 'peca', value: 'R$ 30/mês', desc: 'Materiais para uma oficina terapêutica' },
        { icon: 'van', value: 'R$ 100/mês', desc: 'Transporte de um aluno por um mês' },
        { icon: 'maos', value: 'R$ 250/mês', desc: 'Uma sessão semanal de fisioterapia' },
      ],
      campaign: {
        title: 'Van acessível para o transporte dos alunos',
        raised: 68400,
        goal: 120000,
        donors: 184,
      },
    },
  },
}

/** Secao de doacao padrao (usada como fallback quando o conteudo salvo nao a tem). */
export function getDefaultDonation(): HomeDonation {
  return {
    label: 'Doação',
    title: 'Sua doação vira transporte, terapia e futuro',
    description:
      'A APAE é uma entidade sem fins lucrativos. Doações mensais garantem a continuidade dos atendimentos gratuitos e a manutenção da estrutura.',
    tiers: [
      { icon: 'peca', value: 'R$ 30/mês', desc: 'Materiais para uma oficina terapêutica' },
      { icon: 'van', value: 'R$ 100/mês', desc: 'Transporte de um aluno por um mês' },
      { icon: 'maos', value: 'R$ 250/mês', desc: 'Uma sessão semanal de fisioterapia' },
    ],
    campaign: {
      title: '',
      raised: 0,
      goal: 0,
      donors: 0,
    },
  }
}

/** Fallback quando o tenant nao tem entrada propria. */
function fallback(): HomeContent {
  return registry.apiuna
}

export function getDefaultHomeContent(tenant: string): HomeContent {
  return registry[tenant] ?? fallback()
}

export function getHomeContent(tenant: string): HomeContent {
  const override = localSettings.get<HomeContent>(tenant, 'home')
  return override ?? getDefaultHomeContent(tenant)
}
