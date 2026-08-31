/**
 * Camada de "settings" local por tenant (substituto temporario do backend).
 *
 * Guarda overrides de configuracao (tema, doacao, etc.) no localStorage,
 * escopados por tenant. As telas do Admin salvam aqui; o site publico le daqui
 * (com merge sobre os dados padrao). Quando o backend existir, basta trocar
 * estas funcoes por chamadas HTTP mantendo a mesma assinatura.
 */

export type SettingsDomain =
  | 'theme'
  | 'donation'
  | 'home'
  | 'servicos'
  | 'transparencia'

function storageKey(tenant: string, domain: SettingsDomain): string {
  return `apae.settings.${tenant}.${domain}`
}

export const localSettings = {
  get<T>(tenant: string, domain: SettingsDomain): T | null {
    try {
      const raw = localStorage.getItem(storageKey(tenant, domain))
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  set<T>(tenant: string, domain: SettingsDomain, value: T): void {
    localStorage.setItem(storageKey(tenant, domain), JSON.stringify(value))
    // Notifica a app (mesmo tab) para reagir sem reload.
    window.dispatchEvent(
      new CustomEvent('apae:settings-changed', { detail: { tenant, domain } }),
    )
  },

  clear(tenant: string, domain: SettingsDomain): void {
    localStorage.removeItem(storageKey(tenant, domain))
    window.dispatchEvent(
      new CustomEvent('apae:settings-changed', { detail: { tenant, domain } }),
    )
  },
}
