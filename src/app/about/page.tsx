'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Github, Globe, Shield, Layers, Cpu, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

const ShaderBackground = dynamic(() => import('@/components/hero/ShaderBackground'), { ssr: false })

const STACK = [
  { name: 'Next.js 14 (App Router)',    desc: 'React framework, SSR + RSC',           icon: Globe  },
  { name: 'Three.js + @react-three/fiber', desc: 'WebGL 3D scene rendering',           icon: Layers },
  { name: 'Framer Motion',              desc: 'UI panel animations & micro-interactions', icon: Cpu  },
  { name: 'GSAP',                       desc: 'Page transitions & glitch animation',   icon: Cpu    },
  { name: 'Tailwind CSS v3',            desc: 'Utility-first dark design system',       icon: Shield },
  { name: 'TypeScript (strict)',        desc: 'Full type safety across all components', icon: Lock   },
]

const CONCEPTS = [
  'Zero Trust Architecture (NIST SP 800-207)',
  'SOC / CERT workflow and SIEM correlation',
  'MITRE ATT&CK framework — 30+ techniques',
  'Kill chain modeling (Lockheed Martin)',
  'Micro-segmentation & least-privilege access',
  'EDR, WAF, IdP and Threat Intel integration',
]

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-14 overflow-hidden">
      <ShaderBackground />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                          border border-cyan/30 bg-surface/50 font-mono text-xs text-cyan
                          tracking-widest uppercase mb-6">
            <Shield size={11} />
            Project Overview
          </div>
          <h1 className="font-sans font-bold text-4xl text-white/95 mb-4 glow-cyan">
            SecureArch 3D Explorer
          </h1>
          <p className="font-sans text-white/60 text-lg leading-relaxed">
            An interactive 3D visualization of a Zero Trust / SOC security architecture,
            built to demonstrate deep cybersecurity domain knowledge in a uniquely compelling way.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-5">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STACK.map(({ name, desc, icon: Icon }) => (
              <div
                key={name}
                className="flex items-start gap-3 p-4 rounded bg-surface/60
                           border border-white/8 hover:border-cyan/30 transition-colors"
              >
                <Icon size={15} className="text-cyan mt-0.5 shrink-0" />
                <div>
                  <div className="font-mono text-xs text-white/90 mb-0.5">{name}</div>
                  <div className="font-sans text-xs text-white/45">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Security Concepts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-5">
            Security Concepts Visualized
          </h2>
          <ul className="space-y-2">
            {CONCEPTS.map(c => (
              <li key={c} className="flex items-center gap-3 font-mono text-sm text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* How to present */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mb-12 p-5 rounded bg-surface/60 border border-cyan/20"
        >
          <h2 className="font-mono text-xs text-cyan uppercase tracking-widest mb-4">
            How to Present This — Interview Guide
          </h2>
          <ol className="space-y-3 list-none">
            {[
              'Open /explorer — walk through each node: explain its role in Zero Trust by clicking it and reading the panel aloud.',
              'Hit "Simulate Attack" — narrate the kill chain step by step as it animates. Reference each MITRE technique shown in the terminal.',
              'Discuss the HUD: explain what SIEM correlates, how SOC metrics are measured, and what the threat level indicator represents operationally.',
              'On mobile, flip to the SVG diagram to show graceful degradation and responsive design thinking.',
              'Close with the architecture.json — show that the entire topology is data-driven, making it trivially extensible for real client environments.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-cyan/60 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                <span className="font-sans text-white/65 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded border border-white/20
                       font-mono text-sm text-white/60 hover:border-cyan/50 hover:text-cyan
                       transition-all duration-200"
          >
            <Github size={15} />
            View Source
          </a>
          <Link
            href="/explorer"
            className="flex items-center gap-2 px-5 py-2.5 rounded
                       bg-cyan text-navy font-mono text-sm font-bold
                       hover:bg-cyan/90 transition-colors"
          >
            <Cpu size={15} />
            Open Explorer
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
