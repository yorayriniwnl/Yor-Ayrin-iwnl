"use client"

import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import UI from '../../lib/uiConfig'

export default function HiddenEasterEgg(): JSX.Element | null {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!meshRef.current) return
    // gentle bob + slow rotation
    meshRef.current.rotation.y = t * 0.6
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.08
    const baseScale = unlocked ? 1.2 : hovered ? 1.05 : 0.85
    const pulse = 1 + Math.sin(t * 2.2) * 0.02
    meshRef.current.scale.set(baseScale * pulse, baseScale * pulse, baseScale * pulse)
  })

  if (unlocked) return null

  return (
    <mesh
      ref={meshRef}
      position={[-2.4, 0.6, 1.6]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); (document.body as any).style.cursor = 'pointer' }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); (document.body as any).style.cursor = 'auto' }}
      onClick={(e) => {
        e.stopPropagation()
        setUnlocked(true)
        try { window.dispatchEvent(new CustomEvent('easter-egg-unlocked', { detail: { source: '3d-hidden-object' } })) } catch {}
      }}
      castShadow
    >
      <octahedronGeometry args={[0.09, 0]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={UI.EGG_EMISSIVE_INTENSITY} metalness={0.12} roughness={0.42} transparent opacity={0.98} />
    </mesh>
  )
}
