"use client"

import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCanvasActive } from './hooks'
import UI from '../../lib/uiConfig'
import { useAdaptive } from '../ui/AdaptiveProvider'

type Particle = {
  pos: [number, number, number]
  scale: number
  speed: number
  phase: number
}

type Props = { count?: number }

export default function FloatingParticles({ count = UI.PARTICLES_COUNT_DEFAULT }: Props): JSX.Element {
  const meshRef = useRef<THREE.InstancedMesh | null>(null)
  const active = useCanvasActive()

  const effectiveCount = useMemo(() => {
    try {
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
      if (deviceMemory < 2) return Math.min(count, 12)
      if (deviceMemory < 4) return Math.min(count, 20)
    } catch {
      return count
    }

    return count
  }, [count])

  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: effectiveCount }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 50,
      ],
      scale: 0.03 + Math.random() * 0.08,
      speed: 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [effectiveCount])

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 4, 4), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#06b6d4',
        emissive: '#06b6d4',
        emissiveIntensity: UI.PARTICLES_EMISSIVE_INTENSITY,
        roughness: 0.85,
        metalness: 0,
      }),
    []
  )

  useEffect(() => {
    if (!meshRef.current) return

    const dummy = new THREE.Object3D()
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]
      dummy.position.set(particle.pos[0], particle.pos[1], particle.pos[2])
      dummy.scale.set(particle.scale, particle.scale, particle.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [particles])

  const lastFrameRef = useRef(0)
  const minInterval = 1 / 30
  const { reducedMotion, recruiterMode } = useAdaptive()

  useFrame((state) => {
    if (!active || !meshRef.current || reducedMotion || recruiterMode) return

    const now = state.clock.getElapsedTime()
    if (now - lastFrameRef.current < minInterval) return

    const dummy = new THREE.Object3D()
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]
      const y = particle.pos[1] + Math.sin(now * particle.speed + particle.phase) * 0.6
      dummy.position.set(particle.pos[0], y, particle.pos[2])
      dummy.scale.set(particle.scale, particle.scale, particle.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    lastFrameRef.current = now
  })

  return <instancedMesh ref={meshRef} args={[geometry, material, effectiveCount]} frustumCulled />
}
