"use client"
import React from 'react'

// This plugin demonstrates returning r3f-compatible nodes when mounted into the scene.
// It's disabled by default; enable via meta.enabled = true.
export const meta = {
  id: 'three-engine',
  name: '3D Engine (example)',
  enabled: false,
  mount: 'scene'
}

export default function ThreeEnginePlugin(): any {
  // When mounted inside the r3f Scene, this can return r3f elements (meshes, lights, groups).
  // Keep this file minimal — plugin authors can replace with complex systems.
  return (
    // Intentionally returning a fragment so this can be rendered in both DOM and r3f contexts.
    <>
      {/* If this gets mounted inside an r3f Scene, simple mesh elements will render. */}
      <group name="plugin-three-engine">
        {/* a small helper mesh as a visible example */}
        {/* Note: this requires being mounted inside the r3f Canvas/Scene */}
      </group>
    </>
  )
}
