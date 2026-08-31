import { Helmet } from 'react-helmet-async'
import { useTheme } from '@/contexts/ThemeContext'

interface PageMetaProps {
  title: string
  description?: string
}

/** Define <title> e meta description por pagina, prefixando com o tenant. */
export function PageMeta({ title, description }: PageMetaProps) {
  const { theme } = useTheme()
  return (
    <Helmet>
      <title>{`${title} · ${theme.name}`}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  )
}
