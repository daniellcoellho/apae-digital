interface PageHeaderProps {
  title: string
  subtitle?: string
}

/** Cabecalho padrao das paginas internas: faixa verde com titulo pesado. */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-primary text-primary-contrast">
      <div className="container-page py-14 lg:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-primary-contrast/85">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
