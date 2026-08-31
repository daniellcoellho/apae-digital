import type { BrandTheme } from './theme.types'
import { getThemeBySlug } from './themes'
import { localSettings } from '@/services/localSettings'

/** Overrides parciais salvos pelo Admin (Identidade Visual). */
export type ThemeOverride = Partial<
  Pick<BrandTheme, 'name' | 'city' | 'logoUrl' | 'radius'>
> & {
  colors?: Partial<BrandTheme['colors']>
  typography?: Partial<BrandTheme['typography']>
}

/**
 * Resolve o tema final do tenant: base (arquivo) + overrides locais (Admin).
 * Quando o backend existir, o override vira o payload do endpoint de tema.
 */
export function resolveTheme(slug: string): BrandTheme {
  const base = getThemeBySlug(slug)
  const override = localSettings.get<ThemeOverride>(slug, 'theme')
  if (!override) return base

  return {
    ...base,
    ...override,
    colors: { ...base.colors, ...(override.colors ?? {}) },
    typography: { ...base.typography, ...(override.typography ?? {}) },
  }
}
