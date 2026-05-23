'use client'
import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Zap, ZapOff } from 'lucide-react'

import { useMobile }          from '@/hooks/useMobile'
import { useAttackSimulation } from '@/hooks/useAttackSimulation'
import type { ArchNode, ArchitectureData } from '@/types/architecture'

import SceneWrapper       from './SceneWrapper'
import NodeInfoPanel      from './NodeInfoPanel'
import HUDOverlay         from './HUDOverlay'
import TerminalLog        from './TerminalLog'
import KillChainProgress  from './KillChainProgress'
import MobileFallback     from './MobileFallback'

interface Props {
  data: ArchitectureData
}

export default function ExplorerPage({ data }: Props) {
  const isMobile                       = useMobile()
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null)

  const { state: atk, startAttack, stopAttack } = useAttackSimulation(
    data.nodes, data.edges, data.attackPath, data.attackLogs
  )

  const handleNodeClick = useCallback((node: ArchNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  const handleAttackToggle = () => {
    if (atk.active) {
      stopAttack()
      toast.info('Attack simulation stopped.')
    } else {
      startAttack()
      toast.warning('⚠ Attack simulation started — watch the kill chain', { duration: 4000 })

      // Step-by-step toast notifications
      data.attackPath.forEach((nodeId, i) => {
        if (i === 0) return
        const prevId = data.attackPath[i - 1]
        const isLast = i === data.attackPath.length - 1
        setTimeout(() => {
          const node = data.nodes.find(n => n.id === nodeId)
          if (isLast) {
            toast.error(`⛔ BLOCKED — Attack terminated at ${node?.label}`, { duration: 5000 })
          } else {
            toast.warning(`→ Attack reached: ${node?.label}`, { duration: 3000 })
          }
        }, i * 2500)
      })
    }
  }

  const isAttackMode = atk.active

  return (
    <div className="relative w-full h-screen pt-14 bg-navy overflow-hidden">
      {/* HUD */}
      <HUDOverlay isAttackMode={isAttackMode} />

      {/* 3D Scene or Mobile Fallback */}
      <div className="absolute inset-0 top-14" style={{ bottom: atk.active ? '10rem' : 0 }}>
        {isMobile ? (
          <MobileFallback
            data={data}
            onSelect={handleNodeClick}
            selected={selectedNode}
          />
        ) : (
          <SceneWrapper
            data={data}
            selectedNodeId={selectedNode?.id ?? null}
            onNodeClick={handleNodeClick}
            attackedNodes={atk.attackedNodes}
            attackEdgeIds={atk.attackEdgeIds}
            attackStep={atk.step}
          />
        )}
      </div>

      {/* Node Info Panel */}
      {!isMobile && (
        <div className="absolute inset-y-0 right-0 top-14 w-full max-w-sm pointer-events-none
                        flex flex-col">
          <div className="flex-1 pointer-events-auto relative overflow-hidden">
            <NodeInfoPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          </div>
        </div>
      )}

      {/* Simulate Attack button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40"
           style={{ bottom: atk.active ? '11rem' : '1rem' }}>
        <button
          onClick={handleAttackToggle}
          className={`flex items-center gap-2 px-6 py-3 rounded font-mono text-sm
                      font-bold tracking-widest uppercase transition-all duration-200
                      border shadow-lg ${
            isAttackMode
              ? 'bg-alert/20 border-alert/60 text-alert hover:bg-alert/30 shadow-alert/20'
              : 'bg-surface/80 border-cyan/40 text-cyan hover:bg-cyan/10 shadow-cyan/20'
          }`}
        >
          {isAttackMode ? <ZapOff size={15} /> : <Zap size={15} />}
          {isAttackMode ? 'Stop Simulation' : 'Simulate Attack'}
        </button>
      </div>

      {/* Terminal Log + Kill Chain — bottom drawer */}
      <AnimatePresence>
        {atk.active && (
          <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col">
            <KillChainProgress step={atk.step} />
            <TerminalLog
              logs={atk.visibleLogs}
              onClose={stopAttack}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
