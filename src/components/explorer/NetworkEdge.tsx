'use client'
import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ArchEdge, ArchNode } from '@/types/architecture'

interface Props {
  edge:         ArchEdge
  fromNode:     ArchNode
  toNode:       ArchNode
  isAttackPath: boolean
}

function NetworkEdge({ edge, fromNode, toNode, isAttackPath }: Props) {
  const dotRef     = useRef<THREE.Mesh>(null)
  const progressRef = useRef(Math.random())
  const color = isAttackPath ? '#ff4d6d' : edge.color
  const opacity = isAttackPath ? 0.9 : 0.35

  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...fromNode.position),
      new THREE.Vector3(...toNode.position),
    ])
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    return new THREE.Line(geo, mat)
  }, [fromNode.position, toNode.position, color, opacity])

  useFrame((_, delta) => {
    if (!dotRef.current || !edge.animated) return
    progressRef.current = (progressRef.current + delta * (isAttackPath ? 0.9 : 0.35)) % 1
    const t = progressRef.current
    const from = new THREE.Vector3(...fromNode.position)
    const to   = new THREE.Vector3(...toNode.position)
    dotRef.current.position.lerpVectors(from, to, t)
  })

  return (
    <group>
      <primitive object={lineObj} />
      {edge.animated && (
        <mesh ref={dotRef}>
          <sphereGeometry args={[isAttackPath ? 0.1 : 0.055, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isAttackPath ? 4 : 2}
          />
        </mesh>
      )}
    </group>
  )
}

export default memo(NetworkEdge)
