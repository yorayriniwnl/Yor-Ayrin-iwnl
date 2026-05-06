"use client"

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  Component,
  type ReactNode,
  type ErrorInfo,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, OrbitControls, OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'

// ─── Data ─────────────────────────────────────────────────────────────────────

type NodeType = 'skill' | 'project' | 'concept'

interface GraphNode {
  id: string
  name: string
  type: NodeType
}

interface GraphEdge {
  source: string
  target: string
  rel: string
}

interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export const GRAPH: GraphData = {
  nodes: [
    { id: 'react',      name: 'React',          type: 'skill'   },
    { id: 'typescript', name: 'TypeScript',      type: 'skill'   },
    { id: 'threejs',    name: 'Three.js',        type: 'skill'   },
    { id: 'python',     name: 'Python',          type: 'skill'   },
    { id: 'opencv',     name: 'OpenCV',          type: 'skill'   },
    { id: 'sklearn',    name: 'Scikit-Learn',    type: 'skill'   },
    { id: 'streamlit',  name: 'Streamlit',       type: 'skill'   },
    { id: 'zenith',     name: 'Yor Zenith',          type: 'project' },
    { id: 'ai-detector',name: 'Yor AI vs Real Image',     type: 'project' },
    { id: 'mentor',     name: 'Mentor-Mentee',   type: 'project' },
    { id: 'solar',      name: 'Solar Planning',  type: 'concept' },
    { id: 'ml',         name: 'Machine Learning',type: 'concept' },
    { id: 'systems',    name: 'Systems Design',  type: 'concept' },
  ],
  edges: [
    { source: 'zenith',      target: 'react',      rel: 'uses' },
    { source: 'zenith',      target: 'typescript', rel: 'uses' },
    { source: 'zenith',      target: 'threejs',    rel: 'uses' },
    { source: 'zenith',      target: 'solar',      rel: 'uses' },
    { source: 'zenith',      target: 'systems',    rel: 'uses' },
    { source: 'ai-detector', target: 'python',     rel: 'uses' },
    { source: 'ai-detector', target: 'opencv',     rel: 'uses' },
    { source: 'ai-detector', target: 'sklearn',    rel: 'uses' },
    { source: 'ai-detector', target: 'streamlit',  rel: 'uses' },
    { source: 'ai-detector', target: 'ml',         rel: 'uses' },
    { source: 'mentor',      target: 'python',     rel: 'uses' },
    { source: 'mentor',      target: 'systems',    rel: 'uses' },
  ],
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NODE_CONFIG: Record<NodeType, { radius: number; color: string; emissive: string }> = {
  skill:   { radius: 0.18, color: '#6366f1', emissive: '#818cf8' },
  project: { radius: 0.24, color: '#06b6d4', emissive: '#22d3ee' },
  concept: { radius: 0.14, color: '#f59e0b', emissive: '#fbbf24' },
}

const REPULSION   = 0.002
const SPRING_REST = 2.5
const SPRING_K    = 0.01
const DAMPING     = 0.85
const FREEZE_AT   = 120

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Distribute N points evenly over a unit sphere using Fibonacci lattice */
function fibonacciSphere(n: number, scale = 3.5): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y     = 1 - (i / (n - 1)) * 2
    const r     = Math.sqrt(1 - y * y)
    const theta = golden * i
    points.push(new THREE.Vector3(Math.cos(theta) * r * scale, y * scale, Math.sin(theta) * r * scale))
  }
  return points
}

/** Build a Set of neighbor IDs for each node id */
function buildAdjacency(nodes: GraphNode[], edges: GraphEdge[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>()
  nodes.forEach(n => adj.set(n.id, new Set()))
  edges.forEach(e => {
    adj.get(e.source)?.add(e.target)
    adj.get(e.target)?.add(e.source)
  })
  return adj
}

// ─── Error boundary ───────────────────────────────────────────────────────────

interface EBState { hasError: boolean }
class GraphErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false }
  static getDerivedStateFromError(): EBState { return { hasError: true } }
  componentDidCatch(_err: Error, _info: ErrorInfo) {}
  render() {
    return this.state.hasError ? null : this.props.children
  }
}

// ─── OrbitControls wrapper that pauses autoRotate on user interaction ─────────

interface SmartOrbitControlsProps {
  autoRotateSpeed: number
}

function SmartOrbitControls({ autoRotateSpeed }: SmartOrbitControlsProps) {
  const controlsRef = useRef<any>(null)
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pause = useCallback(() => {
    if (!controlsRef.current) return
    controlsRef.current.autoRotate = false
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (controlsRef.current) controlsRef.current.autoRotate = true
    }, 3000)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate
      autoRotateSpeed={autoRotateSpeed}
      enablePan={false}
      enableZoom
      minDistance={4}
      maxDistance={18}
      onStart={pause}
    />
  )
}

