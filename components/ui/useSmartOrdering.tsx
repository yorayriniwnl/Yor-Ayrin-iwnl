"use client"
import { useEffect, useMemo, useState } from 'react'
import type { Project } from '../../lib/projects'
import { loadInteractionMetrics, orderProjectsByInteraction, topSections } from '../../lib/smartOrdering'

export default function useSmartOrdering(projects: Project[]) {
  const [metrics, setMetrics] = useState(() => {
    try {
      return loadInteractionMetrics()
    } catch {
      return null
    }
  })

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const ev = e as CustomEvent
      const m = ev?.detail?.metrics
      if (m) setMetrics(m)
      else setMetrics(loadInteractionMetrics())
    }

    window.addEventListener('interaction-metrics-updated', onUpdate as EventListener)
    return () => window.removeEventListener('interaction-metrics-updated', onUpdate as EventListener)
  }, [])

  const ordered = useMemo(() => {
    if (!projects) return [] as Project[]
    if (!metrics) return projects
    try {
      return orderProjectsByInteraction(projects, metrics)
    } catch {
      return projects
    }
  }, [projects, metrics])

  const top = useMemo(() => {
    if (!metrics) return [] as string[]
    try {
      return topSections(metrics, 2)
    } catch {
      return []
    }
  }, [metrics])

  return { orderedProjects: ordered, topSections: top, metrics }
}
