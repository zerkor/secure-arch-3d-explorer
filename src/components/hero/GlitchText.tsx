'use client'
import { useEffect, useRef, useState } from 'react'

const GLITCH_CHARS = '0123456789ABCDEF@#$%!?><{}[]|/\\'

interface Props {
  text:      string
  className?: string
  delay?:    number   // ms before animation starts
}

export default function GlitchText({ text, className = '', delay = 200 }: Props) {
  // Must match server render exactly — no Math.random() at init time
  const [display, setDisplay]   = useState(text)
  const [revealed, setRevealed] = useState(false)
  const iterRef = useRef(0)

  useEffect(() => {
    iterRef.current = 0

    // Immediately scramble (client-only) so the real text isn't visible before animation
    setDisplay(
      text.split('').map(c => c === ' ' ? ' ' : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]).join('')
    )

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        iterRef.current += 0.4
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (i < iterRef.current) return char
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          }).join('')
        )
        if (iterRef.current >= text.length) {
          clearInterval(interval)
          setDisplay(text)
          setRevealed(true)
        }
      }, 28)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span
      className={`${className} ${revealed ? 'glitch' : ''}`}
      data-text={revealed ? text : undefined}
    >
      {display}
    </span>
  )
}
