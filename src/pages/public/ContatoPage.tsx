import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'

const contactSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().email('E-mail inválido'),
  message: z.string().min(10, 'Escreva uma mensagem com pelo menos 10 caracteres'),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContatoPage() {
  const { theme } = useTheme()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(data: ContactForm) {
    // TODO: POST /api/contact
    console.log('contato', data)
    await new Promise((r) => setTimeout(r, 400))
    reset()
  }

  return (
    <>
      <PageMeta title="Contato" description="Fale com a gente." />
      <PageHeader title="Contato" subtitle="Envie sua mensagem ou use nossos canais." />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">Nome</label>
            <input id="name" {...register('name')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
            {errors.name && <p className="mt-1 text-sm text-secondary-dark">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">E-mail</label>
            <input id="email" type="email" {...register('email')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
            {errors.email && <p className="mt-1 text-sm text-secondary-dark">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink">Mensagem</label>
            <textarea id="message" rows={5} {...register('message')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
            {errors.message && <p className="mt-1 text-sm text-secondary-dark">{errors.message.message}</p>}
          </div>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
          </button>
          {isSubmitSuccessful && <p className="text-sm text-primary">Mensagem enviada. Obrigado!</p>}
        </form>

        <aside className="rounded-3xl bg-surface-alt p-6">
          <h2 className="text-lg font-extrabold text-ink">Nossos canais</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li><strong>E-mail:</strong> {theme.contact.email}</li>
            <li><strong>Telefone:</strong> {theme.contact.phone}</li>
            <li><strong>Endereço:</strong> {theme.contact.address}</li>
          </ul>
        </aside>
      </section>
    </>
  )
}
