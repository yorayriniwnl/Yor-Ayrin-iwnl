"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'session_memory_v1'

type SectionStats = { count: number; totalTime: number }
type ProjectStats = { count: number; lastClicked?: string }

type SessionMemory = {
  firstVisit?: string
  lastVisit?: string
  visitCount: number
  sections: Record<string, SectionStats>
  projects: Record<string, ProjectStats>
  totalTime: number
  lastSection?: string
  lastProject?: string
  greeted?: boolean
  lastUpdated?: string
}

const defaultMemory: SessionMemory = { visitCount: 0, sections: {}, projects: {}, totalTime: 0 }

type SessionContext = {
  memory: SessionMemory
  setMemory: (m: SessionMemory) => void
  clear: () => void
}

const SessionMemoryContext = createContext<SessionContext | undefined>(undefined)

export function useSessionMemory(): SessionContext {
  const ctx = useContext(SessionMemoryContext)
  if (!ctx) throw new Error('useSessionMemory must be used within SessionMemoryProvider')
  return ctx
}

export default function SessionMemoryProvider({ children }: { children: React.ReactNode }) {
  const [memory, setMemoryState] = useState<SessionMemory>(defaultMemory)
  const lastSectionStartRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SessionMemory
        // bump visit count + lastVisit
        const now = new Date().toISOString()
        const updated = { ...parsed, visitCount: (parsed.visitCount || 0) + 1, lastVisit: now, lastUpdated: now }
        setMemoryState(updated)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)) } catch {}
      } else {
        const now = new Date().toISOString()
        const init = { ...defaultMemory, visitCount: 1, firstVisit: now, lastVisit: now, lastUpdated: now }
        setMemoryState(init)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(init)) } catch {}
      }
    } catch (err) {
      setMemoryState(defaultMemory)
    }

    return () => { mountedRef.current = false }
  }, [])

  function saveMemory(m: SessionMemory) {
    try {
      m.lastUpdated = new Date().toISOString()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(m))
    } catch {}
  }

  function setMemory(m: SessionMemory) {
    setMemoryState(m)
    saveMemory(m)
  }

  function clear() {
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setMemoryState(defaultMemory)
  }

  useEffect(() => {
    // handle section focus events to track time spent
    const onSection = (ev: Event) => {
      const e = ev as CustomEvent
      const id = e?.detail?.id
      const now = Date.now()

      setMemoryState((prev) => {
        const next = { ...prev }

        // finalize previous section time
        if (next.lastSection && lastSectionStartRef.current) {
          const elapsed = Math.max(0, (now - lastSectionStartRef.current) / 1000)
          const prevStats = next.sections[next.lastSection] || { count: 0, totalTime: 0 }
          prevStats.totalTime = (prevStats.totalTime || 0) + elapsed
          next.sections[next.lastSection] = prevStats
          next.totalTime = (next.totalTime || 0) + elapsed
        }

        if (id) {
          const stats = next.sections[id] || { count: 0, totalTime: 0 }
          stats.count = (stats.count || 0) + 1
          next.sections[id] = stats
          next.lastSection = id
        }

        lastSectionStartRef.current = now
        return next
      })
    }

    const onProject = (ev: Event) => {
      const e = ev as CustomEvent
      const id = e?.detail?.id
      const now = new Date().toISOString()
      if (!id) return
      setMemoryState((prev) => {
        const next = { ...prev }
        const stats = next.projects[id] || { count: 0 }
        stats.count = (stats.count || 0) + 1
        stats.lastClicked = now
        next.projects[id] = stats
        next.lastProject = id
        return next
      })
    }

    const onVisibility = () => {
      const now = Date.now()
      if (document.hidden) {
        // finalize current section time
        setMemoryState((prev) => {
          const next = { ...prev }
          if (next.lastSection && lastSectionStartRef.current) {
            const elapsed = Math.max(0, (now - lastSectionStartRef.current) / 1000)
            const prevStats = next.sections[next.lastSection] || { count: 0, totalTime: 0 }
            prevStats.totalTime = (prevStats.totalTime || 0) + elapsed
            next.sections[next.lastSection] = prevStats
            next.totalTime = (next.totalTime || 0) + elapsed
          }
          lastSectionStartRef.current = null
          return next
        })
      } else {
        // resume timing
        lastSectionStartRef.current = Date.now()
      }
    }

    const onBeforeUnload = () => {
      const now = Date.now()
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const prev = raw ? JSON.parse(raw) as SessionMemory : { ...defaultMemory }
        if (prev.lastSection && lastSectionStartRef.current) {
          const elapsed = Math.max(0, (now - lastSectionStartRef.current) / 1000)
          const prevStats = prev.sections[prev.lastSection] || { count: 0, totalTime: 0 }
          prevStats.totalTime = (prevStats.totalTime || 0) + elapsed
          prev.sections[prev.lastSection] = prevStats
          prev.totalTime = (prev.totalTime || 0) + elapsed
        }
        prev.lastUpdated = new Date().toISOString()
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prev)) } catch {}
      } catch {}
    }

    window.addEventListener('section-focus', onSection as EventListener)
    window.addEventListener('focus-project', onProject as EventListener)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('section-focus', onSection as EventListener)
      window.removeEventListener('focus-project', onProject as EventListener)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // save whenever memory changes
  useEffect(() => {
    try { saveMemory(memory) } catch {}
  }, [memory])

  const value: SessionContext = { memory, setMemory, clear }

  return <SessionMemoryContext.Provider value={value}>{children}</SessionMemoryContext.Provider>
}
