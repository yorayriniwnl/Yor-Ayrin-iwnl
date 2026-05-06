import React, { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Mesh } from "three";

type Skill = {
  id: string;
  label: string;
  color?: string;
  radius?: number;
  speed?: number;
  size?: number;
};

const DEFAULT_SKILLS: Skill[] = [
  { id: "react", label: "React", color: "#61dafb" },
  { id: "typescript", label: "TypeScript", color: "#3178c6" },
  { id: "three", label: "Three.js", color: "#c24bff" },
  { id: "next", label: "Next.js", color: "#000000" },
  { id: "tailwind", label: "Tailwind", color: "#38bdf8" },
  { id: "framer", label: "Framer Motion", color: "#ff0055" },
  { id: "ai", label: "AI", color: "#f59e0b" },
  { id: "node", label: "Node.js", color: "#83cd29" },
];

export default function SkillsGalaxy({ skills = DEFAULT_SKILLS, height = 420 }: { skills?: Skill[]; height?: number }) {
  const [focus, setFocus] = useState<THREE.Vector3 | null>(null);

  const handleFocus = useCallback((pos: THREE.Vector3) => {
    setFocus(pos.clone());
  }, []);

  return (
    <div style={{ width: "100%", height }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 55 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Galaxy skills={skills} onFocus={handleFocus} />
        <CameraFocus target={focus} />
        <OrbitControls enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

function Galaxy({ skills, onFocus }: { skills: Skill[]; onFocus: (pos: THREE.Vector3) => void }) {
  // reuse a single sphere geometry for performance
  const sphereGeom = useMemo(() => new THREE.SphereGeometry(1, 24, 24), []);

  // precompute per-node constants so children receive stable props
  const nodes = useMemo(() => {
    return skills.map((s, i) => {
      const radius = s.radius ?? 4 + i * 1.2;
      const speed = s.speed ?? 0.2 + ((i % 5) * 0.03 + i * 0.01);
      const angle = Math.random() * Math.PI * 2;
      const size = s.size ?? 0.6;
      return { ...s, radius, speed, angle, size };
    });
  }, [skills]);

  return (
    <group>
      {nodes.map((n) => (
        <SkillNode key={n.id} geom={sphereGeom} node={n} onFocus={onFocus} />
      ))}
    </group>
  );
}

const SkillNode = React.memo(function SkillNode({
  geom,
  node,
  onFocus,
}: {
  geom: THREE.BufferGeometry;
  node: Skill & { angle: number; radius: number; speed: number; size: number };
  onFocus: (pos: THREE.Vector3) => void;
}) {
  const meshRef = useRef<Mesh | null>(null);
  const angleRef = useRef<number>(node.angle);
  const scaleRef = useRef<number>(1);
  const hoveredRef = useRef<boolean>(false);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    angleRef.current += delta * node.speed;
    const x = Math.cos(angleRef.current) * node.radius;
    const z = Math.sin(angleRef.current) * node.radius;
    mesh.position.set(x, 0, z);
    mesh.rotation.y += delta * 0.5;

    const targetScale = hoveredRef.current ? 1.4 : 1;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, Math.min(1, delta * 8));
    mesh.scale.setScalar(node.size * scaleRef.current);
  });

  const onPointerOver = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    hoveredRef.current = true;
    setHovered(true);
  }, []);

  const onPointerOut = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    hoveredRef.current = false;
    setHovered(false);
  }, []);

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const pos = meshRef.current?.position;
      if (pos) onFocus(pos);
    },
    [onFocus]
  );

  return (
    <mesh ref={meshRef} geometry={geom} onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick} castShadow receiveShadow>
      <meshStandardMaterial color={node.color ?? "#999"} roughness={0.4} metalness={0.2} />
      {hovered ? (
        <Html center style={{ pointerEvents: "none", transform: "translateY(-8px)" }}>
          <div style={{ background: "rgba(0,0,0,0.75)", color: "white", padding: 6, borderRadius: 6, fontSize: 12, whiteSpace: "nowrap" }}>
            {node.label}
          </div>
        </Html>
      ) : null}
    </mesh>
  );
});

function CameraFocus({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const desired = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const t = Math.min(1, delta * 4);
    const targetPos = target ?? new THREE.Vector3(0, 0, 0);
    targetRef.current.lerp(targetPos, t);

    desired.current.copy(targetRef.current).add(new THREE.Vector3(0, 0, target ? 6 : 14));
    camera.position.lerp(desired.current, Math.min(1, delta * 3));
    camera.lookAt(targetRef.current);
  });

  return null;
}
