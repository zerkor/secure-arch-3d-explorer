'use client'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, X } from 'lucide-react'
import type { AttackLog } from '@/types/architecture'

interface Props {
  logs:    AttackLog[]
  onClose: () => void
}

const LEVEL_COLOR: Record<string, string> = {
  ALERT: '#ffd700',
  BLOCK: '#ff4d6d',
  INFO:  '#00ffe0',
}

export default function TerminalLog({ logs, onClose }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0,       opacity: 1 }}
      exit={  { y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="absolute bottom-0 left-0 right-0 z-30 max-h-64
                 bg-navy/97 backdrop-blur-xl border-t border-cyan/20 flex flex-col"
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2
                      bg-surface/80 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-cyan" />
          <span className="font-mono text-xs text-cyan tracking-widest">
            SOC TERMINAL — LIVE INCIDENT FEED
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/30">
            {logs.length} event{logs.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/40
                       hover:text-white/80"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Log lines */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 min-h-0">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1,  x: 0   }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 font-mono text-xs"
            >
              <span className="text-white/30 shrink-0">[{log.time}]</span>
              <span
                className="font-bold shrink-0 w-10"
                style={{ color: LEVEL_COLOR[log.level] ?? '#f5f5f5' }}
              >
                {log.level}
              </span>
              <span className="text-white/75 leading-relaxed">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor at bottom */}
        {logs.length > 0 && (
          <div className="font-mono text-xs text-cyan/40 cursor">
            &gt;_
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </motion.div>
  )
}
