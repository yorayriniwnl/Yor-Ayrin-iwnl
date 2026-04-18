import type { Project } from './projects'
import { scoreProjectMetric } from './smartOrdering'
import type { InteractionMetrics } from './smartOrdering'

function trimDot(s?: string) {
  if (!s) return ''
  return s.trim().replace(/\s+/g, ' ').replace(/\.$/, '')
}

export function generateImpactLine(p: Project): string {
  const problem = trimDot(p.problem || '')
  const outcome = trimDot(p.outcome || '')
  if (problem && outcome) return `${problem} — ${outcome}`
  if (problem && p.shortDescription) return `${problem} — ${trimDot(p.shortDescription)}`
  if (outcome) return outcome
  return trimDot(p.shortDescription || p.title)
}

function complexityScore(p: Project) {
  const techCount = (p.tech || []).length
  let extra = 0
  const tags = (p.tags || []).map((t) => String(t).toLowerCase())
  if (tags.includes('3d') || tags.includes('interactive ui')) extra += 2
  if (p.fullDescription && p.fullDescription.length > 300) extra += 1
  return techCount * 10 + extra * 8
}

function baselineImpactHeuristic(p: Project) {
  const outcomeWords = (p.outcome || '').split(/\s+/).filter(Boolean).length
  const featured = p.featured ? 1 : 0
  return outcomeWords * 20 + featured * 2000
}

export type Annotation = { id: string; impactLine: string; tags: string[]; complexityScore: number; impactScore: number; productionReady: boolean }

export function annotateProjects(projects: Project[], metrics?: InteractionMetrics): Annotation[] {
  const items = projects.map((p) => {
    const key = String(p.id).toLowerCase()
    const impactScore = metrics?.projects?.[key] ? scoreProjectMetric(metrics.projects[key]) : baselineImpactHeuristic(p)
    const complexity = complexityScore(p)
    const productionReady = Boolean(p.github && (p.outcome || '').length > 20)
    const tags: string[] = []
    if (productionReady) tags.push('Production Ready')
    return { id: p.id, impactLine: generateImpactLine(p), tags, complexityScore: complexity, impactScore, productionReady }
  })

  // mark single Most Complex and Most Impactful
  if (items.length > 0) {
    const byComplex = items.slice().sort((a, b) => b.complexityScore - a.complexityScore)
    const topComplex = byComplex[0]
    if (topComplex) topComplex.tags.push('Most Complex')

    const byImpact = items.slice().sort((a, b) => b.impactScore - a.impactScore)
    const topImpact = byImpact[0]
    if (topImpact) topImpact.tags.push('Most Impactful')
  }

  return items
}

export default { generateImpactLine, annotateProjects }
