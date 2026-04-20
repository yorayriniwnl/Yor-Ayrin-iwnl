"use client"

import React, { useEffect, useRef, useState } from 'react'

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function SharedSession(): JSX.Element | null {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const sessionRef = useRef<string | null>(null)
  const [joined, setJoined] = useState(false)
  const [follow, setFollow] = useState(true)
  const [cursorSync, setCursorSync] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentRef = useRef<{ kind: 'section' | 'project' | null; id?: string }>({ kind: null })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // auto-join if URL contains ?share=ID
    try {
      const params = new URLSearchParams(window.location.search)
      const s = params.get('share') || params.get('session')
      if (s) {
        sessionRef.current = s
        setSessionId(s)
        setJoined(true)
        // request presence join notification
        try {
          window.dispatchEvent(new CustomEvent('presence-share', { detail: { type: 'shared-session', sessionId: s, payload: { action: 'join' } } }))
        } catch {}
      }
    } catch {}

    // handle remote shared-session updates
    const onSharedUpdated = (e: Event) => {
      const ev = e as CustomEvent
      const detail = ev?.detail || {}
      const sid = detail?.sessionId
      const payload = detail?.payload
      if (!sid || !payload) return
      if (!sessionRef.current) return
      if (sid !== sessionRef.current) return
      if (!follow) return

      // apply update
      try {
        if (payload.kind === 'section' && payload.id) {
          const el = document.getElementById(payload.id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          try { window.dispatchEvent(new CustomEvent('section-focus', { detail: { id: payload.id } })) } catch {}
        } else if (payload.kind === 'project' && payload.id) {
          try { window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: payload.id } })) } catch {}
        }
      } catch {}
    }

    window.addEventListener('shared-session-updated', onSharedUpdated as EventListener)

    // listen for local focus changes and forward when joined
    const onSectionFocus = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      if (!id) return
      currentRef.current = { kind: 'section', id }
      if (!sessionRef.current) return
      try {
        window.dispatchEvent(new CustomEvent('presence-share', { detail: { type: 'shared-session', sessionId: sessionRef.current, payload: { kind: 'section', id } } }))
      } catch {}
    }

    const onFocusProject = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      if (!id) return
      currentRef.current = { kind: 'project', id }
      if (!sessionRef.current) return
      try {
        window.dispatchEvent(new CustomEvent('presence-share', { detail: { type: 'shared-session', sessionId: sessionRef.current, payload: { kind: 'project', id } } }))
      } catch {}
    }

    window.addEventListener('section-focus', onSectionFocus as EventListener)
    window.addEventListener('focus-project', onFocusProject as EventListener)
    window.addEventListener('focus-panel', onFocusProject as EventListener)

    return () => {
      window.removeEventListener('shared-session-updated', onSharedUpdated as EventListener)
      window.removeEventListener('section-focus', onSectionFocus as EventListener)
      window.removeEventListener('focus-project', onFocusProject as EventListener)
      window.removeEventListener('focus-panel', onFocusProject as EventListener)
    }
  }, [follow])

  if (typeof window === 'undefined') return null

  function createSession() {
    const id = genId()
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('share', id)
      window.history.replaceState({}, '', url.toString())
      navigator.clipboard?.writeText(url.toString()).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }).catch(() => {})
    } catch {}

    sessionRef.current = id
    setSessionId(id)
    setJoined(true)

    try {
      window.dispatchEvent(new CustomEvent('presence-share', { detail: { type: 'shared-session', sessionId: id, payload: { action: 'join' } } }))
    } catch {}
  }

  function leaveSession() {
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('share')
      window.history.replaceState({}, '', url.toString())
    } catch {}
    try {
      if (sessionRef.current) {
        window.dispatchEvent(new CustomEvent('presence-share', { detail: { type: 'shared-session', sessionId: sessionRef.current, payload: { action: 'leave' } } }))
      }
    } catch {}
    sessionRef.current = null
    setSessionId(null)
    setJoined(false)
  }

  function copyLink() {
    try {
      const url = new URL(window.location.href)
      if (sessionRef.current) url.searchParams.set('share', sessionRef.current)
      navigator.clipboard?.writeText(url.toString()).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }).catch(() => {})
    } catch {}
  }

  function toggleCursorSync() {
    const next = !cursorSync
    setCursorSync(next)
    try { window.dispatchEvent(new CustomEvent('presence-set-cursor-enabled', { detail: { enabled: next } })) } catch {}
  }

  return (
    <div className="fixed top-4 right-36 z-60">
      <div className="relative">
        <div className="p-2 rounded bg-white/5 backdrop-blur-sm shadow-lg flex items-center gap-3">
          {!joined ? (
            <>
              <button onClick={createSession} className="px-3 py-1 rounded bg-white/6 text-sm">Share session</button>
              <div className="text-sm text-white/70">Create a share link to sync views</div>
            </>
          ) : (
            <>
              <div className="text-sm">Session <span className="font-mono ml-2">{sessionId}</span></div>
              <button onClick={copyLink} className="px-2 py-1 rounded bg-white/6 text-sm">{copied ? 'Copied' : 'Copy'}</button>
              <button onClick={leaveSession} className="px-2 py-1 rounded bg-red-600 text-sm">Leave</button>
              <label className="ml-2 text-sm flex items-center gap-2">
                <input type="checkbox" checked={follow} onChange={() => setFollow((s) => !s)} />
                Follow
              </label>
              <label className="ml-2 text-sm flex items-center gap-2">
                <input type="checkbox" checked={cursorSync} onChange={toggleCursorSync} />
                Cursor
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
