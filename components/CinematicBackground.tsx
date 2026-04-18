"use client"

import React, {
  Component,
  type ErrorInfo,
  type ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import dynamic from 'next/dynamic'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Seeded PRNG — mulberry32 ─────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let s = seed | 0
  return (): number => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Galaxy geometry ──────────────────────────────────────────────────────────

interface GalaxyBuffers {
  positions:  Float32Array
  sizes:      Float32Array
  colors:     Float32Array   // RGB per particle — nebula tinting
  twinkles:   Float32Array   // Phase offset for opacity shimmer
}

function buildGalaxyGeometry(count: number): GalaxyBuffers {
  const rng = mulberry32(31_415_926)

  const positions = new Float32Array(count * 3)
  const sizes     = new Float32Array(count)
  const colors    = new Float32Array(count * 3) // r,g,b per particle
  const twinkles  = new Float32Array(count)     // phase 0..2π

  const N_ARMS          = 3
  const MAX_RADIUS      = 10.0
  const SPIRAL_TIGHTNESS = 2.8
  const ARM_WIDTH       = 0.62
  const DISK_HEIGHT     = 0.85

  // Arm accent colors: indigo core, violet mid, cyan far edge
  const ARM_COLORS: [number, number, number][] = [
    [0.38, 0.40, 0.94],  // #6166f0 — indigo
    [0.73, 0.40, 0.95],  // #ba66f3 — violet
    [0.24, 0.73, 0.96],  // #3cbbf5 — cyan
  ]

  for (let i = 0; i < count; i++) {
    const armIndex    = i % N_ARMS
    const armBaseAngle = (armIndex / N_ARMS) * Math.PI * 2

    const t      = rng()
    const radius = Math.sqrt(t) * MAX_RADIUS

    const spiralAngle = radius * SPIRAL_TIGHTNESS
    const scatter     = (rng() - 0.5) * ARM_WIDTH * Math.max(0.15, 1.0 - t * 0.55)
    const finalAngle  = armBaseAngle + spiralAngle + scatter

    const diskFalloff = 1.0 - radius / MAX_RADIUS
    const y           = (rng() - 0.5) * 2.0 * DISK_HEIGHT * diskFalloff

    positions[i * 3]     = Math.cos(finalAngle) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(finalAngle) * radius

    sizes[i]    = 0.02 + rng() * 0.04
    twinkles[i] = rng() * Math.PI * 2

    // Blend arm base color towards white at the center (core glow)
    const coreBlend  = Math.max(0, 1.0 - radius / (MAX_RADIUS * 0.3))
    const [ar, ag, ab] = ARM_COLORS[armIndex]
    colors[i * 3]     = ar + (1.0 - ar) * coreBlend
    colors[i * 3 + 1] = ag + (1.0 - ag) * coreBlend
    colors[i * 3 + 2] = ab + (1.0 - ab) * coreBlend
  }

  return { positions, sizes, colors, twinkles }
}

// ─── GLSL shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3  aColor;
  attribute float aTwinkle;
  uniform   float uPixelRatio;
  uniform   float uTime;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    // Soft opacity shimmer per particle — low amplitude so galaxy reads clearly
    vAlpha = 0.72 + 0.28 * sin(uTime * 1.4 + aTwinkle);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position  = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (220.0 / -mvPosition.z);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    // Soft Gaussian-ish falloff
    float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha * uOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── GalaxyPoints ─────────────────────────────────────────────────────────────

interface GalaxyPointsProps {
  count:        number
  paused:       boolean
}

function GalaxyPoints({ count, paused }: GalaxyPointsProps): React.ReactElement {
  const groupRef = useRef<THREE.Group>(null)
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const { positions, sizes, colors, twinkles } = useMemo(
    () => buildGalaxyGeometry(count),
    [count],
  )

  const material = useMemo((): THREE.ShaderMaterial => {
    const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
    return new THREE.ShaderMaterial({
      uniforms: {
        uOpacity:    { value: 0.6 },
        uPixelRatio: { value: pixelRatio },
        uTime:       { value: 0 },
      },
      vertexShader:   VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent:    true,
      depthWrite:     false,
      blending:       THREE.AdditiveBlending,
    })
  }, [])

  useEffect((): (() => void) => () => material.dispose(), [material])

  // Mouse + touch parallax
  useEffect((): (() => void) => {
    function toNorm(clientX: number, clientY: number): void {
      mouseRef.current.x =  (clientX / window.innerWidth)  - 0.5
      mouseRef.current.y = -((clientY / window.innerHeight) - 0.5)
    }
    const onMouse = (e: MouseEvent): void => toNorm(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent): void => {
      if (e.touches[0]) toNorm(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return (): void => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  useFrame(({ clock }): void => {
    const g = groupRef.current
    if (!g) return

    // Update time uniform for twinkle effect
    material.uniforms.uTime.value = clock.elapsedTime

    if (paused) return

    // Galaxy rotation
    g.rotation.z += 0.0002

    // Parallax
    g.position.x = THREE.MathUtils.lerp(g.position.x, mouseRef.current.x * 2.0, 0.05)
    g.position.y = THREE.MathUtils.lerp(g.position.y, mouseRef.current.y * 2.0, 0.05)
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSize"    args={[sizes,     1]} />
          <bufferAttribute attach="attributes-aColor"   args={[colors,    3]} />
          <bufferAttribute attach="attributes-aTwinkle" args={[twinkles,  1]} />
        </bufferGeometry>
        <primitive object={material} attach="material" />
      </points>
    </group>
  )
}

// ─── Canvas impl ──────────────────────────────────────────────────────────────

function GalaxyCanvasImpl(): React.ReactElement {
  const [isMobile, setIsMobile] = useState(false)
  // Pause when the tab is not visible
  const [paused,   setPaused]   = useState(false)

  useEffect((): (() => void) => {
    const check = (): void => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return (): void => window.removeEventListener('resize', check)
  }, [])

  useEffect((): (() => void) => {
    const onVis = (): void => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return (): void => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const count = isMobile ? 800 : 4000

  return (
    <Canvas
      camera={{ position: [0, 4, 16], fov: 60 }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, width: '100%', height: '100%', pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <GalaxyPoints count={count} paused={paused} />
      </Suspense>
    </Canvas>
  )
}

const GalaxyCanvas = dynamic(
  (): Promise<{ default: typeof GalaxyCanvasImpl }> => Promise.resolve({ default: GalaxyCanvasImpl }),
  { ssr: false },
)

// ─── Error boundary ───────────────────────────────────────────────────────────

interface EBState { hasError: boolean }

class GalaxyErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(): EBState { return { hasError: true } }
  override componentDidCatch(err: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production')
      console.warn('[CinematicBackground] WebGL suppressed:', err.message, info.componentStack)
  }
  override render(): ReactNode {
    return this.state.hasError ? null : this.props.children
  }
}

// ─── Default export ───────────────────────────────────────────────────────────

export default function CinematicBackground(): React.ReactElement {
  const [mounted,       setMounted]       = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect((): (() => void) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (): void => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)

    // Defer canvas 100 ms so it never contends with LCP
    const t = setTimeout((): void => setMounted(true), 100)

    return (): void => {
      mq.removeEventListener('change', onChange)
      clearTimeout(t)
    }
  }, [])

  // When the user prefers reduced motion, skip the animated canvas entirely
  if (reducedMotion || !mounted) return <div aria-hidden="true" />

  return (
    <div aria-hidden="true">
      <GalaxyErrorBoundary>
        <Suspense fallback={<div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} />}>
          <GalaxyCanvas />
        </Suspense>
      </GalaxyErrorBoundary>
    </div>
  )
}
