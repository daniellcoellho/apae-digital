'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getInstitutionalPages } from '@/content/institucional'
import type { InstitutionalPage } from '@/content/institucional/types'
import { tenantService } from '@/services/tenantService'

/**
 * Resolve o conteudo institucional do tenant ativo, buscando da API.
 * Usa o catalogo local como fallback (resiliencia offline).
 * Fornece os itens do menu (subpaginas), busca por slug e um flag de loading.
 */
export function useInstitutional() {
  const { theme } = useTheme()
  const tenant = theme.tenant

  const [pages, setPages] = useState<InstitutionalPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    tenantService
      .getPublicInstitutional(tenant)
      .then((data) => {
        if (!active) return
        // fallback local quando a API nao tem conteudo/erro
        setPages(data && data.length > 0 ? data : getInstitutionalPages(tenant))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [tenant])

  const menu = useMemo(
    () => pages.map((p) => ({ slug: p.slug, title: p.title })),
    [pages],
  )

  const getPage = (slug: string) => pages.find((p) => p.slug === slug)

  return { pages, menu, getPage, loading }
}
