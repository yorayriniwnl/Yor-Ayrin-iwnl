import type { PortfolioEntry } from './portfolio'

export type Intent = 'skills' | 'projects' | 'fit' | 'other'

export function detectIntent(question: string): Intent {
  const q = question.toLowerCase()
  const skillsKeywords = ['skill', 'stack', 'tech', 'technolog', 'experience', 'familiar', 'proficient']
  const projectsKeywords = ['project', 'projects', 'work on', 'showcase', 'repo', 'repository', 'examples', 'case study']
  const fitKeywords = ['hire', 'hiring', 'fit', 'role', 'join', 'team', 'available', 'interest', 'contract', 'hiring fit']

  const score = (arr: string[]) => arr.reduce((s, k) => s + (q.includes(k) ? 1 : 0), 0)
  const sSkills = score(skillsKeywords)
  const sProjects = score(projectsKeywords)
  const sFit = score(fitKeywords)

  if (sFit >= Math.max(sSkills, sProjects, 1)) return 'fit'
  if (sSkills >= Math.max(sProjects, sFit, 1)) return 'skills'
  if (sProjects >= Math.max(sSkills, sFit, 1)) return 'projects'
  return 'other'
}

type QnAResult = { answer: string; sources: string[]; intent: Intent; confidence: number }

function topTechs(entries: PortfolioEntry[], limit = 5) {
  const counts = new Map<string, number>()
  for (const e of entries) {
    for (const t of e.tech || []) {
      const key = t.trim()
      if (!key) continue
      counts.set(key, (counts.get(key) || 0) + 1)
    }
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit).map((p) => p[0])
}

function findProjectsByQuery(entries: PortfolioEntry[], q: string) {
  const ql = q.toLowerCase()
  const matches: { entry: PortfolioEntry; score: number }[] = []
  for (const e of entries) {
    let s = 0
    if (e.title && e.title.toLowerCase().includes(ql)) s += 8
    if (e.description && e.description.toLowerCase().includes(ql)) s += 4
    for (const h of e.highlights || []) if (h.toLowerCase().includes(ql)) s += 2
    for (const t of e.tech || []) if (t.toLowerCase().includes(ql)) s += 2
    if (s > 0) matches.push({ entry: e, score: s })
  }
  return matches.sort((a, b) => b.score - a.score).map((m) => m.entry)
}

export function answerQuestion(question: string, entries: PortfolioEntry[]): QnAResult {
  const intent = detectIntent(question)
  const ql = question.toLowerCase()

  if (intent === 'skills') {
    const techs = topTechs(entries, 5)
    if (!techs.length) return { answer: "I don't have that information.", sources: [], intent, confidence: 0.9 }
    // find example projects for top techs
    const examples: string[] = []
    for (const t of techs.slice(0, 3)) {
      const p = entries.find((e) => (e.tech || []).some((x) => x.toLowerCase() === t.toLowerCase()))
      if (p) examples.push(`${p.title} (${p.url})`)
    }
    const ans = `Primary skills: ${techs.slice(0, 3).join(', ')}.` + (examples.length ? ` Examples: ${examples.slice(0, 3).join('; ')}.` : '')
    return { answer: ans, sources: examples.map((s) => { const m = s.match(/\((https?:\/\/[^)]+)\)$/); return m ? m[1] : '' }).filter(Boolean), intent, confidence: 0.95 }
  }

  if (intent === 'projects') {
    // try to match a project name
    const byTitle = findProjectsByQuery(entries, question)
    if (byTitle.length) {
      const e = byTitle[0]
      const shortDesc = e.description || ''
      const tech = (e.tech || []).slice(0, 4).join(', ')
      const src = e.url
      const ans = `${e.title} — ${shortDesc} Tech: ${tech}.`
      return { answer: ans, sources: [src], intent, confidence: 0.95 }
    }

    // otherwise return top 3 projects
    const top = entries.slice(0, 3)
    if (!top.length) return { answer: "I don't have that information.", sources: [], intent, confidence: 0.9 }
    const list = top.map((p) => `${p.title} (${p.url})`).join('; ')
    return { answer: `Top projects: ${list}.`, sources: top.map((p) => p.url), intent, confidence: 0.9 }
  }

  if (intent === 'fit') {
    // map role keywords to desirable techs
    const roleMap: Record<string, string[]> = {
      frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'CSS'],
      backend: ['Node.js', 'Python', 'PostgreSQL', 'GraphQL'],
      'full-stack': ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      devops: ['Docker', 'AWS', 'GCP'],
    }

    let targetRole: string | null = null
    for (const r of Object.keys(roleMap)) if (ql.includes(r)) { targetRole = r; break }

    const allTechs = new Set<string>()
    for (const e of entries) for (const t of e.tech || []) allTechs.add(t)

    if (!targetRole) {
      // generic hiring fit: list top skills and sample projects
      const techs = topTechs(entries, 4)
      if (!techs.length) return { answer: "I don't have that information.", sources: [], intent, confidence: 0.85 }
      const ex = entries.slice(0, 2).map((p) => `${p.title} (${p.url})`).join('; ')
      return { answer: `Skills: ${techs.join(', ')}. Examples: ${ex}.`, sources: entries.slice(0, 2).map((p) => p.url), intent, confidence: 0.9 }
    }

    const required = roleMap[targetRole]
    const present = required.filter((r) => Array.from(allTechs).some((t) => t.toLowerCase().includes(r.toLowerCase())))
    const matchedCount = present.length
    const strength = matchedCount / required.length
    const strengthLabel = strength >= 0.66 ? 'Strong' : strength >= 0.33 ? 'Moderate' : 'Weak'
    const projectsWithMatch = entries.filter((e) => (e.tech || []).some((t) => present.some((p) => t.toLowerCase().includes(p.toLowerCase()))))
    const example = projectsWithMatch[0]
    const ans = `${strengthLabel} fit — matches ${matchedCount}/${required.length} skills (${present.join(', ') || 'none'}).` + (example ? ` Example: ${example.title} (${example.url}).` : '')
    return { answer: ans, sources: example ? [example.url] : [], intent, confidence: 0.9 }
  }

  // fallback: try to find a match across titles/tech/highlights
  const general = findProjectsByQuery(entries, question)
  if (general.length) {
    const e = general[0]
    return { answer: `${e.title} — ${shorten(e.description || '', 140)}`, sources: [e.url], intent: 'other', confidence: 0.85 }
  }

  return { answer: "I don't have that information.", sources: [], intent, confidence: 0.8 }
}

function shorten(s: string, max = 120) {
  const t = s.replace(/\s+/g, ' ').trim()
  return t.length <= max ? t : t.slice(0, max - 3).trim() + '...'
}

export default answerQuestion
