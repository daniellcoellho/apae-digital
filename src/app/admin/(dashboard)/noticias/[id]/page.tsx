import { NewsFormPage } from '@/screens/admin/NewsFormPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <NewsFormPage id={id} />
}
