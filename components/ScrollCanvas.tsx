"use client"

import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  Component,
  type ReactNode,
  type ErrorInfo,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import type { SceneSection } from './scroll-canvas.types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrollCanvasProps {
  activeSection: SceneSection
}

// ─── Camera targets per section ───────────────────────────────────────────────

const CAMERA_TARGETS: Record<SceneSection, THREE.Vector3> = {
  hero:     new THREE.Vector3( 0, 0, 8),
  projects: new THREE.Vector3( 2, 1, 7),
  skills:   new THREE.Vector3( 0, 2, 9),
  contact:  new THREE.Vector3(-1, 0, 7),
}

// ─── Camera controller ────────────────────────────────────────────────────────

function CameraController({ activeSection }: { activeSection: SceneSection }) {
  const { camera } = useThree()
  const target = CAMERA_TARGETS[activeSection]

  useFrame(() => {
    camera.position.lerp(target, 0.02)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Scene: Hero — 800-particle cloud ────────────────────────────────────────

interface ParticleState {
  positions: Float32Array
  velocities: Float32Array
}

function HeroScene({ opacity }: { opacity: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef    = useRef<THREE.PointsMaterial>(null)

  const state = useMemo<ParticleState>(() => {
    const count = 800
    const positions  = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.004
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }
    return { positions, velocities }
  }, [])

  useFrame(() => {
    const { positions, velocities } = state
    const count = 800
    for (let i = 0; i < count; i++) {
      const x = i * 3 + 0
      const y = i * 3 + 1
      const z = i * 3 + 2
      positions[x] += velocities[x]
      positions[y] += velocities[y]
      positions[z] += velocities[z]
      if (positions[x] >  5) positions[x] = -5
      if (positions[x] < -5) positions[x] =  5
      if (positions[y] >  3) positions[y] = -3
      if (positions[y] < -3) positions[y] =  3
      if (positions[z] >  3) positions[z] = -3
      if (positions[z] < -3) positions[z] =  3
    }

    const pts = pointsRef.current
    if (pts) {
      const attr = pts.geometry.attributes.position as THREE.BufferAttribute
      attr.needsUpdate = true
    }

    if (matRef.current) {
      matRef.current.opacity = opacity.current
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[state.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#6366f1"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={opacity.current}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Scene: Projects — 6 wireframe boxes in 2 rows ───────────────────────────

const BOX_POSITIONS: [number, number, number][] = [
  [-2.5, 0.8, 0], [0, 0.8, 0], [2.5, 0.8, 0],
  [-2.5,-0.8, 0], [0,-0.8, 0], [2.5,-0.8, 0],
]

const BOX_SPEEDS: [number, number][] = [
  [0.6, 0.4], [0.3, 0.7], [0.8, 0.2],
  [0.4, 0.9], [0.7, 0.5], [0.2, 0.6],
]

interface RotatingBoxProps {
  position: [number, number, number]
  speedX: number
  speedY: number
  opacity: React.MutableRefObject<number>
  floatSpeed: number
  floatOffset: number
}

function RotatingBox({ position, speedX, speedY, opacity, floatSpeed, floatOffset }: RotatingBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * speedX
      meshRef.current.rotation.y = t * speedY
    }
    if (matRef.current) {
      matRef.current.opacity = opacity.current
    }
  })

  return (
    <Float speed={floatSpeed} floatIntensity={0.4} rotationIntensity={0}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial
          ref={matRef}
          color="#06b6d4"
          wireframe
          transparent
          opacity={opacity.current}
        />
      </mesh>
    </Float>
  )
}

function ProjectsScene({ opacity }: { opacity: React.MutableRefObject<number> }) {
  return (
    <>
      {BOX_POSITIONS.map((pos, i) => (
        <RotatingBox
          key={i}
          position={pos}
          speedX={BOX_SPEEDS[i][0]}
          speedY={BOX_SPEEDS[i][1]}
          opacity={opacity}
          floatSpeed={1 + i * 0.15}
          floatOffset={i * 0.5}
        />
      ))}
    </>
  )
}

// ─── Scene: Skills — ring of 12 spheres with wave scale ──────────────────────

const SPHERE_COLORS = ['#6366f1', '#06b6d4', '#f59e0b']
const RING_RADIUS   = 3
const SPHERE_COUNT  = 12

interface WaveSphereProps {
  index: number
  opacity: React.MutableRefObject<number>
}

function WaveSphere({ index, opacity }: WaveSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.MeshStandardMaterial>(null)
  const angle   = (index / SPHERE_COUNT) * Math.PI * 2
  const x       = Math.cos(angle) * RING_RADIUS
  const y       = Math.sin(angle) * RING_RADIUS
  const color   = SPHERE_COLORS[index % SPHERE_COLORS.length]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const wave = 0.7 + 0.5 * Math.sin(t * 1.4 + index * 0.52)
    if (meshRef.current) {
      meshRef.current.scale.setScalar(wave)
    }
    if (matRef.current) {
      matRef.current.opacity = opacity.current
    }
  })

  return (
    <mesh ref={meshRef} position={[x, y, 0]}>
      <sphereGeometry args={[0.12, 14, 14]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        transparent
        opacity={opacity.current}
      />
    </mesh>
  )
}

function SkillsScene({ opacity }: { opacity: React.MutableRefObject<number> }) {
  return (
    <>
      {Array.from({ length: SPHERE_COUNT }, (_, i) => (
        <WaveSphere key={i} index={i} opacity={opacity} />
      ))}
    </>
  )
}

// ─── Scene: Contact — icosahedron + orbiting point light ─────────────────────

function ContactScene({ opacity }: { opacity: React.MutableRefObject<number> }) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const matRef   = useRef<THREE.MeshStandardMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
    }
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(t * 0.7) * 3
      lightRef.current.position.y = Math.sin(t * 0.5) * 2
      lightRef.current.position.z = Math.sin(t * 0.7) * 3
    }
    if (matRef.current) {
      matRef.current.opacity = opacity.current
    }
  })

  return (
    <>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          ref={matRef}
          color="#6366f1"
          metalness={1}
          roughness={0.1}
          wireframe
          transparent
          opacity={opacity.current}
        />
      </mesh>
      <pointLight ref={lightRef} color="#06b6d4" intensity={2.5} distance={10} />
    </>
  )
}

