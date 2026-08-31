import { InstitucionalPage } from '@/screens/public/InstitucionalPage'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <InstitucionalPage slug={slug} />
}
