'use client'

import { useRef, useState } from 'react'
import { ImageIcon, Loader2, Upload, X } from 'lucide-react'
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  uploadService,
} from '@/services/uploadService'

interface ImageUploadFieldProps {
  /** URL atual (string vazia quando nao definida). */
  value: string
  /** Chamado com a nova URL (apos upload ou edicao manual). */
  onChange: (url: string) => void
  /** Rotulo do campo. */
  label?: string
  /** Texto de ajuda abaixo do campo. */
  hint?: string
  /** Se true, aceita tambem PDF (para documentos). Default: so imagens. */
  allowPdf?: boolean
  /** Mostra a previa da imagem. Default: true. */
  preview?: boolean
}

/**
 * Campo de arquivo reutilizavel: botao de upload + campo de URL (fallback) + previa.
 * O upload grava no backend e preenche a URL automaticamente. O usuario tambem
 * pode colar uma URL externa manualmente.
 */
export function ImageUploadField({
  value,
  onChange,
  label = 'Imagem',
  hint,
  allowPdf = false,
  preview = true,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accept = (allowPdf ? ACCEPTED_FILE_TYPES : ACCEPTED_IMAGE_TYPES).join(',')
  const isImage = value && !/\.pdf($|\?)/i.test(value)

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(null)

    const allowed = allowPdf ? ACCEPTED_FILE_TYPES : ACCEPTED_IMAGE_TYPES
    if (!allowed.includes(file.type)) {
      setError(allowPdf ? 'Envie uma imagem ou PDF.' : 'Envie uma imagem (PNG, JPG, WEBP, GIF ou SVG).')
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError('Arquivo acima de 5 MB.')
      return
    }

    setUploading(true)
    try {
      const result = await uploadService.upload(file)
      onChange(result.url)
    } catch {
      setError('Falha ao enviar o arquivo. Tente novamente.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="block">
      <span className="text-sm font-medium text-ink">{label}</span>

      <div className="mt-1 flex flex-wrap items-center gap-3">
        {/* Botao de upload */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-theme border border-black/10 px-3 py-2 text-sm font-semibold text-ink hover:border-primary disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
          {uploading ? 'Enviando...' : 'Enviar arquivo'}
        </button>

        {/* Campo de URL (fallback / edicao manual) */}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ou cole uma URL (https://... ou /uploads/...)"
          className="min-w-[200px] flex-1 rounded-theme border border-black/10 px-3 py-2 text-sm focus:border-primary"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            title="Remover"
            className="rounded-lg p-2 text-secondary-dark hover:bg-secondary/10"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="mt-1 text-sm text-secondary-dark">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}

      {/* Previa */}
      {preview && value && (
        <div className="mt-3">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Prévia"
              className="h-24 w-auto rounded-xl border border-black/10 bg-surface-alt object-contain p-1"
            />
          ) : (
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              <ImageIcon className="h-4 w-4" aria-hidden /> Ver arquivo enviado
            </a>
          )}
        </div>
      )}
    </div>
  )
}
