'use client'

/**
 * components/Timeline3D.tsx
 *
 * Scroll-driven 3D timeline for Ayush Roy (@yorayriniwnl).
 * Entries are positioned along the Z-axis; the camera lerps along that axis
 * in response to native window scroll — equivalent to drei's useScroll but
 * compatible with the sticky-canvas / tall-page layout in app/timeline/page.tsx.
 *
 * Stack: React 18 · @react-three/fiber · @react-three/drei · three ^0.183
 */

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Kind = 'work' | 'project' | 'education' | 'achievement'

export type TimelineEntry = {
  id: string
  date: string        // ISO date string e.g. '2022-03-01'
  title: string
  description: string
  kind: Kind
}

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

export const TIMELINE: TimelineEntry[] = [
  {
    id: 't1',
    date: '2023-08-01',
    title: 'Started B.Tech at KIIT',
    description: 'Computer Science & Communication Engineering, expected graduation 2027',
    kind: 'education',
  },
  {
    id: 't2',
    date: '2026-01-21',
    title: 'Yor-Solar-Nexus',
    description: 'Solar energy planning and optimization project published on GitHub',
    kind: 'project',
  },
  {
    id: 't3',
    date: '2026-04-12',
    title: 'Yor Zenith',
    description: 'Solar planning platform with React and Three.js dashboards',
    kind: 'project',
  },
  {
    id: 't4',
    date: '2026-04-12',
    title: 'Yor AI vs Real Image',
    description: 'OpenCV, LBP/GLCM, Scikit-Learn SVM, and Streamlit image classifier',
    kind: 'project',
  },
  {
    id: 't5',
    date: '2026-04-13',
    title: 'Mentor-Mentee System',
    description: 'Python mentorship coordination system with Flask, SQLite, and Tkinter',
    kind: 'project',
  },
  {
    id: 't6',
    date: '2026-04-13',
    title: 'Portfolio Data Refresh',
    description: 'Portfolio content reconciled with resume and live GitHub repositories',
    kind: 'achievement',
  },
  {
    id: 't7',
    date: '2027-05-01',
    title: 'Expected Graduation',
    description: 'B.Tech Computer Science & Communication Engineering',
    kind: 'education',
  },
]

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

/** World-space step between consecutive entries along –Z */
const Z_STEP = -3 // units per entry

/** Camera Z at scroll progress = 0 (start) */
const START_Z = 3

/** Camera Z at scroll progress = 1 (end) */
const END_Z = (TIMELINE.length - 1) * Z_STEP - 3

/** Per-entry colour by kind */
const KIND_COLOR: Record<Kind, string> = {
  work:        '#6366f1',
  project:     '#06b6d4',
  education:   '#10b981',
  achievement: '#f59e0b',
}

/** Human-readable kind labels */
const KIND_LABEL: Record<Kind, string> = {
  work:        'Work',
  project:     'Project',
  education:   'Education',
  achievement: 'Achievement',
}

// ─────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    year:  'numeric',
  })
}

/** Z position for entry at index i */
function entryZ(i: number): number {
  return i * Z_STEP
}

/**
 * Closest entry index for a given camera Z.
 * Entry i sits at z = i * Z_STEP  →  i = –cameraZ / |Z_STEP|
 */
function zToIndex(cameraZ: number): number {
  const raw = -cameraZ / Math.abs(Z_STEP)
  return Math.max(0, Math.min(TIMELINE.length - 1, Math.round(raw)))
}

// ─────────────────────────────────────────────────────────────
// Sub-component: SphereNode
// ─────────────────────────────────────────────────────────────

interface SphereNodeProps {
  entry:    TimelineEntry
  index:    number
  isActive: boolean
}

