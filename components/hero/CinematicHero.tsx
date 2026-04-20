"use client"
import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import CameraController from './CameraController'
import { shouldDisable3D } from '../3d/devUtils'
import { PROFILE_PHOTO_SRC } from '../../lib/profilePhoto'
const AvatarModel = React.lazy(() => import('../3d/AvatarModel'))
import * as THREE from 'three'
import { PROJECTS } from '../../lib/data'
import UI from '../../lib/uiConfig'
import { speak } from '../../lib/tts'

function Orb({ option = 'A', expanded = false, onToggle }: { option?: 'A'; expanded?: boolean; onToggle?: () => void }) {
  const innerRef = useRef<any>(null)
  const groupRef = useRef<any>(null)
  const shellRef = useRef<any>(null)
  const edgeRef = useRef<any>(null)
  const ringRef = useRef<any>(null)
  const lightRef = useRef<any>(null)
  const tRef = useRef(0)
  const ripple = useRef({ active: false, t0: 0 })

  useFrame((state) => {
    tRef.current = state.clock.getElapsedTime()
    // slower, softer breathing for premium feel
    const breath = 1 + Math.sin(tRef.current * 1.2) * 0.05

    if (innerRef.current) {
      // gentler rotation response for smoothness
      innerRef.current.rotation.x += (state.mouse.y * 0.5 - innerRef.current.rotation.x) * 0.035
      innerRef.current.rotation.y += (state.mouse.x * 0.8 - innerRef.current.rotation.y) * 0.035
    }

    if (shellRef.current) {
      shellRef.current.rotation.x += (state.mouse.y * 0.22 - shellRef.current.rotation.x) * 0.02
      shellRef.current.rotation.y += (state.mouse.x * 0.35 - shellRef.current.rotation.y) * 0.025
    }

    if (edgeRef.current && edgeRef.current.material) {
      const m = edgeRef.current.material
      m.opacity = 0.44 + Math.sin(tRef.current * 2.2) * 0.1
    }

    if (lightRef.current) {
      // slightly smoother intensity modulation
      lightRef.current.intensity += ((1.6 + Math.sin(tRef.current * 2.4) * 0.6) - lightRef.current.intensity) * 0.08
    }

    // slow vertical drift for whole group
    if (groupRef.current) {
      const driftTarget = Math.sin(tRef.current * 0.52) * 0.05
      groupRef.current.position.y += (driftTarget - groupRef.current.position.y) * 0.04
    }

    // apply breathing + expansion
    const targetBase = expanded ? 1.55 : 1.0
    const targetScale = breath * targetBase
    if (innerRef.current) {
      innerRef.current.scale.x += (targetScale - innerRef.current.scale.x) * 0.06
      innerRef.current.scale.y += (targetScale - innerRef.current.scale.y) * 0.06
      innerRef.current.scale.z += (targetScale - innerRef.current.scale.z) * 0.06
    }

    // ripple animation when active
    if (ringRef.current && ripple.current.active) {
      const dt = state.clock.getElapsedTime() - ripple.current.t0
      const progress = Math.min(1, dt / 1.0)
      ringRef.current.scale.setScalar(1 + progress * 4)
      if (ringRef.current.material) ringRef.current.material.opacity = 0.45 * (1 - progress)
      if (progress >= 0.98) ripple.current.active = false
    }
  })

  // memoize lower-detail geometries to reduce GPU and CPU work
  const icosaGeom = useMemo(() => new THREE.IcosahedronGeometry(1.25, 3), [])
  const torusGeom = useMemo(() => new THREE.TorusKnotGeometry(0.9, 0.35, 64, 12), [])
  const geometry = option === 'A' ? icosaGeom : torusGeom

  function triggerRipple() {
    if (ringRef.current && ringRef.current.material) {
      ripple.current.active = true
      ripple.current.t0 = performance.now() / 1000
      ringRef.current.scale.setScalar(1)
      ringRef.current.material.opacity = 0.45
    }
  }

  return (
    <group ref={groupRef} onPointerDown={(e) => { e.stopPropagation(); if (onToggle) onToggle(); triggerRipple(); }}>
      <pointLight ref={lightRef} color="#9b5cf6" distance={8} intensity={1.6} />

      {/* inner: metallic core (memoized geometry) */}
      <mesh ref={innerRef} castShadow receiveShadow geometry={geometry}>
        <meshPhysicalMaterial
          color="#8672ff"
          metalness={0.45}
          roughness={0.18}
          clearcoat={0.28}
          clearcoatRoughness={0.06}
          reflectivity={0.6}
          envMapIntensity={1.0}
          normalScale={new THREE.Vector2(0.6, 0.6)}
        />
      </mesh>

      {/* shell: thin glass-like outer layer for depth */}
      <mesh ref={shellRef} scale={[1.02, 1.02, 1.02]} castShadow receiveShadow renderOrder={1} geometry={geometry}>
        <meshPhysicalMaterial
          color="#2b1a59"
          transmission={0.62}
          thickness={0.9}
          roughness={0.06}
          metalness={0.0}
          clearcoat={0.42}
          clearcoatRoughness={0.02}
          opacity={0.96}
          transparent
          envMapIntensity={1.2}
          ior={1.45}
        />
      </mesh>

      {/* neon edges: additive emissive shell */}
      <mesh ref={edgeRef} scale={[1.045, 1.045, 1.045]} renderOrder={2} geometry={geometry}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.9}
          roughness={1}
          metalness={0}
          transparent
          opacity={0.55}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ripple ring for signature interaction */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
        <ringGeometry args={[1.15, 1.3, 32]} />
        <meshBasicMaterial transparent opacity={0} color="#9b5cf6" blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* reduced-but-rich sparkles for glow without crowding */}
      <Sparkles count={Math.max(8, Math.min(20, Math.round((UI.PARTICLES_COUNT_DEFAULT || 28) * 0.55)))} size={7} scale={2.4} color="#8b5cf6" />
    </group>
  )
}

