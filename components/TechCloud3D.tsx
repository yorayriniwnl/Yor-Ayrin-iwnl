"use client"

import React, { useEffect, useMemo, useRef, useState, Suspense, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, Html, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ─── Tech data ────────────────────────────────────────────────────────────────

interface Tech {
  name:  string
  color: string
  level: number   // 1–3: 1=learning, 2=proficient, 3=expert
}

const TECHS: Tech[] = [
  { name: 'React',       color: '#61DAFB', level: 3 },
  { name: 'Python',      color: '#F7CB3D', level: 3 },
  { name: 'Three.js',    color: '#049EF4', level: 2 },
  { name: 'TypeScript',  color: '#3178C6', level: 2 },
  { name: 'OpenCV',      color: '#5C3EE8', level: 2 },
  { name: 'Scikit-Learn',color: '#F89939', level: 2 },
  { name: 'Tailwind',    color: '#38BDF8', level: 3 },
  { name: 'Streamlit',   color: '#FF4B4B', level: 2 },
  { name: 'HTML / CSS',  color: '#E34F26', level: 3 },
  { name: 'Git',         color: '#F05032', level: 3 },
  { name: 'SQL',         color: '#336791', level: 1 },
  { name: 'Java',        color: '#ED8B00', level: 1 },
]

const LEVEL_LABELS: Record<number, string> = { 1: 'Learning', 2: 'Proficient', 3: 'Expert' }

// ─── Fibonacci sphere ─────────────────────────────────────────────────────────

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = []
  const phi = (1 + Math.sqrt(5)) / 2
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n)
    const angle = (2 * Math.PI * i) / phi
    positions.push(new THREE.Vector3(
      radius * Math.sin(theta) * Math.cos(angle),
      radius * Math.sin(theta) * Math.sin(angle),
      radius * Math.cos(theta),
    ))
  }
  return positions
}

const POSITIONS = fibonacciSphere(TECHS.length, 3.5)

// ─── Auto-rotate controller ───────────────────────────────────────────────────
// Pauses on hover so users can read badges, resumes after 1.5 s of inactivity.

function AutoRotateController({ paused }: { paused: boolean }): null {
  const { camera } = useThree()
  const angleRef   = useRef(0)
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useFrame((_, delta): void => {
    if (paused) return
    angleRef.current += delta * 0.3
    camera.position.x = Math.sin(angleRef.current) * 7
    camera.position.z = Math.cos(angleRef.current) * 7
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ─── Single tech badge ────────────────────────────────────────────────────────

interface TechBadgeProps {
  tech:     Tech
  position: THREE.Vector3
  index:    number
  onHover:  (name: string | null) => void
  focused:  boolean
}

function TechBadge({ tech, position, index, onHover, focused }: TechBadgeProps): React.ReactElement {
  const [hovered, setHovered] = useState(false)
  const groupRef              = useRef<THREE.Group>(null)
  const scaleRef              = useRef(1.0)

  const floatSpeed     = 1.2 + ((index * 0.3) % 1.5)
  const floatIntensity = 0.3 + ((index * 0.2) % 0.8)

  // Spring-like scale animation via useFrame (no external spring library)
  useFrame((_, delta): void => {
    if (!groupRef.current) return
    const target = (hovered || focused) ? 1.35 : 1.0
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, Math.min(1, delta * 12))
    groupRef.current.scale.setScalar(scaleRef.current)
  })

  const handleEnter = useCallback((): void => {
    setHovered(true)
    onHover(tech.name)
  }, [tech.name, onHover])

  const handleLeave = useCallback((): void => {
    setHovered(false)
    onHover(null)
  }, [onHover])

  const isActive = hovered || focused

  const badgeStyle: React.CSSProperties = {
    background:    isActive ? tech.color + '33' : tech.color + '1a',
    border:        `1px solid ${isActive ? tech.color : tech.color + '88'}`,
    color:         '#ffffff',
    padding:       '5px 11px',
    borderRadius:  '20px',
    fontSize:      '12px',
    fontFamily:    'monospace',
    whiteSpace:    'nowrap',
    cursor:        'pointer',
    userSelect:    'none',
    transition:    'background 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
    boxShadow:     isActive ? `0 0 16px ${tech.color}55` : 'none',
    outline:       focused ? `2px solid ${tech.color}` : 'none',
    outlineOffset: focused ? '2px' : '0',
  }

  return (
    <Float speed={floatSpeed} rotationIntensity={0} floatIntensity={floatIntensity}>
      <Billboard position={position}>
        <group ref={groupRef}>
          <Html center distanceFactor={6}>
            <div
              role="button"
              tabIndex={0}
              aria-label={`${tech.name} — ${LEVEL_LABELS[tech.level]}`}
              style={badgeStyle}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              onFocus={handleEnter}
              onBlur={handleLeave}
              onClick={(): void => { window.location.href = '#skills' }}
              onKeyDown={(e): void => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = '#skills' }
              }}
            >
              {tech.name}
            </div>
          </Html>
        </group>
      </Billboard>
    </Float>
  )
}

