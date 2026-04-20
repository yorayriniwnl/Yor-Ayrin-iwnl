"use client"

import React, { useEffect, useState } from 'react'
import { PROJECTS, SECTIONS } from '../../lib/data'

const STORAGE_KEY = 'site_interaction_metrics_v1'

function safeParse<T>(s: string | null, fallback: T): T {
  try {
    return s ? (JSON.parse(s) as T) : fallback
  } catch {
    return fallback
  }
}

type Metrics = { sections: Record<string, any>; projects: Record<string, any>; updatedAt?: string }

function computeScore(m: Metrics) {
  const totalSections = SECTIONS.length || 1
  const visitedSections = Object.keys(m.sections || {}).length
  const sectionsCoverage = visitedSections / totalSections

  const totalProjects = PROJECTS.length || 1
  const visitedProjects = Object.keys(m.projects || {}).length
  const projectsCoverage = visitedProjects / totalProjects

  let totalTimeMs = 0
  let totalVisits = 0
  for (const s of Object.values(m.sections || {})) {
    totalTimeMs += s.timeMs || 0
    totalVisits += s.visits || 0
  }
  for (const p of Object.values(m.projects || {})) {
    totalTimeMs += p.timeMs || 0
    totalVisits += p.visits || 0
  }

  // normalize time: consider 5 minutes (300k ms) as full-engagement
  const normalizedTime = Math.min(totalTimeMs / 300000, 1)
  // normalize visits with an expected cap
  const normalizedVisits = Math.min(totalVisits / 20, 1)

  // weighted score: sections 40%, projects 30%, time 20%, visits 10%
  const raw = sectionsCoverage * 0.4 + projectsCoverage * 0.3 + normalizedTime * 0.2 + normalizedVisits * 0.1
  const score = Math.round(raw * 100)

  return {
    score,
    sectionsCoverage: Math.round(sectionsCoverage * 100),
    projectsCoverage: Math.round(projectsCoverage * 100),
    totalTimeMs,
    totalVisits,
  }
}

export default function ExperienceBadge(): JSX.Element | null {
  const [metrics, setMetrics] = useState<Metrics>(() => safeParse(localStorage.getItem(STORAGE_KEY), { sections: {}, projects: {} }))
  const [computed, setComputed] = useState(() => computeScore(metrics))

  useEffect(() => {
    function onUpdate(e: Event) {
      const ev = e as CustomEvent
      const m = ev?.detail?.metrics || safeParse(localStorage.getItem(STORAGE_KEY), { sections: {}, projects: {} })
      setMetrics(m)
      setComputed(computeScore(m))
    }

    window.addEventListener('interaction-metrics-updated', onUpdate as EventListener)

    // also update from storage periodically (in case other tabs changed)
    const t = setInterval(() => {
      const m = safeParse(localStorage.getItem(STORAGE_KEY), { sections: {}, projects: {} })
      setMetrics(m)
      setComputed(computeScore(m))
    }, 3000)

    return () => {
      window.removeEventListener('interaction-metrics-updated', onUpdate as EventListener)
      clearInterval(t)
    }
  }, [])

  if (!computed) return null

  return (
    <div className="experience-badge ml-3 px-3 py-1 rounded-md bg-white/6 text-sm">
      <div className="font-semibold">Engagement: <span className="text-accent">{computed.score}%</span></div>
      <div className="text-xs text-gray-300">Explored {computed.sectionsCoverage}% of sections • {computed.projectsCoverage}% projects</div>
    </div>
  )
}
