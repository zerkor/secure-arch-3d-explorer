'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import type { ArchNode, ArchEdge, AttackLog } from '@/types/architecture'

export interface AttackState {
  active:         boolean
  step:           number          // -1 = idle, 0..n = current path index
  attackedNodes:  string[]
  attackEdgeIds:  string[]
  visibleLogs:    AttackLog[]
  complete:       boolean
}

const INITIAL: AttackState = {
  active:        false,
  step:          -1,
  attackedNodes: [],
  attackEdgeIds: [],
  visibleLogs:   [],
  complete:      false,
}

export function useAttackSimulation(
  nodes:      ArchNode[],
  edges:      ArchEdge[],
  attackPath: string[],
  attackLogs: AttackLog[],
) {
  const [state, setState] = useState<AttackState>(INITIAL)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    logTimers.current.forEach(clearTimeout)
    logTimers.current = []
  }

  const getEdgeId = (fromId: string, toId: string) =>
    edges.find(e => e.from === fromId && e.to === toId)?.id ?? ''

  const startAttack = useCallback(() => {
    clearAll()
    setState({ ...INITIAL, active: true, step: 0, attackedNodes: [attackPath[0]] })

    // Stream logs with staggered delay
    attackLogs.forEach((log, i) => {
      const t = setTimeout(() => {
        setState(prev => ({
          ...prev,
          visibleLogs: [...prev.visibleLogs, log],
        }))
      }, i * 2000 + 500)
      logTimers.current.push(t)
    })

    // Advance attack step every 2.5s
    attackPath.forEach((_, stepIdx) => {
      if (stepIdx === 0) return
      const t = setTimeout(() => {
        setState(prev => ({
          ...prev,
          step:          stepIdx,
          attackedNodes: attackPath.slice(0, stepIdx + 1),
          attackEdgeIds: attackPath
            .slice(0, stepIdx)
            .map((id, i) => getEdgeId(id, attackPath[i + 1]))
            .filter(Boolean),
          complete: stepIdx === attackPath.length - 1,
        }))
      }, stepIdx * 2500)
      logTimers.current.push(t)
    })
  }, [attackPath, attackLogs, edges])

  const stopAttack = useCallback(() => {
    clearAll()
    setState(INITIAL)
  }, [])

  useEffect(() => () => clearAll(), [])

  return { state, startAttack, stopAttack }
}
