"use client"
import type { ThreeEvent } from '@react-three/fiber'

import React, { useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber' // types added below
import { Float, Html, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: string
  title: string
  shortDescription: string
  tech: string[]
  category: string
  featured?: boolean
  badge?: string
  github?: string
}

type ProjectCard3DProps = {
  project: Project
  index: number
  total: number
  onSelect: (id: string) => void
  /** live orbit angle for this card, driven by parent useFrame */
  angleRef: React.MutableRefObject<number>
}

type ProjectCarousel3DSceneProps = {
  projects: Project[]
  onSelect: (id: string) => void
}

export type ProjectCarousel3DProps = {
  projects: Project[]
  onSelect: (id: string) => void
  /** When true the component returns null — parent renders flat cards instead */
  isMobile?: boolean
}

// ─── Category colour palette ──────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { base: string; glow: string }> = {
  frontend: { base: '#1a2e4a', glow: '#38bdf8' },
  ai:       { base: '#1e1a2e', glow: '#a78bfa' },
  '3d':     { base: '#1a2e1e', glow: '#34d399' },
  backend:  { base: '#2e1a1a', glow: '#f87171' },
  mobile:   { base: '#2e2a1a', glow: '#fbbf24' },
  default:  { base: '#1a1e2e', glow: '#94a3b8' },
}

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default
}

// ─── Single orbiting card ─────────────────────────────────────────────────────

function ProjectCard3D({ project, index, total, onSelect, angleRef }: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Ellipse radii — slightly wider than tall for a cinematic sweep
  const RX = 5.2  // horizontal radius
  const RZ = 2.4  // depth radius

  // Each card's offset in the orbit (evenly spaced)
  const offset = useMemo(() => (index / total) * Math.PI * 2, [index, total])

  const { base, glow } = getCategoryColor(project.category)

  useFrame(() => {
    if (!meshRef.current) return

    const angle = angleRef.current + offset
    const x = Math.cos(angle) * RX
    const z = Math.sin(angle) * RZ

    meshRef.current.position.x = x
    meshRef.current.position.z = z

    // Face the camera (billboard around Y only)
    meshRef.current.rotation.y = -angle + Math.PI * 0.5

    // Smooth scale lerp
    const targetScale = hovered ? 1.15 : 1.0
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    )

    // Emissive glow when hovered
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    if (mat) {
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity,
        hovered ? 0.55 : 0.08,
        0.1
      )
    }
  })

  const handleClick = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onSelect(project.id)
    },
    [onSelect, project.id]
  )

  const handlePointerEnter = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerLeave = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'default'
  }, [])

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.05}
      floatIntensity={hovered ? 0.4 : 0.2}
      floatingRange={[-0.06, 0.06]}
    >
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        castShadow
      >
        {/* Card geometry: 2 × 1.2 units */}
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial
          color={base}
          emissive={glow}
          emissiveIntensity={0.08}
          roughness={0.35}
          metalness={0.6}
          transparent
          opacity={0.94}
          side={THREE.DoubleSide}
        />

        {/* Html overlay — title + short desc + tech pills */}
        <Html
          center
          occlude={false}
          transform
          distanceFactor={4}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div
            style={{
              width: '180px',
              padding: '12px 14px',
              color: '#f1f5f9',
              fontFamily: "'DM Mono', 'Fira Code', 'Courier New', monospace",
              position: 'relative',
            }}
          >
            {/* Category badge */}
            <span
              style={{
                display: 'inline-block',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: glow,
                marginBottom: '5px',
                opacity: 0.9,
              }}
            >
              {project.category}
              {project.featured && (
                <span
                  style={{
                    marginLeft: '6px',
                    background: glow,
                    color: '#0f172a',
                    padding: '1px 5px',
                    borderRadius: '3px',
                    fontSize: '7px',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                  }}
                >
                  ★ FEATURED
                </span>
              )}
            </span>

            {/* Title */}
            <h3
              style={{
                margin: '0 0 4px',
                fontSize: '15px',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#f8fafc',
                fontFamily: "'DM Sans', 'Inter', sans-serif",
              }}
            >
              {project.title}
            </h3>

            {/* Short description */}
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '10px',
                color: 'rgba(241,245,249,0.6)',
                lineHeight: 1.45,
                fontFamily: 'inherit',
              }}
            >
              {project.shortDescription}
            </p>

            {/* Tech pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
              {project.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: `${glow}22`,
                    color: glow,
                    border: `1px solid ${glow}44`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Click hint */}
            <p
              style={{
                marginTop: '8px',
                fontSize: '8px',
                color: `${glow}99`,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'inherit',
              }}
            >
              click to open →
            </p>
          </div>
        </Html>
      </mesh>
    </Float>
  )
}

// ─── Scene (Canvas contents) ──────────────────────────────────────────────────

function CarouselScene({ projects, onSelect }: ProjectCarousel3DSceneProps) {
  // Shared mutable angle reference — mutated in useFrame below, read by all cards
  const orbitAngleRef = useRef<number>(0)
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const velocityRef = useRef(0)

  useFrame((_state, delta) => {
    if (!isDragging.current) {
      // Auto-orbit: ~0.18 rad/s base speed
      velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, 0.18, delta * 2)
      orbitAngleRef.current += velocityRef.current * delta
    }
  })

  // Pointer drag to manually rotate carousel
  const { gl } = useThree()

  React.useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      lastX.current = e.clientX
      velocityRef.current = 0
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastX.current
      orbitAngleRef.current += dx * 0.008
      lastX.current = e.clientX
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl])

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault fov={60} position={[0, 0, 8]} near={0.1} far={100} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.1}
        color="#e2e8f0"
        castShadow
      />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={0.2}
        color="#7c3aed"
      />

      {/* Subtle fog for depth */}
      <fog attach="fog" args={['#060b14', 10, 26]} />

      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard3D
          key={project.id}
          project={project}
          index={index}
          total={projects.length}
          onSelect={onSelect}
          angleRef={orbitAngleRef}
        />
      ))}
    </>
  )
}

// ─── Exported component ───────────────────────────────────────────────────────

export default function ProjectCarousel3D({
  projects,
  onSelect,
  isMobile = false,
}: ProjectCarousel3DProps): JSX.Element | null {
  if (isMobile) return null

  return (
    <div
      style={{
        width: '100%',
        height: '420px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #060b14 0%, #0d1424 60%, #0a0f1e 100%)',
        boxShadow: '0 0 60px rgba(56,189,248,0.06), 0 0 120px rgba(167,139,250,0.04)',
        position: 'relative',
      }}
      aria-label="3D project carousel — drag to rotate, click a card to open"
    >
      {/* Hint overlay */}
      <p
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          color: 'rgba(148,163,184,0.45)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: "'DM Mono', monospace",
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        drag to spin · click to open
      </p>

      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <React.Suspense fallback={null}>
          <CarouselScene projects={projects} onSelect={onSelect} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