function Particles({ count, spread = 12 }: { count?: number; spread?: number }) {
  const pointsRef = useRef<any>(null)

  // pick an effective count tuned to device capabilities
  const effectiveCount = useMemo(() => {
    const base = count || UI.PARTICLES_COUNT_DEFAULT || 28
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return base
    const cores = (navigator as any).hardwareConcurrency || 4
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let multiplier = 1
    if (cores <= 2) multiplier = 0.6
    else if (cores <= 4) multiplier = 0.85
    multiplier *= dpr > 1.25 ? 1 : 0.9
    return Math.max(8, Math.round(base * multiplier))
  }, [count])

  const { positions, phases } = React.useMemo(() => {
    const positions = new Float32Array(effectiveCount * 3)
    const phases = new Float32Array(effectiveCount)
    for (let i = 0; i < effectiveCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.35
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, phases }
  }, [effectiveCount, spread])

  // throttle updates (~25fps) to cut CPU
  const lastRef = useRef(0)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!pointsRef.current) return
    if (t - lastRef.current < 0.04) return
    lastRef.current = t
    const attr = pointsRef.current.geometry.attributes.position
    for (let i = 0; i < effectiveCount; i++) {
      const ix = i * 3
      const baseX = positions[ix]
      const baseY = positions[ix + 1]
      const baseZ = positions[ix + 2]
      const ph = phases[i]
      const ox = Math.sin(t * 0.06 + ph) * 0.25
      const oy = Math.cos(t * 0.04 + ph * 0.7) * 0.35
      const oz = Math.sin(t * 0.05 + ph * 0.4) * 0.18
      attr.array[ix + 0] = baseX + ox
      attr.array[ix + 1] = baseY + oy
      attr.array[ix + 2] = baseZ + oz
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} position={[0, -0.6, 0]}>
      <bufferGeometry>
        {/* @ts-ignore: r3f dynamic buffer attribute typing */}
        <bufferAttribute attachObject={["attributes", "position"]} array={positions} itemSize={3} count={effectiveCount} />
      </bufferGeometry>
      {/* slightly smaller points for depth and reduced glare */}
      <pointsMaterial color="#7fb3ff" size={0.02} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </points>
  )
}

