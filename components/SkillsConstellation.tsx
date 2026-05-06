'use client'

/**
 * SkillsConstellation.tsx
 * -------------------------
 * 3-D skills visualiser for Ayush Roy's portfolio.
 *
 * â€¢ Each skill is a sphere sized by proficiency value.
 * â€¢ Positions follow a Fibonacci sphere distribution.
 * â€¢ Related skills are wired with thin LineSegments.
 * â€¢ Hover â†’ scale pulse + emissive highlight + Html tooltip (drei).
 * â€¢ Suspense / SSR fallback â†’ IntersectionObserver-driven CSS bars.
 *
 * Stack: React 18 Â· TypeScript Â· @react-three/fiber Â· @react-three/drei Â· Three.js
 */

import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  Suspense,
  useCallback,
} from 'react'
import dynamic from 'next/dynamic'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Skill = {
  name: string
  value: number // 0â€“100
  desc?: string
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Data
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SKILLS: Skill[] = [
  { name: 'React',         value: 82 },
  { name: 'TypeScript',    value: 65 },
  { name: 'Three.js',      value: 72 },
  { name: 'Python',        value: 84 },
  { name: 'OpenCV',        value: 76 },
  { name: 'Scikit-Learn',  value: 74 },
  { name: 'HTML/CSS',      value: 82 },
  { name: 'TailwindCSS',   value: 80 },
  { name: 'Streamlit',     value: 70 },
  { name: 'Git/GitHub',    value: 90 },
  { name: 'VS Code',       value: 88 },
  { name: 'SQL',           value: 58 },
]

/**
 * Index pairs that should be connected by a line.
 * Grouped by conceptual proximity.
 */
const CONNECTIONS: readonly [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 6],
  [0, 7],
  [1, 7],
  [2, 7],
  [3, 4],
  [3, 5],
  [3, 8],
  [4, 5],
  [9, 10],
  [3, 11],
]
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Colour helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function skillHex(value: number): string {
  if (value > 80) return '#6366f1'
  if (value > 60) return '#06b6d4'
  return '#94a3b8'
}

function skillHexBright(value: number): string {
  if (value > 80) return '#818cf8'
  if (value > 60) return '#22d3ee'
  return '#cbd5e1'
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Geometry helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Distribute n points evenly across a sphere using the
 * Fibonacci / golden-angle method.
 */
function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle in radians
  for (let i = 0; i < n; i++) {
    const y   = 1 - (i / (n - 1)) * 2
    const r   = Math.sqrt(1 - y * y)
    const theta = phi * i
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y           * radius,
        Math.sin(theta) * r * radius,
      ),
    )
  }
  return pts
}

