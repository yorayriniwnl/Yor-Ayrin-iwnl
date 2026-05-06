"use client"
import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAdaptive } from '../ui/AdaptiveProvider'

function isPerspectiveCamera(camera: THREE.Camera): camera is THREE.PerspectiveCamera {
  return 'fov' in camera
}

export default function EntryController(): null {
  const { camera } = useThree()
  const { reducedMotion, recruiterMode } = useAdaptive()
  const introRef = useRef(false)
  const startRef = useRef(0)
  const duration = 1200 // ms
  const startPos = useRef(new THREE.Vector3(0, 6, 26))
  const endPos = useRef(new THREE.Vector3(0, 0, 12))
  const startFov = 75
  const endFov = 55

  useEffect(() => {
    const handler = (e: Event) => {
      if (reducedMotion || recruiterMode) {
        camera.position.copy(endPos.current)
        if (isPerspectiveCamera(camera)) {
          camera.fov = endFov
          camera.updateProjectionMatrix()
        }
        window.dispatchEvent(new CustomEvent('intro-end'))
        return
      }

      // Normal cinematic start
      introRef.current = true
      startRef.current = performance.now()
      camera.position.set(startPos.current.x, startPos.current.y, startPos.current.z)
      if (isPerspectiveCamera(camera)) {
        camera.fov = startFov
        camera.updateProjectionMatrix()
      }
    }

    window.addEventListener('intro-start', handler as EventListener)
    return () => window.removeEventListener('intro-start', handler as EventListener)
  }, [camera, reducedMotion, recruiterMode])

  useFrame(() => {
    if (!introRef.current) return
    const now = performance.now()
    let t = (now - startRef.current) / duration
    if (t > 1) t = 1
    // easeOutCubic
    const ease = 1 - Math.pow(1 - t, 3)

    // lerp position
    camera.position.lerpVectors(startPos.current, endPos.current, ease)
    camera.lookAt(0, 0, 0)

    // lerp fov
    if (isPerspectiveCamera(camera)) {
      camera.fov = THREE.MathUtils.lerp(startFov, endFov, ease)
      camera.updateProjectionMatrix()
    }

    if (t >= 1) {
      introRef.current = false
      window.dispatchEvent(new CustomEvent('intro-end'))
    }
  })

  return null
}
