/**
 * Conversao entre HEX (#1e6b52) e o formato de canais RGB usado nas CSS
 * variables do tema ("30 107 82"). Os inputs de cor do navegador usam HEX,
 * mas o Tailwind consome os canais para suportar <alpha-value>.
 */

/** "#1e6b52" -> "30 107 82" */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

/** "30 107 82" -> "#1e6b52" */
export function rgbChannelsToHex(channels: string): string {
  const [r, g, b] = channels.trim().split(/\s+/).map(Number)
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
