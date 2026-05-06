import type { Project } from './projects'

export type ProjectMetric = { id: string; visits: number; timeMs: number; lastVisited?: string }
export type SectionMetric = { id: string; visits: number; timeMs: number; lastVisited?: string }
export type InteractionMetrics = { projects: Record<string, ProjectMetric>; sections: Record<string, SectionMetric>; updatedAt?: string }

const STORAGE_KEY = 'site_interaction_metrics_v1'

function safeParse<T>(s: string | null, fallback: T): T {
  try {
    return s ? (JSON.parse(s) as T) : fallback
  } catch {
    return fallback
  }
}

export function loadInteractionMetrics(): InteractionMetrics | null {
  if (typeof window === 'undefined') return null
  return safeParse<InteractionMetrics>(window.localStorage.getItem(STORAGE_KEY), { projects: {}, sections: {} })
}

export function scoreProjectMetric(pm?: ProjectMetric) {
  if (!pm) return 0
  // Weighted score: visits are primary, time is secondary
  // visits * 10000 + timeMs/1000
  return (pm.visits || 0) * 10000 + Math.floor((pm.timeMs || 0) / 1000)
}

export function orderProjectsByInteraction(projects: Project[], metrics?: InteractionMetrics) {
  if (!metrics) return projects

  const arr = projects.map((p, idx) => {
    const key = String(p.id).toLowerCase()
    const pm = metrics.projects?.[key]
    const base = scoreProjectMetric(pm)
    const featuredBonus = (p as any).featured ? 50000 : 0

    // recency boost: prioritize recently-viewed projects
    let recencyBonus = 0
    try {
      const last = pm?.lastVisited ? Date.parse(pm.lastVisited as string) : 0
      if (last && !Number.isNaN(last)) {
        const age = Date.now() - last
        const day = 24 * 60 * 60 * 1000
        if (age < day) recencyBonus = 50000
        else if (age < 7 * day) recencyBonus = 20000
      }
    } catch {}

    return { project: p, score: base + featuredBonus + recencyBonus, origIndex: idx }
  })

  arr.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // tie-breaker: more recent lastVisited first
    const aKey = String(a.project.id).toLowerCase()
    const bKey = String(b.project.id).toLowerCase()
    const aLast = metrics.projects?.[aKey]?.lastVisited ? Date.parse(metrics.projects[aKey].lastVisited as string) : 0
    const bLast = metrics.projects?.[bKey]?.lastVisited ? Date.parse(metrics.projects[bKey].lastVisited as string) : 0
    if (bLast !== aLast) return bLast - aLast
    return a.origIndex - b.origIndex
  })

  return arr.map((r) => r.project)
}

export function topSections(metrics?: InteractionMetrics, top = 2) {
  if (!metrics) return [] as string[]
  const items = Object.values(metrics.sections || {})
  items.sort((a, b) => {
    if (b.visits !== a.visits) return b.visits - a.visits
    return (b.timeMs || 0) - (a.timeMs || 0)
  })
  return items.slice(0, top).map((s) => String(s.id))
}
