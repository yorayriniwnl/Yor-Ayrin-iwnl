"use client"
import React, { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type PanelDef = { id: string; title: string; desc?: string; pos: [number, number, number]; size?: [number, number] }

export const PANEL_DEFS: PanelDef[] = [
  { id: 'about', title: 'About', desc: 'Who I am', pos: [-3.2, 1.2, -4.2], size: [2.4, 1.2] },
  { id: 'projects', title: 'Projects', desc: 'Selected work', pos: [0, 1.2, -3.6], size: [2.6, 1.2] },
  { id: 'resume', title: 'Skills', desc: 'Tooling & systems', pos: [3.2, 1.2, -4.2], size: [2.4, 1.2] },
  { id: 'contact', title: 'Contact', desc: 'Say hello', pos: [0, -1.4, -3.2], size: [2.2, 1.0] },
]

export default function Panels(): JSX.Element {
  const groupRef = useRef<THREE.Group | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const { camera, size } = useThree()
  const lastDispatch = useRef<number>(0)
  const dispatchInterval = 1 / 30

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const baseY = PANEL_DEFS[i].pos[1]
      const float = Math.sin(t * (0.6 + i * 0.08) + i) * 0.12
      child.position.y = baseY + float
      child.rotation.y = Math.sin(t * 0.12 + i) * 0.06
    })

    // dispatch screen positions at a throttled interval so the DOM overlay can sync
    const now = state.clock.getElapsedTime()
    if (now - lastDispatch.current >= dispatchInterval) {
      const positions = PANEL_DEFS.map((p, i) => {
        const child = groupRef.current?.children[i]
        const world = new THREE.Vector3()
        if (child) child.getWorldPosition(world)
        else world.set(p.pos[0], p.pos[1], p.pos[2])

        const ndc = world.clone().project(camera)
        const visible = ndc.z > -1 && ndc.z < 1 && ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1
        const x = (ndc.x * 0.5 + 0.5) * size.width
        const y = (-ndc.y * 0.5 + 0.5) * size.height
        return { id: p.id, title: p.title, x, y, visible }
      })

      try {
        window.dispatchEvent(new CustomEvent('panels:positions', { detail: positions }))
      } catch (err) {
        // ignore
      }

      lastDispatch.current = now
    }
  })

  const scrollToId = (id: string) => {
    const el = document.querySelector(`#${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <group ref={groupRef}>
      {PANEL_DEFS.map((p, i) => (
        <group key={p.id} position={p.pos}>
          <mesh>
            <planeGeometry args={[p.size?.[0] ?? 2, p.size?.[1] ?? 1]} />
            <meshStandardMaterial color={hovered === i ? '#1f2a6a' : '#071130'} transparent opacity={0.72} roughness={0.6} metalness={0.05} />
          </mesh>

          {/* Panel DOM is rendered in the React overlay; meshes remain for depth/occlusion */}
        </group>
      ))}
    </group>
  )
}
