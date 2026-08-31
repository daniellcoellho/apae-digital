import type { BrandTheme } from './theme.types'

/**
 * Catalogo de temas por tenant.
 *
 * Em producao, o ideal e o backend Spring Boot expor GET /api/tenants/{slug}/theme
 * e o ThemeProvider buscar de la. Este catalogo local serve como:
 *  - fallback offline / primeira renderizacao (evita "flash" sem estilo);
 *  - base de desenvolvimento enquanto o endpoint nao existe.
 */
export const themes: Record<string, BrandTheme> = {
  // Tenant padrao / marca do produto
  default: {
    tenant: 'default',
    name: 'APAE Digital',
    city: 'Brasil',
    logoUrl: '/tenants/default/logo.svg',
    colors: {
      primary: '30 107 82',
      primaryLight: '61 148 120',
      primaryDark: '20 74 57',
      primaryContrast: '255 255 255',
      secondary: '234 88 12',
      secondaryLight: '251 146 60',
      secondaryDark: '194 65 12',
      secondaryContrast: '255 255 255',
      accent: '37 99 235',
      surface: '255 255 255',
      surfaceAlt: '236 242 238',
      ink: '17 24 28',
      inkMuted: '90 100 105',
    },
    typography: {
      heading: "'Poppins', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
    },
    radius: '0.75rem',
    contact: {
      email: 'contato@apaedigital.org.br',
      phone: '(00) 0000-0000',
      address: 'Brasil',
    },
    donationUrl: '/doacoes',
  },

  // Cliente inicial (estudo de caso): APAE de Apiuna - SC
  apiuna: {
    tenant: 'apiuna',
    name: 'APAE de Apiúna',
    city: 'Apiúna - SC',
    logoUrl: '/tenants/apiuna/logo.svg',
    colors: {
      primary: '21 128 61', // verde
      primaryLight: '74 179 111',
      primaryDark: '15 92 44',
      primaryContrast: '255 255 255',
      secondary: '234 88 12', // laranja "Doe Agora"
      secondaryLight: '251 146 60',
      secondaryDark: '194 65 12',
      secondaryContrast: '255 255 255',
      accent: '2 132 199',
      surface: '255 255 255',
      surfaceAlt: '233 241 235',
      ink: '20 27 24',
      inkMuted: '82 96 88',
    },
    typography: {
      heading: "'Poppins', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
    },
    radius: '0.875rem',
    contact: {
      email: 'contato@apaeapiuna.org.br',
      phone: '(47) 0000-0000',
      address: 'Apiúna - SC',
      social: {
        instagram: 'https://instagram.com/',
        facebook: 'https://facebook.com/',
      },
    },
    donationUrl: '/doacoes',
  },
}

export const DEFAULT_TENANT =
  import.meta.env.VITE_DEFAULT_TENANT || 'apiuna'

/**
 * Resolve o tenant a partir do dominio.
 * Ex.: apiuna.apaedigital.org.br -> "apiuna"
 * Em dev (localhost) cai no DEFAULT_TENANT.
 */
export function resolveTenantSlug(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT

  const host = window.location.hostname
  if (host === 'localhost' || host === '127.0.0.1') {
    // permite testar via ?tenant=xxx em dev
    const fromQuery = new URLSearchParams(window.location.search).get('tenant')
    return fromQuery || DEFAULT_TENANT
  }

  const [subdomain] = host.split('.')
  return themes[subdomain] ? subdomain : DEFAULT_TENANT
}

export function getThemeBySlug(slug: string): BrandTheme {
  return themes[slug] ?? themes.default
}