function SphereNode({ entry, index, isActive }: SphereNodeProps) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const glowRef  = useRef<THREE.Mesh>(null)
  const color    = KIND_COLOR[entry.kind]

  // Smoothly animate scale toward target
  useFrame((_, delta) => {
    if (!meshRef.current || !glowRef.current) return

    const targetScale = isActive ? 1.5 : 1.0
    const targetGlow  = isActive ? 0.22 : 0.06

    // Smooth spring-like lerp  (factor 0.05 per the spec, applied per frame)
    const scaleNow = meshRef.current.scale.x
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(scaleNow, targetScale, 0.05)
    )

    const mat = glowRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetGlow, 0.05)
  })

  const pos: [number, number, number] = [0, 0, entryZ(index)]

  return (
    <group position={pos}>
      {/* ── Glow halo ─────────────────────────────────── */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      {/* ── Core sphere (radius 0.15 as specified) ─────── */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2.4 : 0.8}
          roughness={0.15}
          metalness={0.45}
          toneMapped={false}
        />
      </mesh>

      {/* ── Active PointLight at entry position ─────────── */}
      {isActive && (
        <pointLight
          color={color}
          intensity={8}
          distance={5}
          decay={2}
        />
      )}

      {/* ── Html overlay (drei) ──────────────────────────── */}
      <Html
        position={[0.45, 0.1, 0]}
        center={false}
        distanceFactor={5.5}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
        occlude={false}
      >
        <div
          aria-hidden={!isActive}
          style={{
            opacity:    isActive ? 1 : 0,
            transform:  isActive ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.94)',
            transition: 'opacity 0.38s ease, transform 0.38s ease',
            minWidth:   '190px',
            maxWidth:   '220px',
            background: 'rgba(6,10,20,0.90)',
            border:     `1px solid ${color}33`,
            borderLeft: `2.5px solid ${color}`,
            borderRadius: '7px',
            padding:    '9px 13px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: `0 4px 24px ${color}22, 0 2px 8px rgba(0,0,0,0.5)`,
            color:      '#e8effe',
            fontFamily: 'var(--font-ds-body,"DM Sans",ui-sans-serif,system-ui,sans-serif)',
          }}
        >
          {/* Kind badge */}
          <div
            style={{
              display:     'inline-flex',
              alignItems:  'center',
              gap:         '4px',
              fontSize:    '8px',
              fontFamily:  'var(--font-ds-mono,"DM Mono",monospace)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:       color,
              marginBottom: '4px',
              background:  `${color}18`,
              padding:     '2px 6px',
              borderRadius: '3px',
            }}
          >
            <span
              style={{
                width:        '5px',
                height:       '5px',
                borderRadius: '50%',
                background:   color,
                display:      'inline-block',
                flexShrink:   0,
              }}
            />
            {KIND_LABEL[entry.kind]}
          </div>

          {/* Date */}
          <div
            style={{
              fontSize:    '9px',
              fontFamily:  'var(--font-ds-mono,"DM Mono",monospace)',
              color:       '#8892aa',
              marginBottom: '3px',
              letterSpacing: '0.08em',
            }}
          >
            {formatDate(entry.date)}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize:   '13px',
              fontWeight: 700,
              lineHeight: 1.25,
              color:      '#f0f4ff',
              marginBottom: '4px',
            }}
          >
            {entry.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize:   '11px',
              color:      '#8892aa',
              lineHeight: 1.5,
            }}
          >
            {entry.description}
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────
// Sub-component: TubePath (CatmullRomCurve3 spine)
// ─────────────────────────────────────────────────────────────

function TubePath() {
  // Build control points — one per entry
  const points = TIMELINE.map((_, i) => new THREE.Vector3(0, 0, entryZ(i)))
  const curve  = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)

  // Memoised geometry (rebuilt only once since TIMELINE is static)
  const geometry = new THREE.TubeGeometry(
    curve,
    /* tubularSegments */ 128,
    /* radius          */ 0.015,
    /* radialSegments  */ 8,
    /* closed          */ false
  )

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#2d3a50"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────
// Sub-component: IndexIndicator (HUD – entry n / total)
// ─────────────────────────────────────────────────────────────

interface IndexIndicatorProps {
  activeIdx: number
}

