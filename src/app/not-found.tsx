import { NotFoundPage } from '@/screens/NotFoundPage'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <NotFoundPage />
      </main>
      <Footer />
    </div>
  )
}