// ─── Tooltip overlay ──────────────────────────────────────────────────────────

function Tooltip({ name }: { name: string | null }): React.ReactElement | null {
  const tech = name ? TECHS.find((t) => t.name === name) : null
  if (!tech) return null

  const dots = Array.from({ length: 3 }, (_, i) => i < tech.level)

  return (
    <div
      style={{
        position:      'absolute',
        bottom:        12,
        left:          '50%',
        transform:     'translateX(-50%)',
        background:    'rgba(6,10,20,0.92)',
        border:        `1px solid ${tech.color}44`,
        borderRadius:  8,
        padding:       '7px 14px',
        pointerEvents: 'none',
        display:       'flex',
        alignItems:    'center',
        gap:           10,
        whiteSpace:    'nowrap',
        backdropFilter: 'blur(8px)',
        zIndex:        10,
        animation:     '_tcTooltipIn 180ms cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <style>{`
        @keyframes _tcTooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);   }
        }
      `}</style>
      <span style={{ color: tech.color, fontFamily: 'monospace', fontSize: 13, fontWeight: 600 }}>
        {tech.name}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
        {LEVEL_LABELS[tech.level]}
      </span>
      <div style={{ display: 'flex', gap: 3 }}>
        {dots.map((filled, i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: filled ? tech.color : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── 3D Scene ─────────────────────────────────────────────────────────────────

function CloudScene({ onHoverChange }: { onHoverChange: (n: string | null) => void }): React.ReactElement {
  const [hoveredGlobal, setHoveredGlobal] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const handleHover = useCallback((name: string | null): void => {
    setHoveredGlobal(name)
    setPaused(name !== null)
    onHoverChange(name)
  }, [onHoverChange])

  return (
    <>
      <ambientLight intensity={0.4} />
      <AutoRotateController paused={paused} />

      {TECHS.map((tech, i) => (
        <TechBadge
          key={tech.name}
          tech={tech}
          position={POSITIONS[i]}
          index={i}
          onHover={handleHover}
          focused={hoveredGlobal === tech.name}
        />
      ))}

      {/* Fallback orbit controls when not auto-rotating */}
      {paused && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          makeDefault
        />
      )}
    </>
  )
}

// ─── 2D fallback ──────────────────────────────────────────────────────────────

export function FlatCloud(): React.ReactElement {
  return (
    <div
      style={{
        display:        'flex',
        flexWrap:       'wrap',
        gap:            '8px',
        justifyContent: 'center',
        padding:        '2rem 1rem',
        minHeight:      '120px',
        alignItems:     'center',
      }}
    >
      {TECHS.map((tech) => (
        <a
          key={tech.name}
          href="#skills"
          aria-label={`${tech.name} — ${LEVEL_LABELS[tech.level]}`}
          style={{
            background:     tech.color + '1a',
            border:         `1px solid ${tech.color}88`,
            color:          '#ffffff',
            padding:        '5px 11px',
            borderRadius:   '20px',
            fontSize:       '12px',
            fontFamily:     'monospace',
            whiteSpace:     'nowrap',
            textDecoration: 'none',
            transition:     'background 150ms ease',
          }}
        >
          {tech.name}
        </a>
      ))}
    </div>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function TechCloud3D(): React.ReactElement {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect((): (() => void) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (): void => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return (): void => mq.removeEventListener('change', onChange)
  }, [])

  if (reducedMotion) return <FlatCloud />

  return (
    <div style={{ width: '100%', height: 380, position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <CloudScene onHoverChange={setHoveredTech} />
        </Suspense>
      </Canvas>

      <Tooltip name={hoveredTech} />
    </div>
  )
}
