"use client"
import type { ThreeEvent } from '@react-three/fiber'

import React, { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber' // types added below
import * as THREE from 'three'
import { Environment, OrbitControls, ContactShadows, Html } from '@react-three/drei'
import AvatarModel from './AvatarModel'
import CoderCamera from './CoderCamera'

  function Monitor() {
  const matRef = useRef<any>(null)
  const lightRef = useRef<any>(null)
  const hoveredRef = useRef(false)

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hoveredRef.current = true
    window.dispatchEvent(new CustomEvent('monitor-hover', { detail: { hover: true } }))
  }
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hoveredRef.current = false
    window.dispatchEvent(new CustomEvent('monitor-hover', { detail: { hover: false } }))
  }

  useFrame(() => {
    if (!matRef.current) return
    // stronger base emissive for a bluish screen glow, subtle hover boost
    const baseEmissive = 1.6
    const hoverEmissive = 2.6
    const targetE = hoveredRef.current ? hoverEmissive : baseEmissive
    const curE = matRef.current.emissiveIntensity ?? baseEmissive
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(curE, targetE, 0.08)

    if (lightRef.current) {
      const baseLight = 1.8
      const hoverLight = 2.6
      const targetL = hoveredRef.current ? hoverLight : baseLight
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity ?? baseLight, targetL, 0.12)
      // slightly expand range for softer falloff
      lightRef.current.distance = THREE.MathUtils.lerp(lightRef.current.distance ?? 2.0, 2.6, 0.06)
    }
  })

  return (
    <group position={[0, 1.05, -0.6]}>
      <mesh position={[0, -0.22, 0]}> {/* stand */}
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial color="#0b0f14" />
      </mesh>

      <mesh position={[0, 0, 0.04]}> {/* monitor body */}
        <boxGeometry args={[1.4, 0.82, 0.06]} />
        <meshStandardMaterial color="#03060a" roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.08]} onPointerOver={onOver} onPointerOut={onOut}> {/* screen */}
        <planeGeometry args={[1.32, 0.74]} />
        <meshStandardMaterial ref={matRef} emissive={'#7dd3fc'} emissiveIntensity={1.6} color="#02232b" />
      </mesh>

      <pointLight ref={lightRef} position={[0, 1.05, -0.52]} color="#7dd3fc" intensity={1.8} distance={2.6} decay={2} />
    </group>
  )
}

export default function CoderEnvironment({ height = 520 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            obs.disconnect()
          }
        })
      },
      { root: null, threshold: 0.15 }
    )
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height }} className="rounded overflow-hidden">
      {isVisible ? (
        <Canvas shadows={false} dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'low-power' }} camera={{ position: [1.2, 1.65, 5.0], fov: 38 }}>
        <color attach="background" args={["#05060a"]} />

        {/* Soft ambient + cinematic feel */}
        <ambientLight intensity={0.18} />
        <hemisphereLight args={["#a8b9ff", "#071022", 0.24]} />

        {/* Cinematic rim lights (purple accents) */}
        <spotLight position={[2.2, 1.9, -0.6]} angle={0.6} penumbra={0.5} intensity={0.6} color="#8b5cf6" />
        <spotLight position={[-2.2, 1.7, -0.6]} angle={0.6} penumbra={0.5} intensity={0.52} color="#7c3aed" />
        {/* subtle rear purple rim to outline shoulder */}
        <spotLight position={[0, 1.8, 1.2]} angle={1.1} penumbra={0.6} intensity={0.45} color="#8b5cf6" />

        <Suspense fallback={<Html center>Loading scene…</Html>}>
          <CoderCamera
            initial={[1.2, 1.65, 5.0]}
            target={[0.7, 1.2, 3.2]}
            lookAt={[0.1, 0.6, -0.3]}
            duration={1.2}
            delay={0.2}
          />
          {/* Desk */}
          <mesh position={[0, 0.4, -0.3]} receiveShadow>
            <boxGeometry args={[2.0, 0.06, 1.1]} />
            <meshStandardMaterial color="#071026" roughness={0.8} />
          </mesh>

          {/* Monitor (interactive) */}
          <Monitor />

          {/* Keyboard */}
          <group position={[0, 0.42, -0.25]}> 
            <mesh position={[0, -0.02, 0]}> 
              <boxGeometry args={[0.98, 0.04, 0.28]} />
              <meshStandardMaterial color="#0f1724" roughness={0.7} />
            </mesh>

            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 12 }).map((__, c) => {
                const x = -0.46 + c * 0.082 + (r % 2) * 0.018
                const z = 0.01 + r * 0.045
                return (
                  <mesh key={`k-${r}-${c}`} position={[x, 0.02, z]}> 
                    <boxGeometry args={[0.076, 0.03, 0.036]} />
                    <meshStandardMaterial color="#e6eef6" roughness={0.6} />
                  </mesh>
                )
              })
            )}
          </group>

          {/* Chair back */}
          <mesh position={[0, 0.18, -0.45]}> 
            <boxGeometry args={[0.58, 0.5, 0.15]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>

          {/* Avatar positioned to face the monitor */}
          <group position={[0, 0.0, -0.15]}> 
            <AvatarModel headRadius={0.95} />
          </group>

          {/* monitor light is managed by Monitor component */}

          <Environment preset="studio" background={false} />
          <ContactShadows position={[0, 0.02, 0]} opacity={0.6} scale={3} blur={3} far={2} />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      ) : (
        // Lightweight placeholder to reserve layout and avoid heavy render until visible
        <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05060a' }}>
          <div style={{ color: '#94e0ff', opacity: 0.9 }}>3D scene loading…</div>
        </div>
      )}
    </div>
  )
}
