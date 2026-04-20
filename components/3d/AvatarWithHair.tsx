"use client"

import React from 'react'
import { Canvas } from '@react-three/fiber'
import AvatarModel from './AvatarModel'

export default function AvatarWithHair({ height = 380 }: { height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      <Canvas camera={{ position: [0, 1.4, 2.6], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 4]} intensity={0.6} />

        <React.Suspense fallback={null}>
          <AvatarModel headRadius={0.95} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
