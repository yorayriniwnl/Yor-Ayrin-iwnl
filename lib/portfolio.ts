/**
 * Minimal, deterministic portfolio pipeline.
 *
 * Functions:
 * - buildPortfolio(repos, readmes) -> PortfolioEntry[]
 * - helper utilities exported for reuse/tests
 *
 * The implementation prefers simple, deterministic heuristics (no randomness).
 */

export type GitHubRepo = {
  name: string
  full_name?: string
  html_url: string
  description?: string | null
  language?: string | null
  topics?: string[] | null
  stargazers_count?: number
  forks_count?: number
  watchers_count?: number
  size?: number // KB
}

export type PortfolioEntry = {
  id?: string // slug-safe id (lowercase)
  title: string
  description: string
  tech: string[]
  highlights: string[]
  url: string
  score: number // 0..100
  scores: { impact: number; complexity: number; uniqueness: number }
  source?: { repoName: string; repoFullName?: string; repoDescription?: string | null }
}

export type UserProfile = {
  id?: string
  name?: string
  role?: string
  email?: string
  summary?: string
  website?: string
  github?: string
  linkedin?: string
  avatar?: string
}

export type PortfolioDocument = {
  profile?: UserProfile
  projects: PortfolioEntry[]
  generatedAt: string
  source?: string
}

function clamp(n: number, lo = 0, hi = 10) {
  return Math.max(lo, Math.min(hi, n))
}

