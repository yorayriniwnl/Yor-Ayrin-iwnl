import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type ThreeRef<T> = { current: T | null | undefined }

type AnimatedMesh = THREE.Object3D & {
  morphTargetInfluences?: number[]
}

type AnimatableMaterial = THREE.Material & {
  emissiveIntensity?: number
}

function randBlinkInterval() {
  return 2200 + Math.random() * 4800 // ms
}

export type AvatarAnimationOptions = {
  groupRef?: ThreeRef<THREE.Object3D>
  headRef?: ThreeRef<THREE.Object3D>
  mouthRef?: ThreeRef<THREE.Object3D>
  leftEyeRef?: ThreeRef<THREE.Object3D>
  rightEyeRef?: ThreeRef<THREE.Object3D>
  screenLightRef?: ThreeRef<THREE.Light>
  screenMatRef?: ThreeRef<AnimatableMaterial>
  glbMouthNodesRef?: ThreeRef<AnimatedMesh[]>
  glbEyeNodesRef?: ThreeRef<THREE.Object3D[]>
  glbBlinkNodesRef?: ThreeRef<AnimatedMesh[]>
  visemeAmpRef?: ThreeRef<number>
  reducedMotion?: boolean
  monitorHover?: boolean
  isSpeaking?: boolean
}

