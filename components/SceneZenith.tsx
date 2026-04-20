'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Sun
// ─────────────────────────────────────────────────────────────────────────────

function Sun(): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // gentle pulse on emissive intensity
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.6 + Math.sin(t * 1.4) * 0.12
    }
  })

  return (
    <group>
      {/* Point light emanating from the sun */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={10}
        color="#f97316"
        decay={2}
      />
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.6}
          roughness={0.55}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Solar panel — orbits at `orbitRadius` with `speed` rad/s, offset by `phase`
// ─────────────────────────────────────────────────────────────────────────────

interface SolarPanelProps {
  orbitRadius: number
  speed: number
  phase: number
  tilt: number
}

function SolarPanel({
  orbitRadius,
  speed,
  phase,
  tilt,
}: SolarPanelProps): JSX.Element {
  const groupRef = useRef<THREE.Group>(null!)
  const meshRef  = useRef<THREE.Mesh>(null!)
  const SUN_POS  = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame(({ clock }) => {
    const t     = clock.getElapsedTime()
    const angle = t * speed + phase

    const x = Math.cos(angle) * orbitRadius
    const y = Math.sin(angle * 0.35) * 0.6 // gentle vertical oscillation
    const z = Math.sin(angle) * orbitRadius

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z)
      // Face the sun
      groupRef.current.lookAt(SUN_POS)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.04]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>
      {/* Panel frame lines */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(0.8, 0.5, 0.04)]}
        />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </lineSegments>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Equatorial particle ring — 200 points
// ─────────────────────────────────────────────────────────────────────────────

function ParticleRing(): JSX.Element {
  const COUNT = 200

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const col = new Float32Array(COUNT * 3)

    const colorA = new THREE.Color('#f97316') // orange
    const colorB = new THREE.Color('#06b6d4') // cyan

    for (let i = 0; i < COUNT; i++) {
      const angle  = (i / COUNT) * Math.PI * 2
      const spread = 0.18
      const radius = 5.2 + (Math.random() - 0.5) * spread

      pos[i * 3]     = Math.cos(angle) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.35
      pos[i * 3 + 2] = Math.sin(angle) * radius

      const c = i % 2 === 0 ? colorA : colorB
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  const pointsRef = useRef<THREE.Points>(null!)

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.07
    }
  })

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(colors,    3))
    return g
  }, [positions, colors])

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Composed scene graph
// ─────────────────────────────────────────────────────────────────────────────

function ZenithScene(): JSX.Element {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 6, 6]} intensity={0.4} color="#fff8f0" />

      <Sun />

      <SolarPanel orbitRadius={2.5} speed={0.38} phase={0}               tilt={0.2} />
      <SolarPanel orbitRadius={3.2} speed={0.24} phase={Math.PI * 2 / 3} tilt={0.5} />
      <SolarPanel orbitRadius={4.0} speed={0.16} phase={Math.PI * 4 / 3} tilt={-0.3} />

      <ParticleRing />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.75}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported canvas
// ─────────────────────────────────────────────────────────────────────────────

export default function SceneZenith(): JSX.Element {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [0, 3, 8], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      shadows
    >
      <ZenithScene />
    </Canvas>
  )
}
