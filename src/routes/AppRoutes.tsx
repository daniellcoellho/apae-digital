import { Routes, Route } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Paginas publicas
import { HomePage } from '@/pages/public/HomePage'
import { InstitucionalPage } from '@/pages/public/InstitucionalPage'
import { ServicosPage } from '@/pages/public/ServicosPage'
import { EventosPage } from '@/pages/public/EventosPage'
import { NoticiasPage } from '@/pages/public/NoticiasPage'
import { NoticiaDetalhePage } from '@/pages/public/NoticiaDetalhePage'
import { ParceriasPage } from '@/pages/public/ParceriasPage'
import { TransparenciaPage } from '@/pages/public/TransparenciaPage'
import { FaqPage } from '@/pages/public/FaqPage'
import { ContatoPage } from '@/pages/public/ContatoPage'
import { DoacoesPage } from '@/pages/public/DoacoesPage'

// Admin
import { LoginPage } from '@/pages/admin/LoginPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { NewsListPage } from '@/pages/admin/NewsListPage'
import { NewsFormPage } from '@/pages/admin/NewsFormPage'
import { EventsAdminPage } from '@/pages/admin/EventsAdminPage'
import { BrandingPage } from '@/pages/admin/BrandingPage'
import { DonationAdminPage } from '@/pages/admin/DonationAdminPage'

import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Site publico */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="sobre" element={<InstitucionalPage />} />
        <Route path="sobre/:slug" element={<InstitucionalPage />} />
        <Route path="servicos" element={<ServicosPage />} />
        <Route path="eventos" element={<EventosPage />} />
        <Route path="noticias" element={<NoticiasPage />} />
        <Route path="noticias/:slug" element={<NoticiaDetalhePage />} />
        <Route path="parcerias" element={<ParceriasPage />} />
        <Route path="transparencia" element={<TransparenciaPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="contato" element={<ContatoPage />} />
        <Route path="doacoes" element={<DoacoesPage />} />
      </Route>

      {/* Login do admin (fora do layout protegido) */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin protegido */}
      <Route element={<ProtectedRoute roles={['ADMIN', 'EDITOR']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="noticias" element={<NewsListPage />} />
          <Route path="noticias/nova" element={<NewsFormPage />} />
          <Route path="noticias/:id" element={<NewsFormPage />} />
          <Route path="eventos" element={<EventsAdminPage />} />
          <Route path="identidade-visual" element={<BrandingPage />} />
          <Route path="doacao" element={<DonationAdminPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
