"use client"

import React, { useEffect, useState } from 'react'
import { useSessionMemory } from './SessionMemoryProvider'

export default function SessionWelcome(): JSX.Element | null {
  const { memory, setMemory } = useSessionMemory()
  const [title, setTitle] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!memory) return
    if (memory.greeted) return
    if (!memory.lastProject) return
    // only show if returning visitor
    if ((memory.visitCount || 0) <= 1) return

    // try to resolve project title from assistant_data.json
    fetch('/assistant_data.json')
      .then((r) => r.json())
      .then((d) => {
        const projects = Array.isArray(d?.projects) ? d.projects : []
        const found = projects.find((p: Record<string, unknown>) => String(p.id).toLowerCase() === String(memory.lastProject).toLowerCase() || String(p.title || '').toLowerCase().includes(String(memory.lastProject).toLowerCase()))
        setTitle(found ? (found.title || found.id) : memory.lastProject || null)
        setVisible(true)
      })
      .catch(() => {
        setTitle(memory.lastProject || null)
        setVisible(true)
      })
  }, [memory])

  if (!visible || !title) return null

  const close = () => {
    const next = { ...memory, greeted: true }
    try { setMemory(next) } catch {}
    setVisible(false)
  }

  const resume = () => {
    // dispatch focus events used by the 3D scene
    window.dispatchEvent(new CustomEvent('focus-panel', { detail: { id: memory.lastProject } }))
    window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: memory.lastProject } }))
    close()
  }

  return (
    <div className="time-banner" style={{ left: 18, top: 18 }}>
      <div className="time-pill pointer-events-auto">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>Welcome back</div>
          <div style={{ opacity: 0.95 }}>Continue exploring <strong>{title}</strong></div>
          <div style={{ marginLeft: 8 }}>
            <button className="btn btn-primary" onClick={resume}>Resume</button>
          </div>
          <div>
            <button className="btn" onClick={close}>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  )
}