export function useAvatarAnimation(opts: AvatarAnimationOptions) {
  const {
    groupRef,
    headRef,
    mouthRef,
    leftEyeRef,
    rightEyeRef,
    screenLightRef,
    screenMatRef,
    glbMouthNodesRef,
    glbEyeNodesRef,
    glbBlinkNodesRef,
    visemeAmpRef,
    reducedMotion = false,
    monitorHover = false,
    isSpeaking = false,
  } = opts

  const posYRef = useRef(-0.45)
  const headRxRef = useRef(0)
  const headRyRef = useRef(0)
  const lightIntensityRef = useRef(1.6)
  const lastUpdateRef = useRef(0)
  const lastVisemeLocalRef = useRef(0)

  const blinkState = useRef({ active: false, start: 0, next: typeof window !== 'undefined' ? performance.now() + randBlinkInterval() : 0 })

  useEffect(() => {
    // reset blink schedule when reducedMotion toggles
    blinkState.current.next = (typeof window !== 'undefined' ? performance.now() : 0) + randBlinkInterval()
  }, [reducedMotion])

  useFrame((state, delta) => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()

    // throttle heavy updates to ~30fps
    if (now - lastUpdateRef.current < 33) {
      if (screenLightRef?.current) {
        screenLightRef.current.intensity = THREE.MathUtils.lerp(screenLightRef.current.intensity || 1, lightIntensityRef.current, Math.min(0.12, delta * 8))
      }
      return
    }
    lastUpdateRef.current = now

    const t = state.clock.getElapsedTime()

    // mouse input
    const mouse = (state as any).mouse || { x: 0, y: 0 }
    const mx = THREE.MathUtils.clamp(mouse.x, -1, 1)
    const my = THREE.MathUtils.clamp(mouse.y, -1, 1)

    // breathing & idle head movement
    const targetBreath = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.01
    const baseTilt = -0.03
    const mouseInfluenceX = -my * 0.06
    const mouseInfluenceY = mx * 0.12
    const idleHeadRx = reducedMotion ? 0 : baseTilt + Math.sin(t * 0.7) * 0.02
    const idleHeadRy = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.01

    let targetHeadRx = idleHeadRx + mouseInfluenceX
    let targetHeadRy = idleHeadRy + mouseInfluenceY

    if (isSpeaking && !reducedMotion) {
      targetHeadRx += Math.sin(t * 10) * 0.02
      targetHeadRy += Math.sin(t * 7) * 0.03
    }
    targetHeadRx = THREE.MathUtils.clamp(targetHeadRx, -0.25, 0.25)
    targetHeadRy = THREE.MathUtils.clamp(targetHeadRy, -0.45, 0.45)

    const hoverBoost = monitorHover ? 0.6 : 0.0
    const targetLight = reducedMotion ? 1.6 : 1.6 + Math.sin(t * 6.4) * 0.045 + hoverBoost

    const smooth = 1 - Math.exp(-6 * delta)

    posYRef.current = THREE.MathUtils.lerp(posYRef.current, -0.45 + targetBreath, smooth)
    headRxRef.current = THREE.MathUtils.lerp(headRxRef.current, targetHeadRx, smooth)
    headRyRef.current = THREE.MathUtils.lerp(headRyRef.current, targetHeadRy, smooth)
    lightIntensityRef.current = THREE.MathUtils.lerp(lightIntensityRef.current, targetLight, Math.min(0.18, smooth * 1.2))

    if (groupRef?.current) groupRef.current.position.y = posYRef.current
    if (headRef?.current) {
      headRef.current.rotation.x = headRxRef.current
      headRef.current.rotation.y = headRyRef.current
    }
    if (screenLightRef?.current) screenLightRef.current.intensity = lightIntensityRef.current
    try {
      if (screenMatRef?.current) {
        const desired = Math.max(0.6, lightIntensityRef.current * 0.6) + (monitorHover ? 0.6 : 0)
        screenMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(screenMatRef.current.emissiveIntensity || 0.8, desired, Math.min(0.14, smooth * 1.2))
        screenMatRef.current.needsUpdate = true
      }
    } catch (e) {}

    // handle blinking
    let blinkProg = 0
    if (!reducedMotion) {
      const bs = blinkState.current
      if (!bs.active && now >= bs.next) {
        bs.active = true
        bs.start = now
      }
      if (bs.active) {
        const closeDur = 70
        const openDur = 130
        const elapsed = now - bs.start
        if (elapsed <= closeDur) blinkProg = elapsed / closeDur
        else if (elapsed <= closeDur + openDur) blinkProg = 1 - (elapsed - closeDur) / openDur
        else {
          bs.active = false
          bs.next = now + randBlinkInterval()
          blinkProg = 0
        }
      }
    }

    // viseme / mouth amplitude
    const amp = visemeAmpRef?.current || 0

    // apply mouth animation (GLB nodes preferred)
    if (glbMouthNodesRef?.current && glbMouthNodesRef.current.length) {
      for (const node of glbMouthNodesRef.current) {
        try {
          if (node.morphTargetInfluences && node.morphTargetInfluences.length) {
            for (let i = 0; i < node.morphTargetInfluences.length; i++) {
              node.morphTargetInfluences[i] = Math.max(node.morphTargetInfluences[i] || 0, amp * 0.9)
            }
          } else {
            node.scale.y = THREE.MathUtils.lerp(node.scale.y || 1, 1 + amp * 0.6, Math.min(0.22, smooth * 1.4))
          }
        } catch (e) {}
      }
    } else if (mouthRef?.current) {
      const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now()
      // track recent viseme timestamp and decay amplitude when idle
      if (visemeAmpRef?.current && visemeAmpRef.current > 0.001) lastVisemeLocalRef.current = nowMs
      if (nowMs - lastVisemeLocalRef.current > 180) {
        if (visemeAmpRef?.current !== undefined) visemeAmpRef.current = THREE.MathUtils.lerp(visemeAmpRef.current || 0, 0, 0.12)
      }
      let mouthOpen = 1
      if (isSpeaking && !reducedMotion) {
        if (amp > 0.02) mouthOpen = 1 + amp * 0.9
        else mouthOpen = 1 + Math.abs(Math.sin(t * 12)) * 0.28
      }
      const cur = mouthRef.current.scale.y || 1
      mouthRef.current.scale.y = THREE.MathUtils.lerp(cur, mouthOpen, Math.min(0.22, smooth * 1.4))
    }

    // eyes: combine blink + speaking influence
    const speakEyeFactor = 1 - Math.min(0.2, amp * 0.12)
    const blinkFactor = 1 - blinkProg * 0.95
    const finalEyeScale = Math.max(0.05, speakEyeFactor * blinkFactor)

    if (glbEyeNodesRef?.current && glbEyeNodesRef.current.length) {
      for (const node of glbEyeNodesRef.current) {
        try {
          const s = THREE.MathUtils.lerp(node.scale.x || 1, finalEyeScale, Math.min(0.18, smooth * 1.6))
          node.scale.setScalar(s)
        } catch (e) {}
      }
    } else {
      if (leftEyeRef?.current) {
        const curL = leftEyeRef.current.scale.x || 1
        const nextL = THREE.MathUtils.lerp(curL, finalEyeScale, Math.min(0.18, smooth * 1.6))
        leftEyeRef.current.scale.setScalar(nextL)
      }
      if (rightEyeRef?.current) {
        const curR = rightEyeRef.current.scale.x || 1
        const nextR = THREE.MathUtils.lerp(curR, finalEyeScale, Math.min(0.18, smooth * 1.6))
        rightEyeRef.current.scale.setScalar(nextR)
      }
    }

    // blink nodes (if present) - set morph targets or scale
    if (glbBlinkNodesRef?.current && glbBlinkNodesRef.current.length) {
      for (const node of glbBlinkNodesRef.current) {
        try {
          if (node.morphTargetInfluences && node.morphTargetInfluences.length) {
            for (let i = 0; i < node.morphTargetInfluences.length; i++) {
              node.morphTargetInfluences[i] = Math.max(node.morphTargetInfluences[i] || 0, blinkProg * 0.95)
            }
          } else {
            node.scale.y = THREE.MathUtils.lerp(node.scale.y || 1, Math.max(0.02, 1 - blinkProg), 0.3)
          }
        } catch (e) {}
      }
    }
  })
}