// ─── Force simulation state ───────────────────────────────────────────────────

interface SimState {
  positions:  THREE.Vector3[]
  velocities: THREE.Vector3[]
  frame:      number
  frozen:     boolean
}

function makeSimState(nodes: GraphNode[]): SimState {
  const initial = fibonacciSphere(nodes.length)
  return {
    positions:  initial.map(p => p.clone()),
    velocities: nodes.map(() => new THREE.Vector3()),
    frame:      0,
    frozen:     false,
  }
}

// ─── Scene graph ──────────────────────────────────────────────────────────────

interface SceneProps {
  graph:      GraphData
  onNodeHover:(id: string | null) => void
  onNodeClick:(id: string | null) => void
  hovered:    string | null
  selected:   string | null
}

const _tmpA = new THREE.Vector3()
const _tmpB = new THREE.Vector3()
const _tmpF = new THREE.Vector3()

function GraphScene({ graph, onNodeHover, onNodeClick, hovered, selected }: SceneProps) {
  const { nodes, edges } = graph
  const nodeCount  = nodes.length
  const indexMap   = new Map(nodes.map((n, i) => [n.id, i]))
  const adjacency  = buildAdjacency(nodes, edges)

  // Per-node mesh refs
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(nodeCount).fill(null))

  // Edge geometry
  const lineRef  = useRef<THREE.LineSegments | null>(null)

  // Simulation state (mutable, lives across frames)
  const sim = useRef<SimState>(makeSimState(nodes))

  // ── Force simulation ──────────────────────────────────────────────────────
  useFrame(() => {
    const { positions, velocities, frozen, frame } = sim.current

    if (!frozen) {
      // 1. Repulsion between all pairs
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          _tmpF.subVectors(positions[i], positions[j])
          const distSq = Math.max(_tmpF.lengthSq(), 0.01)
          const mag    = REPULSION / distSq
          _tmpF.normalize().multiplyScalar(mag)
          velocities[i].add(_tmpF)
          velocities[j].sub(_tmpF)
        }
      }

      // 2. Spring attraction along edges
      for (const edge of edges) {
        const si = indexMap.get(edge.source)
        const ti = indexMap.get(edge.target)
        if (si === undefined || ti === undefined) continue
        _tmpA.copy(positions[ti]).sub(positions[si])
        const dist      = _tmpA.length()
        const stretch   = dist - SPRING_REST
        const force     = stretch * SPRING_K
        _tmpF.copy(_tmpA).normalize().multiplyScalar(force)
        velocities[si].add(_tmpF)
        velocities[ti].sub(_tmpF)
      }

      // 3. Integrate + damp
      for (let i = 0; i < nodeCount; i++) {
        velocities[i].multiplyScalar(DAMPING)
        positions[i].add(velocities[i])
      }

      sim.current.frame = frame + 1
      if (sim.current.frame >= FREEZE_AT) sim.current.frozen = true
    }

    // ── Update mesh positions ──────────────────────────────────────────────
    for (let i = 0; i < nodeCount; i++) {
      const mesh = meshRefs.current[i]
      if (!mesh) continue
      mesh.position.copy(positions[i])
    }

    // ── Update edge positions ──────────────────────────────────────────────
    const line = lineRef.current
    if (line) {
      const posAttr = line.geometry.attributes.position as THREE.BufferAttribute
      let ptr = 0
      for (const edge of edges) {
        const si = indexMap.get(edge.source)
        const ti = indexMap.get(edge.target)
        if (si === undefined || ti === undefined) continue
        const a = positions[si]
        const b = positions[ti]
        posAttr.setXYZ(ptr++, a.x, a.y, a.z)
        posAttr.setXYZ(ptr++, b.x, b.y, b.z)
      }
      posAttr.needsUpdate = true
    }

    // ── Highlight / dim materials ──────────────────────────────────────────
    const neighborSet = selected ? adjacency.get(selected) ?? new Set<string>() : new Set<string>()

    for (let i = 0; i < nodeCount; i++) {
      const mesh = meshRefs.current[i]
      if (!mesh) continue
      const mat  = mesh.material as THREE.MeshStandardMaterial
      const id   = nodes[i].id
      const cfg  = NODE_CONFIG[nodes[i].type]
      const isHov  = id === hovered
      const isSel  = id === selected
      const isNbr  = neighborSet.has(id)
      const isDimmed = selected !== null && !isSel && !isNbr

      // Scale
      const targetScale = isHov ? 1.5 : isSel || isNbr ? 1.3 : 1.0
      mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.14)

      // Emissive
      const targetEmissiveI = isHov ? 0.3 : isSel ? 0.22 : isNbr ? 0.14 : 0.0
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissiveI, 0.14)

      // Opacity / dim
      const targetOpacity = isDimmed ? 0.2 : 1.0
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.14)
      mat.transparent = true
    }
  })

  // ── Edge geometry (static vertex count, positions updated each frame) ──────
  const edgePositions = new Float32Array(edges.length * 2 * 3)

  // ── Node event handlers ───────────────────────────────────────────────────
  const handlePointerEnter = useCallback((id: string) => () => {
    onNodeHover(id)
    document.body.style.cursor = 'pointer'
  }, [onNodeHover])

  const handlePointerLeave = useCallback(() => {
    onNodeHover(null)
    document.body.style.cursor = 'default'
  }, [onNodeHover])

  const handleClick = useCallback((id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onNodeClick(id)
  }, [onNodeClick])

  return (
    <>
      {/* Nodes */}
      {nodes.map((node, i) => {
        const cfg = NODE_CONFIG[node.type]
        return (
          <mesh
            key={node.id}
            ref={el => { meshRefs.current[i] = el }}
            onPointerEnter={handlePointerEnter(node.id)}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick(node.id)}
          >
            <sphereGeometry args={[cfg.radius, 20, 20]} />
            <meshStandardMaterial
              color={cfg.color}
              emissive={cfg.emissive}
              emissiveIntensity={0}
              roughness={0.28}
              metalness={0.55}
              transparent
              opacity={1}
            />

            {/* Tooltip */}
            {hovered === node.id && (
              <Html
                center
                distanceFactor={6}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                <div
                  style={{
                    background: 'rgba(10,9,6,0.92)',
                    border: `1px solid ${cfg.color}55`,
                    borderRadius: '8px',
                    padding: '7px 11px',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(8px)',
                    boxShadow: `0 4px 24px ${cfg.color}22`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#f0e8d8',
                      fontFamily: 'var(--ds-font-display, "Playfair Display", serif)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {node.name}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '3px',
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: cfg.color,
                      fontFamily: 'var(--ds-font-mono, "DM Mono", monospace)',
                    }}
                  >
                    {node.type}
                  </span>
                </div>
              </Html>
            )}
          </mesh>
        )
      })}

      {/* Edges */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[edgePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#334155" transparent opacity={0.4} />
      </lineSegments>
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

interface KnowledgeGraph3DProps {
  graph?: GraphData
}

function KnowledgeGraph3DInner({ graph = GRAPH }: KnowledgeGraph3DProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const handleNodeClick = useCallback((id: string | null) => {
    setSelected(prev => (prev === id ? null : id ?? null))
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '520px',
        borderRadius: 'var(--ds-radius-lg, 1.35rem)',
        overflow: 'hidden',
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.07) 0%, transparent 65%), radial-gradient(ellipse at 80% 70%, rgba(6,182,212,0.06) 0%, transparent 55%), rgba(10,9,6,0.6)',
        border: '1px solid rgba(42,37,32,0.95)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.48)',
      }}
      aria-label="Interactive 3D knowledge graph — click nodes to explore connections"
    >
      {/* Deselect hint */}
      {selected && (
        <button
          onClick={() => setSelected(null)}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 20,
            background: 'rgba(10,9,6,0.85)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: '6px',
            padding: '5px 10px',
            color: '#a89878',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--ds-font-mono, monospace)',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
          }}
        >
          clear ×
        </button>
      )}

      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <OrthographicCamera makeDefault zoom={80} position={[0, 0, 10]} near={0.1} far={100} />

        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 8, 5]}  intensity={0.9} color="#e2d5bc" />
        <directionalLight position={[-4, -3, -4]} intensity={0.25} color="#6366f1" />

        <React.Suspense fallback={null}>
          <GraphScene
            graph={graph}
            onNodeHover={setHovered}
            onNodeClick={handleNodeClick}
            hovered={hovered}
            selected={selected}
          />
        </React.Suspense>

        <SmartOrbitControls autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  )
}

// ─── Public export (wrapped in error boundary) ────────────────────────────────

export default function KnowledgeGraph3D(props: KnowledgeGraph3DProps): JSX.Element {
  return (
    <GraphErrorBoundary>
      <KnowledgeGraph3DInner {...props} />
    </GraphErrorBoundary>
  )
}
