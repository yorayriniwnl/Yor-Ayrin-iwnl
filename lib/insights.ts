import { PROJECTS, SKILL_CATEGORIES } from './data'

export type SkillRow = { name: string; value: number; desc?: string; category: string }

export function computeSkillSummary(): SkillRow[] {
  const rows: SkillRow[] = []
  for (const category of Object.keys(SKILL_CATEGORIES)) {
    const list = (SKILL_CATEGORIES as any)[category] as any[]
    list.forEach((s) => rows.push({ name: s.name, value: s.value, desc: s.desc, category }))
  }
  rows.sort((a, b) => b.value - a.value)
  return rows
}

export function computeProjectCategoryDistribution() {
  const counts: Record<string, number> = {}
  for (const p of PROJECTS) {
    const k = p.category || 'Uncategorized'
    counts[k] = (counts[k] || 0) + 1
  }
  const total = PROJECTS.length || 1
  const list = Object.keys(counts).map((k) => ({ category: k, count: counts[k], percent: Math.round((counts[k] / total) * 100) }))
  list.sort((a, b) => b.count - a.count)
  return { total, list }
}

export function computeTechDistribution() {
  const counts: Record<string, number> = {}
  for (const p of PROJECTS) {
    if (!p.tech) continue
    for (const t of p.tech) counts[t] = (counts[t] || 0) + 1
  }
  const list = Object.keys(counts).map((k) => ({ tech: k, count: counts[k] }))
  list.sort((a, b) => b.count - a.count)
  const total = list.reduce((s, x) => s + x.count, 0) || 1
  return list.map((x) => ({ tech: x.tech, count: x.count, percent: Math.round((x.count / total) * 100) }))
}
