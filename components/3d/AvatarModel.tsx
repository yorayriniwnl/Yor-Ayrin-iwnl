"use client"

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getSegmentCount, getDeviceScale } from './devUtils'
import { shouldDisable3D } from './devUtils'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const AvatarModel = function AvatarModel({ headRadius = 0.95 }: { headRadius?: number }) {
  const groupRef = useRef<any>(null)
  const headRef = useRef<any>(null)
  const screenLightRef = useRef<any>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hasGlb, setHasGlb] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
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

  // check whether a Ready Player Me GLB has been placed at /public/avatars/avatar.glb
  useEffect(() => {
    let mounted = true
    if (typeof window === 'undefined') return
    // quick HEAD probe (best-effort) to detect a drop-in GLB
    fetch('/avatars/avatar.glb', { method: 'HEAD', cache: 'no-store' })
      .then((res) => {
        if (!mounted) return
        if (res.ok) {
          // prefer to ensure file size is non-trivial if header available
          const len = Number(res.headers.get('content-length') || 0)
          if (!isNaN(len) && len > 512) setHasGlb(true)
          else if (!res.headers.has('content-length')) setHasGlb(true)
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  // listen for monitor hover events to increase screen glow subtly
  const [monitorHover, setMonitorHover] = useState(false)
  useEffect(() => {
    const handler = (e: Event) => setMonitorHover(Boolean((e as CustomEvent<{hover?: boolean}>).detail?.hover))
    window.addEventListener('monitor-hover', handler as EventListener)
    return () => window.removeEventListener('monitor-hover', handler as EventListener)
  }, [])

  // speaking state (set by TTS events) and viseme amplitude for lip-sync
  const [isSpeaking, setIsSpeaking] = useState(false)
  const ttsIdRef = useRef<number | null>(null)
  const visemeAmpRef = useRef(0)
  const lastVisemeAtRef = useRef(0)

  useEffect(() => {
    const onStart = (event: CustomEvent<{id?: number | null}>) => {
      const id = event.detail?.id ?? null
      ttsIdRef.current = id
      setIsSpeaking(true)
    }
    const onEnd = (event: CustomEvent<{id?: number | null}>) => {
      const id = event.detail?.id ?? null
      // if id is present and doesn't match current, ignore
      if (id !== null && ttsIdRef.current !== null && id !== ttsIdRef.current) return
      ttsIdRef.current = null
      setIsSpeaking(false)
      visemeAmpRef.current = 0
    }
    const onViseme = (event: CustomEvent<{id?: number | null; amplitude?: number}>) => {
      const d = event.detail || {}
      const id = typeof d.id !== 'undefined' ? d.id : null
      const amp = typeof d.amplitude === 'number' ? Math.max(0, Math.min(1, d.amplitude)) : 0.35
      // if an id exists, ignore visemes that don't match the active tts id
      if (id !== null && ttsIdRef.current !== null && id !== ttsIdRef.current) return
      // smooth-ish envelope: keep recent amplitude higher, but allow decay
      visemeAmpRef.current = Math.max(visemeAmpRef.current * 0.55, amp)
      lastVisemeAtRef.current = performance.now()
    }

    window.addEventListener('tts-start', onStart as EventListener)
    window.addEventListener('tts-end', onEnd as EventListener)
    window.addEventListener('tts-viseme', onViseme as EventListener)
    window.addEventListener('tts-error', onEnd as EventListener)
    return () => {
      window.removeEventListener('tts-start', onStart as EventListener)
      window.removeEventListener('tts-end', onEnd as EventListener)
      window.removeEventListener('tts-viseme', onViseme as EventListener)
      window.removeEventListener('tts-error', onEnd as EventListener)
    }
  }, [])

  // smoothing refs
  const posYRef = useRef(-0.45)
  const headRxRef = useRef(0)
  const headRyRef = useRef(0)
  const lightIntensityRef = useRef(1.6)
  const mouthRef = useRef<any>(null)

  // use delta-based smoothing and reduce per-frame allocations
  const lastUpdateRef = useRef(0)
  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current) return
    const t = state.clock.getElapsedTime()

    // throttle heavy updates to ~30fps when possible
    const now = performance.now()
    if (now - lastUpdateRef.current < 33) {
      // still update light softly to avoid visible stutter
      if (screenLightRef.current) screenLightRef.current.intensity = THREE.MathUtils.lerp(screenLightRef.current.intensity || 1, lightIntensityRef.current, Math.min(0.12, delta * 8))
      return
    }
    lastUpdateRef.current = now

    // mouse input (normalized -1..1 from three's state.mouse)
    const mouse = state.mouse || { x: 0, y: 0 }
    const mx = THREE.MathUtils.clamp(mouse.x, -1, 1)
    const my = THREE.MathUtils.clamp(mouse.y, -1, 1)

    // subtle breathing + base tilt
    const targetBreath = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.01
    const baseTilt = -0.03

    // mouse-driven head follow (very subtle)
    const mouseInfluenceX = -my * 0.06 // up / down
    const mouseInfluenceY = mx * 0.12 // left / right

    const idleHeadRx = reducedMotion ? 0 : baseTilt + Math.sin(t * 0.7) * 0.02
    const idleHeadRy = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.01

    let targetHeadRx = idleHeadRx + mouseInfluenceX
    let targetHeadRy = idleHeadRy + mouseInfluenceY

    // speaking adds a subtle head movement to sell talking illusion
    if (isSpeaking && !reducedMotion) {
      const speakRx = Math.sin(t * 10) * 0.02
      const speakRy = Math.sin(t * 7) * 0.03
      targetHeadRx += speakRx
      targetHeadRy += speakRy
    }
    targetHeadRx = THREE.MathUtils.clamp(targetHeadRx, -0.25, 0.25)
    targetHeadRy = THREE.MathUtils.clamp(targetHeadRy, -0.45, 0.45)

    // hover increases screen glow slightly
    const hoverBoost = monitorHover ? 0.6 : 0.0
    const targetLight = reducedMotion ? 1.6 : 1.6 + Math.sin(t * 6.4) * 0.045 + hoverBoost

    // smoothing factor scaled by delta (frame-rate independent)
    const smooth = 1 - Math.exp(-6 * delta)

    // lerp current towards target for smoothness
    posYRef.current = THREE.MathUtils.lerp(posYRef.current, -0.45 + targetBreath, smooth)
    headRxRef.current = THREE.MathUtils.lerp(headRxRef.current, targetHeadRx, smooth)
    headRyRef.current = THREE.MathUtils.lerp(headRyRef.current, targetHeadRy, smooth)
    lightIntensityRef.current = THREE.MathUtils.lerp(lightIntensityRef.current, targetLight, Math.min(0.18, smooth * 1.2))

    groupRef.current.position.y = posYRef.current
    headRef.current.rotation.x = headRxRef.current
    headRef.current.rotation.y = headRyRef.current
    if (screenLightRef.current) screenLightRef.current.intensity = lightIntensityRef.current

    // mouth animation (procedural avatar only) - lerp to target using viseme amplitude
    if (mouthRef.current) {
      const mouthBase = 1
      // decay viseme amplitude if no recent viseme events
      const nowMs = performance.now()
      if (nowMs - lastVisemeAtRef.current > 180) {
        visemeAmpRef.current = THREE.MathUtils.lerp(visemeAmpRef.current, 0, 0.12)
      }

      let mouthOpen = 1
      if (isSpeaking && !reducedMotion) {
        const amp = visemeAmpRef.current
        if (amp > 0.02) {
          mouthOpen = 1 + amp * 0.9
        } else {
          // fallback: subtle periodic movement when speaking but no visemes
          mouthOpen = 1 + Math.abs(Math.sin(t * 12)) * 0.28
        }
      }
      const cur = mouthRef.current.scale.y || mouthBase
      mouthRef.current.scale.y = THREE.MathUtils.lerp(cur, mouthOpen, Math.min(0.22, smooth * 1.4))
    }
  })

  const segments = useMemo(() => getSegmentCount(28), [])

  const deviceScale = useMemo(() => getDeviceScale(), [])

  // disable heavy 3D on constrained devices
  if (shouldDisable3D()) {
    return (
      <group>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[headRadius * 1.02, Math.max(8, Math.round(12 * deviceScale)), Math.max(8, Math.round(12 * deviceScale))]} />
          <meshStandardMaterial color="#f1d1c1" roughness={0.7} />
        </mesh>
      </group>
    )
  }

  // If a GLB exported from Ready Player Me is present, load it and use it instead (robust loader)
  if (hasGlb) {
    return (
      <React.Suspense fallback={null}>
        <GLBAvatarAsync screenLightRef={screenLightRef} isSpeaking={isSpeaking} />
      </React.Suspense>
    )
  }

  return (
    <group ref={groupRef} position={[0, -0.45, 0]}>
      <mesh position={[0, -0.38, 0]} scale={[0.9, 0.8, 0.45]}>
        <boxGeometry args={[1, 1, 0.6]} />
        <meshStandardMaterial color="#0f1724" roughness={0.8} />
      </mesh>

      <mesh ref={headRef} position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[headRadius, segments, segments]} />
        <meshStandardMaterial color="#f1d1c1" roughness={0.62} metalness={0.02} />
      </mesh>

      {/* mouth - subtle procedural mesh animated during speech */}
      <mesh ref={mouthRef} position={[0, 0.54, 0.34]} castShadow>
        <boxGeometry args={[0.16, 0.06, 0.02]} />
        <meshStandardMaterial color="#3b2b22" roughness={0.6} />
      </mesh>

      {/* simple low-cost hair cap (keeps silhouette while avoiding heavy instancing) */}
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[headRadius * 1.06, 12, 8]} />
        <meshStandardMaterial color="#22180f" roughness={0.9} metalness={0} />
      </mesh>
      <pointLight ref={screenLightRef} position={[0, 0.12, -0.26]} color="#7dd3fc" intensity={1.6} distance={2.2} decay={2} />
      {/* soft key light to prioritize face visibility */}
      <pointLight position={[0, 0.6, 1.1]} color="#fff6e8" intensity={0.6} distance={4} decay={1.6} />
    </group>
  )
}

