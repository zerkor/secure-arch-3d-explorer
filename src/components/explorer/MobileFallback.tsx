'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ArchitectureData, ArchNode } from '@/types/architecture'

interface Props {
  data:     ArchitectureData
  onSelect: (n: ArchNode) => void
  selected: ArchNode | null
}

// Simple radial layout for mobile SVG diagram
const LAYOUT: Record<string, { x: number; y: number }> = {
  internet:    { x: 160, y: 60  },
  firewall:    { x: 160, y: 140 },
  dmz:         { x: 160, y: 220 },
  idp:         { x: 60,  y: 220 },
  siem:        { x: 260, y: 220 },
  edr:         { x: 300, y: 300 },
  internal:    { x: 160, y: 320 },
  zerotrust:   { x: 60,  y: 320 },
  threatintel: { x: 60,  y: 140 },
  cloud:       { x: 300, y: 180 },
}

const STATUS_COLOR = {
  secured:    '#00ff88',
  monitoring: '#00ffe0',
  alert:      '#ff4d6d',
}

export default function MobileFallback({ data, onSelect, selected }: Props) {
  return (
    <div className="w-full h-full flex flex-col bg-navy">
      <div className="p-3 border-b border-cyan/10 font-mono text-xs text-cyan/60 tracking-widest">
        2D DIAGRAM MODE — tap node for details
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center p-4">
        <svg
          viewBox="0 0 360 400"
          className="w-full max-w-sm"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          {/* Edges */}
          {data.edges.map(edge => {
            const from = LAYOUT[edge.from]
            const to   = LAYOUT[edge.to]
            if (!from || !to) return null
            return (
              <line
                key={edge.id}
                x1={from.x} y1={from.y}
                x2={to.x}   y2={to.y}
                stroke={edge.color}
                strokeWidth={1}
                strokeOpacity={0.35}
                strokeDasharray={edge.animated ? '4 4' : undefined}
              />
            )
          })}

          {/* Nodes */}
          {data.nodes.map(node => {
            const pos    = LAYOUT[node.id]
            if (!pos) return null
            const isSelected = selected?.id === node.id
            const r = node.size * 18

            return (
              <g
                key={node.id}
                onClick={() => onSelect(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pos.x} cy={pos.y}
                  r={r + (isSelected ? 6 : 0)}
                  fill={node.color}
                  fillOpacity={0.12}
                  stroke={node.color}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 1 : 0.6}
                />
                {/* Status dot */}
                <circle
                  cx={pos.x + r - 3} cy={pos.y - r + 3}
                  r={4}
                  fill={STATUS_COLOR[node.status]}
                />
                <text
                  x={pos.x} y={pos.y + r + 12}
                  textAnchor="middle"
                  fontSize={8}
                  fill={node.color}
                  fillOpacity={0.8}
                >
                  {node.label.split('/')[0].trim().slice(0, 14)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected node mini-card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            exit={  { y: 80, opacity: 0 }}
            className="border-t border-cyan/20 bg-surface/95 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="font-sans font-bold text-sm"
                style={{ color: selected.color }}
              >
                {selected.label}
              </span>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded border"
                style={{
                  color:       STATUS_COLOR[selected.status],
                  borderColor: `${STATUS_COLOR[selected.status]}40`,
                }}
              >
                {selected.status.toUpperCase()}
              </span>
            </div>
            <p className="font-sans text-xs text-white/60 leading-relaxed line-clamp-3">
              {selected.role}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selected.mitre.map(t => (
                <span
                  key={t}
                  className="font-mono text-xs px-2 py-0.5 rounded border"
                  style={{ color: selected.color, borderColor: `${selected.color}30` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
