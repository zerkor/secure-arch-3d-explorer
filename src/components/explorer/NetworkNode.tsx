'use client'
import { useRef, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { ArchNode } from '@/types/architecture'

interface Props {
  node:       ArchNode
  selected:   boolean
  attacked:   boolean
  defended:   boolean
  onSelect:   (n: ArchNode) => void
}

function NetworkNode({ node, selected, attacked, defended, onSelect }: Props) {
  const meshRef    = useRef<THREE.Mesh>(null)
  const glowRef    = useRef<THREE.Mesh>(null)
  const baseColor  = attacked ? '#ff4d6d' : defended ? '#00ff88' : node.color

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    // Gentle rotation
    if (node.shape === 'torus') {
      meshRef.current.rotation.x = t * 0.4
      meshRef.current.rotation.z = t * 0.2
    } else {
      meshRef.current.rotation.y = t * 0.3
    }

    // Pulse scale
    const pulse = 1 + Math.sin(t * 2.2 + node.position[0]) * 0.04
    meshRef.current.scale.setScalar(selected ? 1.3 : pulse)

    // Glow halo pulse
    if (glowRef.current) {
      const g = 1.6 + Math.sin(t * 1.8) * 0.2
      glowRef.current.scale.setScalar(g)
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        attacked ? 0.35 : selected ? 0.2 : 0.07 + Math.sin(t * 1.5) * 0.03
    }
  })

  const geo = useMemo(() => {
    switch (node.shape) {
      case 'sphere': return <sphereGeometry args={[node.size, 32, 32]} />
      case 'torus':  return <torusGeometry  args={[node.size, node.size * 0.32, 16, 48]} />
      case 'box':    return <boxGeometry    args={[node.size, node.size, node.size]} />
    }
  }, [node.shape, node.size])

  const emissiveIntensity = attacked ? 4 : selected ? 2.5 : 0.6

  return (
    <group
      position={node.position}
      onClick={(e) => { e.stopPropagation(); onSelect(node) }}
    >
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[node.size * 1.6, 16, 16]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.07}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main mesh */}
      <mesh ref={meshRef} castShadow>
        {geo}
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.2}
          metalness={0.8}
          wireframe={node.shape === 'box' && !selected && !attacked}
        />
      </mesh>

      {/* Label via Html overlay */}
      <Html
        center
        distanceFactor={7}
        occlude={false}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize:   '10px',
            color:      baseColor,
            whiteSpace: 'nowrap',
            textShadow: `0 0 8px ${baseColor}`,
            marginTop:  '28px',
            opacity:    selected ? 1 : 0.8,
          }}
        >
          {node.label}
        </div>
      </Html>
    </group>
  )
}

export default memo(NetworkNode)
