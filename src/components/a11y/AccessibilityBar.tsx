import { useEffect, useState } from 'react'

/**
 * Barra de acessibilidade (inclusao digital).
 * Controla tamanho da fonte e alto contraste, persistindo a preferencia.
 * Aplica as mudancas via atributos/classes no <html>, sem quebrar o tema.
 */
export function AccessibilityBar() {
  const [fontScale, setFontScale] = useState<number>(() =>
    Number(localStorage.getItem('a11y.fontScale') || 1),
  )
  const [highContrast, setHighContrast] = useState<boolean>(
    () => localStorage.getItem('a11y.highContrast') === 'true',
  )

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * fontScale}px`
    localStorage.setItem('a11y.fontScale', String(fontScale))
  }, [fontScale])

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
    localStorage.setItem('a11y.highContrast', String(highContrast))
  }, [highContrast])

  const clamp = (v: number) => Math.min(1.4, Math.max(0.9, Number(v.toFixed(2))))

  return (
    <div className="bg-primary-dark text-primary-contrast">
      <div className="container-page flex items-center justify-end gap-2 py-1.5 text-xs">
        <span className="mr-1 opacity-80">Acessibilidade:</span>
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-white/10"
          onClick={() => setFontScale((s) => clamp(s - 0.1))}
          aria-label="Diminuir tamanho da fonte"
        >
          A-
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-white/10"
          onClick={() => setFontScale(1)}
          aria-label="Restaurar tamanho da fonte"
        >
          A
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-white/10"
          onClick={() => setFontScale((s) => clamp(s + 0.1))}
          aria-label="Aumentar tamanho da fonte"
        >
          A+
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 hover:bg-white/10"
          onClick={() => setHighContrast((v) => !v)}
          aria-pressed={highContrast}
          aria-label="Alternar alto contraste"
        >
          Alto contraste
        </button>
      </div>
    </div>
  )
}
