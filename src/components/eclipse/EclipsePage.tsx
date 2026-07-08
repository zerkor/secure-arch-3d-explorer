'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Hero from './sections/Hero'
import Story from './sections/Story'
import MacroDetails from './sections/MacroDetails'
import ExplodedSpecs from './sections/ExplodedSpecs'
import LimitedEdition from './sections/LimitedEdition'
import Waitlist from './sections/Waitlist'

gsap.registerPlugin(ScrollTrigger)

export default function EclipsePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 2,
    })

    let lastTime = Date.now()
    const raf = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time
      lenis.raf(deltaTime)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.lagSmoothing(1)
    }
  }, [])

  return (
    <div className="overflow-hidden bg-noir-950">
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-40" />
      </div>

      <div className="relative z-10">
        <Hero />
        <Story />
        <MacroDetails />
        <ExplodedSpecs />
        <LimitedEdition />
        <Waitlist />
      </div>
    </div>
  )
}
