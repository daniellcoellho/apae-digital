'use client'

import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import {
  getInstitutionalPage,
  getInstitutionalPages,
} from '@/content/institucional'

/**
 * Resolve o conteudo institucional do tenant ativo.
 * Fornece os itens do menu (subpaginas) e busca por slug.
 */
export function useInstitutional() {
  const { theme } = useTheme()
  const tenant = theme.tenant

  const pages = useMemo(() => getInstitutionalPages(tenant), [tenant])

  const menu = useMemo(
    () => pages.map((p) => ({ slug: p.slug, title: p.title })),
    [pages],
  )

  const getPage = (slug: string) => getInstitutionalPage(tenant, slug)

  return { pages, menu, getPage }
}
