"use client";

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Tracks pointer position relative to the canvas and writes normalized coords to pointerRef
function PointerTracker({ pointerRef }: { pointerRef: React.MutableRefObject<{ x: number; y: number }>; }) {
  // Attach pointer tracking to the r3f canvas element to avoid global listeners and
  // reduce unnecessary events. Updates are written to a ref (no rerenders).
  const { gl } = useThree();

  useEffect(() => {
    const el = gl?.domElement;
    if (!el) return;

    let raf = 0;
    let last = { x: 0, y: 0 };

    const handler = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      last.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      last.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      if (!raf) raf = requestAnimationFrame(() => {
        pointerRef.current.x = last.x;
        pointerRef.current.y = last.y;
        raf = 0;
      });
    };

    el.addEventListener('pointermove', handler, { passive: true });
    return () => {
      el.removeEventListener('pointermove', handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [gl, pointerRef]);

  return null;
}

function PremiumOrb({ pointerRef, reducedMotion = false }: { pointerRef: React.MutableRefObject<{ x: number; y: number }>; reducedMotion?: boolean; }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const baseScale = 1.0;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const px = pointerRef.current?.x || 0;
    const py = pointerRef.current?.y || 0;
    const targetY = px * 0.35;
    const targetX = py * 0.35;
    // smooth follow
    meshRef.current.rotation.x += (targetX - meshRef.current.rotation.x) * 0.08;
    meshRef.current.rotation.y += (targetY - meshRef.current.rotation.y) * 0.08;
    // gentle continuous spin
    const spin = reducedMotion ? 0.02 : 0.12;
    meshRef.current.rotation.y += delta * spin;
    // subtle pulse
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.03;
    meshRef.current.scale.setScalar(baseScale * pulse);
    if (glowRef.current) glowRef.current.scale.setScalar(baseScale * pulse * 1.6);
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshPhysicalMaterial color="#9be7ff" emissive="#4dd0e1" emissiveIntensity={0.95} metalness={0.6} roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.05, 24, 24]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

function CameraController({ pointerRef, reduced = false }: { pointerRef: React.MutableRefObject<{ x: number; y: number }>; reduced?: boolean }) {
  const { camera } = useThree();
  const initial = useRef<THREE.Vector3 | null>(null);
  const target = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!initial.current) initial.current = camera.position.clone();
  }, [camera]);

  useFrame((_, delta) => {
    if (!initial.current) return;
    const px = pointerRef.current.x || 0;
    const py = pointerRef.current.y || 0;
    // small parallax offsets
    const offsetX = px * 0.8; // horizontal parallax
    const offsetY = py * 0.5; // vertical parallax
    const lerpFactor = reduced ? 0.04 : 0.08; // smoothness
    target.current.set(initial.current.x + offsetX, initial.current.y + offsetY, initial.current.z);
    camera.position.lerp(target.current, lerpFactor);
    // always look near origin for cinematic framing
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  });

  return null;
}

function Starfield({ count = 300, radius = 25, depth = 20 }: { count?: number; radius?: number; depth?: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);

  // Compute an effective particle count based on device capabilities to reduce work on weaker devices
  const effectiveCount = useMemo(() => {
    let c = count || 300;
    if (typeof window !== 'undefined') {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cores = Math.max(2, Math.min(navigator.hardwareConcurrency || 4, 12));
      const vw = Math.max(320, Math.min(window.innerWidth || 1024, 1920));
      if (vw < 640) c = Math.round(c * 0.45);
      if (cores <= 4) c = Math.round(c * 0.7);
      c = Math.max(60, Math.round(c * (1 / dpr)));
    }
    return c;
  }, [count]);

  const positions = useMemo(() => {
    const len = effectiveCount * 3;
    const arr = new Float32Array(len);
    for (let i = 0; i < effectiveCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = (radius || 25) * (0.2 + Math.random() * 0.8);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = (Math.random() - 0.5) * (depth || 20);
      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [effectiveCount, radius, depth]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02; // slow rotate
    pointsRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.06) * 0.45; // subtle bob
  });

  return (
    <points ref={pointsRef} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dfefff" size={0.028} sizeAttenuation={true} depthWrite={false} transparent opacity={0.9} />
    </points>
  );
}

function BasicScene({ height = 400 }: { height?: number }) {
  const pointerRef = useRef({ x: 0, y: 0 }) as React.MutableRefObject<{ x: number; y: number }>;
  const reducedMotion = false;

  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height: `${height}px`,
      borderRadius: 8,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #071025 0%, #050617 35%, #02030a 100%)',
    }),
    [height]
  );

  // adaptive particle count chosen to balance quality and performance
  const particleCount = useMemo(() => {
    if (typeof window === 'undefined') return 300;
    const vw = window.innerWidth || 1024;
    if (vw < 640) return 100;
    if (vw < 1024) return 220;
    return 320;
  }, []);

  return (
    <div style={containerStyle}>
      <Canvas style={{ background: 'transparent' }} dpr={[1, 1.3]} camera={{ position: [6, 3, 6], fov: 50 }}>
        {/* Ambient base: very soft fill to lift shadows */}
        <ambientLight intensity={0.12} />

        {/* Hemisphere for subtle sky/ground tone */}
        <hemisphereLight args={["#1b2540", "#08111b", 0.18]} />

        {/* Main soft directional key light (cinematic) */}
        <directionalLight position={[6, 5, 6]} intensity={0.9} color="#fff7f0" />

        {/* Rim/back light to separate object from background */}
        <directionalLight position={[-5, 2, -6]} intensity={0.45} color="#8befff" />

        {/* Subtle spotlight for a highlight/punch */}
        <spotLight position={[-2, 4, 5]} angle={0.6} penumbra={0.4} intensity={0.28} color="#9be7ff" />
        <Suspense fallback={null}>
          <Starfield count={particleCount} radius={35} depth={30} />
          {/* shared pointer ref for interaction */}
          <PremiumOrb pointerRef={pointerRef} reducedMotion={reducedMotion} />
          <PointerTracker pointerRef={pointerRef} />
          <CameraController pointerRef={pointerRef} reduced={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default React.memo(BasicScene);

