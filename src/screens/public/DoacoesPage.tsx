'use client'

import { useMemo, useState } from 'react'
import { Check, Lightbulb } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionHeading } from '@/components/common/SectionHeading'
import { getDonationInfo } from '@/content/doacoes'
import { buildPixBrCode } from '@/features/donations/pixBrCode'
import { PixQRCode } from '@/features/donations/PixQRCode'
import { useSettingsVersion } from '@/hooks/useSettingsVersion'

/** Botao de copiar com feedback temporario. */
function CopyButton({ text, label = 'Copiar' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary/30 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-contrast"
    >
      {copied && <Check className="h-4 w-4" aria-hidden />}
      {copied ? 'Copiado' : label}
    </button>
  )
}

export function DoacoesPage() {
  const { theme } = useTheme()
  const settingsVersion = useSettingsVersion()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const info = useMemo(() => getDonationInfo(theme.tenant), [theme.tenant, settingsVersion])

  // Monta o Pix Copia e Cola (valor livre).
  const brCode = useMemo(() => {
    if (!info) return ''
    return buildPixBrCode({
      key: info.pix.key,
      merchantName: info.pix.merchantName,
      merchantCity: info.pix.merchantCity,
      description: 'Doacao APAE',
    })
  }, [info])

  if (!info) {
    return (
      <>
        <PageMeta title="Doações" />
        <PageHeader title="Doações" subtitle="Sua contribuição transforma vidas." />
        <div className="container-page py-16">
          <p className="text-ink-muted">Dados de doação em breve.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageMeta title="Doações" description={`Doe para a ${theme.name} via PIX ou transferência.`} />
      <PageHeader
        title="Faça uma doação"
        subtitle="Escaneie o QR Code ou copie a chave PIX e doe o valor que desejar. Sua contribuição mantém os atendimentos gratuitos."
      />

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        {/* Coluna principal: PIX */}
        <div>
          <SectionHeading label="Doação via PIX" title="Rápido, seguro e sem taxas" />

          <div className="mt-8 card p-6 sm:p-8">
            <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
              {/* QR Code */}
              <div className="mx-auto grid place-items-center rounded-2xl border border-black/5 bg-surface p-4">
                <PixQRCode payload={brCode} size={200} />
              </div>

              {/* Chave + copia e cola */}
              <div>
                <p className="text-sm font-semibold text-ink-muted">Chave PIX ({info.pix.keyType})</p>
                <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-surface-alt px-4 py-3">
                  <span className="font-semibold text-ink">{info.pix.keyDisplay}</span>
                  <CopyButton text={info.pix.key} label="Copiar chave" />
                </div>

                <p className="mt-4 text-sm font-semibold text-ink-muted">Recebedor</p>
                <p className="text-ink">{info.pix.merchantName}</p>
                <p className="text-sm text-ink-muted">{info.pix.merchantCity}</p>

                <div className="mt-5">
                  <CopyButton text={brCode} label="Copiar código Pix (copia e cola)" />
                </div>
              </div>
            </div>

            <p className="mt-6 flex items-start gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-ink-muted">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              Abra o app do seu banco, escolha pagar com PIX, escaneie o QR Code (ou cole o código)
              e informe o valor que quiser doar.
            </p>
          </div>
        </div>

        {/* Coluna lateral: dados bancarios */}
        <aside>
          <SectionHeading label="Transferência" title="Dados bancários" />
          <div className="mt-8 space-y-4">
            {info.banks.map((b, i) => (
              <div key={i} className="card p-5">
                <h3 className="font-extrabold text-ink">{b.bank}</h3>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Agência</dt>
                    <dd className="font-medium text-ink">{b.agency}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Conta</dt>
                    <dd className="font-medium text-ink">{b.account}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-muted">Titular</dt>
                    <dd className="font-medium text-ink">{b.holder}</dd>
                  </div>
                  {b.document && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Documento</dt>
                      <dd className="font-medium text-ink">{b.document}</dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  )
}
