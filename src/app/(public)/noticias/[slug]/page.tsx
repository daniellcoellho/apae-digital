import { NoticiaDetalhePage } from '@/screens/public/NoticiaDetalhePage'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <NoticiaDetalhePage slug={slug} />
}
