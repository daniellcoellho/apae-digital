import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/common/PageMeta'

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Página não encontrada" />
      <div className="container-page grid min-h-[50vh] place-items-center py-16 text-center">
        <div>
          <p className="text-5xl font-bold text-primary">404</p>
          <h1 className="mt-4 text-2xl font-bold text-ink">Página não encontrada</h1>
          <p className="mt-2 text-ink-muted">O conteúdo que você procura pode ter sido movido.</p>
          <Link to="/" className="btn-primary mt-6">Voltar para a Home</Link>
        </div>
      </div>
    </>
  )
}
