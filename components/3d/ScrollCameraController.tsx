"use client"

import React, { useEffect, useRef, useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shouldDisable3D } from './devUtils'

type AnchorInput = {
  id: string
  cam: [number, number, number]
  lookAt?: [number, number, number]
  onEnter?: () => void
}

export default function ScrollCameraController({
  anchors = [],
  ease = 4,
  onSectionChange,
  mobileReduction = 0.6,
}: {
  anchors?: AnchorInput[]
  ease?: number
  onSectionChange?: (id: string) => void
  mobileReduction?: number
}) {
  const { camera } = useThree()

  const anchorsRef = useRef<{ id: string; cam: THREE.Vector3; lookAt: THREE.Vector3; onEnter?: () => void }[]>([])

  useEffect(() => {
    if (!anchors || anchors.length === 0) {
      anchorsRef.current = [{ id: 'default', cam: camera.position.clone(), lookAt: new THREE.Vector3(0, 0, 0) }]
      return
    }
    anchorsRef.current = anchors.map((a) => ({ id: a.id, cam: new THREE.Vector3(...a.cam), lookAt: new THREE.Vector3(...(a.lookAt ?? [0, 0, 0])), onEnter: a.onEnter }))
  }, [anchors, camera])

  const isLowPerf = typeof window !== 'undefined' ? shouldDisable3D() : true
  const isMobile = typeof window !== 'undefined' ? window.matchMedia && window.matchMedia('(pointer: coarse), (max-width: 720px)').matches : false

  const lastScrollYRef = useRef(0)
  const desiredNormRef = useRef(0)
  const ticking = useRef(false)
  const prevActiveRef = useRef<number | null>(null)

  useEffect(() => {
    if (isLowPerf) return
    const onScroll = () => {
      lastScrollYRef.current = window.scrollY
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          const max = Math.max(document.body.scrollHeight - window.innerHeight, 1)
          desiredNormRef.current = Math.max(0, Math.min(1, lastScrollYRef.current / max))
          ticking.current = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLowPerf])

  useFrame((_, delta) => {
    if (isLowPerf) return
    const anchorsLocal = anchorsRef.current.length ? anchorsRef.current : [{ id: 'default', cam: camera.position.clone(), lookAt: new THREE.Vector3(0, 0, 0) }]
    const n = anchorsLocal.length
    if (n === 1) {
      camera.position.lerp(anchorsLocal[0].cam, Math.min(1, delta * ease))
      camera.lookAt(anchorsLocal[0].lookAt)
      return
    }

    const scaled = desiredNormRef.current * (n - 1)
    const idx = Math.floor(scaled)
    const t = scaled - idx
    const a = anchorsLocal[idx]
    const b = anchorsLocal[Math.min(idx + 1, n - 1)]

    const camTarget = new THREE.Vector3().copy(a.cam).lerp(b.cam, t)
    const lookTarget = new THREE.Vector3().copy(a.lookAt).lerp(b.lookAt, t)

    if (isMobile && mobileReduction > 0 && mobileReduction < 1) {
      camTarget.lerp(camera.position, 1 - mobileReduction)
    }

    camera.position.lerp(camTarget, Math.min(1, delta * ease))

    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    const curLookTarget = dir.add(camera.position)
    curLookTarget.lerp(lookTarget, Math.min(1, delta * ease))
    camera.lookAt(curLookTarget)

    const newIndex = idx
    if (prevActiveRef.current !== newIndex) {
      prevActiveRef.current = newIndex
      const id = anchorsLocal[newIndex].id
      if (typeof onSectionChange === 'function') onSectionChange(id)
      try {
        anchorsLocal[newIndex].onEnter?.()
      } catch (e) {}
    }
  })

  return null
}
