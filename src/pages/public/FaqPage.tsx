import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'

const faqs = [
  {
    q: 'Como posso fazer uma doação?',
    a: 'Clique no botão "Doe Agora" no topo do site e escolha a forma de contribuição.',
  },
  {
    q: 'Quem pode ser atendido pela APAE?',
    a: 'Pessoas com deficiência intelectual e múltipla, conforme avaliação da equipe.',
  },
  {
    q: 'Como me tornar voluntário?',
    a: 'Entre em contato pela página de Contato para conhecer as oportunidades.',
  },
]

export function FaqPage() {
  return (
    <>
      <PageMeta title="FAQ" description="Perguntas frequentes." />
      <PageHeader title="Perguntas frequentes" subtitle="Tire suas dúvidas mais comuns." />
      <section className="container-page max-w-3xl py-16">
        <div className="space-y-4">
          {faqs.map((item) => (
            <details key={item.q} className="card p-6">
              <summary className="cursor-pointer font-extrabold text-ink">{item.q}</summary>
              <p className="mt-2 text-sm text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
