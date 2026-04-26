"use client"
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  initialPosition?: [number, number, number]
  parallaxIntensity?: number
  minZ?: number
  maxZ?: number
  zoomSensitivity?: number
}

type FocusDetail = {
  position?: [number, number, number]
}

export default function CameraController({
  initialPosition = [0, 0, 6],
  parallaxIntensity = 0.42,
  minZ = 3.2,
  maxZ = 12,
  zoomSensitivity = 0.0022,
}: Props) {
  const { camera } = useThree()
  const desiredPos = useRef(new THREE.Vector3(...initialPosition))
  const desiredLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const pointer = useRef({ x: 0, y: 0 })
  const targetZ = useRef(initialPosition[2])
  const focusTimeout = useRef<number | null>(null)
  // reusable vectors to avoid allocations each frame
  const tmpTarget = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())
  const currentLookAt = useRef(new THREE.Vector3())

  useEffect(() => {
    camera.position.set(...initialPosition)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useEffect(() => {
    function onMove(e: MouseEvent) {
      // only track when pointer is precise to avoid noisy touch input
      const nx = (e.clientX / window.innerWidth - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * -2
      pointer.current.x = nx
      pointer.current.y = ny
    }

    function onWheel(e: WheelEvent) {
      targetZ.current = THREE.MathUtils.clamp(
        targetZ.current + e.deltaY * zoomSensitivity,
        minZ,
        maxZ,
      )
    }

    function onFocus(e: Event) {
      const d = (e as CustomEvent<FocusDetail>).detail || {}
      if (focusTimeout.current) window.clearTimeout(focusTimeout.current)

      if (d.position && Array.isArray(d.position) && d.position.length === 3) {
        const [x, y, z] = d.position
        desiredLookAt.current.set(x, y, z)
        desiredPos.current.set(x, y + 0.28, z + Math.max(1.8, camera.position.z - 2.0))
        targetZ.current = desiredPos.current.z
      } else {
        // soft zoom-in to center
        desiredLookAt.current.set(0, 0, 0)
        targetZ.current = Math.max(minZ, camera.position.z - 2.0)
      }

      focusTimeout.current = window.setTimeout(() => {
        focusTimeout.current = null
      }, 1400)
    }

    // only enable mouse parallax on fine-pointer devices
    const isFinePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: fine)').matches
    if (isFinePointer) window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('focus-project', onFocus)
    window.addEventListener('section-focus', onFocus)

    return () => {
      if (isFinePointer) window.removeEventListener('mousemove', onMove)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('focus-project', onFocus)
      window.removeEventListener('section-focus', onFocus)
      if (focusTimeout.current) window.clearTimeout(focusTimeout.current)
    }
  }, [camera, minZ, maxZ, zoomSensitivity])

  useFrame((state, delta) => {
    // subtle parallax offset
    const px = pointer.current.x * parallaxIntensity
    const py = pointer.current.y * parallaxIntensity

    // reuse temp vector
    tmpTarget.current.set(desiredPos.current.x + px, desiredPos.current.y + py, targetZ.current)

    // frame-rate independent smoothing (lower value = more inertia / smoother)
    const smoothing = 1 - Math.exp(-3.6 * delta)
    camera.position.lerp(tmpTarget.current, smoothing)

    // smooth lookAt lerp using reusable vectors
    camera.getWorldDirection(currentLookAt.current)
    currentLookAt.current.add(camera.position)
    tmpLook.current.copy(desiredLookAt.current)
    tmpLook.current.x += pointer.current.x * parallaxIntensity * 0.30
    tmpLook.current.y += pointer.current.y * parallaxIntensity * -0.20
    currentLookAt.current.lerp(tmpLook.current, smoothing)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
