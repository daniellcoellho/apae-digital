'use client'

import { useEffect, useState } from 'react'
import { newsService } from '@/services/newsService'
import type { NewsArticle } from '@/types'

function mockNews(): NewsArticle[] {
  const now = new Date().toISOString()
  const iso = (y: number, m: number, d: number) => new Date(y, m - 1, d).toISOString()
  const img = (id: string, w = 800) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=60`

  const base = {
    content: 'Conteúdo completo da notícia...',
    status: 'PUBLISHED' as const,
    tags: [] as string[],
    createdAt: now,
    updatedAt: now,
  }

  return [
    {
      ...base,
      id: 'n1',
      title: 'Campanha do agasalho arrecada mais de 1.200 peças',
      slug: 'campanha-do-agasalho',
      summary: 'Com apoio de escolas e comércio local, as doações foram distribuídas para as famílias atendidas pela instituição.',
      category: 'CAMPANHAS',
      coverImageUrl: img('1649887221640-481c952df72e'),
      publishedAt: iso(2026, 8, 22),
    },
    {
      ...base,
      id: 'n2',
      title: 'Nova sala de fisioterapia é entregue à comunidade',
      slug: 'nova-sala-de-fisioterapia',
      summary: 'Espaço ampliado permite 40 novos atendimentos por semana e melhora a qualidade dos cuidados.',
      category: 'ESTRUTURA',
      coverImageUrl: img('1519494026892-80bbd2d6fd0d'),
      publishedAt: iso(2026, 8, 14),
    },
    {
      ...base,
      id: 'n3',
      title: 'Oficina de música estreia turma para adolescentes',
      slug: 'oficina-de-musica',
      summary: 'Projeto usa arte como caminho para autonomia e convivência, com aulas semanais gratuitas.',
      category: 'PROJETOS',
      coverImageUrl: img('1711048421235-3fcb9dcf82f7'),
      publishedAt: iso(2026, 8, 2),
    },
    {
      ...base,
      id: 'n4',
      title: 'Novo espaço de convivência é inaugurado',
      slug: 'novo-espaco-de-convivencia',
      summary: 'Ambiente foi pensado para atividades em grupo e acolhimento das famílias.',
      category: 'ESTRUTURA',
      coverImageUrl: img('1761208663763-c4d30657c910'),
      publishedAt: iso(2026, 7, 28),
    },
    {
      ...base,
      id: 'n5',
      title: 'APAE realiza arrecadação de alimentos',
      slug: 'arrecadacao-de-alimentos',
      summary: 'Voluntários organizaram a coleta e a triagem das doações para as famílias assistidas.',
      category: 'CAMPANHAS',
      coverImageUrl: img('1755599629285-91cc09a185c7'),
      publishedAt: iso(2026, 7, 15),
    },
    {
      ...base,
      id: 'n6',
      title: 'Assembleia Geral aprova planejamento para 2027',
      slug: 'assembleia-geral-2027',
      summary: 'Associados definiram metas, prioridades e o orçamento das próximas atividades.',
      category: 'INSTITUCIONAL',
      coverImageUrl: img('1524178232363-1fb2b075b655'),
      publishedAt: iso(2026, 7, 10),
    },
  ]
}

export function useNewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const data = await newsService.listPublished()
        if (active) setArticles(data.content)
      } catch {
        if (active) {
          setArticles(mockNews())
          setError('Exibindo notícias de exemplo (API indisponível).')
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return { articles, loading, error }
}
