'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { newsService } from '@/services/newsService'
import { newsFormSchema, type NewsFormValues } from '@/features/news/newsSchema'
import type { NewsInput } from '@/types'
import { PageMeta } from '@/components/common/PageMeta'

/** Formulario de cadastro/edicao de noticias (Admin). id vazio = nova noticia. */
export function NewsFormPage({ id }: { id?: string }) {
  const isEdit = Boolean(id)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: { status: 'DRAFT', category: 'INSTITUCIONAL', tagsInput: '' },
  })

  // Em edicao, carrega os dados existentes.
  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const a = await newsService.getById(id)
        reset({
          title: a.title,
          summary: a.summary,
          content: a.content,
          coverImageUrl: a.coverImageUrl ?? '',
          category: a.category,
          status: a.status,
          tagsInput: a.tags.join(', '),
        })
      } catch {
        setError('root', { message: 'Não foi possível carregar a notícia.' })
      }
    })()
  }, [id, reset, setError])

  async function onSubmit(values: NewsFormValues) {
    const payload: NewsInput = {
      title: values.title,
      summary: values.summary,
      content: values.content,
      coverImageUrl: values.coverImageUrl || undefined,
      category: values.category,
      status: values.status,
      tags: (values.tagsInput ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    try {
      if (isEdit && id) {
        await newsService.update(id, payload)
      } else {
        await newsService.create(payload)
      }
      router.push('/admin/noticias')
    } catch {
      setError('root', { message: 'Erro ao salvar. Verifique a conexão com a API.' })
    }
  }

  return (
    <>
      <PageMeta title={isEdit ? 'Editar notícia' : 'Nova notícia'} />
      <h1 className="text-2xl font-bold text-ink">{isEdit ? 'Editar notícia' : 'Nova notícia'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl space-y-4" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ink">Título</label>
          <input id="title" {...register('title')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          {errors.title && <p className="mt-1 text-sm text-secondary-dark">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-ink">Resumo</label>
          <textarea id="summary" rows={2} {...register('summary')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          {errors.summary && <p className="mt-1 text-sm text-secondary-dark">{errors.summary.message}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-ink">Conteúdo</label>
          <textarea id="content" rows={10} {...register('content')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          {errors.content && <p className="mt-1 text-sm text-secondary-dark">{errors.content.message}</p>}
        </div>

        <div>
          <label htmlFor="coverImageUrl" className="block text-sm font-medium text-ink">Imagem de capa (URL)</label>
          <input id="coverImageUrl" {...register('coverImageUrl')} placeholder="https://..." className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          {errors.coverImageUrl && <p className="mt-1 text-sm text-secondary-dark">{errors.coverImageUrl.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-ink">Categoria</label>
            <select id="category" {...register('category')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary">
              <option value="CAMPANHAS">Campanhas</option>
              <option value="ESTRUTURA">Estrutura</option>
              <option value="PROJETOS">Projetos</option>
              <option value="INSTITUCIONAL">Institucional</option>
            </select>
          </div>
          <div>
            <label htmlFor="tagsInput" className="block text-sm font-medium text-ink">Tags (separadas por vírgula)</label>
            <input id="tagsInput" {...register('tagsInput')} placeholder="campanha, evento" className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-ink">Status</label>
            <select id="status" {...register('status')} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary">
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>
        </div>

        {errors.root && <p className="text-sm text-secondary-dark">{errors.root.message}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={() => router.push('/admin/noticias')} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </>
  )
}
