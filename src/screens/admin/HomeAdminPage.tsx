'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { localSettings } from '@/services/localSettings'
import { getHomeContent, type HomeContent, type HomeStat } from '@/content/home'

/** Admin > Pagina Inicial: edita hero e numeros de impacto. */
export function HomeAdminPage() {
  const { theme } = useTheme()
  const [content, setContent] = useState<HomeContent>(() => getHomeContent(theme.tenant))
  const [saved, setSaved] = useState(false)

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

  function save() {
    localSettings.set<HomeContent>(theme.tenant, 'home', content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function resetDefault() {
    if (!confirm('Restaurar o conteúdo padrão da Home? As personalizações locais serão apagadas.')) return
    localSettings.clear(theme.tenant, 'home')
    window.location.reload()
  }

  return (
    <>
      <PageMeta title="Página Inicial (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Página Inicial</h1>
          <p className="mt-1 text-ink-muted">Edite o destaque principal e os números de impacto.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefault} className="btn-outline">Restaurar padrão</button>
          <button onClick={save} className="btn-primary inline-flex items-center gap-1.5">
            {saved && <Check className="h-4 w-4" aria-hidden />}
            {saved ? 'Salvo' : 'Salvar'}
          </button>
        </div>
      </div>

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
            <label className="block">
              <span className="text-sm font-medium text-ink">Imagem (URL)</span>
              <input value={content.hero.imageUrl} onChange={(e) => setHero('imageUrl', e.target.value)} placeholder="https://..." className={inputCls} />
            </label>
            {content.hero.imageUrl && (
              <img src={content.hero.imageUrl} alt="Prévia" className="mt-2 aspect-[4/3] w-48 rounded-2xl object-cover" />
            )}
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
