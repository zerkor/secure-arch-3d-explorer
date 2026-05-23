'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ArchNode } from '@/types/architecture'

interface Props {
  attackPath: string[]
  nodes:      ArchNode[]
  step:       number
}

interface Particle {
  progress: number
  speed:    number
  segIdx:   number
}

export default function AttackParticles({ attackPath, nodes, step }: Props) {
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: 30 }, (_, i) => ({
      progress: (i / 30),
      speed:    0.3 + Math.random() * 0.4,
      segIdx:   0,
    }))
  )
  const meshesRef = useRef<(THREE.Mesh | null)[]>([])

  const segments = useMemo(() => {
    const active = attackPath.slice(0, Math.max(step + 2, 0))
    return active.slice(0, -1).map((id, i) => {
      const from = nodes.find(n => n.id === id)
      const to   = nodes.find(n => n.id === active[i + 1])
      if (!from || !to) return null
      return {
        from: new THREE.Vector3(...from.position),
        to:   new THREE.Vector3(...to.position),
      }
    }).filter(Boolean) as { from: THREE.Vector3; to: THREE.Vector3 }[]
  }, [attackPath, nodes, step])

  useFrame((_, delta) => {
    if (segments.length === 0) return
    particlesRef.current.forEach((p, i) => {
      const mesh = meshesRef.current[i]
      if (!mesh) return

      p.progress += delta * p.speed
      if (p.progress >= 1) {
        p.progress = 0
        p.segIdx   = (p.segIdx + 1) % segments.length
      }

      const seg = segments[p.segIdx]
      if (!seg) return
      mesh.position.lerpVectors(seg.from, seg.to, p.progress)
    })
  })

  if (step < 0 || segments.length === 0) return null

  return (
    <group>
      {particlesRef.current.map((_, i) => (
        <mesh
          key={i}
          ref={el => { meshesRef.current[i] = el }}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial
            color="#ff4d6d"
            emissive="#ff4d6d"
            emissiveIntensity={3}
          />
        </mesh>
      ))}
    </group>
  )
}
