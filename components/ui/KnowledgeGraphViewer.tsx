"use client"

import React, { useEffect, useState } from 'react'

type KnowledgeNode = {
  id: string
  title?: string
  name?: string
  label?: string
  type?: string
}

type KnowledgeEdge = {
  source?: string
  target?: string
  from?: string
  to?: string
}

type KnowledgeGraph = {
  nodes?: KnowledgeNode[]
  edges?: KnowledgeEdge[]
}

type NodePosition = {
  id: string
  x: number
  y: number
  label: string
  type?: string
}

export default function KnowledgeGraphViewer(): JSX.Element {
  const [graph, setGraph] = useState<KnowledgeGraph | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/knowledge-graph')
      .then((r) => r.json())
      .then((g) => {
        if (mounted) setGraph(g)
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [])

  if (!graph) return <div className="card-surface p-4">Loading graph…</div>

  const nodes = graph.nodes || []
  const edges = graph.edges || []
  const w = 420
  const h = 260
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) / 2 - 48

  const positions: NodePosition[] = nodes.map((n, i) => {
    const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2
    return { id: n.id, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, label: n.title || n.name || n.label || n.id, type: n.type }
  })

  const posMap: Record<string, NodePosition> = {}
  for (const p of positions) posMap[p.id] = p

  return (
    <div className="card-surface p-4 max-w-md">
      <h4 className="font-bold mb-2">Knowledge Graph</h4>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* edges */}
        {edges.map((e, i) => {
          const a = posMap[e.source || e.from || '']
          const b = posMap[e.target || e.to || '']
          if (!a || !b) return null
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(255,255,255,0.08)" strokeWidth={1.4} />
        })}

        {/* nodes */}
        {positions.map((p) => (
          <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
            <circle r={10} fill={p.type === 'project' ? '#8b5cf6' : p.type === 'skill' ? '#06b6d4' : '#f59e0b'} stroke="rgba(255,255,255,0.06)" strokeWidth={1.2} />
            <text x={14} y={6} fontSize={10} fill="rgba(255,255,255,0.88)">{p.label}</text>
          </g>
        ))}
      </svg>

      <div className="mt-3 text-xs text-muted">
        <div>Nodes: {nodes.length} · Edges: {edges.length}</div>
      </div>
    </div>
  )
}
