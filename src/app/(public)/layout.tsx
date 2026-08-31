import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AccessibilityBar } from '@/components/a11y/AccessibilityBar'

/** Layout do site publico: barra de acessibilidade + Header + conteudo + Footer. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <AccessibilityBar />
      <Header />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
