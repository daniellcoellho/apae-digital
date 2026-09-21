'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { localSettings } from '@/services/localSettings'
import {
  getTransparency,
  type TransparencyContent,
  type TransparencyDoc,
} from '@/content/transparencia'

const emptyDoc: TransparencyDoc = { title: '', description: '', tag: '', url: '' }

/** Admin > Transparencia: CRUD dos documentos exibidos no site. */
export function TransparencyAdminPage() {
  const { theme } = useTheme()
  const [content, setContent] = useState<TransparencyContent>(() => getTransparency(theme.tenant))
  const [saved, setSaved] = useState(false)

  const inputCls = 'mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary'

  function setDoc(index: number, patch: Partial<TransparencyDoc>) {
    setContent((c) => ({
      ...c,
      documents: c.documents.map((d, i) => (i === index ? { ...d, ...patch } : d)),
    }))
  }

  function addDoc() {
    setContent((c) => ({ ...c, documents: [...c.documents, { ...emptyDoc }] }))
  }

  function removeDoc(index: number) {
    setContent((c) => ({ ...c, documents: c.documents.filter((_, i) => i !== index) }))
  }

  function save() {
    localSettings.set<TransparencyContent>(theme.tenant, 'transparencia', content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <PageMeta title="Transparência (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Transparência</h1>
          <p className="mt-1 text-ink-muted">Gerencie os documentos de prestação de contas.</p>
        </div>
        <button onClick={save} className="btn-primary inline-flex items-center gap-1.5">
          {saved && <Check className="h-4 w-4" aria-hidden />}
          {saved ? 'Salvo' : 'Salvar'}
        </button>
      </div>

      <div className="mt-8 max-w-2xl space-y-6">
        <section className="card p-6">
          <label className="block">
            <span className="text-sm font-medium text-ink">Texto de introdução</span>
            <textarea
              rows={2}
              value={content.intro}
              onChange={(e) => setContent((c) => ({ ...c, intro: e.target.value }))}
              className={inputCls}
            />
          </label>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-ink">Documentos</h2>
            <button onClick={addDoc} className="text-sm font-semibold text-primary">+ Adicionar documento</button>
          </div>

          {content.documents.length === 0 && (
            <p className="mt-3 text-sm text-ink-muted">Nenhum documento cadastrado.</p>
          )}

          <div className="mt-4 space-y-4">
            {content.documents.map((d, i) => (
              <div key={i} className="rounded-2xl border border-black/5 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs text-ink-muted">Título</span>
                    <input value={d.title} onChange={(e) => setDoc(i, { title: e.target.value })} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="text-xs text-ink-muted">Categoria (tag)</span>
                    <input value={d.tag} onChange={(e) => setDoc(i, { tag: e.target.value })} placeholder="RELATÓRIO" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="text-xs text-ink-muted">Link do arquivo (URL)</span>
                    <input value={d.url ?? ''} onChange={(e) => setDoc(i, { url: e.target.value })} placeholder="https://..." className={inputCls} />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs text-ink-muted">Descrição</span>
                    <input value={d.description} onChange={(e) => setDoc(i, { description: e.target.value })} className={inputCls} />
                  </label>
                </div>
                <button onClick={() => removeDoc(i)} className="mt-3 text-sm text-secondary-dark hover:underline">Remover</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
