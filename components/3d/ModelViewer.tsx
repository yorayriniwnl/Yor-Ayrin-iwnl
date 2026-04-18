"use client"

import React, { Suspense, memo } from "react";
import { shouldDisable3D } from './devUtils'
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls, useGLTF, Html } from "@react-three/drei";

type Props = {
  src?: string;
  className?: string;
};

const ModelInner = memo(function ModelInner({ src }: { src: string }) {
  // cast to any to avoid strict typing issues with various glTF exports
  const gltf: any = useGLTF(src);
  return <primitive object={gltf.scene} dispose={null} />;
});

function ModelViewer({ src = "/avatars/avatar.glb", className }: Props) {
  const lowPerf = shouldDisable3D()

  if (lowPerf) {
    return (
      <div className={className} style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/avatar-fallback.svg" alt="avatar" style={{ width: '80%', height: 'auto', maxWidth: 420, objectFit: 'contain' }} />
      </div>
    )
  }

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        shadows={false}
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 2.2], fov: 45 }}
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#ffffff", "#444444", 0.15]} />
        <directionalLight
          castShadow={false}
          position={[2, 5, 2]}
          intensity={0.6}
        />

        <Suspense fallback={<Html center>Loading model…</Html>}>
          <Center>
            <ModelInner src={src} />
          </Center>
          <Environment preset="studio" background={false} />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  )
}

export default memo(ModelViewer);
