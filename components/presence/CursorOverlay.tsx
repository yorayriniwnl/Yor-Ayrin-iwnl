"use client"

import React, { useEffect, useState } from 'react'

type Session = { id: string; name?: string; lastSeen: string; cursor?: { x: number; y: number } }

export default function CursorOverlay(): JSX.Element | null {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent
      const s: Session[] = ev?.detail?.sessions || []
      // keep those with cursors
      const cursors = s.filter((ss) => ss.cursor && (Date.now() - Date.parse(ss.lastSeen) < 45_000))
      setSessions(cursors)
    }

    window.addEventListener('presence-updated', handler as EventListener)
    return () => window.removeEventListener('presence-updated', handler as EventListener)
  }, [])

  if (!sessions || sessions.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {sessions.map((s) => {
        if (!s.cursor) return null
        const left = Math.max(4, Math.min(96, Math.round((s.cursor.x || 0) * 100)))
        const top = Math.max(4, Math.min(96, Math.round((s.cursor.y || 0) * 100)))
        const style: React.CSSProperties = { left: `${(s.cursor.x || 0) * 100}%`, top: `${(s.cursor.y || 0) * 100}%`, transform: 'translate(-50%, -50%)' }
        return (
          <div key={s.id} className="presence-cursor" style={style} title={s.name || s.id}>
            <div className="presence-cursor-dot" />
            <div className="presence-cursor-label">{s.name || 'Visitor'}</div>
          </div>
        )
      })}
    </div>
  )
}
