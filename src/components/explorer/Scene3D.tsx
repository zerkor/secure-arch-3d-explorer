'use client'
import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import NetworkNode      from './NetworkNode'
import NetworkEdge      from './NetworkEdge'
import AttackParticles  from './AttackParticles'
import type { ArchNode, ArchEdge, ArchitectureData } from '@/types/architecture'

interface Props {
  data:           ArchitectureData
  selectedNodeId: string | null
  onNodeClick:    (n: ArchNode) => void
  attackedNodes:  string[]
  attackEdgeIds:  string[]
  attackStep:     number
}

function SceneContent({ data, selectedNodeId, onNodeClick, attackedNodes, attackEdgeIds, attackStep }: Props) {
  const nodeMap = useMemo(
    () => new Map(data.nodes.map(n => [n.id, n])),
    [data.nodes]
  )

  const defendedNodes = useMemo(() => {
    if (attackStep < 0 || attackedNodes.length === 0) return []
    return attackedNodes.slice(0, -1)
  }, [attackedNodes, attackStep])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.08} />
      <pointLight position={[0,  12, 0]}  intensity={1.2} color="#00ffe0" />
      <pointLight position={[-8, -4, -4]} intensity={0.6} color="#7b61ff" />
      <pointLight position={[8,  4,  6]}  intensity={0.4} color="#1a88ff" />

      {/* Stars background */}
      <Stars radius={80} depth={40} count={2000} factor={3} fade speed={0.4} />

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        minDistance={5}
        maxDistance={30}
        autoRotate
        autoRotateSpeed={0.25}
      />

      {/* Edges */}
      {data.edges.map(edge => {
        const from = nodeMap.get(edge.from)
        const to   = nodeMap.get(edge.to)
        if (!from || !to) return null
        return (
          <NetworkEdge
            key={edge.id}
            edge={edge}
            fromNode={from}
            toNode={to}
            isAttackPath={attackEdgeIds.includes(edge.id)}
          />
        )
      })}

      {/* Nodes */}
      {data.nodes.map(node => (
        <NetworkNode
          key={node.id}
          node={node}
          selected={selectedNodeId === node.id}
          attacked={attackedNodes.includes(node.id) && !defendedNodes.includes(node.id)}
          defended={defendedNodes.includes(node.id)}
          onSelect={onNodeClick}
        />
      ))}

      {/* Attack particles */}
      {attackStep >= 0 && (
        <AttackParticles
          attackPath={data.attackPath}
          nodes={data.nodes}
          step={attackStep}
        />
      )}
    </>
  )
}

export default function Scene3D(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 4, 18], fov: 55 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        // toneMapping is a renderer *property*, not a constructor param
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.0
      }}
      style={{ background: '#0a0f1e' }}
    >
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  )
}
