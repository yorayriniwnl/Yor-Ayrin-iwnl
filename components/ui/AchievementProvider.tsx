"use client"

import React, { useEffect, useRef, useState } from 'react'
import AchievementToast from './AchievementToast'
import { SECTIONS } from '../../lib/data'

type AchDef = { id: string; title: string; description?: string }

const ACHIEVEMENTS: Record<string, AchDef> = {
  zenith_explorer: { id: 'zenith_explorer', title: 'Yor Zenith Explorer', description: 'Discovered the Yor Zenith project or a hidden element.' },
  full_viewer: { id: 'full_viewer', title: 'Full Viewer', description: 'Visited every main section of the site.' },
}

export default function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<string[]>(() => {
    try {
      if (typeof window === 'undefined') return []
      const raw = localStorage.getItem('achievements_v1')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  const [queue, setQueue] = useState<AchDef[]>([])
  const [current, setCurrent] = useState<AchDef | null>(null)
  const visitedRef = useRef<Set<string>>(new Set())

  const pushQueue = (a: AchDef) => setQueue((q) => [...q, a])

  const unlock = (id: string) => {
    const def = ACHIEVEMENTS[id]
    if (!def) return
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      try { localStorage.setItem('achievements_v1', JSON.stringify(next)) } catch {}
      pushQueue(def)
      return next
    })
  }

  useEffect(() => {
    const onSection = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail
        let sec = ''
        if (!d) sec = ''
        else if (typeof d === 'string') sec = d
        else if (typeof d === 'object' && d.section) sec = d.section
        else if (typeof d === 'object' && d.id) sec = String(d.id)
        sec = sec?.toLowerCase() || ''
        if (!sec) return
        if (sec.includes('project')) sec = 'projects'
        if (sec.includes('skill')) sec = 'resume'
        visitedRef.current.add(sec)
        if (visitedRef.current.size >= SECTIONS.length) unlock('full_viewer')
      } catch (err) {
        // ignore
      }
    }

    const onFocusProject = (e: Event) => {
      try {
        const d = (e as CustomEvent).detail
        const id = d?.id ?? d?.projectId ?? ''
        if (id === 'zenith') unlock('zenith_explorer')
      } catch {}
    }

    const onEaster = () => unlock('zenith_explorer')

    window.addEventListener('section-focus', onSection as EventListener)
    window.addEventListener('focus-project', onFocusProject as EventListener)
    window.addEventListener('easter-egg-unlocked', onEaster as EventListener)

    return () => {
      window.removeEventListener('section-focus', onSection as EventListener)
      window.removeEventListener('focus-project', onFocusProject as EventListener)
      window.removeEventListener('easter-egg-unlocked', onEaster as EventListener)
    }
  }, [])

  // manage current toast display from queue
  useEffect(() => {
    if (current) return
    if (queue.length === 0) return
    setCurrent(queue[0])
    setQueue((q) => q.slice(1))
  }, [queue, current])

  const handleClose = () => setCurrent(null)

  return (
    <>
      {children}
      <div className="achievement-root" aria-live="polite">
        <AchievementToast item={current} onClose={handleClose} />
      </div>
    </>
  )
}
