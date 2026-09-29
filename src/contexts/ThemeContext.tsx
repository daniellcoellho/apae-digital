'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BrandTheme } from '@/theme/theme.types'
import { applyTheme } from '@/theme/applyTheme'
import { resolveTenantSlug } from '@/theme/themes'
import { resolveTheme } from '@/theme/resolveTheme'
import { tenantService } from '@/services/tenantService'

interface ThemeContextValue {
  theme: BrandTheme
  loading: boolean
  /** troca o tenant ativo (util para preview no admin White Label) */
  setTenant: (slug: string) => void
  /** aplica um tema ja resolvido (ex.: retorno do PUT admin) */
  applyServerTheme: (theme: BrandTheme) => void
  /** rebusca o tema do tenant atual na API */
  refresh: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantSlug] = useState<string>(() => resolveTenantSlug())
  // Estado inicial SINCRONO (catalogo local) — garante primeiro paint com cores
  // validas e evita flash/hydration mismatch antes do fetch da API.
  const [theme, setTheme] = useState<BrandTheme>(() => resolveTheme(resolveTenantSlug()))
  const [loading, setLoading] = useState(false)

  // Aplica as CSS variables sempre que o tema muda.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Apos montar (cliente): resolve o slug real e busca o tema da API.
  // Em caso de erro, o tenantService ja faz fallback para o catalogo local.
  useEffect(() => {
    const slug = resolveTenantSlug()
    setTenantSlug(slug)

    let active = true
    setLoading(true)
    tenantService
      .getPublicTheme(slug)
      .then((fetched) => {
        if (active) setTheme(fetched)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const refresh = useCallback(() => {
    setLoading(true)
    tenantService
      .getPublicTheme(tenant)
      .then(setTheme)
      .finally(() => setLoading(false))
  }, [tenant])

  const applyServerTheme = useCallback((next: BrandTheme) => {
    setTheme(next)
  }, [])

  const setTenant = useCallback((slug: string) => {
    setTenantSlug(slug)
    // fallback imediato local (evita flash) e busca a versao real
    setTheme(resolveTheme(slug))
    tenantService.getPublicTheme(slug).then(setTheme)
  }, [])

  const value = useMemo(
    () => ({ theme, loading, setTenant, applyServerTheme, refresh }),
    [theme, loading, setTenant, applyServerTheme, refresh],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
  return ctx
}
