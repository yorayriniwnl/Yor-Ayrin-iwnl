"use client"
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import LoaderBridge from './LoaderBridge'
import EntryController from './EntryController'

export default function SpaceCanvas(): JSX.Element {
  return (
    <div className="space-canvas" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        {/* lightweight bridge + controller outside Suspense */}
        <LoaderBridge />
        <EntryController />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