function IndexIndicator({ activeIdx }: IndexIndicatorProps) {
  const entry = TIMELINE[activeIdx]
  const color = KIND_COLOR[entry.kind]

  return (
    <Html
      position={[-2.8, -1.6, 0]}
      center={false}
      distanceFactor={10}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
      zIndexRange={[50, 0]}
    >
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '8px',
          fontFamily: 'var(--font-ds-mono,"DM Mono",monospace)',
          fontSize:   '10px',
          color:      '#8892aa',
          letterSpacing: '0.1em',
        }}
      >
        <span style={{ color, fontWeight: 700, fontSize: '12px' }}>
          {String(activeIdx + 1).padStart(2, '0')}
        </span>
        <span>/</span>
        <span>{String(TIMELINE.length).padStart(2, '0')}</span>
      </div>
    </Html>
  )
}

// ─────────────────────────────────────────────────────────────
// Sub-component: Scene (inner R3F scene graph)
// ─────────────────────────────────────────────────────────────

function Scene() {
  const { camera } = useThree()

  /**
   * scrollProgress is updated by the window 'scroll' listener (passive).
   * Using a ref avoids React re-renders on every scroll event.
   */
  const scrollProgress = useRef<number>(0)

  /**
   * Smooth camera Z value — updated in useFrame via lerp factor 0.05
   * (as specified).
   */
  const cameraZRef = useRef<number>(START_Z)

  /** Track previous active index to avoid unnecessary setState calls. */
  const prevActiveRef = useRef<number>(0)

  const [activeIdx, setActiveIdx] = useState<number>(0)

  // ── Initialise camera ─────────────────────────────────────
  useEffect(() => {
    camera.position.set(0, 0, START_Z)
    camera.lookAt(0, 0, START_Z - 1)
  }, [camera])

  // ── Native window scroll listener ─────────────────────────
  //    Maps window.scrollY / maxScroll → [0, 1]
  //    This is semantically identical to drei useScroll but
  //    compatible with the sticky-canvas layout (ScrollControls
  //    would create its own overflow container, conflicting with
  //    the tall outer div approach in page.tsx).
  useEffect(() => {
    const onScroll = () => {
      const el        = document.documentElement
      const maxScroll = el.scrollHeight - el.clientHeight
      if (maxScroll > 0) {
        scrollProgress.current = window.scrollY / maxScroll
      }
    }

    // Initialise on mount in case page is already scrolled
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Per-frame update ──────────────────────────────────────
  useFrame(() => {
    // Target Z interpolated from scroll progress
    const targetZ =
      START_Z + scrollProgress.current * (END_Z - START_Z)

    // Lerp with factor 0.05 per spec (frame-rate dependent)
    cameraZRef.current = THREE.MathUtils.lerp(
      cameraZRef.current,
      targetZ,
      0.05
    )
    camera.position.z = cameraZRef.current

    // Determine which entry is "active" (closest on Z axis)
    const next = zToIndex(cameraZRef.current)
    if (next !== prevActiveRef.current) {
      prevActiveRef.current = next
      setActiveIdx(next)
    }
  })

  return (
    <>
      {/* ── Lighting ──────────────────────────────────────── */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 8]}  intensity={0.4} />
      <directionalLight position={[-4, -2, -6]} intensity={0.15} color="#334" />

      {/* ── Spine connecting all nodes ───────────────────── */}
      <TubePath />

      {/* ── One sphere node per entry ─────────────────────── */}
      {TIMELINE.map((entry, i) => (
        <SphereNode
          key={entry.id}
          entry={entry}
          index={i}
          isActive={i === activeIdx}
        />
      ))}

      {/* ── HUD counter ──────────────────────────────────── */}
      <IndexIndicator activeIdx={activeIdx} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Root export: Timeline3D (wraps Canvas)
// ─────────────────────────────────────────────────────────────

export default function Timeline3D() {
  return (
    <Canvas
      /**
       * alpha=true → transparent background so the page's dark
       * CSS background shows through.
       */
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      /**
       * Camera starts at Z=3 looking toward the first entry (z=0).
       * fov 55 gives a cinematic, slightly compressed look.
       */
      camera={{
        position: [0, 0, START_Z],
        fov:      55,
        near:     0.1,
        far:      200,
      }}
      dpr={[1, 2]}
      style={{
        position: 'absolute',
        inset:    0,
        height:   '100vh',
        width:    '100%',
      }}
    >
      <Scene />
    </Canvas>
  )
}
