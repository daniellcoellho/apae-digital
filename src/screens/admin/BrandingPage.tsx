'use client'

import { useState } from 'react'
import { Check, Heart } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { tenantService } from '@/services/tenantService'
import type { BrandColors, BrandTheme } from '@/theme/theme.types'
import { hexToRgbChannels, rgbChannelsToHex } from '@/theme/colorUtils'

// Campos de cor editaveis (chave no BrandColors + rotulo)
const COLOR_FIELDS: Array<{ key: keyof BrandColors; label: string }> = [
  { key: 'primary', label: 'Primária' },
  { key: 'primaryDark', label: 'Primária (escura)' },
  { key: 'secondary', label: 'Secundária (CTA)' },
  { key: 'secondaryDark', label: 'Secundária (escura)' },
  { key: 'surface', label: 'Fundo' },
  { key: 'surfaceAlt', label: 'Fundo alternativo' },
  { key: 'ink', label: 'Texto' },
  { key: 'inkMuted', label: 'Texto suave' },
]

/**
 * Admin > Identidade Visual (White Label).
 * Edita cores, logo, tipografia e raio, salvando na API (PUT /api/admin/theme).
 */
export function BrandingPage() {
  const { theme, applyServerTheme } = useTheme()
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado do formulario espelha o tema atual.
  const [name, setName] = useState(theme.name)
  const [city, setCity] = useState(theme.city)
  const [logoUrl, setLogoUrl] = useState(theme.logoUrl)
  const [radius, setRadius] = useState(theme.radius)
  const [colors, setColors] = useState<BrandColors>({ ...theme.colors })

  /** Monta o BrandTheme completo (tema atual + campos editados no formulario). */
  function buildTheme(): BrandTheme {
    return {
      ...theme,
      name,
      city,
      logoUrl,
      radius,
      colors,
    }
  }

  // Salva na API e aplica o tema retornado pelo servidor.
  async function apply() {
    setSaving(true)
    setError(null)
    try {
      const updated = await tenantService.updateAdminTheme(buildTheme())
      applyServerTheme(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Não foi possível salvar. Verifique sua conexão e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageMeta title="Identidade Visual (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Identidade Visual</h1>
          <p className="mt-1 text-ink-muted">Personalize cores, logo e tipografia da sua APAE.</p>
        </div>
        <button onClick={apply} disabled={saving} className="btn-primary inline-flex items-center gap-1.5">
          {saved && <Check className="h-4 w-4" aria-hidden />}
          {saving ? 'Salvando...' : saved ? 'Salvo' : 'Salvar'}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-secondary/10 px-4 py-2 text-sm text-secondary-dark">{error}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Formulario */}
        <div className="space-y-8">
          {/* Marca */}
          <section className="card p-6">
            <h2 className="font-extrabold text-ink">Marca</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Nome</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Cidade / UF</span>
                <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-ink">Logotipo (URL)</span>
                <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="/tenants/.../logo.svg ou https://..." className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary" />
              </label>
            </div>
          </section>

          {/* Cores */}
          <section className="card p-6">
            <h2 className="font-extrabold text-ink">Cores</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {COLOR_FIELDS.map((f) => (
                <label key={f.key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={rgbChannelsToHex(colors[f.key] ?? '0 0 0')}
                    onChange={(e) =>
                      setColors((c) => ({ ...c, [f.key]: hexToRgbChannels(e.target.value) }))
                    }
                    className="h-10 w-12 shrink-0 cursor-pointer rounded border border-black/10 bg-transparent"
                    aria-label={f.label}
                  />
                  <span className="text-sm text-ink">{f.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Tipografia e forma */}
          <section className="card p-6">
            <h2 className="font-extrabold text-ink">Tipografia e forma</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Fonte dos títulos</span>
                <input
                  value={theme.typography.heading}
                  readOnly
                  className="mt-1 w-full rounded-theme border border-black/10 bg-surface-alt px-4 py-2.5 text-ink-muted"
                  title="Edição de fontes personalizadas em breve"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Raio dos cantos</span>
                <select value={radius} onChange={(e) => setRadius(e.target.value)} className="mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary">
                  <option value="0.375rem">Pequeno</option>
                  <option value="0.75rem">Médio</option>
                  <option value="0.875rem">Grande</option>
                  <option value="1.25rem">Extra</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        {/* Preview ao vivo */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="section-label">Pré-visualização</p>
          <div className="mt-3 overflow-hidden rounded-3xl border border-black/5 shadow-sm">
            {/* mini header */}
            <div className="flex items-center gap-2 bg-surface px-4 py-3">
              <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-primary text-[10px] font-bold text-primary-contrast">
                <img src={logoUrl} alt="" className="h-8 w-8 object-cover" onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')} />
              </span>
              <span className="text-sm font-extrabold text-ink">{name}</span>
            </div>
            {/* mini hero */}
            <div className="bg-gradient-to-br from-primary-dark to-primary p-5 text-primary-contrast">
              <p className="text-xs opacity-80">{city}</p>
              <p className="mt-1 text-lg font-extrabold leading-tight">Inclusão que transforma vidas</p>
              <span className="btn-secondary mt-3 inline-flex items-center gap-1 text-xs">
                <Heart className="h-3.5 w-3.5" aria-hidden />
                Doe agora
              </span>
            </div>
            {/* mini card */}
            <div className="bg-surface-alt p-4">
              <div className="card p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Notícia</p>
                <p className="mt-1 font-extrabold text-ink">Título de exemplo</p>
                <p className="mt-1 text-sm text-ink-muted">Texto de apoio da notícia.</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            As mudanças são aplicadas ao site ao clicar em “Salvar”.
          </p>
        </aside>
      </div>
    </>
  )
}