export default React.memo(AvatarModel)

function GLBAvatarAsync({ screenLightRef, isSpeaking }: { screenLightRef: React.RefObject<import("three").DirectionalLight>; isSpeaking?: boolean }) {
  // Async GLTF loader to avoid throwing inside suspense boundaries if load fails
  const [gltf, setGltf] = useState<{ scene: import("three").Group } | null>(null)
  const [err, setErr] = useState(false)
  const groupRef = useRef<import("three").Group>(null)

  useEffect(() => {
    let mounted = true
    const loader = new GLTFLoader()
    try {
      loader.load(
        '/avatars/avatar.glb',
        (g) => {
          if (!mounted) return
          setGltf(g)
        },
        undefined,
        () => {
          if (!mounted) return
          setErr(true)
        }
      )
    } catch (e) {
      setErr(true)
    }
    return () => {
      mounted = false
    }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // subtle head bob when speaking
    const targetRx = isSpeaking ? Math.sin(t * 10) * 0.02 : 0
    const targetRy = isSpeaking ? Math.sin(t * 7) * 0.03 : 0
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x || 0, targetRx, 0.08)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y || 0, targetRy, 0.08)
  })

  useEffect(() => {
    if (!gltf || !gltf.scene) return
    try {
      gltf.scene.traverse((node: THREE.Object3D) => {
        if (!(node instanceof THREE.Mesh) || !node.material) return
        const materials = Array.isArray(node.material) ? node.material : [node.material]
        materials.forEach((mat: THREE.Material) => {
          if (!mat) return
          const material = mat as THREE.MeshStandardMaterial
          if (material.map) {
            try {
              material.map.generateMipmaps = false
              material.map.minFilter = THREE.LinearFilter
              material.map.magFilter = THREE.LinearFilter
              material.map.anisotropy = 1
              material.map.needsUpdate = true
            } catch {}
          }
          if (material.normalMap) material.normalMap = null
          if (material.roughnessMap) material.roughnessMap = null
          if (material.metalnessMap) material.metalnessMap = null
          if (material.emissiveMap) material.emissiveMap = null
          if (material.aoMap) material.aoMap = null
          material.metalness = Math.min(material.metalness ?? 0, 0.0)
          material.roughness = Math.max(material.roughness ?? 0.5, 0.8)
          material.needsUpdate = true
        })
        node.frustumCulled = true
      })
    } catch (err) {
      // best-effort
    }
  }, [gltf])

  if (err || !gltf) return null

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene.clone()} dispose={null} scale={[1.05, 1.05, 1.05]} position={[0, -0.45, 0]} />
      <pointLight ref={screenLightRef} position={[0, 0.12, -0.26]} color="#7dd3fc" intensity={1.8} distance={2.6} decay={2} />
      <pointLight position={[0, 0.6, 1.1]} color="#fff6e8" intensity={0.7} distance={4} decay={1.6} />
    </group>
  )
}
