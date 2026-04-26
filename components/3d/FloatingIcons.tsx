"use client"
import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAdaptive } from '../ui/AdaptiveProvider'

type IconDef = { pos: [number, number, number]; speed: number; phase: number; baseScale: number }

export default function FloatingIcons({ count = 6 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const icons: IconDef[] = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: [ (Math.random() - 0.5) * 8, 0.8 + Math.random() * 2.2, -3 - Math.random() * 6 ],
      speed: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      baseScale: 0.18 + Math.random() * 0.26,
    }))
  }, [count])

  const geom = useMemo(() => new THREE.OctahedronGeometry(1, 0), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f472b6', emissive: '#f472b6', emissiveIntensity: 0.6, roughness: 0.6 }), [])

  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < icons.length; i++) {
      const p = icons[i]
      dummy.position.set(p.pos[0], p.pos[1], p.pos[2])
      dummy.scale.set(p.baseScale, p.baseScale, p.baseScale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [icons, dummy])

  const hoverRef = useRef<number | null>(null)
  const clickPulse = useRef<number>(0)
  const clickedId = useRef<number | null>(null)
  const { reducedMotion, recruiterMode } = useAdaptive()

  useFrame((state) => {
    if (!meshRef.current) return
    // Respect recruiter mode and reduced-motion preference to avoid distracting movement
    if (recruiterMode || reducedMotion) return
    const t = state.clock.getElapsedTime()
    for (let i = 0; i < icons.length; i++) {
      const p = icons[i]
      const bob = Math.sin(t * p.speed + p.phase) * 0.25
      const rot = (t * 0.2 + i) * 0.6
      const isHover = hoverRef.current === i
      const isClick = clickedId.current === i
      const pulse = isHover ? 1.0 : 0.0
      const clickEffect = isClick ? Math.max(0, 1 - (t - (clickPulse.current || 0)) * 2.5) : 0

      dummy.position.set(p.pos[0], p.pos[1] + bob, p.pos[2])
      dummy.rotation.set(rot, rot * 0.6, rot * 0.3)
      const base = p.baseScale
      const scale = base * (1 + pulse * 0.28 + clickEffect * 0.8)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const onPointerMove = (e: import("@react-three/fiber").ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const id = e.instanceId
    if (typeof id === 'number') hoverRef.current = id
    document.body.style.cursor = 'pointer'
  }

  const onPointerOut = (e: import("@react-three/fiber").ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hoverRef.current = null
    document.body.style.cursor = 'auto'
  }

  const onClick = (e: import("@react-three/fiber").ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    const id = e.instanceId
    if (typeof id === 'number') {
      clickedId.current = id
      clickPulse.current = e.timeStamp || performance.now()
      // quick visual feedback; clear after short delay
      setTimeout(() => {
        if (clickedId.current === id) clickedId.current = null
      }, 420)
    }
  }

  return (
    <instancedMesh ref={meshRef} args={[geom, mat, icons.length]} onPointerMove={onPointerMove} onPointerOut={onPointerOut} onClick={onClick} frustumCulled>
    </instancedMesh>
  )
}
