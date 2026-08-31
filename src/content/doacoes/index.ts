/**
 * Dados de doacao por tenant (White Label).
 * Chave PIX + recebedor + contas bancarias.
 *
 * IMPORTANTE: estes dados ficam visiveis no front. Use os dados OFICIAIS
 * da APAE em producao. Os valores abaixo sao de TESTE.
 */

export interface BankAccount {
  bank: string
  agency: string
  account: string
  holder: string
  document?: string
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA'

export interface DonationInfo {
  pix: {
    key: string
    keyType: PixKeyType
    /** como exibir a chave (formatada) */
    keyDisplay: string
    merchantName: string
    merchantCity: string
  }
  banks: BankAccount[]
}

const registry: Record<string, DonationInfo> = {
  // TESTE: dados pessoais do desenvolvedor para validar o QR do PIX.
  // Trocar pelos dados oficiais da APAE de Apiuna antes de publicar.
  apiuna: {
    pix: {
      key: '12966084928', // CPF (so digitos)
      keyType: 'CPF',
      keyDisplay: '129.660.849-28',
      merchantName: 'DANIEL FELIPE COELHO',
      merchantCity: 'APIUNA',
    },
    banks: [
      {
        bank: 'Banco (exemplo)',
        agency: '0001',
        account: '00000-0',
        holder: 'DANIEL FELIPE COELHO',
        document: 'CPF 129.660.849-28',
      },
    ],
  },
}

import { localSettings } from '@/services/localSettings'

/** Dados base (arquivo) sem overrides. */
export function getDefaultDonationInfo(tenant: string): DonationInfo | undefined {
  return registry[tenant]
}

/**
 * Resolve a info de doacao: base + overrides locais (Admin).
 * Se o Admin salvou uma config, ela tem prioridade total.
 */
export function getDonationInfo(tenant: string): DonationInfo | undefined {
  const override = localSettings.get<DonationInfo>(tenant, 'donation')
  return override ?? registry[tenant]
}
