'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * Providers globais client-side:
 * - ThemeProvider: identidade visual White Label (por tenant)
 * - AuthProvider: sessao JWT do admin
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}
