'use client'

import { useRef } from 'react'
import FrameScrubber from '../FrameScrubber'

export default function MacroDetails() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="min-h-screen bg-noir-950 flex items-center justify-center py-24">
      <div className="w-full">
        <FrameScrubber
          sequence="macro"
          frameCount={90}
          trigger={sectionRef.current}
          start="top 60%"
          end="bottom 40%"
          scrub={1.2}
          className="rounded-lg overflow-hidden"
        />
        <div className="text-center mt-12 px-8 max-w-2xl mx-auto">
          <h3 className="font-display text-4xl font-light tracking-widest text-bone mb-8">
            In Every Detail
          </h3>
          <ul className="space-y-6 text-sm font-sans text-bone-dim">
            <li>Engraved dial indices in 18K gold</li>
            <li>Visible tourbillon at 6 o'clock</li>
            <li>Chronograph subdials at 3, 6, and 9</li>
            <li>Sapphire exhibition caseback</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
