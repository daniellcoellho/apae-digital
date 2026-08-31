import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { AccessibilityBar } from '@/components/a11y/AccessibilityBar'

/**
 * Layout principal do site publico: Header + Main + Footer.
 * O <Outlet /> renderiza a pagina atual da rota.
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <AccessibilityBar />
      <Header />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
