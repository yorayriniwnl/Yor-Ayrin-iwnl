"use client"
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import UI from '../../lib/uiConfig'

export default function Orb({ position = [0, 0, -2] }: { position?: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const hoveredRef = useRef(false)
  const clickPulse = useRef(0)

  useFrame((state, delta) => {
    const m = meshRef.current
    if (!m) return

    // gentle idle rotation
    m.rotation.y += delta * (UI.CUBE_ROT_Y_MULT || 0.28)

    // react to cursor position
    const targetX = state.mouse.y * 0.7
    const targetY = state.mouse.x * 1.0
    m.rotation.x += (targetX - m.rotation.x) * 0.08
    m.rotation.y += (targetY - m.rotation.y) * 0.08

    // click pulse decay
    clickPulse.current = Math.max(0, clickPulse.current - delta * 2.2)

    // scale & material react
    const base = hoveredRef.current ? 1.08 : 1.0
    const scale = base + clickPulse.current * 0.32
    m.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08)

    const mat = m.material as THREE.MeshStandardMaterial
    if (mat) mat.emissiveIntensity = hoveredRef.current ? 0.9 : 0.24
  })

  return (
    <mesh
      ref={meshRef}
      position={position as any}
      onPointerOver={(e) => {
        e.stopPropagation()
        hoveredRef.current = true
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        hoveredRef.current = false
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        clickPulse.current = 1
      }}
      castShadow
    >
      <sphereGeometry args={[0.9, 24, 16]} />
      <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" roughness={0.32} metalness={0.18} />
    </mesh>
  )
}
