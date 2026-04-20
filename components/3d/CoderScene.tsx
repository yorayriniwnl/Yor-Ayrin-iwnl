"use client"

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
// HairSystem and FacialHair removed to simplify avatar rendering for hiring-focused site
import { getSegmentCount, getDeviceScale, shouldDisable3D } from './devUtils'
import { PROFILE_PHOTO_SRC } from '../../lib/profilePhoto'

// Pull AvatarRig out as a memoized top-level component to avoid re-definition
const AvatarRig = React.memo(function AvatarRig({ headRadius = 0.95 }: { headRadius?: number }) {
  const avatarRef = useRef<any>(null)
  const headRef = useRef<any>(null)
  const screenLightRef = useRef<any>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(mq.matches)
    setReducedMotion(mq.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  const segments = useMemo(() => getSegmentCount(28), [])
  const deviceScale = useMemo(() => getDeviceScale(), [])

  // smoothing refs
  const posYRef = useRef(0.9)
  const headRxRef = useRef(0)
  const headRyRef = useRef(0)
  const lightIntensityRef = useRef(2.0)

  useFrame((state) => {
    if (!avatarRef.current || !headRef.current) return
    const t = state.clock.getElapsedTime()

    // targets
    const baseTilt = -0.03
    const targetBreath = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.01
    const targetHeadRx = reducedMotion ? 0 : baseTilt + Math.sin(t * 0.7) * 0.02
    const targetHeadRy = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.01
    const targetLight = reducedMotion ? 2.0 : 2.0 + Math.sin(t * 6.4) * 0.05

    // lerp for smoothness
    posYRef.current = THREE.MathUtils.lerp(posYRef.current, 0.9 + targetBreath, 0.08)
    headRxRef.current = THREE.MathUtils.lerp(headRxRef.current, targetHeadRx, 0.08)
    headRyRef.current = THREE.MathUtils.lerp(headRyRef.current, targetHeadRy, 0.08)
    lightIntensityRef.current = THREE.MathUtils.lerp(lightIntensityRef.current, targetLight, 0.12)

    avatarRef.current.position.y = posYRef.current
    headRef.current.rotation.x = headRxRef.current
    headRef.current.rotation.y = headRyRef.current
    if (screenLightRef.current) screenLightRef.current.intensity = lightIntensityRef.current
  })

  const hairCount = Math.max(32, Math.round(240 * deviceScale))
  const beardCount = Math.max(16, Math.round(220 * deviceScale))

  return (
    <group ref={avatarRef} position={[0, 0.9, -0.15]}>
      {/* Torso */}
      <mesh position={[0, -0.28, 0]} scale={[0.9, 0.8, 0.45]}>
        <boxGeometry args={[1, 1, 0.6]} />
        <meshStandardMaterial color="#071026" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[headRadius, segments, segments]} />
        <meshStandardMaterial color="#f1d1c1" roughness={0.62} metalness={0.02} />
      </mesh>

      {/* simple low-cost hair cap (keeps silhouette while avoiding heavy instancing) */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[headRadius * 1.06, 12, 8]} />
        <meshStandardMaterial color="#22180f" roughness={0.9} metalness={0} />
      </mesh>

      {/* Local monitor light positioned relative to avatar group so flicker feels connected */}
      <pointLight ref={screenLightRef} position={[0, 0.16, -0.37]} color="#7dd3fc" intensity={2.0} distance={2.4} decay={2} />
      <spotLight position={[0, 0.15, -0.2]} angle={0.9} penumbra={0.5} intensity={0.8} color="#7dd3fc" />
    </group>
  )
})

const CoderScene = function CoderScene({ height = 460 }: { height?: number }) {
  const headRadius = 0.95

  // Memoize keyboard key meshes to avoid re-creating on every render
  const keys = useMemo(() => {
    const elems: JSX.Element[] = []
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 12; c++) {
        const x = -0.46 + c * 0.082 + (r % 2) * 0.018
        const z = 0.01 + r * 0.045
        elems.push(
          <mesh key={`k-${r}-${c}`} position={[x, 0.02, z]}>
            <boxGeometry args={[0.076, 0.03, 0.036]} />
            <meshStandardMaterial color="#e6eef6" roughness={0.6} />
          </mesh>
        )
      }
    }
    return elems
  }, [])

  // If device is constrained, avoid WebGL and show a lightweight fallback
  if (typeof window !== 'undefined' && shouldDisable3D()) {
    return (
      <div style={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #05060a, #02030a)' }}>
        <img src={PROFILE_PHOTO_SRC} alt="Portrait of Ayush Roy" style={{ width: '60%', height: 'auto', objectFit: 'contain' }} />
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height }} className="rounded overflow-hidden">
      <Canvas shadows={false} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: 'low-power' }} camera={{ position: [0, 1.35, 3.0], fov: 38 }}>
        <color attach="background" args={["#05060a"]} />

        {/* Soft ambient base + hemisphere for a premium photographic feel */}
        <ambientLight intensity={0.16} />
        <hemisphereLight args={["#9fb7ff", "#040515", 0.26]} />

        {/* Cinematic rim lights — purple accents to outline silhouette */}
        <spotLight position={[2.2, 1.9, -0.6]} angle={0.6} penumbra={0.5} intensity={0.55} color="#8b5cf6" />
        <spotLight position={[-2.2, 1.7, -0.6]} angle={0.6} penumbra={0.5} intensity={0.48} color="#7c3aed" />
        <spotLight position={[0, 1.9, 1.0]} angle={1.0} penumbra={0.6} intensity={0.45} color="#8b5cf6" />

        {/* Monitor / screen fill handled per-avatar for flicker */}

        <Suspense fallback={null}>
          {/* Desk */}
          <mesh position={[0, 0.4, -0.3]}>
            <boxGeometry args={[2.0, 0.06, 1.1]} />
            <meshStandardMaterial color="#071026" roughness={0.8} />
          </mesh>

          {/* Monitor */}
          <group position={[0, 1.05, -0.6]}>
            <mesh position={[0, -0.22, 0]}> {/* stand */}
              <boxGeometry args={[0.06, 0.06, 0.06]} />
              <meshStandardMaterial color="#0b0f14" />
            </mesh>

            <mesh position={[0, 0, 0.04]}> {/* monitor body */}
              <boxGeometry args={[1.4, 0.82, 0.06]} />
              <meshStandardMaterial color="#03060a" roughness={0.2} />
            </mesh>

            <mesh position={[0, 0, 0.08]}> {/* screen (emissive) */}
              <planeGeometry args={[1.32, 0.74]} />
              <meshStandardMaterial emissive={'#7dd3fc'} emissiveIntensity={1.2} color="#02232b" />
            </mesh>
          </group>

          {/* Keyboard */}
          <group position={[0, 0.42, -0.25]}>
            <mesh position={[0, -0.02, 0]}>
              <boxGeometry args={[0.98, 0.04, 0.28]} />
              <meshStandardMaterial color="#0f1724" roughness={0.7} />
            </mesh>

            {keys}
          </group>

          {/* Chair back (simple) */}
          <mesh position={[0, 0.18, -0.45]}>
            <boxGeometry args={[0.58, 0.5, 0.15]} />
            <meshStandardMaterial color="#0b1220" />
          </mesh>

          {/* Avatar (low-poly head + torso) with subtle animation */}
          <AvatarRig headRadius={headRadius} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default React.memo(CoderScene)