function EffectsLoader() {
  const [Effects, setEffects] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    if (typeof window === 'undefined') return

    // Load effects only on capable devices to keep mid devices smooth
    const hw = (navigator as any).hardwareConcurrency || 4
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const canLoad = hw >= 3 && dpr <= 1.5
    if (!canLoad) return

    // dynamically load postprocessing when allowed (runtime-only import)
    // Build systems try to statically analyze `import('literal')`, so avoid
    // embedding a literal module path in the generated code. Use a small
    // runtime indirection to prevent bundlers from resolving the optional
    // dependency at build time.
    const modName = '@react-three' + '/postprocessing'
    try {
      // eslint-disable-next-line no-new-func
      const importer = new Function('m', 'return import(m)')
      importer(modName)
        .then((mod: any) => {
          if (!mounted) return
          setEffects(mod)
        })
        .catch(() => {
          // degrade gracefully if package not present
        })
    } catch (e) {
      // degrade gracefully if dynamic import via Function is not allowed
    }
    return () => {
      mounted = false
    }
  }, [])

  if (!Effects) return null
  const { EffectComposer, Bloom } = Effects
  return (
    // @ts-ignore - runtime-loaded module
    <EffectComposer>
      {/* soft cinematic bloom (tuned for premium glow) */}
      {/* @ts-ignore */}
      <Bloom luminanceThreshold={0.06} luminanceSmoothing={0.68} intensity={0.64} kernelSize={3} />
    </EffectComposer>
  )
}

// Memoize heavy child components to avoid unnecessary re-renders
const OrbMemo = React.memo(Orb)
const ParticlesMemo = React.memo(Particles)
const EffectsLoaderMemo = React.memo(EffectsLoader)

