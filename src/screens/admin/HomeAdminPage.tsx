'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { ImageUploadField } from '@/components/common/ImageUploadField'
import { tenantService } from '@/services/tenantService'
import { getDefaultHomeContent, type HomeContent, type HomeStat } from '@/content/home'

/** Admin > Pagina Inicial: edita hero e numeros de impacto. */
export function HomeAdminPage() {
  const { theme } = useTheme()
  const [content, setContent] = useState<HomeContent>(() => getDefaultHomeContent(theme.tenant))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carrega o conteudo do tenant autenticado.
  useEffect(() => {
    let active = true
    tenantService.getAdminHome().then((data) => {
      if (active && data) setContent(data)
    })
    return () => {
      active = false
    }
  }, [])

  const inputCls = 'mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary'

  function setHero<K extends keyof HomeContent['hero']>(key: K, value: HomeContent['hero'][K]) {
    setContent((c) => ({ ...c, hero: { ...c.hero, [key]: value } }))
  }

  function setImpact<K extends keyof HomeContent['impact']>(key: K, value: HomeContent['impact'][K]) {
    setContent((c) => ({ ...c, impact: { ...c.impact, [key]: value } }))
  }

  function setStat(index: number, patch: Partial<HomeStat>) {
    setContent((c) => ({
      ...c,
      impact: {
        ...c.impact,
        stats: c.impact.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
      },
    }))
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const updated = await tenantService.updateAdminHome(content)
      setContent(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Não foi possível salvar. Verifique os campos e sua conexão.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageMeta title="Página Inicial (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Página Inicial</h1>
          <p className="mt-1 text-ink-muted">Edite o destaque principal e os números de impacto.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary inline-flex items-center gap-1.5">
          {saved && <Check className="h-4 w-4" aria-hidden />}
          {saving ? 'Salvando...' : saved ? 'Salvo' : 'Salvar'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-secondary/10 px-4 py-2 text-sm text-secondary-dark">{error}</p>
      )}

      <div className="mt-8 max-w-2xl space-y-8">
        {/* Hero */}
        <section className="card p-6">
          <h2 className="font-extrabold text-ink">Destaque principal (Hero)</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Selo (badge)</span>
              <input value={content.hero.badge} onChange={(e) => setHero('badge', e.target.value)} className={inputCls} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Título (parte normal)</span>
                <input value={content.hero.titlePrefix} onChange={(e) => setHero('titlePrefix', e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Título (parte em destaque)</span>
                <input value={content.hero.titleHighlight} onChange={(e) => setHero('titleHighlight', e.target.value)} className={inputCls} />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-ink">Subtítulo</span>
              <textarea rows={3} value={content.hero.subtitle} onChange={(e) => setHero('subtitle', e.target.value)} className={inputCls} />
            </label>
            <ImageUploadField
              label="Imagem do destaque"
              value={content.hero.imageUrl}
              onChange={(url) => setHero('imageUrl', url)}
              hint="Imagem principal da home (JPG, PNG...). Até 5 MB."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Botão principal</span>
                <input value={content.hero.primaryCtaLabel} onChange={(e) => setHero('primaryCtaLabel', e.target.value)} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Botão secundário</span>
                <input value={content.hero.secondaryCtaLabel} onChange={(e) => setHero('secondaryCtaLabel', e.target.value)} className={inputCls} />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Número em destaque (card flutuante)</span>
                <input type="number" value={content.hero.floatingValue} onChange={(e) => setHero('floatingValue', Number(e.target.value))} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Texto do card flutuante</span>
                <input value={content.hero.floatingLabel} onChange={(e) => setHero('floatingLabel', e.target.value)} className={inputCls} />
              </label>
            </div>
          </div>
        </section>

        {/* Impacto */}
        <section className="card p-6">
          <h2 className="font-extrabold text-ink">Números de impacto</h2>
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Rótulo da seção</span>
              <input value={content.impact.label} onChange={(e) => setImpact('label', e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Título</span>
              <input value={content.impact.title} onChange={(e) => setImpact('title', e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Descrição</span>
              <textarea rows={2} value={content.impact.description} onChange={(e) => setImpact('description', e.target.value)} className={inputCls} />
            </label>

            <div className="space-y-3">
              {content.impact.stats.map((s, i) => (
                <div key={i} className="rounded-2xl border border-black/5 p-4">
                  <p className="text-sm font-semibold text-ink-muted">Número {i + 1}</p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-4">
                    <label className="block">
                      <span className="text-xs text-ink-muted">Valor</span>
                      <input type="number" value={s.value} onChange={(e) => setStat(i, { value: Number(e.target.value) })} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="text-xs text-ink-muted">Sufixo (ex: +)</span>
                      <input value={s.suffix} onChange={(e) => setStat(i, { suffix: e.target.value })} className={inputCls} />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs text-ink-muted">Rótulo</span>
                      <input value={s.label} onChange={(e) => setStat(i, { label: e.target.value })} className={inputCls} />
                    </label>
                    <label className="block sm:col-span-4">
                      <span className="text-xs text-ink-muted">Descrição</span>
                      <input value={s.hint} onChange={(e) => setStat(i, { hint: e.target.value })} className={inputCls} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