/** Sphere radius for a given skill value. */
function nodeRadius(value: number): number {
  return (value / 100) * 0.3 + 0.08
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Sub-components â€“ 3-D scene
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface SkillNodeProps {
  skill: Skill
  position: THREE.Vector3
  hovered: boolean
  onPointerEnter: () => void
  onPointerLeave: () => void
}

function SkillNode({
  skill,
  position,
  hovered,
  onPointerEnter,
  onPointerLeave,
}: SkillNodeProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef  = useRef<THREE.MeshStandardMaterial>(null!)

  const baseColor    = useMemo(() => new THREE.Color(skillHex(skill.value)),       [skill.value])
  const hoverColor   = useMemo(() => new THREE.Color('#6366f1'),                   [])
  const emissiveBase = useMemo(() => new THREE.Color(skillHex(skill.value)),       [skill.value])
  const emissiveHov  = useMemo(() => new THREE.Color(skillHexBright(skill.value)), [skill.value])

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return
    const mesh = meshRef.current
    const mat  = matRef.current

    // Smooth scale
    const target = hovered ? 1.4 : 1.0
    mesh.scale.setScalar(
      THREE.MathUtils.lerp(mesh.scale.x, target, Math.min(1, delta * 10)),
    )

    // Smooth colour
    mat.color.lerp(hovered ? hoverColor : baseColor, Math.min(1, delta * 8))
    mat.emissive.lerp(hovered ? emissiveHov : emissiveBase, Math.min(1, delta * 8))
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      hovered ? 0.7 : 0.12,
      Math.min(1, delta * 8),
    )
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={(e) => { e.stopPropagation(); onPointerEnter() }}
      onPointerLeave={(e) => { e.stopPropagation(); onPointerLeave() }}
    >
      <sphereGeometry args={[nodeRadius(skill.value), 24, 24]} />
      <meshStandardMaterial
        ref={matRef}
        color={skillHex(skill.value)}
        emissive={skillHex(skill.value)}
        emissiveIntensity={0.12}
        roughness={0.25}
        metalness={0.65}
      />

      {hovered && (
        <Html
          center
          distanceFactor={7}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div
            style={{
              background: 'rgba(10, 9, 6, 0.92)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '0.6rem',
              padding: '0.45rem 0.75rem',
              fontFamily: 'var(--ds-font-mono, "DM Mono", monospace)',
              fontSize: '0.75rem',
              color: 'var(--ds-text, #ddd5c0)',
              whiteSpace: 'nowrap',
              lineHeight: 1.5,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15)',
              transform: 'translateY(-0.25rem)',
            }}
          >
            <span style={{ color: skillHexBright(skill.value), fontWeight: 700 }}>
              {skill.name}
            </span>
            <span style={{ color: 'var(--ds-text-muted, #a89878)', marginLeft: '0.4rem' }}>
              {skill.value}%
            </span>
            {skill.desc && (
              <span
                style={{
                  display: 'block',
                  color: 'var(--ds-text-dim, #7a7060)',
                  fontSize: '0.7rem',
                  marginTop: '0.1rem',
                }}
              >
                {skill.desc}
              </span>
            )}
          </div>
        </Html>
      )}
    </mesh>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ConnectionLinesProps {
  positions: THREE.Vector3[]
}

