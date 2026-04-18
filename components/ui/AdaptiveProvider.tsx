"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Stats = {
  visits: Record<string, number>
  time: Record<string, number>
  lastSection?: string | null
  lastStart?: number | null
}

type AdaptiveContextType = {
  highlightProjects: boolean
  expandSkills: boolean
  stats: Stats
  recordSection: (section: string) => void
  recruiterMode: boolean
  setRecruiterMode: (v: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (v: boolean) => void
}

const KEY = 'adaptive_stats_v1'

const defaultStats: Stats = {
  visits: { projects: 0, skills: 0 },
  time: { projects: 0, skills: 0 },
  lastSection: null,
  lastStart: null,
}

const AdaptiveContext = createContext<AdaptiveContextType | null>(null)

export default function AdaptiveProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(() => {
    try {
      if (typeof window === 'undefined') return defaultStats
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as Stats) : defaultStats
    } catch (err) {
      return defaultStats
    }
  })

  // record a section visit and accumulate time spent in previous section
  const recordSection = (section: string) => {
    const now = Date.now()
    setStats((prev) => {
      const last = prev.lastSection
      const lastStart = prev.lastStart || now
      const delta = last ? Math.max(0, now - lastStart) : 0

      const nextTime = { ...prev.time }
      if (last) nextTime[last] = (nextTime[last] || 0) + delta

      const nextVisits = { ...prev.visits }
      nextVisits[section] = (nextVisits[section] || 0) + 1

      const next: Stats = {
        ...prev,
        time: nextTime,
        visits: nextVisits,
        lastSection: section,
        lastStart: now,
      }

      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }

  useEffect(() => {
    const onSection = (e: Event) => {
      try {
        // support both string detail or { section }
        // @ts-ignore
        const d = (e as CustomEvent).detail
        let sec = 'other'
        if (!d) sec = 'other'
        else if (typeof d === 'string') sec = d
        else if (typeof d === 'object' && d.section) sec = d.section
        else if (typeof d === 'object' && d.id) sec = String(d.id)

        sec = sec.toLowerCase()
        if (sec.includes('project')) sec = 'projects'
        if (sec.includes('skill') || sec === 'resume') sec = 'skills'

        recordSection(sec)
      } catch (err) {
        // ignore
      }
    }

    const onFocusProject = (e: Event) => recordSection('projects')

    window.addEventListener('section-focus', onSection as EventListener)
    window.addEventListener('focus-project', onFocusProject as EventListener)

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        // bump time for current section
        const now = Date.now()
        setStats((prev) => {
          const last = prev.lastSection
          const lastStart = prev.lastStart || now
          if (!last) return prev
          const delta = Math.max(0, now - lastStart)
          const nextTime = { ...prev.time, [last]: (prev.time[last] || 0) + delta }
          const next: Stats = { ...prev, time: nextTime, lastStart: now }
          try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
          return next
        })
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('section-focus', onSection as EventListener)
      window.removeEventListener('focus-project', onFocusProject as EventListener)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(stats)) } catch {}
  }, [stats])

  const highlightProjects = useMemo(() => {
    const visits = stats.visits.projects || 0
    const time = stats.time.projects || 0
    return visits >= 3 || time >= 1000 * 60 * 2 // 2 minutes
  }, [stats.visits.projects, stats.time.projects])

  const expandSkills = useMemo(() => {
    const visits = stats.visits.skills || 0
    const time = stats.time.skills || 0
    return visits >= 2 || time >= 1000 * 60 // 1 minute
  }, [stats.visits.skills, stats.time.skills])

  const [recruiterMode, setRecruiterModeState] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return true
      const v = localStorage.getItem('recruiter_mode')
      // Default ON for first visit when no value is stored
      if (v === null) return true
      return v === '1'
    } catch {
      return true
    }
  })

  const setRecruiterMode = (v: boolean) => {
    try { localStorage.setItem('recruiter_mode', v ? '1' : '0') } catch {}
    setRecruiterModeState(v)
  }

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false
      const v = localStorage.getItem('reduced_motion')
      if (v === null) {
        const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')
        return !!(mq && mq.matches)
      }
      return v === '1'
    } catch {
      return false
    }
  })

  const setReducedMotion = (v: boolean) => {
    try { localStorage.setItem('reduced_motion', v ? '1' : '0') } catch {}
    setReducedMotionState(v)
  }

  // toggle document-level classes to let CSS adapt the UI
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('adaptive-projects', highlightProjects)
      document.documentElement.classList.toggle('adaptive-skills', expandSkills)
      document.documentElement.classList.toggle('recruiter-mode', recruiterMode)
      document.documentElement.classList.toggle('reduced-motion', reducedMotion)
    } catch (err) {
      // ignore
    }
  }, [highlightProjects, expandSkills, recruiterMode, reducedMotion])

  useEffect(() => {
    try {
      const mql = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
      const onChange = (e: any) => {
        try {
          const override = localStorage.getItem('reduced_motion')
          if (override === null && mql) setReducedMotionState(!!mql.matches)
        } catch {}
      }

      if (mql) {
        if ('addEventListener' in mql) mql.addEventListener('change', onChange)
        else (mql as any).addListener(onChange)
      }

      return () => {
        if (mql) {
          if ('removeEventListener' in mql) mql.removeEventListener('change', onChange)
          else (mql as any).removeListener(onChange)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const value: AdaptiveContextType = {
    highlightProjects,
    expandSkills,
    stats,
    recordSection,
    recruiterMode,
    setRecruiterMode,
    reducedMotion,
    setReducedMotion,
  }

  return <AdaptiveContext.Provider value={value}>{children}</AdaptiveContext.Provider>
}

export function useAdaptive() {
  const ctx = useContext(AdaptiveContext)
  if (!ctx) throw new Error('useAdaptive must be used within AdaptiveProvider')
  return ctx
}