function titleFromRepoName(name: string) {
  if (!name) return ''
  return name
    .replace(/[_\.\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(' ')
}

function firstParagraph(text?: string): string | null {
  if (!text) return null
  // remove leading badges and title lines
  const cleaned = text.replace(/^#.*$/gm, '').replace(/\n{2,}/g, '\n\n').trim()
  const parts = cleaned.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  if (!parts.length) return null
  const first = parts[0].replace(/\s+/g, ' ')
  return first
}

function extractSection(readme: string, headings: string[]) {
  const hpat = headings.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const re = new RegExp('(?:^|\\n)#{1,3}\\s*(?:' + hpat + ')[^\\n]*\\n([\\s\\S]*?)(?=\\n#{1,3}\\s|$)', 'i')
  const m = readme.match(re)
  if (!m) return null
  return m[1].trim()
}

function parseTechFromReadme(readme?: string): string[] {
  if (!readme) return []
  const sections = ['technolog', 'tech', 'stack', 'built with', 'dependencies']
  const s = extractSection(readme, sections)
  const list: string[] = []
  if (s) {
    s.split('\n').forEach((line) => {
      const l = line.trim().replace(/^[-*\d\.\)\s]*/, '')
      if (!l) return
      l.split(/[,:\/\|•·]/).forEach((tok) => {
        const t = tok.trim()
        if (t) list.push(t)
      })
    })
  }
  // inline patterns like "Built with: React, TypeScript"
  const inline = readme.match(/(?:built with|technolog(?:ies)?|stack)[:\s]+([^\n]+)/i)
  if (inline) {
    inline[1].split(/[,:\/\|•·]/).forEach((tok) => { const t = tok.trim(); if (t) list.push(t) })
  }
  return list.map((s) => s.trim()).filter(Boolean)
}

function parseHighlightsFromReadme(readme?: string): string[] {
  if (!readme) return []
  const sections = ['highlights', 'features', 'what it does', 'key features', 'summary']
  const s = extractSection(readme, sections)
  const out: string[] = []
  if (s) {
    s.split('\n').forEach((line) => {
      const l = line.trim().replace(/^[-*\d\.\)\s]*/, '')
      if (!l) return
      out.push(l.replace(/\s+/g, ' ').trim())
    })
    return out.filter(Boolean).slice(0, 6)
  }

  // Fallback: try to gather bullet points across README
  const bullets = Array.from(readme.matchAll(/^\s*[-*]\s+(.+)$/gim)).map((m) => m[1].trim())
  if (bullets.length) return bullets.slice(0, 4)

  return []
}

const TECH_CANON: Record<string, string> = {
  js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript', react: 'React', 'react.js': 'React', 'next': 'Next.js', 'nextjs': 'Next.js', 'next.js': 'Next.js', node: 'Node.js', nodejs: 'Node.js', deno: 'Deno', python: 'Python', py: 'Python', rust: 'Rust', go: 'Go', golang: 'Go', docker: 'Docker', aws: 'AWS', azure: 'Azure', gcp: 'GCP', graphql: 'GraphQL', tailwind: 'Tailwind CSS', tailwindcss: 'Tailwind CSS', css: 'CSS', html: 'HTML', postgres: 'PostgreSQL', postgresql: 'PostgreSQL', mongo: 'MongoDB', mongodb: 'MongoDB'
}

function normalizeTech(tokens: string[], repo?: GitHubRepo) {
  const seen = new Set<string>()
  const push = (v?: string) => { if (!v) return; const t = v.trim(); if (!t) return; if (!seen.has(t)) { seen.add(t); arr.push(t) } }
  const arr: string[] = []

  // prefer explicit tokens
  tokens.forEach((tok) => {
    const key = tok.toLowerCase().replace(/[^a-z0-9\.\+\-]+/g, ' ').trim()
    const words = key.split(/\s+/)
    for (const w of words) {
      const mapped = TECH_CANON[w] || (w.length > 1 ? w[0].toUpperCase() + w.slice(1) : w)
      push(mapped)
    }
  })

  // add repo language if not present
  if (repo?.language) {
    const lang = repo.language.trim()
    const mapped = TECH_CANON[lang.toLowerCase()] || lang
    if (!seen.has(mapped)) arr.unshift(mapped)
  }

  return arr.slice(0, 12)
}

function polishDescription(raw?: string, repo?: GitHubRepo) {
  const base = (raw || repo?.description || 'Open-source project').trim()
  // one sentence
  const firstSent = base.split(/\.(\s|$)/)[0].trim()
  const s = firstSent.replace(/\s+/g, ' ')
  if (s.length <= 200) return s.endsWith('.') ? s : s + '.'
  return s.slice(0, 197).trim() + '...'
}

function polishHighlight(h: string) {
  const s = h.replace(/\s+/g, ' ').trim()
  if (s.length <= 100) return s
  return s.slice(0, 97).trim() + '...'
}

function scoreProject(repo: GitHubRepo, readme?: string) {
  const stars = repo.stargazers_count || 0
  const forks = repo.forks_count || 0
  const size = repo.size || 0
  const topicsCount = (repo.topics || []).length
  const codeBlocks = readme ? (readme.match(/```/g) || []).length : 0

  // Impact: driven by stars + forks (log scale)
  const impactRaw = Math.log10(stars + 1) * 3 + Math.log10(forks + 1) * 1.2
  const impact = clamp(impactRaw, 0, 10)

  // Complexity: repo size + code examples in README
  const complexityRaw = Math.log10(size + 1) * 1.8 + Math.min(4, codeBlocks) * 0.9 + (topicsCount > 3 ? 0.8 : 0)
  const complexity = clamp(complexityRaw, 0, 10)

  // Uniqueness: topics + uncommon language + keywords
  const uncommon = repo.language ? ['rust', 'go', 'haskell', 'elixir', 'clojure', 'scala', 'zig'].includes(repo.language.toLowerCase()) : false
  const novelty = readme && /novel|research|prototype|experimental|first-of-its-kind/i.test(readme) ? 1.5 : 0
  const uniquenessRaw = topicsCount * 1.0 + (uncommon ? 2 : 0) + novelty
  const uniqueness = clamp(uniquenessRaw, 0, 10)

  const total = Math.round((0.5 * impact + 0.3 * complexity + 0.2 * uniqueness) * 10)
  return { impact: Math.round(impact * 10) / 10, complexity: Math.round(complexity * 10) / 10, uniqueness: Math.round(uniqueness * 10) / 10, total }
}

/**
 * Build a portfolio from a list of GitHub repo objects and optional README contents.
 * - repos: array of GitHub-like repo objects
 * - readmes: mapping from repo.full_name || repo.name -> README markdown string
 */
export function buildPortfolio(repos: GitHubRepo[], readmes?: Record<string, string | undefined>): PortfolioEntry[] {
  const entries: PortfolioEntry[] = []

  for (const repo of repos) {
    const key = (repo.full_name || repo.name || '').toString()
    const readme = readmes && key in readmes ? readmes[key] : undefined

    const rawDesc = firstParagraph(readme) || repo.description || ''
    const description = polishDescription(rawDesc, repo)

    const rawTech = parseTechFromReadme(readme)
    const tech = normalizeTech(rawTech, repo)

    const rawHighlights = parseHighlightsFromReadme(readme)
    const highlights = (rawHighlights.length ? rawHighlights : []).map(polishHighlight).slice(0, 4)
    if (!highlights.length) {
      // fallback highlights
      if ((repo.stargazers_count || 0) > 0) highlights.push(`Open-source — ${repo.stargazers_count} stars`)
      if (repo.language) highlights.push(`Built with ${repo.language}`)
      if (tech.length) highlights.push(`Stack: ${tech.slice(0, 3).join(', ')}`)
    }

    const scores = scoreProject(repo, readme)

    const entry: PortfolioEntry = {
        id: (repo.name || repo.full_name || '').toString().toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)/g, ''),
        title: titleFromRepoName(repo.name),
      description,
      tech,
      highlights,
      url: repo.html_url,
      score: scores.total,
      scores: { impact: scores.impact, complexity: scores.complexity, uniqueness: scores.uniqueness },
      source: { repoName: repo.name, repoFullName: repo.full_name, repoDescription: repo.description },
    }
    entries.push(entry)
  }

  // deterministic sort: score desc, then title asc
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.title.localeCompare(b.title)
  })

  return entries
}

export default buildPortfolio

/**
 * Build a full portfolio document including optional user profile metadata.
 */
export function buildPortfolioDocument(profile: UserProfile | undefined, repos: GitHubRepo[], readmes?: Record<string, string | undefined>): PortfolioDocument {
  const projects = buildPortfolio(repos, readmes)
  return {
    profile: profile || undefined,
    projects,
    generatedAt: new Date().toISOString(),
    source: 'generated',
  }
}
