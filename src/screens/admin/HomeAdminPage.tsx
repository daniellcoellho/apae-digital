'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { Check, Plus, Trash2 } from 'lucide-react'
import { ImageUploadField } from '@/components/common/ImageUploadField'
import { ICON_KEYS, iconLabel } from '@/components/common/Icon'
import { tenantService } from '@/services/tenantService'
import {
  getDefaultDonation,
  getDefaultHomeContent,
  type DonationTier,
  type HomeCampaign,
  type HomeContent,
  type HomeDonation,
  type HomeStat,
} from '@/content/home'

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

  function addStat() {
    setContent((c) => ({
      ...c,
      impact: { ...c.impact, stats: [...c.impact.stats, { value: 0, suffix: '', label: '', hint: '' }] },
    }))
  }

  function removeStat(index: number) {
    setContent((c) => ({
      ...c,
      impact: { ...c.impact, stats: c.impact.stats.filter((_, i) => i !== index) },
    }))
  }

  // ---- Doacao + campanha ----
  const donation: HomeDonation = content.donation ?? getDefaultDonation()

  function setDonation<K extends keyof HomeDonation>(key: K, value: HomeDonation[K]) {
    setContent((c) => ({ ...c, donation: { ...(c.donation ?? getDefaultDonation()), [key]: value } }))
  }

  function setCampaign<K extends keyof HomeCampaign>(key: K, value: HomeCampaign[K]) {
    setContent((c) => {
      const d = c.donation ?? getDefaultDonation()
      return { ...c, donation: { ...d, campaign: { ...d.campaign, [key]: value } } }
    })
  }

  function setTier(index: number, patch: Partial<DonationTier>) {
    setContent((c) => {
      const d = c.donation ?? getDefaultDonation()
      return { ...c, donation: { ...d, tiers: d.tiers.map((t, i) => (i === index ? { ...t, ...patch } : t)) } }
    })
  }

  function addTier() {
    setContent((c) => {
      const d = c.donation ?? getDefaultDonation()
      return { ...c, donation: { ...d, tiers: [...d.tiers, { icon: '', value: '', desc: '' }] } }
    })
  }

  function removeTier(index: number) {
    setContent((c) => {
      const d = c.donation ?? getDefaultDonation()
      return { ...c, donation: { ...d, tiers: d.tiers.filter((_, i) => i !== index) } }
    })
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-muted">Número {i + 1}</p>
                    <button
                      onClick={() => removeStat(i)}
                      title="Remover número"
                      className="rounded-lg p-1.5 text-secondary-dark hover:bg-secondary/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
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

              <button
                onClick={addStat}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                <Plus className="h-4 w-4" aria-hidden /> Adicionar número
              </button>
              <p className="text-xs text-ink-muted">
                A seção exibe os números em grade; o ideal é cadastrar ao menos 4.
              </p>
            </div>
          </div>
        </section>

        {/* Doacao + campanha */}
        <section className="card p-6">
          <h2 className="font-extrabold text-ink">Doação e campanha</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Textos da seção de doação da página inicial, as faixas sugeridas e a campanha em destaque.
          </p>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Rótulo da seção</span>
              <input value={donation.label} onChange={(e) => setDonation('label', e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Título</span>
              <input value={donation.title} onChange={(e) => setDonation('title', e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Descrição</span>
              <textarea rows={2} value={donation.description} onChange={(e) => setDonation('description', e.target.value)} className={inputCls} />
            </label>

            {/* Faixas de doacao */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-ink">Faixas sugeridas</p>
              {donation.tiers.map((t, i) => (
                <div key={i} className="rounded-2xl border border-black/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-ink-muted">Faixa {i + 1}</p>
                    <button onClick={() => removeTier(i)} title="Remover faixa" className="rounded-lg p-1.5 text-secondary-dark hover:bg-secondary/10">
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-xs text-ink-muted">Ícone</span>
                      <select value={t.icon} onChange={(e) => setTier(i, { icon: e.target.value })} className={inputCls}>
                        <option value="">Sem ícone</option>
                        {ICON_KEYS.map((key) => (
                          <option key={key} value={key}>{iconLabel(key)}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs text-ink-muted">Valor (ex.: R$ 50/mês)</span>
                      <input value={t.value} onChange={(e) => setTier(i, { value: e.target.value })} className={inputCls} />
                    </label>
                    <label className="block">
                      <span className="text-xs text-ink-muted">O que custeia</span>
                      <input value={t.desc} onChange={(e) => setTier(i, { desc: e.target.value })} className={inputCls} />
                    </label>
                  </div>
                </div>
              ))}
              <button onClick={addTier} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Plus className="h-4 w-4" aria-hidden /> Adicionar faixa
              </button>
            </div>

            {/* Campanha */}
            <div className="rounded-2xl border border-black/5 p-4">
              <p className="text-sm font-semibold text-ink">Campanha em destaque</p>
              <p className="text-xs text-ink-muted">Deixe o título em branco para ocultar a campanha na página inicial.</p>
              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="text-xs text-ink-muted">Título da campanha</span>
                  <input value={donation.campaign.title} onChange={(e) => setCampaign('title', e.target.value)} className={inputCls} />
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-xs text-ink-muted">Arrecadado (R$)</span>
                    <input type="number" value={donation.campaign.raised} onChange={(e) => setCampaign('raised', Number(e.target.value))} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="text-xs text-ink-muted">Meta (R$)</span>
                    <input type="number" value={donation.campaign.goal} onChange={(e) => setCampaign('goal', Number(e.target.value))} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className="text-xs text-ink-muted">Nº de doadores</span>
                    <input type="number" value={donation.campaign.donors} onChange={(e) => setCampaign('donors', Number(e.target.value))} className={inputCls} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
