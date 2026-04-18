"use client"
import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GridFloor(): JSX.Element {
  const matRef = useRef<THREE.ShaderMaterial | null>(null)

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uClick: { value: new THREE.Vector3(1e5, 1e5, 1e5) },
        uClickPower: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec3 uClick;
        uniform float uClickPower;
        varying float vDisplace;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
          float d = distance(worldPos.xz, uClick.xz);
          float wave = sin((pos.x + pos.z) * 0.18 + uTime * 2.0) * 0.08;
          float pulse = exp(-d * d * 0.02) * uClickPower * sin(uTime * 6.0 - d * 0.22) * 0.45;
          pos.y += wave + pulse;
          vDisplace = pos.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vDisplace;
        varying vec2 vUv;
        void main() {
          vec3 low = vec3(0.04, 0.06, 0.12);
          vec3 high = vec3(0.12, 0.16, 0.24);
          float t = clamp(vDisplace * 2.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(low, high, t);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })
    return mat
  }, [])

  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime()
    if (!matRef.current) matRef.current = material
    matRef.current.uniforms.uTime.value = matRef.current.uniforms.uTime.value + delta
    matRef.current.uniforms.uClickPower.value = Math.max(0, matRef.current.uniforms.uClickPower.value - delta * 1.2)
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    const p = e.point as THREE.Vector3
    if (matRef.current) {
      matRef.current.uniforms.uClick.value.copy(p)
      matRef.current.uniforms.uClickPower.value = 1.0
    }
  }

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
      onPointerDown={handleClick}
      receiveShadow
    >
      <planeGeometry args={[60, 60, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
