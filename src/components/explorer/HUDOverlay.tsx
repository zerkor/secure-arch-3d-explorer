'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Zap } from 'lucide-react'

interface Props {
  isAttackMode: boolean
}

const THREAT_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const
type ThreatLevel = typeof THREAT_LEVELS[number]

const LEVEL_COLOR: Record<ThreatLevel, string> = {
  LOW:    '#00ff88',
  MEDIUM: '#ffd700',
  HIGH:   '#ff4d6d',
}

function useCounter(base: number, variance: number, interval: number) {
  const [val, setVal] = useState(base)
  useEffect(() => {
    const t = setInterval(() => {
      setVal(base + Math.floor(Math.random() * variance))
    }, interval)
    return () => clearInterval(t)
  }, [base, variance, interval])
  return val
}

export default function HUDOverlay({ isAttackMode }: Props) {
  const sessions  = useCounter(1247, 80, 3000)
  const blocked   = useCounter(8934, 50, 5000)
  const level: ThreatLevel = isAttackMode ? 'HIGH' : 'LOW'

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-center justify-between px-4 py-2
                      bg-navy/80 backdrop-blur-md border-b border-cyan/10">

        {/* Left: sessions */}
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-cyan" />
          <span className="font-mono text-xs text-white/50">Sessions</span>
          <motion.span
            key={sessions}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1,  y: 0  }}
            className="font-mono text-xs text-cyan font-bold"
          >
            {sessions.toLocaleString()}
          </motion.span>
        </div>

        {/* Centre: threat level */}
        <motion.div
          animate={{
            boxShadow: isAttackMode
              ? ['0 0 0px #ff4d6d', '0 0 16px #ff4d6d', '0 0 0px #ff4d6d']
              : 'none',
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex items-center gap-2 px-3 py-1 rounded border font-mono text-xs font-bold
                     uppercase tracking-widest"
          style={{
            color:       LEVEL_COLOR[level],
            borderColor: `${LEVEL_COLOR[level]}50`,
            background:  `${LEVEL_COLOR[level]}10`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: LEVEL_COLOR[level] }}
          />
          Threat: {level}
        </motion.div>

        {/* Right: threats blocked */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} className="text-green-400" />
          <span className="font-mono text-xs text-white/50">Blocked</span>
          <motion.span
            key={blocked}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1,  y: 0  }}
            className="font-mono text-xs text-green-400 font-bold"
          >
            {blocked.toLocaleString()}
          </motion.span>
        </div>
      </div>

      {/* Attack mode banner */}
      {isAttackMode && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1,  y: 0  }}
          className="flex items-center justify-center gap-2 py-1.5
                     bg-alert/20 border-b border-alert/40"
        >
          <Zap size={11} className="text-alert" />
          <span className="font-mono text-xs text-alert tracking-widest font-bold">
            ⚠ ATTACK SIMULATION ACTIVE — MONITORING KILL CHAIN
          </span>
          <Zap size={11} className="text-alert" />
        </motion.div>
      )}
    </div>
  )
}
