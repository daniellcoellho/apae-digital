import { useEffect, useState } from 'react'

/**
 * Retorna um contador que incrementa quando settings locais mudam.
 * Use como dependencia para re-ler dados derivados de localSettings
 * (ex.: getDonationInfo) apos edicao no Admin, sem reload.
 */
export function useSettingsVersion(): number {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1)
    window.addEventListener('apae:settings-changed', bump)
    window.addEventListener('storage', bump)
    return () => {
      window.removeEventListener('apae:settings-changed', bump)
      window.removeEventListener('storage', bump)
    }
  }, [])

  return version
}
