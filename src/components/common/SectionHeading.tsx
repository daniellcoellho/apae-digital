import type { ReactNode } from 'react'

interface SectionHeadingProps {
  /** rotulo curto em maiusculas, ex: "NOSSO IMPACTO" */
  label?: string
  title: ReactNode
  description?: ReactNode
  /** alinhamento do bloco */
  align?: 'left' | 'center'
  /** usa cores claras (para fundos escuros) */
  light?: boolean
  className?: string
}

/**
 * Cabecalho de secao reutilizavel do novo design:
 * rotulo verde em maiusculas + titulo pesado + descricao opcional.
 */
export function SectionHeading({
  label,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={[
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className,
      ].join(' ')}
    >
      {label && (
        <p
          className={[
            'text-xs font-bold uppercase tracking-[0.15em]',
            light ? 'text-primary-contrast/80' : 'text-primary',
          ].join(' ')}
        >
          {label}
        </p>
      )}
      <h2
        className={[
          'mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl',
          light ? 'text-primary-contrast' : 'text-ink',
        ].join(' ')}
      >
        {title}
      </h2>
      {description && (
        <p className={['mt-3 text-base', light ? 'text-primary-contrast/80' : 'text-ink-muted'].join(' ')}>
          {description}
        </p>
      )}
    </div>
  )
}
