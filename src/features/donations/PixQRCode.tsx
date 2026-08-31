import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

interface PixQRCodeProps {
  /** string do Pix Copia e Cola (BR Code) */
  payload: string
  size?: number
}

/** Renderiza o QR Code do PIX localmente (sem servico externo). */
export function PixQRCode({ payload, size = 200 }: PixQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(
      canvas,
      payload,
      { width: size, margin: 1, errorCorrectionLevel: 'M' },
      (err) => setError(Boolean(err)),
    )
  }, [payload, size])

  if (error) {
    return <p className="text-sm text-secondary-dark">Não foi possível gerar o QR Code.</p>
  }

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      role="img"
      aria-label="QR Code do PIX para doação"
      className="rounded-xl"
    />
  )
}