export default function CinematicHero({ option = 'A' }: { option?: 'A' }) {
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLowPerf, setIsLowPerf] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const [isTalking, setIsTalking] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(pointer: coarse), (max-width: 720px)')
    const onChange = () => setIsMobile(mq.matches)
    setIsMobile(mq.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setIsLowPerf(shouldDisable3D())
    } catch (e) {
      setIsLowPerf(false)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setCanSpeak(Boolean((window as any).speechSynthesis))
  }, [])

  // Auto-play a short intro on first visit to create an instant "wow" effect.
  // Only attempt when TTS is available and not on small/coarse-pointer devices.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!canSpeak) return
    if (isMobile) return

    try {
      const key = 'yor:hero-auto-intro-shown'
      const shown = localStorage.getItem(key)
      if (shown) return

      const intro = "Hi, I'm Yor. I craft high-impact product experiences focused on clarity, performance, and recruiter-first storytelling. Check out my projects or quick apply below."
      const delay = 1000 + Math.floor(Math.random() * 1000) // 1-2 seconds

      const timer = setTimeout(() => {
        try {
          speak(intro, setIsTalking)
            .then(() => {
              try { localStorage.setItem(key, '1') } catch (e) {}
            })
            .catch(() => {
              // speaking may be blocked by browser until user gesture; don't mark shown
            })
        } catch (e) {
          // ignore
        }
      }, delay)

      return () => clearTimeout(timer)
    } catch (e) {
      // ignore storage errors
    }
  }, [canSpeak, isMobile])

  return (
    <div className="hero-canvas w-full h-screen relative" style={{ height: '100vh' }}>
      <div className="hero-inner container mx-auto px-6 h-full flex flex-col-reverse md:flex-row items-center justify-center">
        {/* Text column */}
        <div className="hero-text w-full md:w-1/2 lg:w-6/12 text-center md:text-left py-8 md:py-0">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-4">Production-grade web & 3D engineer</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-xl">I deliver fast, reliable frontends and interactive 3D experiences. Available for hire (full-time & contract).</p>

          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start">
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => {
                try { window.dispatchEvent(new CustomEvent('section-focus', { detail: { id: 'contact', section: 'contact' } })) } catch {}
                const el = document.getElementById('contact')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Contact Me
            </button>

            <button
              className="btn btn-outline w-full sm:w-auto"
              onClick={() => {
                try { window.dispatchEvent(new CustomEvent('section-focus', { detail: { id: 'projects', section: 'projects' } })) } catch {}
                const el = document.getElementById('projects')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              View Projects
            </button>

            <a href="/resume.pdf" download className="btn btn-ghost w-full sm:w-auto">
              Download Resume
            </a>

            <a href="https://github.com/yorayriniwnl" target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full sm:w-auto">
              View GitHub
            </a>

            <button
              className="btn btn-ghost w-full sm:w-auto"
              onClick={() => {
                const intro = "Hi, I'm Ayush. I build systems, 3D experiences, and AI-powered applications."
                try { speak(intro, setIsTalking).catch(() => {}) } catch (e) { /* ignore */ }
              }}
              disabled={!canSpeak}
              aria-label="Talk to Me"
            >
              Talk to Me
            </button>
          </div>
        </div>

        {/* Canvas / fallback column */}
        <div className="hero-canvas__canvas-wrapper layer-background w-full md:w-1/2 lg:w-6/12 h-64 sm:h-96 md:h-full" aria-hidden>
          {(isMobile || isLowPerf) ? (
            <div style={{ width: '100%', height: '100%', backgroundImage: `url('${PROFILE_PHOTO_SRC}')`, backgroundSize: 'cover', backgroundPosition: 'center 18%' }} />
          ) : (
            <Canvas
              camera={{ position: [0, 0.18, 5.1], fov: 40 }}
              shadows={false}
              dpr={[1, 1.25]}
              gl={{ antialias: false, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => {
                // disable expensive shadowing for hero; keep cinematic tone mapping
                gl.shadowMap.enabled = false
                gl.toneMapping = THREE.ACESFilmicToneMapping
                gl.toneMappingExposure = 1.0
              }}
            >
              {/* subtle deep-space background */}
              <color attach="background" args={["#030414"]} />
              <fog attach="fog" args={["#030414", 2, 18]} />

              {/* gentle ambient / hemisphere fill for subtle color grading */}
              <hemisphereLight {...({ skyColor: '#7c3aed', groundColor: '#041726', intensity: 0.09 } as any)} />
              <ambientLight intensity={0.06} />

              {/* Key (soft directional) light - warm, low intensity with soft shadows */}
              <directionalLight
                position={[2.5, 4, 3]}
                intensity={0.48}
                color="#fff6e8"
              />

              {/* Rim / edge glow - cool purple-blue to separate the object */}
              <pointLight position={[-2.6, 1.8, 5.5]} intensity={0.36} color="#8b5cf6" distance={10} decay={2} />

              {/* Screen glow: soft cool-blue fill (simulates monitor light, aims at face) */}
              <spotLight
                position={[0.9, 0.2, 2.2]}
                color="#60a5fa"
                intensity={0.8}
                angle={Math.PI / 9}
                penumbra={0.6}
                distance={4}
                decay={2}
                castShadow={false}
              />

              {/* Soft rim light behind avatar to increase face separation */}
              <pointLight position={[1.8, 1.2, -1.6]} color="#9b5cf6" intensity={0.28} distance={6} decay={2} />

              <Suspense fallback={null}>
                <ParticlesMemo />
                <CameraController parallaxIntensity={0.28} minZ={3.6} maxZ={9.5} />
                {/* Avatar replaces the orb as the central focal point */}
                <AvatarModel headRadius={1.0} />
                <Environment preset="studio" background={false} />
                <ContactShadows position={[0, -1.6, 0]} opacity={0.42} width={6} height={6} blur={2.0} far={1.6} />
                <EffectsLoaderMemo />
              </Suspense>

              <OrbitControls enableZoom={false} enablePan={false} enableRotate={!expanded} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.7} />
            </Canvas>
          )}
        </div>
      </div>

      {/* signature overlay: minimal, centered project reveal */}
      {expanded && (
        <div className="signature-panel" role="dialog" aria-modal="true">
          <div className="signature-card animate-hero">
            <h3 className="mb-2">Featured Projects</h3>
            <div className="signature-list">
              {PROJECTS.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  className="signature-item"
                  onClick={() => {
                    try { window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: p.id } })) } catch {}
                    setExpanded(false)
                  }}
                >
                  {p.title}
                </button>
              ))}
            </div>

            <div className="mt-4 signature-actions">
              <button
                className="btn btn-primary"
                onClick={() => { try { window.dispatchEvent(new CustomEvent('section-focus', { detail: { section: 'projects' } })) } catch {} setExpanded(false) }}
              >
                View all
              </button>
              <button className="btn btn-outline ml-2" onClick={() => setExpanded(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* subtle purple/blue overlay gradient for color grading */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(124,58,237,0.04) 0%, rgba(14,165,233,0.02) 100%)',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  )
}
