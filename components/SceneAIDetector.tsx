'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ParticleState {
  x: number
  y: number
  z: number
  speed: number
  colorIdx: 0 | 1
}

// ─────────────────────────────────────────────────────────────────────────────
// Central cube with wireframe overlay
// ─────────────────────────────────────────────────────────────────────────────

function CoreCube(): JSX.Element {
  const meshRef  = useRef<THREE.Mesh>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const edgesGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
    [],
  )

  useFrame(() => {
    if (meshRef.current)  meshRef.current.rotation.y  += 0.003
    if (linesRef.current) linesRef.current.rotation.y += 0.003
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={1}
          roughness={0}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Wireframe clone */}
      <lineSegments ref={linesRef} geometry={edgesGeo}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </lineSegments>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Data stream — 60 falling spheres
// ─────────────────────────────────────────────────────────────────────────────

const DATA_COUNT = 60
const COLOR_A    = new THREE.Color('#6366f1')
const COLOR_B    = new THREE.Color('#06b6d4')

function DataStream(): JSX.Element {
  const pointsRef = useRef<THREE.Points>(null!)

  // Mutable particle state lives outside React state to avoid re-renders
  const particles = useMemo<ParticleState[]>(() => {
    return Array.from({ length: DATA_COUNT }, (_, i) => ({
      x:        (Math.random() - 0.5) * 6,   // −3 to +3
      y:        (Math.random() - 0.5) * 8,   // spread from the start
      z:        (Math.random() - 0.5) * 2,   // −1 to +1
      speed:    0.02 + Math.random() * 0.03, // 0.02–0.05
      colorIdx: (i % 2 === 0 ? 0 : 1) as 0 | 1,
    }))
  }, [])

  // Float32Arrays updated each frame in place
  const positions = useMemo(() => new Float32Array(DATA_COUNT * 3), [])
  const colors    = useMemo(() => new Float32Array(DATA_COUNT * 3), [])

  // Geometry created once; attributes mutated each frame
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color',    new THREE.BufferAttribute(colors,    3))
    return g
  }, [positions, colors])

  useFrame(() => {
    for (let i = 0; i < DATA_COUNT; i++) {
      const p = particles[i]

      // Advance fall
      p.y -= p.speed
      if (p.y < -4) {
        // Reset to top with a new random X / Z
        p.y = 4
        p.x = (Math.random() - 0.5) * 6
        p.z = (Math.random() - 0.5) * 2
      }

      positions[i * 3]     = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z

      const c = p.colorIdx === 0 ? COLOR_A : COLOR_B
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    // Mark attributes dirty so Three.js re-uploads to GPU
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const colAttr = geo.getAttribute('color')    as THREE.BufferAttribute
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Subtle grid floor for depth
// ─────────────────────────────────────────────────────────────────────────────

function GridHelper(): JSX.Element {
  const geo = useMemo(() => {
    const helper = new THREE.GridHelper(10, 20, '#6366f1', '#1e1b4b')
    const g      = helper.geometry.clone()
    helper.geometry.dispose()
    return g
  }, [])

  return (
    <lineSegments geometry={geo} position={[0, -2.5, 0]}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
    </lineSegments>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Ambient connection arcs — thin arcs drawn as LineLoops around the cube
// ─────────────────────────────────────────────────────────────────────────────

function NeuronRings(): JSX.Element {
  const ring1Ref = useRef<THREE.LineLoop>(null!)
  const ring2Ref = useRef<THREE.LineLoop>(null!)
  const ring3Ref = useRef<THREE.LineLoop>(null!)

  const makeRingGeo = (radius: number, segments = 64) => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }

  const geo1 = useMemo(() => makeRingGeo(1.8), [])
  const geo2 = useMemo(() => makeRingGeo(2.4), [])
  const geo3 = useMemo(() => makeRingGeo(3.0), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ring1Ref.current) ring1Ref.current.rotation.y = t * 0.18
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.11
      ring2Ref.current.rotation.x = Math.sin(t * 0.2) * 0.4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.09
      ring3Ref.current.rotation.x = Math.cos(t * 0.15) * 0.35
    }
  })

  return (
    <group>
      <lineLoop ref={ring1Ref} geometry={geo1}>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.18} />
      </lineLoop>
      <lineLoop ref={ring2Ref} geometry={geo2}>
        <lineBasicMaterial color="#06b6d4" transparent opacity={0.13} />
      </lineLoop>
      <lineLoop ref={ring3Ref} geometry={geo3}>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.1} />
      </lineLoop>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Composed scene graph
// ─────────────────────────────────────────────────────────────────────────────

function AIDetectorScene(): JSX.Element {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 6, 2]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-4, -2, -4]} intensity={0.25} color="#6366f1" />

      <CoreCube />
      <DataStream />
      <NeuronRings />
      <GridHelper />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported canvas
// ─────────────────────────────────────────────────────────────────────────────

export default function SceneAIDetector(): JSX.Element {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 100 }}
      dpr={[1, 2]}
    >
      <AIDetectorScene />
    </Canvas>
  )
}
