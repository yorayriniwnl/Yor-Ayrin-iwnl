"use client"
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PANEL_DEFS } from './Panels'

type Target = { pos: THREE.Vector3; lookAt: THREE.Vector3 }

function cameraTargetFromPanel(p: number[]): Target {
  const [x, y, z] = p
  // Camera sits in front (positive z) and offsets a bit towards the panel
  const pos = new THREE.Vector3(x * 0.6, y * 0.6, 6)
  const lookAt = new THREE.Vector3(x, y, z)
  return { pos, lookAt }
}

export default function CameraController(): null {
  const { camera, gl } = useThree()
  const targetRef = useRef<Target>({ pos: camera.position.clone(), lookAt: new THREE.Vector3(0, 0, 0) })
  const lerpSpeed = 0.08
  const introActiveRef = useRef(false)

  // Free navigation refs
  const freeActiveRef = useRef(false)
  const freePosRef = useRef(camera.position.clone())
  const yawRef = useRef(0)
  const pitchRef = useRef(0)
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0))
  const keysRef = useRef<Record<string, boolean>>({})
  const pointerLockedRef = useRef(false)

  // boundaries for exploration (configurable)
  const BOUNDS = {
    minX: -40,
    maxX: 40,
    minY: -6,
    maxY: 28,
    minZ: -40,
    maxZ: 40,
  }

  useEffect(() => {
    const onFocus = (e: Event) => {
      const ev = e as CustomEvent
      const data = ev?.detail
      if (!data) return
      const panel = PANEL_DEFS.find((p) => p.id === data.id)
      if (panel) {
        targetRef.current = cameraTargetFromPanel(panel.pos)
      } else if (data.pos) {
        targetRef.current = cameraTargetFromPanel(data.pos)
      }
    }

    const onSection = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      if (!id) return
      const panel = PANEL_DEFS.find((p) => p.id === id)
      if (panel) targetRef.current = cameraTargetFromPanel(panel.pos)
      else if (id === 'home') targetRef.current = { pos: new THREE.Vector3(0, 0, 12), lookAt: new THREE.Vector3(0, 0, 0) }
    }

    window.addEventListener('focus-panel', onFocus as EventListener)
    window.addEventListener('section-focus', onSection as EventListener)

    // toggle free navigation mode
    const onToggleFree = (ev: Event) => {
      const evt = ev as CustomEvent
      const active = !!evt?.detail?.active
      freeActiveRef.current = active
      if (active) {
        // initialize free pos/rotation from current camera
        freePosRef.current.copy(camera.position)
        const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
        yawRef.current = euler.y
        pitchRef.current = euler.x
        // attempt pointer lock on the canvas (must be in user gesture context)
        try { (gl.domElement as HTMLElement).requestPointerLock() } catch (err) { /* ignore */ }
      } else {
        // exit pointer lock if locked
        try { if (document.pointerLockElement === gl.domElement) document.exitPointerLock() } catch (err) { /* ignore */ }
      }
    }

    window.addEventListener('explore-3d-toggle', onToggleFree as EventListener)

    const onIntroStart = () => {
      introActiveRef.current = true
    }

    const onIntroEnd = () => {
      introActiveRef.current = false
    }

    window.addEventListener('intro-start', onIntroStart as EventListener)
    window.addEventListener('intro-end', onIntroEnd as EventListener)

    // pointer lock change
    const onPointerLockChange = () => {
      pointerLockedRef.current = document.pointerLockElement === gl.domElement
    }
    document.addEventListener('pointerlockchange', onPointerLockChange)

    // keyboard handlers for WASD movement
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true
      // escape should disable free mode
      if (e.code === 'Escape' && freeActiveRef.current) {
        freeActiveRef.current = false
        try { if (document.pointerLockElement === gl.domElement) document.exitPointerLock() } catch {}
        window.dispatchEvent(new CustomEvent('explore-3d-toggle', { detail: { active: false } }))
      }
    }
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false }

    // pointermove (mouse look) — respects pointer lock movementX/movementY
    const onPointerMove = (e: PointerEvent) => {
      if (!freeActiveRef.current) return
      const mvx = (e as any).movementX || 0
      const mvy = (e as any).movementY || 0
      const sensitivity = 0.0024
      yawRef.current -= mvx * sensitivity
      pitchRef.current -= mvy * sensitivity
      // clamp pitch
      const limit = Math.PI / 2 - 0.05
      pitchRef.current = Math.max(-limit, Math.min(limit, pitchRef.current))
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('pointermove', onPointerMove as EventListener)

    return () => {
      window.removeEventListener('focus-panel', onFocus as EventListener)
      window.removeEventListener('section-focus', onSection as EventListener)
      window.removeEventListener('intro-start', onIntroStart as EventListener)
      window.removeEventListener('intro-end', onIntroEnd as EventListener)
      window.removeEventListener('explore-3d-toggle', onToggleFree as EventListener)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('pointermove', onPointerMove as EventListener)
    }
  }, [])

  useEffect(() => {
    // Observe page sections and emit section-focus events
    const ids = ['home', 'about', 'projects', 'resume', 'contact', 'steam']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.dispatchEvent(new CustomEvent('section-focus', { detail: { id: entry.target.id } }))
          }
        })
      },
      { threshold: 0.45 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useFrame((state, delta) => {
    if (introActiveRef.current) return

    // Free navigation active: WASD + mouse look
    if (freeActiveRef.current) {
      // compute movement vector from keys
      const forward = !!keysRef.current['KeyW']
      const back = !!keysRef.current['KeyS']
      const left = !!keysRef.current['KeyA']
      const right = !!keysRef.current['KeyD']
      const up = !!keysRef.current['Space'] || !!keysRef.current['KeyE']
      const down = !!keysRef.current['ShiftLeft'] || !!keysRef.current['KeyQ']

      // direction basis from yaw
      const yaw = yawRef.current
      const pitch = pitchRef.current
      const forwardVec = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize()
      const rightVec = new THREE.Vector3(Math.sin(yaw + Math.PI / 2), 0, Math.cos(yaw + Math.PI / 2)).normalize()

      const move = new THREE.Vector3(0, 0, 0)
      if (forward) move.add(forwardVec)
      if (back) move.sub(forwardVec)
      if (right) move.add(rightVec)
      if (left) move.sub(rightVec)
      if (up) move.y += 1
      if (down) move.y -= 1

      if (move.lengthSq() > 0) move.normalize()

      // smooth acceleration
      const moveSpeed = 8.0 // units per second
      const accel = 40.0
      const desiredVel = move.multiplyScalar(moveSpeed)
      // velocity += (desired - vel) * (1 - exp(-accel*dt)) approximate lerp
      velocityRef.current.lerp(desiredVel, Math.min(1, 1 - Math.exp(-accel * delta)))

      // integrate
      const deltaPos = velocityRef.current.clone().multiplyScalar(delta)
      freePosRef.current.add(deltaPos)

      // apply bounds
      freePosRef.current.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, freePosRef.current.x))
      freePosRef.current.y = Math.max(BOUNDS.minY, Math.min(BOUNDS.maxY, freePosRef.current.y))
      freePosRef.current.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, freePosRef.current.z))

      // smooth camera position
      camera.position.lerp(freePosRef.current, Math.min(1, lerpSpeed * 1.5))

      // smooth camera rotation from yaw/pitch
      const e = new THREE.Euler(pitch, yaw, 0, 'YXZ')
      const q = new THREE.Quaternion().setFromEuler(e)
      camera.quaternion.slerp(q, Math.min(1, lerpSpeed * 2))
      camera.updateProjectionMatrix()
      return
    }

    // default behavior: follow targetRef (panels)
    const t = state.clock.getElapsedTime()
    const mouse = state.mouse

    const desiredPos = targetRef.current.pos.clone()
    // add slight parallax from mouse
    const px = mouse.x * 0.8
    const py = -mouse.y * 0.45
    desiredPos.x += px
    desiredPos.y += py

    // lerp camera position
    camera.position.lerp(desiredPos, lerpSpeed)

    // smooth lookAt
    const desiredLookAt = targetRef.current.lookAt.clone()
    const currentLook = new THREE.Vector3()
    camera.getWorldDirection(currentLook)
    // simply lerp a target vector and call lookAt
    const lookVec = new THREE.Vector3().lerpVectors(new THREE.Vector3().addVectors(camera.position, currentLook), desiredLookAt, lerpSpeed)
    camera.lookAt(lookVec)
    camera.updateProjectionMatrix()
  })

  return null
}