function ConnectionLines({ positions }: ConnectionLinesProps): JSX.Element {
  const geo = useMemo(() => {
    const verts: number[] = []
    for (const [a, b] of CONNECTIONS) {
      const pa = positions[a]
      const pb = positions[b]
      verts.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(verts), 3),
    )
    return geometry
  }, [positions])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial
        color="#334155"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </lineSegments>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function AmbientParticles(): JSX.Element {
  const COUNT = 160
  const geo = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 9
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  return (
    <points geometry={geo}>
      <pointsMaterial
        color="#94a3b8"
        size={0.018}
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Scene(): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const positions = useMemo(
    () => fibonacciSphere(SKILLS.length, 1.85),
    [],
  )

  const { gl } = useThree()
  useEffect(() => {
    // Restore pointer when canvas is not hovered
    gl.domElement.style.cursor = 'default'
  }, [gl])

  const handleEnter = useCallback((i: number) => {
    setHoveredIndex(i)
    document.body.style.cursor = 'pointer'
  }, [])
  const handleLeave = useCallback(() => {
    setHoveredIndex(null)
    document.body.style.cursor = 'default'
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]}  intensity={1.2} color="#c9a84c" />
      <pointLight position={[-4, -3, -4]} intensity={0.5} color="#6366f1" />
      <pointLight position={[0, -5, 3]}  intensity={0.3} color="#06b6d4" />

      {/* Background star-dust */}
      <AmbientParticles />

      {/* Connections */}
      <ConnectionLines positions={positions} />

      {/* Skill nodes */}
      {SKILLS.map((skill, i) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          position={positions[i]}
          hovered={hoveredIndex === i}
          onPointerEnter={() => handleEnter(i)}
          onPointerLeave={handleLeave}
        />
      ))}

      <OrbitControls
        enablePan={false}
        autoRotate={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Flat fallback (Suspense + mobile)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface FlatSkillsListProps {
  /** If true, skip the IntersectionObserver and animate immediately. */
  immediate?: boolean
}

function FlatSkillsList({ immediate = false }: FlatSkillsListProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(immediate)

  useEffect(() => {
    if (immediate) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [immediate])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 28rem), 1fr))',
        gap: '0.55rem 2.5rem',
        padding: '0.25rem 0',
      }}
    >
      {SKILLS.map((skill) => {
        const hex      = skillHex(skill.value)
        const hexBright = skillHexBright(skill.value)

        return (
          <div key={skill.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {/* Label row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--ds-font-mono, "DM Mono", monospace)',
                  fontSize: '0.78rem',
                  color: 'var(--ds-text, #ddd5c0)',
                  letterSpacing: '0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {/* Colour dot */}
                <span
                  style={{
                    display: 'inline-block',
                    width: '0.45rem',
                    height: '0.45rem',
                    borderRadius: '50%',
                    background: hex,
                    boxShadow: `0 0 5px 1px ${hex}55`,
                    flexShrink: 0,
                  }}
                />
                {skill.name}
                {skill.desc && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--ds-text-dim, #7a7060)',
                    }}
                  >
                    Â· {skill.desc}
                  </span>
                )}
              </span>
              <span
                style={{
                  fontFamily: 'var(--ds-font-mono, "DM Mono", monospace)',
                  fontSize: '0.73rem',
                  color: hexBright,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {skill.value}%
              </span>
            </div>

            {/* Bar track */}
            <div
              style={{
                position: 'relative',
                height: '3px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: visible ? `${skill.value}%` : '0%',
                  background: `linear-gradient(90deg, ${hex}, ${hexBright})`,
                  borderRadius: '999px',
                  boxShadow: visible ? `0 0 8px 1px ${hex}66` : 'none',
                  transition: visible
                    ? 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease'
                    : 'none',
                  transitionDelay: visible ? `${SKILLS.indexOf(skill) * 55}ms` : '0ms',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// 3-D Canvas wrapper (CSR only)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Wrapped in dynamic() with ssr:false at the usage site.
 * Exported separately so the dynamic() wrapper can reference it.
 */
function ConstellationCanvas(): JSX.Element {
  return (
    <Canvas
      style={{ width: '100%', height: '500px' }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

/**
 * Dynamic import with ssr:false so Three.js / WebGL never runs on the server.
 */
const ConstellationCanvasNoSSR = dynamic(
  () => Promise.resolve(ConstellationCanvas),
  { ssr: false, loading: () => null },
)

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Mobile detection hook
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function useIsMobile(breakpoint = 640): boolean {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return mobile
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Public export
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * SkillsConstellation
 *
 * Renders a 3-D interactive constellation of skill spheres on desktop,
 * and a clean CSS bar-list on mobile or when the 3-D canvas isn't ready.
 *
 * Usage:
 * ```tsx
 * import SkillsConstellation from '@/components/SkillsConstellation'
 * // â€¦
 * <SkillsConstellation />
 * ```
 */
export default function SkillsConstellation(): JSX.Element {
  const isMobile = useIsMobile()

  return (
    <section
      aria-label="Skills constellation"
      style={{
        width: '100%',
        position: 'relative',
      }}
    >
      {isMobile ? (
        /* â”€â”€ Mobile: flat list only â”€â”€ */
        <div style={{ padding: '0.5rem 0 1rem' }}>
          <FlatSkillsList />
        </div>
      ) : (
        /* â”€â”€ Desktop: 3-D canvas + flat legend â”€â”€ */
        <>
          {/* Canvas */}
          <div
            style={{
              width: '100%',
              height: '500px',
              position: 'relative',
              borderRadius: 'var(--ds-radius-lg, 1.35rem)',
              overflow: 'hidden',
              background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.06) 0%, transparent 70%)',
            }}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FlatSkillsList immediate />
                </div>
              }
            >
              <ConstellationCanvasNoSSR />
            </Suspense>

            {/* Subtle vignette overlay */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(10,9,6,0.55) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Drag hint */}
            <p
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--ds-font-mono, "DM Mono", monospace)',
                fontSize: '0.68rem',
                color: 'var(--ds-text-dim, #7a7060)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              drag to explore Â· hover a node
            </p>
          </div>

          {/* Flat legend beneath the canvas */}
          <div
            style={{
              marginTop: 'var(--ds-space-6, 1.5rem)',
              padding:
                'var(--ds-space-5, 1.25rem) var(--ds-space-6, 1.5rem)',
              background: 'var(--ds-surface, rgba(26,23,16,0.92))',
              border: '1px solid var(--ds-border, rgba(42,37,32,0.95))',
              borderRadius: 'var(--ds-radius-lg, 1.35rem)',
            }}
          >
            <FlatSkillsList />
          </div>
        </>
      )}
    </section>
  )
}

