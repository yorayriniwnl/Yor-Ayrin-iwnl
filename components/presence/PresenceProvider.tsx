"use client"

import React, { useEffect, useRef } from 'react'

type Session = { id: string; name?: string; lastSeen: string; cursor?: { x: number; y: number } }

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

export default function PresenceProvider(): null {
  const selfIdRef = useRef<string | null>(null)
  const nameRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedId = localStorage.getItem('presence_self_id')
    const id = storedId || `visitor-${genId()}`
    selfIdRef.current = id
    localStorage.setItem('presence_self_id', id)

    const storedName = localStorage.getItem('presence_name') || `Visitor-${id.slice(-4)}`
    nameRef.current = storedName

    const wsUrl = process.env.NEXT_PUBLIC_PRESENCE_WS || ''
    let bc: BroadcastChannel | null = null
    let ws: WebSocket | null = null
    const sessions = new Map<string, Session>()
    let cursorEnabled = false
    let lastCursor: { x: number; y: number } | null = null
    let lastCursorSend = 0

    const TTL_MS = 35_000

    function dispatch() {
      const arr = Array.from(sessions.values())
      try { window.dispatchEvent(new CustomEvent('presence-updated', { detail: { sessions: arr } })) } catch {}
    }

    function handleIncoming(msg: any) {
      if (!msg || !msg.type) return
      if (String(msg.id) === String(selfIdRef.current)) return
      const now = new Date().toISOString()

      // shared-session messages: broadcast updates for shared viewing sessions
      if (msg.type === 'shared-session') {
        try {
          window.dispatchEvent(new CustomEvent('shared-session-updated', { detail: { sessionId: msg.sessionId, payload: msg.payload, from: msg.id } }))
        } catch {}
        return
      }

      if (msg.type === 'leave') {
        sessions.delete(String(msg.id))
        dispatch()
        return
      }

      const existing = sessions.get(String(msg.id)) || ({ id: msg.id, name: msg.name || 'Visitor', lastSeen: now } as Session)
      existing.name = msg.name || existing.name
      existing.lastSeen = msg.ts || now
      if (msg.cursor) existing.cursor = msg.cursor
      sessions.set(String(msg.id), existing)
      dispatch()
    }

    function sendMessage(payload: any) {
      const message = { ...payload, id, name: nameRef.current, ts: new Date().toISOString() }
      try {
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message))
        else if (bc) bc.postMessage(message)
        else try { localStorage.setItem('presence_msg', JSON.stringify(message)) } catch {}
      } catch (_) {}
    }

    // open channel
    if (wsUrl) {
      try {
        ws = new WebSocket(wsUrl)
        ws.onopen = () => sendMessage({ type: 'join' })
        ws.onmessage = (e) => {
          try { const data = JSON.parse(e.data); handleIncoming(data) } catch (err) {}
        }
        ws.onclose = () => {}
      } catch (err) {
        ws = null
      }
    } else if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('yor_presence_channel')
        bc.onmessage = (ev) => handleIncoming(ev.data)
        // flush join
        sendMessage({ type: 'join' })
      } catch (err) {
        bc = null
      }
    }

    // localStorage fallback (for older browsers / cross-process)
    function onStorage(e: StorageEvent) {
      if (e.key !== 'presence_msg' || !e.newValue) return
      try { const data = JSON.parse(e.newValue); handleIncoming(data) } catch (err) {}
    }
    window.addEventListener('storage', onStorage)

    // listen for cursor-enable events
    const onSetCursor = (e: Event) => {
      const ev = e as CustomEvent
      cursorEnabled = Boolean(ev?.detail?.enabled)
    }
    window.addEventListener('presence-set-cursor-enabled', onSetCursor as EventListener)

    // listen for shared-session broadcasts from the UI and forward them across presence transport
    const onPresenceShare = (e: Event) => {
      const ev = e as CustomEvent
      const payload = ev?.detail
      if (!payload) return
      try {
        // payload should include { type: 'shared-session', sessionId, payload }
        sendMessage(payload)
      } catch {}
    }
    window.addEventListener('presence-share', onPresenceShare as EventListener)

    // listen for set-name
    const onSetName = (e: Event) => {
      const ev = e as CustomEvent
      try { nameRef.current = String(ev?.detail?.name || nameRef.current); localStorage.setItem('presence_name', nameRef.current || '') } catch {}
    }
    window.addEventListener('presence-set-name', onSetName as EventListener)

    // heartbeat
    const hb = window.setInterval(() => {
      sendMessage({ type: 'heartbeat', cursor: lastCursor })
      // purge
      const now = Date.now()
      let changed = false
      for (const [k, s] of sessions) {
        try {
          const last = Date.parse(s.lastSeen)
          if (Number.isFinite(last) && now - last > TTL_MS) { sessions.delete(k); changed = true }
        } catch { }
      }
      if (changed) dispatch()
    }, 10_000)

    // mouse cursor broadcasting (throttled)
    function onMouseMove(e: MouseEvent) {
      if (!cursorEnabled) return
      const now = Date.now()
      if (now - lastCursorSend < 100) return
      lastCursorSend = now
      lastCursor = { x: e.clientX / (window.innerWidth || 1), y: e.clientY / (window.innerHeight || 1) }
      sendMessage({ type: 'cursor', cursor: lastCursor })
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // react to manual join/leave events
    const onJoin = () => sendMessage({ type: 'join' })
    window.addEventListener('presence-join', onJoin as EventListener)

    // unload: inform others
    const onUnload = () => sendMessage({ type: 'leave' })
    window.addEventListener('beforeunload', onUnload)

    // initial dispatch (empty list)
    dispatch()

    return () => {
      try { sendMessage({ type: 'leave' }) } catch {}
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('presence-set-cursor-enabled', onSetCursor as EventListener)
      window.removeEventListener('presence-share', onPresenceShare as EventListener)
      window.removeEventListener('presence-set-name', onSetName as EventListener)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('presence-join', onJoin as EventListener)
      window.removeEventListener('beforeunload', onUnload)
      clearInterval(hb)
      try { if (bc) bc.close() } catch {}
      try { if (ws) ws.close() } catch {}
    }
  }, [])

  return null
}
