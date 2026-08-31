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
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=60',
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
  },
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
