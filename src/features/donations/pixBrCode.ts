/**
 * Gera o "Pix Copia e Cola" (BR Code) estatico no padrao EMV do Banco Central.
 * Nao depende de banco/gateway: apenas monta a string com os campos TLV
 * (id + tamanho + valor) e adiciona o CRC16-CCITT no final.
 *
 * Referencia: Manual de Padroes para Iniciacao do Pix (BR Code / EMV QRCPS-MPM).
 */

export interface PixParams {
  /** chave pix: CPF/CNPJ (so digitos), email, telefone (+55...) ou aleatoria */
  key: string
  /** nome do recebedor (max 25 chars, sem acento) */
  merchantName: string
  /** cidade do recebedor (max 15 chars, sem acento) */
  merchantCity: string
  /** valor opcional; se omitido, o pagador escolhe (valor livre) */
  amount?: number
  /** identificador da transacao; padrao "***" (livre) */
  txid?: string
  /** descricao opcional exibida em alguns apps */
  description?: string
}

/** Monta um campo TLV: id (2) + length (2, zero-padded) + value. */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

/** Remove acentos e limita o comprimento (nome/cidade nao aceitam acento). */
function sanitize(text: string, maxLen: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacriticos
    .replace(/[^\x20-\x7E]/g, '') // remove nao-ASCII
    .toUpperCase()
    .slice(0, maxLen)
    .trim()
}

/** CRC16-CCITT (0x1021), inicial 0xFFFF, retorna hex maiusculo de 4 digitos. */
function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function buildPixBrCode(params: PixParams): string {
  const { key, merchantName, merchantCity, amount, txid = '***', description } = params

  // Merchant Account Information (id 26): GUI + chave (+ descricao)
  const gui = tlv('00', 'br.gov.bcb.pix')
  const pixKey = tlv('01', key)
  const desc = description ? tlv('02', sanitize(description, 40)) : ''
  const merchantAccountInfo = tlv('26', `${gui}${pixKey}${desc}`)

  const payload = [
    tlv('00', '01'), // Payload Format Indicator
    merchantAccountInfo,
    tlv('52', '0000'), // Merchant Category Code (nao informado)
    tlv('53', '986'), // Moeda: BRL (ISO 4217)
    amount !== undefined ? tlv('54', amount.toFixed(2)) : '',
    tlv('58', 'BR'), // Pais
    tlv('59', sanitize(merchantName, 25)),
    tlv('60', sanitize(merchantCity, 15)),
    tlv('62', tlv('05', txid)), // Additional Data: txid
  ].join('')

  // CRC calculado sobre o payload + "6304"
  const toCrc = `${payload}6304`
  return `${toCrc}${crc16(toCrc)}`
}
