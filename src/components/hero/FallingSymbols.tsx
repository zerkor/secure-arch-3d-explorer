'use client'
import { useEffect, useRef } from 'react'

const CHARS = '01アイウエオABCDEF<>{}[]|#@$%^&*!?/\\ΩΨΦΛΞΠΣΘψφλξπστ'

interface Column {
  x:     number
  y:     number
  speed: number
  chars: string[]
  len:   number
}

export default function FallingSymbols() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const FONT_SIZE = 13
    const cols: Column[] = []

    const init = () => {
      cols.length = 0
      const count = Math.floor(canvas.width / 28)
      for (let i = 0; i < count; i++) {
        cols.push({
          x:     i * 28 + Math.random() * 10,
          y:     Math.random() * -canvas.height,
          speed: 0.8 + Math.random() * 1.4,
          chars: Array.from({ length: 20 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
          len:   6 + Math.floor(Math.random() * 12),
        })
      }
    }
    init()

    let animId: number
    let frame = 0

    const draw = () => {
      animId = requestAnimationFrame(draw)
      frame++

      ctx.fillStyle = 'rgba(10, 15, 30, 0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`

      cols.forEach(col => {
        // Randomise a char every ~6 frames
        if (frame % 6 === 0) {
          const idx = Math.floor(Math.random() * col.chars.length)
          col.chars[idx] = CHARS[Math.floor(Math.random() * CHARS.length)]
        }

        col.chars.forEach((ch, i) => {
          const alpha = 1 - i / col.len
          if (i === 0) {
            ctx.fillStyle = `rgba(245, 245, 245, ${alpha * 0.9})`
          } else {
            ctx.fillStyle = `rgba(0, 255, 224, ${alpha * 0.25})`
          }
          ctx.fillText(ch, col.x, col.y - i * FONT_SIZE)
        })

        col.y += col.speed
        if (col.y - col.len * FONT_SIZE > canvas.height) {
          col.y     = -FONT_SIZE * 2
          col.speed = 0.8 + Math.random() * 1.4
        }
      })
    }
    draw()

    window.addEventListener('resize', () => { resize(); init() })

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
    />
  )
}
