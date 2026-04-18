"use client"

import React, { useEffect, useState } from 'react'

type Session = { id: string; name?: string; lastSeen: string }

export default function PresenceBanner(): JSX.Element | null {
  const [sessions, setSessions] = useState<Session[]>([])
  const [showCursors, setShowCursors] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent
      const s = ev?.detail?.sessions || []
      // only keep recent ones
      const recent = s.filter((ss: any) => {
        try { return Date.now() - Date.parse(ss.lastSeen) < 45_000 } catch { return false }
      })
      setSessions(recent)
    }

    window.addEventListener('presence-updated', handler as EventListener)
    return () => window.removeEventListener('presence-updated', handler as EventListener)
  }, [])

  if (!sessions || sessions.length === 0) return null

  const others = sessions
  const count = others.length

  function toggleCursors() {
    const next = !showCursors
    setShowCursors(next)
    try { window.dispatchEvent(new CustomEvent('presence-set-cursor-enabled', { detail: { enabled: next } })) } catch {}
  }

  return (
    <div className="presence-banner fixed left-6 top-6 z-60">
      <div className="bg-black/70 text-white px-3 py-2 rounded-xl flex items-center gap-3 shadow-md">
        <div className="text-sm">{count === 1 ? 'Someone is viewing' : `${count} people are viewing`}</div>

        <div className="flex -space-x-2">
          {others.slice(0, 4).map((s) => (
            <div key={s.id} className="presence-avatar" title={s.name || s.id}>
              {String(s.name || s.id).slice(0, 2).toUpperCase()}
            </div>
          ))}
          {others.length > 4 && <div className="text-xs text-white/70 px-2">+{others.length - 4}</div>}
        </div>

        <button className="ml-2 px-2 py-1 rounded-md bg-white/6 text-xs" onClick={toggleCursors}>
          {showCursors ? 'Hide cursors' : 'Show cursors'}
        </button>
      </div>
    </div>
  )
}
