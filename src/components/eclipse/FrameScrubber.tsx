'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FrameScrubberProps {
  sequence: 'orbit' | 'macro' | 'exploded'
  frameCount: number
  framePad?: number
  className?: string
  trigger?: HTMLElement | null
  start?: string
  end?: string
  scrub?: number | boolean
}

export default function FrameScrubber({
  sequence,
  frameCount,
  framePad = 4,
  className = '',
  trigger,
  start = 'top center',
  end = 'bottom center',
  scrub = true,
}: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)

  // Load all frames for the sequence
  useEffect(() => {
    const loadFrames = async () => {
      const frames: HTMLImageElement[] = []
      for (let i = 0; i < frameCount; i++) {
        const pad = String(i).padStart(framePad, '0')
        const img = new Image()
        img.src = `/frames/${sequence}/${pad}.webp`
        img.onload = () => frames.push(img)
        img.onerror = () => console.warn(`Failed to load frame ${pad}`)
      }
      // Wait for all to load
      await new Promise((r) =>
        setTimeout(() => r(null), frameCount * 5 + 500)
      )
      framesRef.current = frames
    }
    loadFrames()
  }, [sequence, frameCount, framePad])

  // Set up canvas and draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    ctxRef.current = ctx

    // Responsive sizing
    const w = window.innerWidth
    const h = Math.round((w * 9) / 16)
    canvas.width = w
    canvas.height = h

    const handleResize = () => {
      const w2 = window.innerWidth
      const h2 = Math.round((w2 * 9) / 16)
      canvas.width = w2
      canvas.height = h2
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Draw current frame
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx || framesRef.current.length === 0) return

    const img = framesRef.current[currentFrameRef.current]
    if (img && img.complete) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }, [])

  // GSAP ScrollTrigger animation
  useEffect(() => {
    if (!trigger) return
    if (framesRef.current.length === 0) return

    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return

    gsap.registerPlugin(require('gsap/ScrollTrigger').default)
    const ScrollTrigger = require('gsap/ScrollTrigger').default

    const t = gsap.to(
      { frame: 0 },
      {
        frame: frameCount - 1,
        duration: 1,
        snap: 'frame',
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub,
          markers: false,
        },
        onUpdate() {
          const f = Math.round(this.targets()[0].frame)
          currentFrameRef.current = f
          if (framesRef.current[f]?.complete) {
            ctx.drawImage(framesRef.current[f], 0, 0, canvas.width, canvas.height)
          }
        },
      }
    )

    return () => {
      t.kill()
      ScrollTrigger.getAll().forEach((st: any) => {
        if (st.vars.trigger === trigger) st.kill()
      })
    }
  }, [trigger, frameCount, start, end, scrub])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full bg-noir-950 ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    />
  )
}
