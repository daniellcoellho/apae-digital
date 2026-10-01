import { http } from './http'

/** Resposta do backend ao enviar um arquivo. */
export interface UploadResult {
  url: string
  fileName: string
  contentType: string
  size: number
}

/** Tipos aceitos pelo backend (mantem em sincronia com UploadService.java). */
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
export const ACCEPTED_FILE_TYPES = [...ACCEPTED_IMAGE_TYPES, 'application/pdf']
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

/**
 * Servico de upload de arquivos (imagens/PDF).
 * Envia multipart para POST /api/admin/uploads (JWT injetado pelo interceptor)
 * e devolve a URL publica gerada pelo backend.
 */
export const uploadService = {
  async upload(file: File): Promise<UploadResult> {
    const form = new FormData()
    form.append('file', file)
    // Nao fixamos o Content-Type: o axios define o boundary do multipart.
    const { data } = await http.post<UploadResult>('/admin/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
