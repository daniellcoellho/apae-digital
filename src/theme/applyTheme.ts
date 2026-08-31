import type { BrandTheme } from './theme.types'

/**
 * Aplica um BrandTheme escrevendo as CSS variables no elemento <html>.
 * Como o Tailwind consome estas variaveis (ver tailwind.config.js),
 * trocar o tema aqui repinta toda a UI sem recompilar nada.
 */
export function applyTheme(theme: BrandTheme, target: HTMLElement = document.documentElement) {
  const { colors, typography, radius } = theme

  const vars: Record<string, string> = {
    '--color-primary': colors.primary,
    '--color-primary-light': colors.primaryLight,
    '--color-primary-dark': colors.primaryDark,
    '--color-primary-contrast': colors.primaryContrast,
    '--color-secondary': colors.secondary,
    '--color-secondary-light': colors.secondaryLight,
    '--color-secondary-dark': colors.secondaryDark,
    '--color-secondary-contrast': colors.secondaryContrast,
    '--color-accent': colors.accent,
    '--color-surface': colors.surface,
    '--color-surface-alt': colors.surfaceAlt,
    '--color-ink': colors.ink,
    '--color-ink-muted': colors.inkMuted,
    '--font-heading': typography.heading,
    '--font-body': typography.body,
    '--radius-base': radius,
  }

  for (const [key, value] of Object.entries(vars)) {
    target.style.setProperty(key, value)
  }
}
