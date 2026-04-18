"use client"

import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  initial?: [number, number, number]
  target?: [number, number, number]
  lookAt?: [number, number, number]
  duration?: number
  delay?: number
}

export default function CoderCamera({
  initial = [1.2, 1.65, 5.0],
  target = [0.7, 1.2, 3.2],
  lookAt = [0.1, 0.6, -0.3],
  duration = 1.2,
  delay = 0.2,
}: Props) {
  const { camera } = useThree()
  const startAt = useRef<number | null>(null)
  const animDone = useRef(false)

  useEffect(() => {
    // initialize camera at the starting position and orientation
    camera.position.set(initial[0], initial[1], initial[2])
    camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]))
    camera.updateProjectionMatrix()
  }, [])

  useFrame((state) => {
    if (animDone.current) return
    if (startAt.current === null) startAt.current = state.clock.getElapsedTime()
    const t = state.clock.getElapsedTime() - startAt.current - delay
    if (t <= 0) return
    const progress = Math.min(1, t / Math.max(0.0001, duration))
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3)

    const from = new THREE.Vector3(initial[0], initial[1], initial[2])
    const to = new THREE.Vector3(target[0], target[1], target[2])
    const lerped = new THREE.Vector3().lerpVectors(from, to, eased)
    camera.position.copy(lerped)

    camera.lookAt(new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]))
    camera.updateProjectionMatrix()

    if (progress >= 1) animDone.current = true
  })

  return null
}
