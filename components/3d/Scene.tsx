"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Starfield from './Starfield'
import FloatingParticles from './FloatingParticles'
import Panels from './Panels'
import CameraController from './CameraController'
// PerformanceMeter3D and PluginHost removed for a restrained production build
import ProjectNodes from './ProjectNodes'
import UI from '../../lib/uiConfig'
import HiddenEasterEgg from './HiddenEasterEgg'

export default function Scene(): JSX.Element {
  const group = useRef<THREE.Group | null>(null)
  const cube = useRef<THREE.Mesh | null>(null)
  const zenith = useRef<THREE.Mesh | null>(null)
  const { camera } = useThree()

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    if (group.current) group.current.rotation.y = t * UI.GROUP_ROTATION_SPEED
    if (cube.current) {
      cube.current.rotation.x += delta * UI.CUBE_ROT_X_MULT
      cube.current.rotation.y += delta * UI.CUBE_ROT_Y_MULT
    }

    if (zenith.current) {
      const pulse = 1 + Math.sin(t * 1.1) * 0.035
      zenith.current.rotation.y = t * 0.22
      zenith.current.scale.set(pulse, pulse, pulse)
    }

    // subtle camera parallax
    camera.position.x += (state.mouse.x * 1.2 - camera.position.x) * 0.04
    camera.position.y += (-state.mouse.y * 0.6 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  const [showNodes, setShowNodes] = useState(false)

  useEffect(() => {
    // Defer mounting heavy node cluster until after initial paint / idle
    let id: number | null = null
    if (typeof window !== 'undefined' && (window as any).requestIdleCallback) {
      id = (window as any).requestIdleCallback(() => setShowNodes(true), { timeout: 500 })
    } else {
      id = window.setTimeout(() => setShowNodes(true), 360)
    }
    return () => {
      if (id != null) {
        try { if ((window as any).cancelIdleCallback) (window as any).cancelIdleCallback(id) } catch {}
        try { window.clearTimeout(id as number) } catch {}
      }
    }
  }, [])

  return (
    <group ref={group}>
      <fog attach="fog" args={["#071130", 0.0025]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 8, 6]} intensity={0.8} />

      <Starfield count={650} />
      <FloatingParticles count={40} />

      <Panels />
      {showNodes && <ProjectNodes radius={4} />}
      <CameraController />

      <mesh ref={zenith} position={[0, 0, 0]}> 
        <icosahedronGeometry args={[1.9, 2]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.45} metalness={0.5} roughness={0.28} />
      </mesh>

      <mesh ref={cube} position={[0, -1.6, 0]} rotation={[Math.PI * 0.5, 0, 0]}> 
        <torusGeometry args={[3.2, 0.04, 16, 120]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.06} />
      </mesh>

      <HiddenEasterEgg />
    </group>
  )
}
