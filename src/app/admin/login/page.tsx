import { Suspense } from 'react'
import { LoginPage } from '@/screens/admin/LoginPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center text-ink-muted">Carregando...</div>}>
      <LoginPage />
    </Suspense>
  )
}
