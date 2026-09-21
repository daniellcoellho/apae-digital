'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { ContentIcon, ICON_KEYS } from '@/components/common/Icon'
import { localSettings } from '@/services/localSettings'
import {
  getServicosContent,
  getDefaultServicosContent,
} from '@/content/servicos'
import type { ServicosContent, ServiceItem, ServiceArea } from '@/content/servicos/types'
import type { ContentBlock } from '@/content/institucional/types'

/** Converte os blocos de paragrafo de um servico em texto (um paragrafo por linha em branco). */
function paragraphsToText(blocks: ContentBlock[]): string {
  return blocks
    .filter((b) => b.type === 'paragraph')
    .map((b) => (b as { text: string }).text)
    .join('\n\n')
}

/** Preserva blocos nao-paragrafo (ex.: listas) e substitui os paragrafos pelo texto editado. */
function textToBlocks(text: string, original: ContentBlock[]): ContentBlock[] {
  const paragraphs: ContentBlock[] = text
    .split(/\n\s*\n/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => ({ type: 'paragraph', text: t }))
  const nonParagraphs = original.filter((b) => b.type !== 'paragraph')
  return [...paragraphs, ...nonParagraphs]
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const emptyService = (): ServiceItem => ({
  id: `servico-${Date.now()}`,
  title: '',
  summary: '',
  icon: '',
  blocks: [],
})

/** Admin > Servicos (versao simplificada): edita areas e servicos. */
export function ServicesAdminPage() {
  const { theme } = useTheme()
  const [content, setContent] = useState<ServicosContent>(
    () => getServicosContent(theme.tenant) ?? getDefaultServicosContent(theme.tenant) ?? { intro: [], areas: [] },
  )
  const [saved, setSaved] = useState(false)

  const inputCls = 'mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary'

  function updateArea(ai: number, patch: Partial<ServiceArea>) {
    setContent((c) => ({ ...c, areas: c.areas.map((a, i) => (i === ai ? { ...a, ...patch } : a)) }))
  }

  function updateService(ai: number, si: number, patch: Partial<ServiceItem>) {
    setContent((c) => ({
      ...c,
      areas: c.areas.map((a, i) =>
        i === ai ? { ...a, services: a.services.map((s, j) => (j === si ? { ...s, ...patch } : s)) } : a,
      ),
    }))
  }

  function addService(ai: number) {
    setContent((c) => ({
      ...c,
      areas: c.areas.map((a, i) => (i === ai ? { ...a, services: [...a.services, emptyService()] } : a)),
    }))
  }

  function removeService(ai: number, si: number) {
    setContent((c) => ({
      ...c,
      areas: c.areas.map((a, i) =>
        i === ai ? { ...a, services: a.services.filter((_, j) => j !== si) } : a,
      ),
    }))
  }

  function save() {
    // Garante ids/ancoras coerentes com o titulo.
    const normalized: ServicosContent = {
      ...content,
      areas: content.areas.map((a) => ({
        ...a,
        id: a.id || slugify(a.title),
        services: a.services.map((s) => ({ ...s, id: s.id || slugify(s.title) })),
      })),
    }
    localSettings.set<ServicosContent>(theme.tenant, 'servicos', normalized)
    setContent(normalized)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function resetDefault() {
    if (!confirm('Restaurar o conteúdo padrão de serviços? As personalizações locais serão apagadas.')) return
    localSettings.clear(theme.tenant, 'servicos')
    window.location.reload()
  }

  return (
    <>
      <PageMeta title="Serviços (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Serviços</h1>
          <p className="mt-1 text-ink-muted">Edite as áreas e os atendimentos exibidos na página de serviços.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefault} className="btn-outline">Restaurar padrão</button>
          <button onClick={save} className="btn-primary inline-flex items-center gap-1.5">
            {saved && <Check className="h-4 w-4" aria-hidden />}
            {saved ? 'Salvo' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="mt-8 max-w-3xl space-y-8">
        {content.areas.map((area, ai) => (
          <section key={ai} className="card p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Nome da área</span>
                <input value={area.title} onChange={(e) => updateArea(ai, { title: e.target.value })} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink">Descrição da área</span>
                <input value={area.description ?? ''} onChange={(e) => updateArea(ai, { description: e.target.value })} className={inputCls} />
              </label>
            </div>

            <div className="mt-5 space-y-4">
              {area.services.map((s, si) => (
                <div key={si} className="rounded-2xl border border-black/5 p-4">
                  <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
                    <label className="block">
                      <span className="text-xs text-ink-muted">Ícone</span>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-theme border border-black/10 text-primary">
                          <ContentIcon name={s.icon} className="h-5 w-5" />
                        </span>
                        <select
                          value={s.icon ?? ''}
                          onChange={(e) => updateService(ai, si, { icon: e.target.value })}
                          className={inputCls.replace('mt-1 ', '')}
                        >
                          <option value="">Sem ícone</option>
                          {ICON_KEYS.map((key) => (
                            <option key={key} value={key}>{key}</option>
                          ))}
                        </select>
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs text-ink-muted">Título do serviço</span>
                      <input value={s.title} onChange={(e) => updateService(ai, si, { title: e.target.value })} className={inputCls} />
                    </label>
                  </div>
                  <label className="mt-3 block">
                    <span className="text-xs text-ink-muted">Resumo</span>
                    <input value={s.summary ?? ''} onChange={(e) => updateService(ai, si, { summary: e.target.value })} className={inputCls} />
                  </label>
                  <label className="mt-3 block">
                    <span className="text-xs text-ink-muted">Descrição (separe parágrafos com linha em branco)</span>
                    <textarea
                      rows={5}
                      defaultValue={paragraphsToText(s.blocks)}
                      onChange={(e) => updateService(ai, si, { blocks: textToBlocks(e.target.value, s.blocks) })}
                      className={inputCls}
                    />
                  </label>
                  {s.blocks.some((b) => b.type === 'list') && (
                    <p className="mt-2 text-xs text-ink-muted">
                      Este serviço possui listas que são preservadas (edição de listas em breve).
                    </p>
                  )}
                  <button onClick={() => removeService(ai, si)} className="mt-3 text-sm text-secondary-dark hover:underline">
                    Remover serviço
                  </button>
                </div>
              ))}

              <button onClick={() => addService(ai)} className="text-sm font-semibold text-primary">
                + Adicionar serviço nesta área
              </button>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
