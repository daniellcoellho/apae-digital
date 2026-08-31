'use client'

import { useMemo, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { PageMeta } from '@/components/common/PageMeta'
import { localSettings } from '@/services/localSettings'
import {
  getDonationInfo,
  type BankAccount,
  type DonationInfo,
  type PixKeyType,
} from '@/content/doacoes'
import { buildPixBrCode } from '@/features/donations/pixBrCode'
import { PixQRCode } from '@/features/donations/PixQRCode'

const emptyBank: BankAccount = { bank: '', agency: '', account: '', holder: '', document: '' }

const fallback: DonationInfo = {
  pix: { key: '', keyType: 'CNPJ', keyDisplay: '', merchantName: '', merchantCity: '' },
  banks: [],
}

/** Admin > Doação: edita chave PIX, recebedor e contas, com preview do QR. */
export function DonationAdminPage() {
  const { theme } = useTheme()
  const [info, setInfo] = useState<DonationInfo>(() => getDonationInfo(theme.tenant) ?? fallback)
  const [saved, setSaved] = useState(false)

  const brCode = useMemo(() => {
    if (!info.pix.key || !info.pix.merchantName || !info.pix.merchantCity) return ''
    return buildPixBrCode({
      key: info.pix.key,
      merchantName: info.pix.merchantName,
      merchantCity: info.pix.merchantCity,
      description: 'Doacao APAE',
    })
  }, [info])

  function setPix<K extends keyof DonationInfo['pix']>(key: K, value: DonationInfo['pix'][K]) {
    setInfo((i) => ({ ...i, pix: { ...i.pix, [key]: value } }))
  }

  function setBank(index: number, patch: Partial<BankAccount>) {
    setInfo((i) => ({
      ...i,
      banks: i.banks.map((b, j) => (j === index ? { ...b, ...patch } : b)),
    }))
  }

  function addBank() {
    setInfo((i) => ({ ...i, banks: [...i.banks, { ...emptyBank }] }))
  }

  function removeBank(index: number) {
    setInfo((i) => ({ ...i, banks: i.banks.filter((_, j) => j !== index) }))
  }

  function save() {
    localSettings.set<DonationInfo>(theme.tenant, 'donation', info)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputCls = 'mt-1 w-full rounded-theme border border-black/10 px-4 py-2.5 focus:border-primary'

  return (
    <>
      <PageMeta title="Doação (Admin)" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Doação</h1>
          <p className="mt-1 text-ink-muted">Configure a chave PIX e os dados bancários exibidos no site.</p>
        </div>
        <button onClick={save} className="btn-primary">{saved ? '✓ Salvo' : 'Salvar'}</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          {/* PIX */}
          <section className="card p-6">
            <h2 className="font-extrabold text-ink">Chave PIX</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink">Tipo da chave</span>
                <select value={info.pix.keyType} onChange={(e) => setPix('keyType', e.target.value as PixKeyType)} className={inputCls}>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                  <option value="EMAIL">E-mail</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="ALEATORIA">Aleatória</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Chave (valor real)</span>
                <input value={info.pix.key} onChange={(e) => setPix('key', e.target.value)} placeholder="somente números para CPF/CNPJ" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Chave (como exibir)</span>
                <input value={info.pix.keyDisplay} onChange={(e) => setPix('keyDisplay', e.target.value)} placeholder="00.000.000/0001-00" className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Nome do recebedor</span>
                <input value={info.pix.merchantName} onChange={(e) => setPix('merchantName', e.target.value)} placeholder="APAE DE ..." className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink">Cidade</span>
                <input value={info.pix.merchantCity} onChange={(e) => setPix('merchantCity', e.target.value)} placeholder="APIUNA" className={inputCls} />
              </label>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              O QR Code é gerado a partir destes dados. Nome e cidade sem acento, conforme o padrão do PIX.
            </p>
          </section>

          {/* Contas bancarias */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-ink">Dados bancários</h2>
              <button onClick={addBank} className="text-sm font-semibold text-primary">+ Adicionar conta</button>
            </div>

            {info.banks.length === 0 && (
              <p className="mt-3 text-sm text-ink-muted">Nenhuma conta cadastrada.</p>
            )}

            <div className="mt-4 space-y-4">
              {info.banks.map((b, i) => (
                <div key={i} className="rounded-2xl border border-black/5 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={b.bank} onChange={(e) => setBank(i, { bank: e.target.value })} placeholder="Banco" className={inputCls} />
                    <input value={b.holder} onChange={(e) => setBank(i, { holder: e.target.value })} placeholder="Titular" className={inputCls} />
                    <input value={b.agency} onChange={(e) => setBank(i, { agency: e.target.value })} placeholder="Agência" className={inputCls} />
                    <input value={b.account} onChange={(e) => setBank(i, { account: e.target.value })} placeholder="Conta" className={inputCls} />
                    <input value={b.document ?? ''} onChange={(e) => setBank(i, { document: e.target.value })} placeholder="Documento (CNPJ/CPF)" className={`${inputCls} sm:col-span-2`} />
                  </div>
                  <button onClick={() => removeBank(i)} className="mt-3 text-sm text-secondary-dark hover:underline">Remover conta</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Preview do QR */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="section-label">Pré-visualização do QR</p>
          <div className="mt-3 grid place-items-center rounded-3xl border border-black/5 bg-surface p-6 shadow-sm">
            {brCode ? (
              <PixQRCode payload={brCode} size={180} />
            ) : (
              <p className="text-center text-sm text-ink-muted">Preencha chave, recebedor e cidade para gerar o QR.</p>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
