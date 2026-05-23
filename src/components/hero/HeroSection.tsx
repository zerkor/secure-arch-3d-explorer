'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Lock, Shield, Zap } from 'lucide-react'
// ssr: false on all client-only components to prevent hydration mismatches
const GlitchText       = dynamic(() => import('./GlitchText'),       { ssr: false })
const ShaderBackground = dynamic(() => import('./ShaderBackground'), { ssr: false })
const FallingSymbols   = dynamic(() => import('./FallingSymbols'),   { ssr: false })

const STATS = [
  { label: 'Nodes in Architecture', value: '10', icon: Shield },
  { label: 'MITRE ATT&CK Techniques', value: '30+', icon: Zap  },
  { label: 'Zero Trust Layers',        value: '5',   icon: Lock },
]

export default function HeroSection() {
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.8, ease: 'power2.out' }
      )
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, delay: 2.2, ease: 'power3.out' }
      )
      gsap.fromTo(
        '.stat-card',
        { opacity: 0, y: 30, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, delay: 2.6, ease: 'back.out(1.5)' }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center
                        overflow-hidden pt-14 px-6">
      {/* Backgrounds */}
      <ShaderBackground />
      <FallingSymbols />

      {/* Radial centre glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full
                        bg-cyan/5 blur-[120px] animate-pulse-slow" />
      </div>

      {/* Badge */}
      <div className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full
                      border border-cyan/30 bg-surface/60 backdrop-blur-sm
                      font-mono text-xs text-cyan tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot" />
        Zero Trust Architecture Visualizer
      </div>

      {/* Title */}
      <h1 className="text-center font-sans font-bold leading-tight mb-6
                     text-4xl sm:text-6xl lg:text-7xl">
        <GlitchText
          text="SecureArch"
          className="block glow-cyan text-cyan"
          delay={300}
        />
        <GlitchText
          text="3D Explorer"
          className="block text-white/90"
          delay={800}
        />
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="opacity-0 max-w-xl text-center text-white/60 text-base sm:text-lg
                   font-sans leading-relaxed mb-10"
      >
        Explore a fully interactive Zero Trust / SOC security architecture in
        real-time 3D. Click nodes, simulate attacks, and trace every kill-chain step.
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="opacity-0 flex flex-col sm:flex-row items-center gap-4 mb-20">
        <Link
          href="/explorer"
          className="group flex items-center gap-3 px-8 py-3.5 rounded
                     bg-cyan text-navy font-sans font-semibold text-sm tracking-wider
                     hover:bg-cyan/90 transition-all duration-200
                     border-glow-cyan shadow-lg shadow-cyan/20"
        >
          Enter the Architecture
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/about"
          className="px-8 py-3.5 rounded border border-white/20 text-white/70
                     font-sans text-sm tracking-wider hover:border-white/40
                     hover:text-white/90 transition-all duration-200 backdrop-blur-sm"
        >
          Learn More
        </Link>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {STATS.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="stat-card opacity-0 flex flex-col items-center gap-2 p-4 rounded
                       bg-surface/60 backdrop-blur-sm border border-white/10
                       hover:border-cyan/30 transition-colors"
          >
            <Icon size={18} className="text-cyan" />
            <span className="font-mono text-2xl font-bold text-cyan">{value}</span>
            <span className="font-mono text-xs text-white/50 text-center tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2
                      flex flex-col items-center gap-1 animate-bounce">
        <span className="font-mono text-xs text-white/30 tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  )
}
