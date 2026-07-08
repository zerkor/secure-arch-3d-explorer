'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import FrameScrubber from '../FrameScrubber'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!titleRef.current) return
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.4,
        ease: 'power2.out',
      }
    )
  }, [])

  return (
    <section ref={heroRef} className="relative w-full">
      <div className="h-screen flex flex-col items-center justify-center">
        <FrameScrubber
          sequence="orbit"
          frameCount={120}
          trigger={heroRef.current}
          start="top center"
          end="center center"
          scrub={1}
          className="absolute inset-0 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-noir-950" />
        <div ref={titleRef} className="relative z-20 text-center px-4">
          <div className="kicker mb-6 tracking-widest3">Since 1847</div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-light tracking-widest2 text-bone mb-4">
            AURUM & NOIR
          </h1>
          <div className="rule-gold w-24 mx-auto my-6" />
          <p className="font-sans text-sm tracking-widest2 text-bone-dim uppercase">
            The Eclipse
          </p>
          <p className="font-sans text-xs tracking-widest3 text-bone-faint mt-8 max-w-lg mx-auto leading-relaxed">
            A chronograph in brushed titanium and gold.<br />
            Seventy-two hours of mechanical memory.<br />
            One hundred eighty-eight editions.
          </p>
        </div>
      </div>
    </section>
  )
}
