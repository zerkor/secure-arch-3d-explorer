'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Shield, Eye, AlertTriangle, ExternalLink } from 'lucide-react'
import type { ArchNode } from '@/types/architecture'

interface Props {
  node:    ArchNode | null
  onClose: () => void
}

const STATUS_CFG = {
  secured:    { color: '#00ff88', icon: Shield,        label: 'SECURED'    },
  monitoring: { color: '#00ffe0', icon: Eye,           label: 'MONITORING' },
  alert:      { color: '#ff4d6d', icon: AlertTriangle, label: 'ALERT'      },
} as const

const MITRE_URL = 'https://attack.mitre.org/techniques/'

export default function NodeInfoPanel({ node, onClose }: Props) {
  const cfg = node ? STATUS_CFG[node.status] : null

  return (
    <AnimatePresence>
      {node && cfg && (
        <motion.aside
          key={node.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0,       opacity: 1 }}
          exit={  { x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 h-full w-full max-w-sm z-30
                     bg-surface/95 backdrop-blur-xl border-l border-white/10
                     flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: `${node.color}30` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full pulse-dot"
                style={{ background: node.color, boxShadow: `0 0 8px ${node.color}` }}
              />
              <h2 className="font-sans font-bold text-sm tracking-wide text-white/90">
                {node.label}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/40
                         hover:text-white/80"
            >
              <X size={16} />
            </button>
          </div>

          {/* Status badge */}
          <div className="px-5 pt-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono
                         font-bold tracking-widest uppercase border"
              style={{
                color:       cfg.color,
                borderColor: `${cfg.color}40`,
                background:  `${cfg.color}12`,
              }}
            >
              <cfg.icon size={11} />
              {cfg.label}
            </span>
          </div>

          {/* Type chip */}
          <div className="px-5 pt-3">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
              Type: <span className="text-white/60">{node.type}</span>
            </span>
          </div>

          {/* Role description */}
          <div className="px-5 pt-5">
            <h3 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
              Role in Architecture
            </h3>
            <p className="text-white/75 text-sm font-sans leading-relaxed">
              {node.role}
            </p>
          </div>

          {/* MITRE ATT&CK */}
          <div className="px-5 pt-5">
            <h3 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3">
              MITRE ATT&CK — Techniques Defended
            </h3>
            <div className="flex flex-wrap gap-2">
              {node.mitre.map(tech => (
                <a
                  key={tech}
                  href={`${MITRE_URL}${tech.replace('.', '/')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded
                             font-mono text-xs border transition-all hover:border-cyan/60
                             hover:text-cyan"
                  style={{
                    borderColor: `${node.color}30`,
                    color:       node.color,
                    background:  `${node.color}08`,
                  }}
                >
                  {tech}
                  <ExternalLink size={9} className="opacity-50" />
                </a>
              ))}
            </div>
          </div>

          {/* Position coords */}
          <div className="px-5 pt-5 mt-auto pb-5">
            <div className="p-3 rounded bg-navy/60 border border-white/5">
              <span className="font-mono text-xs text-white/30">
                position: [{node.position.map(v => v.toFixed(1)).join(', ')}]
              </span>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
