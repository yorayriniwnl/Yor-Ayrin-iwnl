"use client"
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useCanvasActive } from './hooks'
import UI from '../../lib/uiConfig'

type Props = { count?: number }

export default function Starfield({ count = UI.STAR_COUNT_DEFAULT }: Props): JSX.Element {
  const geomRef = useRef<THREE.BufferGeometry | null>(null)
  const active = useCanvasActive()

  const effectiveCount = useMemo(() => {
    try {
      const dm = (navigator as any).deviceMemory || 4
      if (dm < 2) return Math.min(count, 220)
      if (dm < 4) return Math.min(count, 420)
    } catch (e) {}
    return count
  }, [count])

  const positions = useMemo(() => {
    const arr = new Float32Array(effectiveCount * 3)
    for (let i = 0; i < effectiveCount; i++) {
      const r = 8 + Math.random() * 60
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    return arr
  }, [effectiveCount])

  const last = useRef<number>(0)
  const minInterval = 1 / 30 // throttle to ~30fps for heavy updates

  useFrame((state) => {
    if (!active) return
    if (!geomRef.current) return
    const now = state.clock.getElapsedTime()
    const diff = now - (last.current || 0)
    if (diff < minInterval) return
    geomRef.current.rotateY(diff * UI.STAR_ROTATION_SPEED)
    last.current = now
  })

  return (
    <points>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={UI.STAR_POINT_SIZE} sizeAttenuation color="#ffffff" transparent opacity={UI.STAR_OPACITY} depthWrite={false} />
    </points>
  )
}
