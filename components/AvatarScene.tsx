"use client"

import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlinkTarget {
  mesh:     THREE.SkinnedMesh | THREE.Mesh
  leftIdx:  number
  rightIdx: number
}

// ─── AvatarMesh ───────────────────────────────────────────────────────────────

function AvatarMesh(): React.ReactElement | null {
  const { scene } = useGLTF('/avatars/avatar.glb')

  // ── Collected references ─────────────────────────────────────────────────
  const breathBones   = useRef<THREE.Bone[]>([])
  const blinkTarget   = useRef<BlinkTarget | null>(null)
  const headBone      = useRef<THREE.Bone | null>(null)

  // ── Blink state machine refs (ms-based, no setState) ─────────────────────
  const blinkPhase        = useRef<'idle' | 'closing' | 'opening'>('idle')
  const blinkPhaseStartMs = useRef<number>(0)
  const blinkNextMs       = useRef<number>(0)

  // ── Mouse-follow refs ─────────────────────────────────────────────────────
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)
  const currentRotX = useRef(0)
  const currentRotY = useRef(0)

  // ── Reduced motion ────────────────────────────────────────────────────────
  const reducedMotion = useRef(false)

  useEffect((): (() => void) => {
    // Check reduced motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const onChange = (): void => { reducedMotion.current = mq.matches }
    mq.addEventListener('change', onChange)

    // Scan model for usable nodes
    scene.traverse((node) => {
      if ((node as THREE.Bone).isBone) {
        const bone = node as THREE.Bone
        if (bone.name === 'Spine' || bone.name === 'Chest') {
          breathBones.current.push(bone)
        }
        if (bone.name === 'Head' || bone.name === 'head') {
          headBone.current = bone
        }
      }
      if (!blinkTarget.current && (node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh
        const dict = mesh.morphTargetDictionary
        if (
          dict &&
          typeof dict['eyeBlinkLeft']  === 'number' &&
          typeof dict['eyeBlinkRight'] === 'number' &&
          mesh.morphTargetInfluences
        ) {
          blinkTarget.current = {
            mesh,
            leftIdx:  dict['eyeBlinkLeft'],
            rightIdx: dict['eyeBlinkRight'],
          }
        }
      }
    })

    blinkNextMs.current = performance.now() + randomBlinkInterval()

    // Mouse-follow handler
    const onMouseMove = (e: MouseEvent): void => {
      if (reducedMotion.current) return
      // Map to [-1, +1] centered
      targetRotY.current =  ((e.clientX / window.innerWidth)  - 0.5) * 0.5
      targetRotX.current = -((e.clientY / window.innerHeight) - 0.5) * 0.3
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return (): void => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [scene])

  // ── Per-frame: breathing + blinking + head-follow ─────────────────────────
  useFrame(({ clock }): void => {
    const t     = clock.elapsedTime
    const nowMs = performance.now()

    // ── Breathing ──────────────────────────────────────────────────────────
    if (!reducedMotion.current && breathBones.current.length > 0) {
      const AMPLITUDE = 0.008
      const offset    = AMPLITUDE * Math.sin((2 * Math.PI * (t * 1000)) / 3000)
      for (const bone of breathBones.current) {
        bone.scale.y = 1 + offset
      }
    }

    // ── Head follow ────────────────────────────────────────────────────────
    const head = headBone.current
    if (head && !reducedMotion.current) {
      // Idle sway layered on top of mouse-follow
      const idleX = Math.sin(t * 0.7) * 0.012
      const idleY = Math.sin(t * 0.5) * 0.008

      const LERP = 0.04  // smoothing: ~4% per frame = buttery 60 fps drift
      currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, targetRotX.current + idleX, LERP)
      currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, targetRotY.current + idleY, LERP)

      head.rotation.x = currentRotX.current
      head.rotation.y = currentRotY.current
    }

    // ── Blinking ───────────────────────────────────────────────────────────
    const bt = blinkTarget.current
    if (bt?.mesh.morphTargetInfluences) {
      const inf = bt.mesh.morphTargetInfluences
      if (blinkPhase.current === 'idle') {
        if (nowMs >= blinkNextMs.current) {
          blinkPhase.current = 'closing'
          blinkPhaseStartMs.current = nowMs
        }
      } else if (blinkPhase.current === 'closing') {
        const progress = Math.min((nowMs - blinkPhaseStartMs.current) / 80, 1)
        inf[bt.leftIdx] = inf[bt.rightIdx] = progress
        if (progress >= 1) {
          blinkPhase.current = 'opening'
          blinkPhaseStartMs.current = nowMs
        }
      } else {
        const progress = Math.min((nowMs - blinkPhaseStartMs.current) / 80, 1)
        inf[bt.leftIdx] = inf[bt.rightIdx] = 1 - progress
        if (progress >= 1) {
          inf[bt.leftIdx] = inf[bt.rightIdx] = 0
          blinkPhase.current = 'idle'
          blinkNextMs.current = nowMs + randomBlinkInterval()
        }
      }
    }
  })

  return <primitive object={scene} dispose={null} />
}

// ─── Camera position adjuster (inside Canvas) ─────────────────────────────────

function CameraRig(): null {
  const { camera } = useThree()
  useEffect((): void => {
    camera.position.set(0, 0.55, 2.6)
    camera.lookAt(0, 0.5, 0)
  }, [camera])
  return null
}

// ─── Scene contents ───────────────────────────────────────────────────────────

function SceneContents(): React.ReactElement {
  return (
    <>
      <CameraRig />

      {/* Three-point lighting rig */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={0.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Rim light for depth */}
      <pointLight position={[-3, 3, -3]} intensity={0.4} color="#c7d2fe" />
      {/* Under-fill to avoid harsh shadows */}
      <pointLight position={[0, -1, 2]}  intensity={0.2} color="#fef3c7" />

      <Suspense fallback={null}>
        <AvatarMesh />
      </Suspense>

      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.25}
        blur={2.5}
        far={4}
        resolution={256}
        color="#000022"
      />

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={4.0}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        makeDefault
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface AvatarSceneProps {
  /** Canvas height in px. Default 520. */
  height?: number
}

export default function AvatarScene({ height = 520 }: AvatarSceneProps): React.ReactElement {
  return (
    <div
      style={{ width: '100%', height, borderRadius: 'inherit', overflow: 'hidden' }}
      aria-label="Interactive 3D avatar — drag to rotate"
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.55, 2.6], fov: 42 }}
        gl={{
          toneMapping:      THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          antialias:        true,
          powerPreference:  'high-performance',
        }}
        dpr={[1, 2]}
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <SceneContents />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/avatars/avatar.glb')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomBlinkInterval(): number {
  return 3000 + Math.random() * 3000
}
