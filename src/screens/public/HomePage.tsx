'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Bus,
  Calendar,
  Clock,
  GraduationCap,
  HandHeart,
  Heart,
  MapPin,
  Puzzle,
  Sprout,
  Stethoscope,
  Users,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CountUp } from '@/components/common/CountUp'
import { NEWS_CATEGORIES } from '@/features/news/categories'
import type { NewsCategory } from '@/types'
import { getHomeContent } from '@/content/home'
import { useSettingsVersion } from '@/hooks/useSettingsVersion'

// ---- Dados fixos das secoes ainda nao editaveis (noticias/agenda/servicos/doacao) ----

const featuredNews = {
  tag: 'CAMPANHAS',
  date: '22 de agosto de 2026',
  title: 'Campanha do agasalho arrecada mais de 1.200 peças',
  summary:
    'Com apoio de escolas e comércio local, as doações foram distribuídas para as famílias atendidas pela instituição.',
  slug: 'campanha-do-agasalho',
  image:
    'https://images.unsplash.com/photo-1649887221640-481c952df72e?auto=format&fit=crop&w=800&q=60',
}

const sideNews = [
  {
    tag: 'ESTRUTURA',
    date: '14 de agosto de 2026',
    title: 'Nova sala de fisioterapia é entregue à comunidade',
    summary: 'Espaço ampliado permite 40 novos atendimentos por semana.',
    slug: 'nova-sala-de-fisioterapia',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=60',
  },
  {
    tag: 'PROJETOS',
    date: '02 de agosto de 2026',
    title: 'Oficina de música estreia turma para adolescentes',
    summary: 'Projeto usa arte como caminho para autonomia e convivência.',
    slug: 'oficina-de-musica',
    image:
      'https://images.unsplash.com/photo-1711048421235-3fcb9dcf82f7?auto=format&fit=crop&w=400&q=60',
  },
]

const upcomingEvents = [
  { day: '12', month: 'SET', tag: 'ARRECADAÇÃO', title: 'Bingo Solidário da APAE', desc: 'Cartelas antecipadas na secretaria. Toda a renda vai para o transporte dos alunos.', time: '19h00', place: 'Salão Paroquial — Centro' },
  { day: '21', month: 'SET', tag: 'MOBILIZAÇÃO', title: 'Dia Nacional da Luta da Pessoa com Deficiência', desc: 'Caminhada, apresentações dos alunos e roda de conversa aberta à comunidade.', time: '09h00', place: 'Praça Central' },
  { day: '04', month: 'OUT', tag: 'FEIRA', title: 'Feira de produtos das oficinas', desc: 'Artesanato, horta e panificação produzidos pelos jovens em formação.', time: '08h00 às 14h00', place: 'Sede da APAE' },
  { day: '19', month: 'OUT', tag: 'PALESTRA', title: 'Rede de apoio às famílias', desc: 'Encontro com profissionais sobre direitos e cuidado.', time: '14h00', place: 'Auditório' },
]

const services = [
  { icon: GraduationCap, title: 'Atendimento educacional', desc: 'Escola especial e apoio pedagógico individualizado.' },
  { icon: Stethoscope, title: 'Saúde e reabilitação', desc: 'Fisioterapia, fonoaudiologia, psicologia e terapia ocupacional.' },
  { icon: Users, title: 'Assistência social', desc: 'Acolhimento das famílias e garantia de direitos.' },
  { icon: Briefcase, title: 'Inclusão produtiva', desc: 'Oficinas de trabalho, formação e geração de renda.' },
]

const donationTiers = [
  { icon: Puzzle, value: 'R$ 30/mês', desc: 'Materiais para uma oficina terapêutica' },
  { icon: Bus, value: 'R$ 100/mês', desc: 'Transporte de um aluno por um mês' },
  { icon: HandHeart, value: 'R$ 250/mês', desc: 'Uma sessão semanal de fisioterapia' },
]

const campaign = {
  title: 'Van acessível para o transporte dos alunos',
  raised: 68400,
  goal: 120000,
  donors: 184,
  pix: '12.345.678/0001-90',
}

