'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FrameScrubberProps {
  sequence: 'orbit' | 'macro' | 'exploded'
  frameCount: number
  framePad?: number
  className?: string
  triggerId?: string
  start?: string
  end?: string
  scrub?: number | boolean
}

export default function FrameScrubber({
  sequence,
  frameCount,
  framePad = 4,
  className = '',
  triggerId,
  start = 'top 60%',
  end = 'bottom 40%',
  scrub = 1.2,
}: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [isReady, setIsReady] = useState(false)

  // Load all frames upfront
  useEffect(() => {
    const loadAllFrames = async () => {
      const frames: HTMLImageElement[] = []
      const promises = []

      for (let i = 0; i < frameCount; i++) {
        const pad = String(i).padStart(framePad, '0')
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.src = `/frames/${sequence}/${pad}.webp`
          img.onload = () => {
            frames[i] = img
            resolve(img)
          }
          img.onerror = () => {
            console.warn(`Failed: ${sequence}/${pad}.webp`)
            reject(new Error(`Frame ${pad}`))
          }
        })
        promises.push(promise)
      }

      try {
        await Promise.all(promises)
        framesRef.current = frames

        // Draw first frame immediately
        if (canvasRef.current && frames[0]) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d', { alpha: false })
          if (ctx && frames[0].complete) {
            ctx.drawImage(frames[0], 0, 0, canvas.width, canvas.height)
          }
        }

        setIsReady(true)
      } catch (e) {
        console.error('Frame load error:', e)
      }
    }

    loadAllFrames()
  }, [sequence, frameCount, framePad])

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // Set initial size
    const w = window.innerWidth
    const h = Math.round((w * 9) / 16)
    canvas.width = w
    canvas.height = h

    const handleResize = () => {
      const w2 = window.innerWidth
      const h2 = Math.round((w2 * 9) / 16)
      canvas.width = w2
      canvas.height = h2

      // Redraw on resize
      if (framesRef.current.length > 0) {
        ctx.drawImage(framesRef.current[0], 0, 0, canvas.width, canvas.height)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // GSAP scroll animation
  useEffect(() => {
    if (!isReady || !triggerId || framesRef.current.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !ctx) return

    // Find trigger element by ID
    const trigger = document.getElementById(triggerId)
    if (!trigger) {
      console.warn(`Trigger element not found: ${triggerId}`)
      return
    }

    let currentFrame = 0

    const tween = gsap.to(
      { frame: 0 },
      {
        frame: frameCount - 1,
        duration: 1,
        snap: 'frame',
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: typeof scrub === 'number' ? scrub : 1,
          markers: false,
        },
        onUpdate() {
          const f = Math.round(this.targets()[0].frame)
          if (f !== currentFrame && framesRef.current[f]) {
            currentFrame = f
            const img = framesRef.current[f]
            if (img.complete) {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
          }
        },
      }
    )

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === trigger) t.kill()
      })
    }
  }, [isReady, triggerId, frameCount, start, end, scrub])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full bg-noir-950 ${className}`}
      style={{ aspectRatio: '16 / 9' }}
    />
  )
}
