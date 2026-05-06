"use client"
import type { ThreeEvent } from '@react-three/fiber'

import React, { useRef, useMemo, useState, useCallback, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber' // types added below
import { Html } from '@react-three/drei'
import ScrollCameraController from './ScrollCameraController'
import * as THREE from 'three'
import type { Mesh } from 'three'
import type { Project } from '../../lib/projects'

type Node = {
  id: string
  project: Project
  pos: THREE.Vector3
}

function clamp(v: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, v))
}

export default function ProjectUniverse({ projects = [], height = 560 }: { projects?: Project[]; height?: number }) {
  const count = projects.length
  const cols = Math.max(1, Math.min(4, Math.ceil(Math.sqrt(count))))
  const rows = Math.max(1, Math.ceil(count / cols))
  const spacingX = 7
  const spacingY = 5
  const layerDepth = 10

  const nodes = useMemo<Node[]>(() => {
    return projects.map((p, i) => {
      const col = i % cols
      const row = Math.floor(i / cols) % rows
      const layer = Math.floor(i / (cols * rows))
      const x = (col - (cols - 1) / 2) * spacingX
      const y = ((rows - 1) / 2 - row) * spacingY
      const z = -layer * layerDepth + (Math.random() * 2 - 1) * 0.5
      return { id: String(p.id), project: p, pos: new THREE.Vector3(x, y, z) }
    })
  }, [projects, cols, rows])

  const [focus, setFocus] = useState<THREE.Vector3 | null>(null)

  const handleFocus = useCallback((pos: THREE.Vector3) => {
    setFocus(pos.clone())
  }, [])

  // simple container to allow sizing from React; Canvas is client-only so this component is safe for dynamic import
  return (
    <div style={{ width: '100%', height }}>
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />

        <Suspense fallback={null}>
          <UniverseNodes nodes={nodes} onFocus={handleFocus} />
        </Suspense>

        {/* Scroll-driven camera: anchors per row */}
        <ScrollCameraController
          anchors={useMemo(() => {
            return Array.from({ length: rows }).map((_, r) => {
              const y = ((rows - 1) / 2 - r) * spacingY
              return { id: `row-${r}`, cam: [0, y, 30] as [number, number, number], lookAt: [0, y, 0] as [number, number, number] }
            })
          }, [rows, spacingY])}
          ease={4}
          onSectionChange={(id) => {
            // optional: could dispatch analytics or highlight UI
            const evt = new CustomEvent('scroll-section-change', { detail: { id } })
            try { window.dispatchEvent(evt) } catch {}
          }}
        />
      </Canvas>
    </div>
  )
}

function UniverseNodes({ nodes, onFocus }: { nodes: Node[]; onFocus: (pos: THREE.Vector3) => void }) {
  return (
    <>
      {nodes.map((n, i) => (
        <Suspense key={n.id} fallback={<NodePlaceholder pos={n.pos} />}>
          <ProjectNode key={n.id} project={n.project} pos={n.pos} index={i} onFocus={onFocus} />
        </Suspense>
      ))}
    </>
  )
}

function NodePlaceholder({ pos }: { pos: THREE.Vector3 }) {
  return (
    <mesh position={pos.toArray()}>
      <planeGeometry args={[3.6, 2.2]} />
      <meshStandardMaterial color="#111" roughness={0.7} />
    </mesh>
  )
}

const ProjectNode = React.memo(function ProjectNode({
  project,
  pos,
  index,
  onFocus,
}: {
  project: Project
  pos: THREE.Vector3
  index: number
  onFocus: (pos: THREE.Vector3) => void
}) {
  const meshRef = useRef<Mesh | null>(null)
  const hoveredRef = useRef(false)
  const [hovered, setHovered] = useState(false)

  const texture = useLoader(
    THREE.TextureLoader,
    project.screenshots?.[0] ?? '/project-placeholder.svg',
  )

  useFrame((state, delta) => {
    const m = meshRef.current
    if (!m) return

    // smooth position (in case of any reflow), plus gentle bob
    const t = state.clock.getElapsedTime()
    const targetX = pos.x + Math.sin(t * 0.6 + index) * 0.18
    const targetY = pos.y + Math.cos(t * 0.4 + index) * 0.15
    m.position.x += (targetX - m.position.x) * Math.min(1, delta * 8)
    m.position.y += (targetY - m.position.y) * Math.min(1, delta * 8)
    m.position.z += (pos.z - m.position.z) * Math.min(1, delta * 8)

    // rotate slowly
    m.rotation.y += delta * 0.12

    // depth-based scale
    const dist = state.camera.position.distanceTo(m.position)
    const depthScale = Math.min(1.6, Math.max(0.7, 18 / Math.max(6, dist)))
    const hoverBoost = hoveredRef.current ? 1.45 : 1
    const targetScale = depthScale * hoverBoost * 0.9
    const cur = m.scale.x || 1
    const s = THREE.MathUtils.lerp(cur, targetScale, Math.min(1, delta * 8))
    m.scale.setScalar(s)
  })

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hoveredRef.current = true
    setHovered(true)
  }, [])

  const onPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    hoveredRef.current = false
    setHovered(false)
  }, [])

  const onClick = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const p = meshRef.current?.position
    if (p) onFocus(p)
  }, [onFocus])

  return (
    <mesh ref={meshRef} position={pos.toArray()} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
      <planeGeometry args={[3.6, 2.2, 1, 1]} />
      <meshStandardMaterial map={texture} toneMapped={false} />

      {hovered ? (
        <Html center style={{ pointerEvents: 'none', transform: 'translateY(-8px)' }}>
          <div style={{ background: 'rgba(0,0,0,0.78)', color: 'white', padding: 6, borderRadius: 6, fontSize: 12, whiteSpace: 'nowrap' }}>
            {project.title}
          </div>
        </Html>
      ) : null}
    </mesh>
  )
})

function CameraController({ focus, rows, spacingY }: { focus: THREE.Vector3 | null; rows: number; spacingY: number }) {
  const { camera } = useThree()
  const desired = useRef(new THREE.Vector3(0, 0, 30))

  useEffect(() => {
    // no-op placeholder so we have a client mount to read scroll
  }, [])

  useFrame((_, delta) => {
    // map global scroll position to camera Y
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    const norm = clamp(window.scrollY / maxScroll, 0, 1)
    const targetY = (norm - 0.5) * rows * spacingY

    const targetZ = focus ? 12 : 30
    desired.current.x = 0
    desired.current.y += (targetY - desired.current.y) * Math.min(1, delta * 4)
    desired.current.z += (targetZ - desired.current.z) * Math.min(1, delta * 4)

    camera.position.lerp(desired.current, Math.min(1, delta * 3))
    if (focus) camera.lookAt(focus)
    else camera.lookAt(0, 0, 0)
  })

  return null
}
