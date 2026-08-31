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

interface ThemeContextValue {
  theme: BrandTheme
  loading: boolean
  /** troca o tenant ativo (util para preview no admin White Label) */
  setTenant: (slug: string) => void
  /** re-resolve o tema do tenant atual (apos edicao no Admin) */
  refresh: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantSlug] = useState<string>(() => resolveTenantSlug())
  const [theme, setTheme] = useState<BrandTheme>(() => resolveTheme(resolveTenantSlug()))
  const [loading] = useState(false)

  // No cliente, re-resolve o tenant/tema (usa window/localStorage) apos hidratar.
  useEffect(() => {
    const slug = resolveTenantSlug()
    setTenantSlug(slug)
    setTheme(resolveTheme(slug))
  }, [])

  // Aplica as CSS variables sempre que o tema muda.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const refresh = useCallback(() => {
    setTheme(resolveTheme(tenant))
  }, [tenant])

  const setTenant = useCallback((slug: string) => {
    setTenantSlug(slug)
    setTheme(resolveTheme(slug))
  }, [])

  // Reage a edicoes salvas no Admin (mesmo tab) e em outras abas.
  useEffect(() => {
    const onChange = () => setTheme(resolveTheme(tenant))
    window.addEventListener('apae:settings-changed', onChange as EventListener)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener('apae:settings-changed', onChange as EventListener)
      window.removeEventListener('storage', onChange)
    }
  }, [tenant])

  const value = useMemo(
    () => ({ theme, loading, setTenant, refresh }),
    [theme, loading, setTenant, refresh],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
  return ctx
}
