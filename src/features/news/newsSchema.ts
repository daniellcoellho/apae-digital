import { z } from 'zod'

export const newsFormSchema = z.object({
  title: z.string().min(3, 'Título muito curto'),
  summary: z.string().min(10, 'Resumo muito curto').max(280, 'Máximo de 280 caracteres'),
  content: z.string().min(20, 'Conteúdo muito curto'),
  coverImageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  category: z.enum(['CAMPANHAS', 'ESTRUTURA', 'PROJETOS', 'INSTITUCIONAL']),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  tagsInput: z.string().optional(),
})

export type NewsFormValues = z.infer<typeof newsFormSchema>
