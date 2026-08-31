/**
 * Contrato do tema White Label.
 * Cada APAE (tenant) fornece uma BrandTheme que sera aplicada em runtime
 * como CSS variables. As cores sao strings em canais RGB: "30 107 82".
 */
export interface BrandColors {
  primary: string
  primaryLight: string
  primaryDark: string
  primaryContrast: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
  secondaryContrast: string
  accent: string
  surface: string
  surfaceAlt: string
  ink: string
  inkMuted: string
}

export interface BrandTypography {
  heading: string
  body: string
}

export interface BrandTheme {
  /** slug unico do tenant, ex: "apiuna" */
  tenant: string
  /** nome de exibicao, ex: "APAE de Apiuna" */
  name: string
  /** cidade/UF para SEO e rodape */
  city: string
  /** URL ou caminho do logotipo */
  logoUrl: string
  /** URL do logotipo em versao clara (para fundos escuros) */
  logoLightUrl?: string
  colors: BrandColors
  typography: BrandTypography
  radius: string
  /** informacoes de contato exibidas no rodape */
  contact: {
    email: string
    phone: string
    address: string
    social?: {
      instagram?: string
      facebook?: string
      youtube?: string
    }
  }
  /** link/config do modulo de doacoes */
  donationUrl?: string
}
