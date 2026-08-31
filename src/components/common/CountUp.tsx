'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  /** valor final (numero) */
  value: number
  /** duracao da animacao em ms */
  duration?: number
  /** texto antes do numero, ex: "R$ " */
  prefix?: string
  /** texto depois do numero, ex: "+" */
  suffix?: string
  className?: string
}

/**
 * Contador animado: sobe de 0 ate `value` quando entra na viewport.
 * - Anima uma unica vez.
 * - Formata com separador de milhar pt-BR.
 * - Respeita prefers-reduced-motion (mostra o valor final direto).
 */
export function CountUp({ value, duration = 1600, prefix = '', suffix = '', className }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setDisplay(value)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !started.current) {
          started.current = true
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    function animate() {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        // easeOutCubic para desacelerar no fim
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(value * eased))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}