export function HomePage() {
  const { theme } = useTheme()
  const settingsVersion = useSettingsVersion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const home = useMemo(() => getHomeContent(theme.tenant), [theme.tenant, settingsVersion])
  const { hero, impact } = home
  const donationUrl = theme.donationUrl ?? '/doacoes'
  const progress = Math.round((campaign.raised / campaign.goal) * 100)
  const brl = (v: number) => v.toLocaleString('pt-BR')

  return (
    <>
      <PageMeta
        title="Início"
        description={`${theme.name} — educação, saúde e assistência social gratuitas em ${theme.city}.`}
      />

      {/* ============ HERO ============ */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary text-primary-contrast">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Sprout className="h-3.5 w-3.5" aria-hidden />
              {hero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {hero.titlePrefix}{' '}
              <span className="text-secondary-light">{hero.titleHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-primary-contrast/85">{hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={donationUrl} className="btn-secondary inline-flex items-center gap-1.5 text-base">
                <Heart className="h-4 w-4" aria-hidden />
                {hero.primaryCtaLabel}
              </Link>
              <Link href="/noticias" className="btn-ghost-light text-base">
                {hero.secondaryCtaLabel} →
              </Link>
            </div>
          </div>

          {/* Imagem + card flutuante de estatistica */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-white/10 shadow-lg">
              <img
                src={hero.imageUrl}
                alt="Atendimento na APAE"
                className="h-full w-full object-cover"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0')}
              />
            </div>
            <div className="absolute -bottom-6 left-6 max-w-[16rem] rounded-2xl bg-surface p-5 shadow-xl">
              <CountUp value={hero.floatingValue} className="text-3xl font-extrabold text-primary" />
              <p className="mt-1 text-sm text-ink-muted">{hero.floatingLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NOSSO IMPACTO ============ */}
      <section className="container-page py-16 lg:py-20">
        <SectionHeading
          label={impact.label}
          title={impact.title}
          description={impact.description}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impact.stats.map((s, i) => (
            <div key={i} className="card p-6">
              <CountUp value={s.value} suffix={s.suffix} className="text-4xl font-extrabold text-primary" />
              <p className="mt-3 font-semibold text-ink">{s.label}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ NOTICIAS ============ */}
      <section className="bg-surface-alt py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading label="Notícias" title="O que aconteceu por aqui" />
            <Link href="/noticias" className="btn-outline">Todas as notícias →</Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Destaque */}
            <Link href={`/noticias/${featuredNews.slug}`} className="card group overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={featuredNews.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${NEWS_CATEGORIES[featuredNews.tag as NewsCategory].tag}`}>
                    {NEWS_CATEGORIES[featuredNews.tag as NewsCategory].label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-ink-muted">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    {featuredNews.date}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold text-ink">{featuredNews.title}</h3>
                <p className="mt-2 text-ink-muted">{featuredNews.summary}</p>
                <span className="mt-4 inline-block font-semibold text-primary">Ler a matéria →</span>
              </div>
            </Link>

            {/* Laterais */}
            <div className="flex flex-col gap-6">
              {sideNews.map((n) => (
                <Link key={n.slug} href={`/noticias/${n.slug}`} className="card group flex overflow-hidden">
                  <div className="aspect-square w-32 shrink-0 overflow-hidden sm:w-40">
                    <img
                      src={n.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${NEWS_CATEGORIES[n.tag as NewsCategory].tag}`}>
                        {NEWS_CATEGORIES[n.tag as NewsCategory].label}
                      </span>
                      <span className="text-xs text-ink-muted">{n.date}</span>
                    </div>
                    <h3 className="mt-2 font-extrabold leading-snug text-ink">{n.title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{n.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ AGENDA ============ */}
      <section className="container-page py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Agenda"
            title="Próximos eventos"
            description="Bingos, feiras, encontros de famílias e mobilizações — tudo aberto à comunidade."
          />
          <Link href="/eventos" className="text-sm font-semibold text-ink-muted hover:text-primary">
            Ver calendário completo →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingEvents.map((e) => (
            <article key={e.title} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-contrast">
                  <span className="text-lg font-extrabold leading-none">{e.day}</span>
                  <span className="text-[10px] font-semibold">{e.month}</span>
                </div>
                <span className="mt-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {e.tag}
                </span>
              </div>
              <h3 className="mt-4 font-extrabold leading-snug text-ink">{e.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{e.desc}</p>
              <ul className="mt-4 space-y-1 text-sm text-ink-muted">
                <li className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {e.time}
                </li>
                <li className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {e.place}
                </li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ============ SERVICOS ============ */}
      <section className="bg-surface-alt py-16 lg:py-20">
        <div className="container-page">
          <SectionHeading label="Serviços" title="Atendimento completo e gratuito" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.title} className="card p-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/servicos" className="btn-outline">Conhecer todos os serviços →</Link>
          </div>
        </div>
      </section>

      {/* ============ DOACAO ============ */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-primary-contrast">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <SectionHeading
              light
              label="Doação"
              title="Sua doação vira transporte, terapia e futuro"
              description={`A ${theme.name} é uma entidade sem fins lucrativos. Doações mensais garantem a continuidade dos atendimentos gratuitos e a manutenção da estrutura.`}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {donationTiers.map((t) => (
                <div key={t.value} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <t.icon className="h-5 w-5" aria-hidden />
                  <p className="mt-2 font-extrabold">{t.value}</p>
                  <p className="mt-1 text-sm text-primary-contrast/80">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card de campanha */}
          <div className="rounded-3xl bg-surface p-6 text-ink shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Campanha atual</p>
            <h3 className="mt-2 text-xl font-extrabold">{campaign.title}</h3>

            <div className="mt-5 flex items-end justify-between">
              <p className="text-2xl font-extrabold text-primary">R$ {brl(campaign.raised)}</p>
              <p className="text-sm text-ink-muted">meta R$ {brl(campaign.goal)}</p>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-primary/10">
              <div className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-dark" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm text-ink-muted">{progress}% arrecadado com {campaign.donors} doadores</p>

            <Link href={donationUrl} className="btn-secondary mt-6 flex w-full items-center justify-center gap-1.5 text-base">
              <Heart className="h-4 w-4" aria-hidden />
              Doar via PIX
            </Link>
            <p className="mt-3 text-center text-sm text-ink-muted">
              Doe o valor que desejar por PIX ou transferência.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
