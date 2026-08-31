import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'APAE Digital',
    template: '%s · APAE Digital',
  },
  description: 'Plataforma White Label para APAEs — inclusão, cuidado e comunidade.',
  icons: { icon: '/favicon.svg' },
}

export const viewport = {
  themeColor: '#1e6b52',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