// ─── Scene switcher + fade controller ────────────────────────────────────────

interface SceneSwitcherProps {
  activeSection: SceneSection
}

function SceneSwitcher({ activeSection }: SceneSwitcherProps) {
  const opacityRef   = useRef<number>(1)
  const frameCounter = useRef<number>(0)
  const prevSection  = useRef<SceneSection>(activeSection)
  const fadingIn     = useRef<boolean>(false)

  useEffect(() => {
    if (activeSection !== prevSection.current) {
      prevSection.current = activeSection
      opacityRef.current  = 0.2
      frameCounter.current = 0
      fadingIn.current     = true
    }
  }, [activeSection])

  useFrame(() => {
    if (fadingIn.current) {
      frameCounter.current += 1
      opacityRef.current = 0.2 + (frameCounter.current / 40) * 0.8
      if (frameCounter.current >= 40) {
        opacityRef.current = 1
        fadingIn.current   = false
      }
    }
  })

  const shared = opacityRef

  return (
    <>
      {activeSection === 'hero'     && <HeroScene     opacity={shared} />}
      {activeSection === 'projects' && <ProjectsScene opacity={shared} />}
      {activeSection === 'skills'   && <SkillsScene   opacity={shared} />}
      {activeSection === 'contact'  && <ContactScene  opacity={shared} />}
    </>
  )
}

// ─── Error boundary ───────────────────────────────────────────────────────────

interface EBState { hasError: boolean }
class CanvasErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false }
  static getDerivedStateFromError(): EBState { return { hasError: true } }
  componentDidCatch(_e: Error, _i: ErrorInfo) {}
  render() {
    return this.state.hasError ? null : this.props.children
  }
}

// ─── Inner canvas (rendered only on client) ───────────────────────────────────

function ScrollCanvasInner({ activeSection }: ScrollCanvasProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ fov: 60, near: 0.1, far: 60, position: [0, 0, 8] }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />

        <CameraController activeSection={activeSection} />

        <React.Suspense fallback={null}>
          <SceneSwitcher activeSection={activeSection} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function ScrollCanvas(props: ScrollCanvasProps): JSX.Element {
  return (
    <CanvasErrorBoundary>
      <ScrollCanvasInner {...props} />
    </CanvasErrorBoundary>
  )
}
