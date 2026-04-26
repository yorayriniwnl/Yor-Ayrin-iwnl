"use client"
import type { ThreeEvent } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber' // types added below
import * as THREE from 'three'
import { PROJECTS } from '../../lib/data'
import UI from '../../lib/uiConfig'

export default function ProjectNodes({ radius = 4 }: { radius?: number }): JSX.Element {
  const meshRef = useRef<THREE.InstancedMesh | null>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tempMat = useMemo(() => new THREE.Matrix4(), [])
  const tempPos = useMemo(() => new THREE.Vector3(), [])

  const projects = useMemo(() => PROJECTS.filter((p) => p.id !== 'zenith'), [])

  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < projects.length; i++) {
      dummy.position.set(0, 0, 0)
      dummy.scale.set(0.001, 0.001, 0.001)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [projects, dummy])

  const hoverRef = useRef<number | null>(null)
  const clickedRef = useRef<number | null>(null)
  const clickTime = useRef<number>(0)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    for (let i = 0; i < projects.length; i++) {
      const base = (i / projects.length) * Math.PI * 2
      const speed = UI.PROJECT_NODES_BASE_SPEED + (i % 3) * 0.02
      const angle = base + t * speed
      const r = radius + ((i % 2) * 0.6)
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      const y = Math.sin(angle * 0.5 + i) * 0.6 - 0.25

      const isHover = hoverRef.current === i
      const isClick = clickedRef.current === i
      const clickEffect = isClick ? Math.max(0, 1 - (t - clickTime.current) * 2.8) : 0

      const baseScale = 0.2 * (projects[i].featured ? 1.36 : 1)
      const scale = baseScale * (isHover ? 1.38 : 1) * (1 + clickEffect * 0.9)

      dummy.position.set(x, y, z)
      dummy.rotation.set(t * 0.6 + i * 0.12, t * 0.24 + i * 0.08, 0)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const id = e.instanceId
    if (typeof id === 'number') hoverRef.current = id
    document.body.style.cursor = 'pointer'
  }

  const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hoverRef.current = null
    document.body.style.cursor = 'auto'
  }

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const id = e.instanceId
    if (typeof id !== 'number' || !meshRef.current) return

    meshRef.current.getMatrixAt(id, tempMat)
    tempMat.decompose(tempPos, new THREE.Quaternion(), new THREE.Vector3())

    const project = projects[id]
    if (project) {
      window.dispatchEvent(new CustomEvent('focus-panel', { detail: { id: project.id, pos: [tempPos.x, tempPos.y, tempPos.z] } }))
      window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: project.id } }))
    }

    clickedRef.current = id
    clickTime.current = stateClockSeconds()
    setTimeout(() => {
      if (clickedRef.current === id) clickedRef.current = null
    }, 480)
  }

  function stateClockSeconds() {
    return typeof performance !== 'undefined' ? performance.now() / 1000 : Date.now() / 1000
  }

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, projects.length]} onPointerMove={onPointerMove} onPointerOut={onPointerOut} onClick={onClick} castShadow>
      <sphereGeometry args={[0.5, 16, 12]} />
      <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.45} metalness={0.35} roughness={0.45} />
    </instancedMesh>
  )
}
