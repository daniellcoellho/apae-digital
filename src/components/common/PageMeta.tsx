'use client'

import { useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface PageMetaProps {
  title: string
  description?: string
}

/**
 * Define o <title> e a meta description no cliente, prefixando com o tenant.
 * (Paginas publicas sao client components; para SEO no server, usar Metadata API.)
 */
export function PageMeta({ title, description }: PageMetaProps) {
  const { theme } = useTheme()

  useEffect(() => {
    document.title = `${title} · ${theme.name}`
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description, theme.name])

  return null
}
