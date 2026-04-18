// Usage in app/layout.tsx:
// const [loading, setLoading] = useState(true)
// {loading && <LoadingScreen onDone={() => setLoading(false)} />}
// Add to the body: style={{ visibility: loading ? 'hidden' : 'visible' }}

'use client'

import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  Suspense,
} from 'react'
import dynamic from 'next/dynamic'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type LoadingScreenProps = {
  onDone: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants — exact positions as specified
// ─────────────────────────────────────────────────────────────────────────────

const SCATTERED: readonly [number, number, number][] = [
  [-2,  2,  0],
  [ 2,  2,  0],
  [-2, -2,  0],
  [ 2, -2,  0],
  [-1,  0,  1],
  [ 1,  0,  1],
  [ 0,  1, -1],
  [ 0, -1, -1],
]

const ASSEMBLED: readonly [number, number, number][] = [
  [-0.45,  0.45,  0.45],
  [ 0.45,  0.45,  0.45],
  [-0.45, -0.45,  0.45],
  [ 0.45, -0.45,  0.45],
  [-0.45,  0.45, -0.45],
  [ 0.45,  0.45, -0.45],
  [-0.45, -0.45, -0.45],
  [ 0.45, -0.45, -0.45],
]

const FRAG_COUNT = 8

// ─────────────────────────────────────────────────────────────────────────────
// Fragment mesh — one BoxGeometry fragment that lerps into place
// ─────────────────────────────────────────────────────────────────────────────

interface FragmentProps {
  index: number
}

function Fragment({ index }: FragmentProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null!)

  // Working copies of the scattered / assembled vectors, created once
  const from   = useMemo(() => new THREE.Vector3(...SCATTERED[index]), [index])
  const to     = useMemo(() => new THREE.Vector3(...ASSEMBLED[index]), [index])
  const curPos = useMemo(() => new THREE.Vector3(...SCATTERED[index]), [index])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return

    const t = clock.getElapsedTime()

    if (t < 0.8) {
      // Phase 1: lerp scattered → assembled
      curPos.lerp(to, 0.06)
      mesh.position.copy(curPos)
    } else if (t < 2.5) {
      // Phase 2: hold assembled position, rotate on Y
      mesh.position.copy(to)
    }
    // Phase 3 (t >= 2.5): scale collapses — handled in parent group
  })

  return (
    <mesh ref={meshRef} position={[...SCATTERED[index]] as [number, number, number]}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial
        color="#6366f1"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene — owns the group rotation, scale collapse, and onDone callback
// ─────────────────────────────────────────────────────────────────────────────

interface SceneProps {
  onDone: () => void
}

function AssemblyScene({ onDone }: SceneProps): JSX.Element {
  const groupRef  = useRef<THREE.Group>(null!)
  const calledRef = useRef(false)

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return

    const t = clock.getElapsedTime()

    if (t >= 0.8 && t < 2.5) {
      // Phase 2: slow Y rotation
      group.rotation.y += 0.008
    }

    if (t >= 2.5) {
      // Phase 3: scale toward zero
      const s = THREE.MathUtils.lerp(group.scale.x, 0, 0.1)
      group.scale.setScalar(Math.max(0, s))
    }

    if (t >= 3.0 && !calledRef.current) {
      calledRef.current = true
      onDone()
    }
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 4, 3]} intensity={1.5} />

      <group ref={groupRef}>
        {Array.from({ length: FRAG_COUNT }, (_, i) => (
          <Fragment key={i} index={i} />
        ))}
      </group>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic canvas — ssr:false so Three.js never touches the server
// ─────────────────────────────────────────────────────────────────────────────

interface CanvasWrapperProps {
  onDone: () => void
}

function CanvasWrapper({ onDone }: CanvasWrapperProps): JSX.Element {
  return (
    <Canvas
      style={{ width: 220, height: 220 }}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <AssemblyScene onDone={onDone} />
      </Suspense>
    </Canvas>
  )
}

const DynamicCanvas = dynamic(
  () => Promise.resolve(CanvasWrapper),
  { ssr: false, loading: () => null },
)

// ─────────────────────────────────────────────────────────────────────────────
// Text fallback — used when canvas errors (or on very old devices)
// ─────────────────────────────────────────────────────────────────────────────

interface TextFallbackProps {
  onDone: () => void
}

function TextFallback({ onDone }: TextFallbackProps): JSX.Element | null {
  useEffect(() => {
    const id = setTimeout(onDone, 1500)
    return () => clearTimeout(id)
  }, [onDone])

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles injected once into the document head
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_ID = 'loading-screen-styles'

function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.getElementById(STYLE_ID)) return

  const el = document.createElement('style')
  el.id = STYLE_ID
  el.textContent = `
    @keyframes loading-pulse {
      0%,100% { opacity: 0.4; }
      50%      { opacity: 1; }
    }
    .loading-screen-root {
      position:        fixed;
      inset:           0;
      z-index:         9999;
      background:      #060a14;
      display:         flex;
      flex-direction:  column;
      align-items:     center;
      justify-content: center;
      transition:      opacity 0.4s ease;
    }
    .loading-screen-root.fading {
      opacity:          0;
      pointer-events:   none;
    }
    .loading-screen-text {
      font-family:     "DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size:       14px;
      color:           #6366f1;
      letter-spacing:  0.2em;
      text-transform:  uppercase;
      margin-top:      1.25rem;
      animation:       loading-pulse 1.5s ease-in-out infinite;
    }
  `
  document.head.appendChild(el)
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function LoadingScreen({ onDone }: LoadingScreenProps): JSX.Element {
  const [fading,    setFading]    = useState(false)
  const [canvasErr, setCanvasErr] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    injectStyles()
  }, [])

  const handleDone = (): void => {
    if (doneRef.current) return
    doneRef.current = true
    setFading(true)
    // Wait for CSS transition to finish before calling the parent callback
    setTimeout(onDone, 420)
  }

  // Catch canvas / WebGL errors via error boundary equivalent
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      if (
        e.message?.toLowerCase().includes('webgl') ||
        e.message?.toLowerCase().includes('three') ||
        e.message?.toLowerCase().includes('canvas')
      ) {
        setCanvasErr(true)
      }
    }
    window.addEventListener('error', onError)
    return () => window.removeEventListener('error', onError)
  }, [])

  return (
    <div className={`loading-screen-root${fading ? ' fading' : ''}`}>
      {canvasErr ? (
        <TextFallback onDone={handleDone} />
      ) : (
        <DynamicCanvas onDone={handleDone} />
      )}
      <p className="loading-screen-text" aria-live="polite" aria-label="Loading">
        Loading...
      </p>
    </div>
  )
}
