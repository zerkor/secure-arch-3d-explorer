'use client'
import { motion } from 'framer-motion'

interface Props {
  step: number
}

const PHASES = [
  { label: 'Recon',      color: '#ff9900' },
  { label: 'Weaponize',  color: '#ff6600' },
  { label: 'Deliver',    color: '#ff4d6d' },
  { label: 'Exploit',    color: '#cc0033' },
  { label: '⛔ BLOCKED', color: '#00ff88', isBlocked: true },
]

export default function KillChainProgress({ step }: Props) {
  // step -1 = idle, 0-3 = stages, 4 = blocked
  const activeIdx = step < 0 ? -1 : Math.min(step, PHASES.length - 1)

  return (
    <div className="px-4 py-3 border-t border-white/10 bg-surface/50">
      <div className="flex items-center gap-1">
        <span className="font-mono text-xs text-white/40 mr-3 shrink-0 tracking-widest uppercase">
          Kill Chain:
        </span>
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {PHASES.map((phase, i) => {
            const isActive  = i === activeIdx
            const isPast    = i < activeIdx
            const isFuture  = i > activeIdx

            return (
              <div key={phase.label} className="flex items-center gap-1 shrink-0">
                <motion.div
                  animate={isActive ? {
                    boxShadow: [`0 0 0px ${phase.color}`, `0 0 12px ${phase.color}`, `0 0 0px ${phase.color}`],
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="px-3 py-1 rounded font-mono text-xs font-bold tracking-wider
                             border transition-all duration-300"
                  style={{
                    color:       isFuture ? '#ffffff30' : phase.color,
                    borderColor: isFuture ? '#ffffff10' : `${phase.color}50`,
                    background:  isActive
                      ? `${phase.color}20`
                      : isPast
                        ? `${phase.color}08`
                        : 'transparent',
                    opacity: isFuture ? 0.35 : 1,
                  }}
                >
                  {phase.label}
                </motion.div>
                {i < PHASES.length - 1 && (
                  <span
                    className="text-white/20 font-mono text-xs transition-colors duration-300"
                    style={{ color: isPast ? phase.color : undefined, opacity: isPast ? 0.5 : 0.2 }}
                  >
                    →
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
