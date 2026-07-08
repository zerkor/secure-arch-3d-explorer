'use client'

import { useRef } from 'react'
import FrameScrubber from '../FrameScrubber'

export default function ExplodedSpecs() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const specs = [
    { label: 'Case material', value: 'Grade 5 Titanium' },
    { label: 'Diameter', value: '42 mm' },
    { label: 'Water resistance', value: '100 m' },
    { label: 'Movement', value: 'In-house tourbillon' },
    { label: 'Power reserve', value: '72 hours' },
    { label: 'Components', value: '217 hand-finished' },
  ]

  return (
    <section ref={sectionRef} className="min-h-screen bg-noir-900 py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="font-display text-5xl font-light tracking-widest2 text-bone text-center mb-20">
          Engineered
        </h3>

        <div className="mb-20">
          <FrameScrubber
            sequence="exploded"
            frameCount={110}
            trigger={sectionRef.current}
            start="top 40%"
            end="center"
            scrub={1.2}
            className="rounded-lg overflow-hidden"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {specs.map((spec, i) => (
            <div key={i} className="border-b border-bone-faint pb-4">
              <p className="font-sans text-xs uppercase tracking-widest3 text-bone-faint mb-2">
                {spec.label}
              </p>
              <p className="font-display text-2xl text-bone">{spec.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
