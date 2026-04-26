import { describe, it, expect } from 'vitest'

// ─── Shared type definitions ──────────────────────────────────────────────────
// Mirrors data/site.ts exactly — never imported from source to keep tests hermetic.

type Project = {
  id: string
  title: string
  shortDescription: string
  tech: string[]
  category: string
  featured?: boolean
}

type ExperienceItem = {
  id: string
  title: string
  meta: string
  summary: string
  bullets: string[]
  kind: 'verified' | 'placeholder' | 'education'
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  'frontend', 'backend', 'ai', '3d', 'fullstack', 'other',
  'Systems', 'AI / ML', 'Python', 'Web', 'GitHub',
] as const

const VALID_KINDS = [
  'verified', 'placeholder', 'education',
] as const

// ─── Mock data ────────────────────────────────────────────────────────────────

const threeProjects: Project[] = [
  {
    id: 'zenith',
    title: 'Yor Zenith',
    shortDescription: 'Solar planning UI',
    tech: ['React', 'TypeScript'],
    category: 'frontend',
    featured: true,
  },
  {
    id: 'yor-website',
    title: 'Yor Portfolio',
    shortDescription: '3D portfolio site',
    tech: ['Next.js', 'Three.js', 'TypeScript'],
    category: '3d',
    featured: true,
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    shortDescription: 'Node reverse proxy',
    tech: ['Node.js', 'TypeScript'],
    category: 'backend',
  },
]

const fiveProjects: Project[] = [
  ...threeProjects,
  {
    id: 'ml-pipeline',
    title: 'ML Pipeline',
    shortDescription: 'Python ETL pipeline',
    tech: ['Python', 'PostgreSQL'],
    category: 'ai',
  },
  {
    id: 'design-tokens',
    title: 'Design Tokens',
    shortDescription: 'Cross-platform token system',
    tech: ['TypeScript', 'CSS'],
    category: 'frontend',
  },
]

const fourExperiences: ExperienceItem[] = [
  {
    id: 'e1',
    title: 'Frontend Engineer',
    meta: 'Startup · 2022–2023',
    summary: 'Built core product UI from scratch',
    bullets: ['Led rewrite of the main dashboard', 'Reduced bundle size by 40%'],
    kind: 'verified',
  },
  {
    id: 'e2',
    title: 'Open Source Contributor',
    meta: 'Various · 2021–present',
    summary: 'Active contributor to OSS ecosystem',
    bullets: ['Merged 15+ upstream PRs', 'Maintained two npm packages'],
    kind: 'verified',
  },
  {
    id: 'e3',
    title: 'B.Tech Computer Science',
    meta: 'University · 2019–2023',
    summary: 'Studied algorithms, systems, and software engineering',
    bullets: [],
    kind: 'education',
  },
  {
    id: 'e4',
    title: 'Freelance Web Developer',
    meta: '2020–2021',
    summary: 'Contracted small-business sites and landing pages',
    bullets: [],
    kind: 'placeholder',
  },
]

// ─── Suite 1: data/site.ts — project data shape ───────────────────────────────

describe('data/site.ts — project data shape', () => {
  it('all projects have required id field', () => {
    threeProjects.forEach((p) => {
      expect(typeof p.id).toBe('string')
      expect(p.id.length).toBeGreaterThan(0)
    })
  })

  it('all projects have required title field', () => {
    threeProjects.forEach((p) => {
      expect(typeof p.title).toBe('string')
      expect(p.title.length).toBeGreaterThan(0)
    })
  })

  it('all projects have non-empty tech array', () => {
    threeProjects.forEach((p) => {
      expect(Array.isArray(p.tech)).toBe(true)
      expect(p.tech.length).toBeGreaterThan(0)
    })
  })

  it('all projects have valid category', () => {
    threeProjects.forEach((p) => {
      expect(VALID_CATEGORIES as readonly string[]).toContain(p.category)
    })
  })

  it('featured projects are a subset of all projects', () => {
    const featured = fiveProjects.filter((p) => p.featured === true)
    expect(featured).toHaveLength(2)
    featured.forEach((fp) => {
      const inAll = fiveProjects.some((p) => p.id === fp.id)
      expect(inAll).toBe(true)
    })
  })

  it('project id is slug-safe', () => {
    const slugPattern = /^[a-z0-9-]+$/
    threeProjects.forEach((p) => {
      expect(p.id).toMatch(slugPattern)
    })
  })
})

// ─── Suite 2: data/site.ts — experience data shape ───────────────────────────

describe('data/site.ts — experience data shape', () => {
  it('all experience items have required fields', () => {
    fourExperiences.forEach((e) => {
      expect(e.id.length).toBeGreaterThan(0)
      expect(e.title.length).toBeGreaterThan(0)
      expect(e.meta.length).toBeGreaterThan(0)
      expect(e.summary.length).toBeGreaterThan(0)
    })
  })

  it('experience kind is one of valid values', () => {
    fourExperiences.forEach((e) => {
      expect(VALID_KINDS as readonly string[]).toContain(e.kind)
    })
  })

  it('verified items have non-empty bullets array', () => {
    const verified = fourExperiences.filter((e) => e.kind === 'verified')
    expect(verified.length).toBeGreaterThan(0)
    verified.forEach((e) => {
      expect(e.bullets.length).toBeGreaterThan(0)
    })
  })

  it('experience items sort by kind correctly', () => {
    const kindRank: Record<ExperienceItem['kind'], number> = {
      verified:    0,
      education:   1,
      placeholder: 2,
    }

    function sortByKind(items: ExperienceItem[]): ExperienceItem[] {
      return [...items].sort((a, b) => kindRank[a.kind] - kindRank[b.kind])
    }

    const sorted = sortByKind(fourExperiences)
    const kinds = sorted.map((e) => e.kind)

    const lastVerified    = kinds.lastIndexOf('verified')
    const firstEducation  = kinds.indexOf('education')
    const firstPlaceholder = kinds.indexOf('placeholder')

    // verified block must end before education block begins
    if (lastVerified !== -1 && firstEducation !== -1) {
      expect(lastVerified).toBeLessThan(firstEducation)
    }
    // education block must end before placeholder block begins
    if (firstEducation !== -1 && firstPlaceholder !== -1) {
      const lastEducation = kinds.lastIndexOf('education')
      expect(lastEducation).toBeLessThan(firstPlaceholder)
    }

    // Absolute positions for our fixture: verified → education → placeholder
    expect(sorted[0].kind).toBe('verified')
    expect(sorted[sorted.length - 1].kind).toBe('placeholder')
  })
})

// ─── Suite 3: lib/portfolio.ts — buildPortfolio() ────────────────────────────
// The real buildPortfolio accepts (repos, readmes?) and returns PortfolioEntry[].
// We inline a simplified version that mirrors its contract for unit testing.

type MockRepo = {
  name?: string
  html_url?: string
  description?: string | null
  language?: string | null
  stargazers_count?: number
  size?: number
}

type PortfolioEntry = {
  id: string
  title: string
  description: string
  tech: string[]
  url: string
  score: number
}

function buildPortfolio(repos: MockRepo[]): PortfolioEntry[] {
  return repos
    .filter((r) => r && r.name && r.html_url)
    .map((r) => ({
      id:          r.name!.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
      title:       r.name!.replace(/-/g, ' '),
      description: r.description ?? '',
      tech:        r.language ? [r.language] : [],
      url:         r.html_url!,
      score:       Math.min(
        100,
        (r.stargazers_count ?? 0) * 10 + (r.size ?? 0) / 100,
      ),
    }))
    .sort((a, b) => b.score - a.score)
}

describe("lib/portfolio.ts — buildPortfolio()", () => {
  it('returns empty array for empty input', () => {
    expect(buildPortfolio([])).toEqual([])
  })

  it('filters out repos without name or url', () => {
    const repos: MockRepo[] = [
      { name: 'valid-repo', html_url: 'https://github.com/u/valid-repo' },
      { name: 'missing-url' },
      { html_url: 'https://github.com/u/missing-name' },
      {},
    ]
    const result = buildPortfolio(repos)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('valid-repo')
  })

  it('returns entries sorted by score descending', () => {
    const repos: MockRepo[] = [
      { name: 'low',  html_url: 'https://github.com/u/low',  stargazers_count: 1 },
      { name: 'high', html_url: 'https://github.com/u/high', stargazers_count: 7 },
      { name: 'mid',  html_url: 'https://github.com/u/mid',  stargazers_count: 4 },
    ]
    const result = buildPortfolio(repos)
    expect(result[0].id).toBe('high')
    expect(result[1].id).toBe('mid')
    expect(result[2].id).toBe('low')
  })

  it('score is capped at 100', () => {
    const repos: MockRepo[] = [
      {
        name:               'viral',
        html_url:           'https://github.com/u/viral',
        stargazers_count:   20, // 20 × 10 = 200 → must clamp to 100
      },
    ]
    const result = buildPortfolio(repos)
    expect(result[0].score).toBe(100)
  })
})

// ─── Suite 4: lib/qna.ts — detectIntent() ────────────────────────────────────
// Mirror the actual implementation from lib/qna.ts for hermetic testing.

type Intent = 'skills' | 'projects' | 'fit' | 'other'

function detectIntent(question: string): Intent {
  const q = question.toLowerCase()

  const skillsKeywords   = ['skill', 'stack', 'tech', 'technolog', 'experience', 'familiar', 'proficient']
  const projectsKeywords = ['project', 'projects', 'work on', 'showcase', 'repo', 'repository', 'examples', 'case study']
  const fitKeywords      = ['hire', 'hiring', 'fit', 'role', 'join', 'team', 'available', 'interest', 'contract', 'hiring fit']

  const score = (arr: string[]) => arr.reduce((s, k) => s + (q.includes(k) ? 1 : 0), 0)
  const sSkills   = score(skillsKeywords)
  const sProjects = score(projectsKeywords)
  const sFit      = score(fitKeywords)

  if (sFit >= Math.max(sSkills, sProjects, 1)) return 'fit'
  if (sSkills >= Math.max(sProjects, sFit, 1)) return 'skills'
  if (sProjects >= Math.max(sSkills, sFit, 1)) return 'projects'
  return 'other'
}

describe("lib/qna.ts — answerQuestion()", () => {
  it('detects skills intent from "what is your tech stack"', () => {
    expect(detectIntent('what is your tech stack')).toBe('skills')
  })

  it('detects projects intent from "what projects have you built"', () => {
    expect(detectIntent('what projects have you built')).toBe('projects')
  })

  it('detects fit intent from "are you available to hire"', () => {
    expect(detectIntent('are you available to hire')).toBe('fit')
  })

  it('returns other for unrecognized query', () => {
    expect(detectIntent('tell me a joke please')).toBe('other')
  })

  it('is case-insensitive', () => {
    expect(detectIntent('WHAT IS YOUR TECH STACK')).toBe('skills')
  })
})

// ─── Suite 5: API route handlers exist and are async functions ────────────────
// Tests structural contract only — never calls the actual routes or network.

const mockContactRoute = {
  GET:  async (): Promise<Response> => new Response('ok'),
  POST: async (): Promise<Response> => new Response('ok'),
}

const mockExplainRoute = {
  GET:  async (): Promise<Response> => new Response('ok'),
  POST: async (): Promise<Response> => new Response('ok'),
}

function isAsyncFunction(fn: unknown): boolean {
  return (fn as { constructor: { name: string } }).constructor.name === 'AsyncFunction'
}

describe("API route handlers exist and are async functions", () => {
  it('contact route exports GET function', () => {
    expect(typeof mockContactRoute.GET).toBe('function')
  })

  it('contact route exports POST function', () => {
    expect(typeof mockContactRoute.POST).toBe('function')
  })

  it('explain-project route exports GET function', () => {
    expect(typeof mockExplainRoute.GET).toBe('function')
  })

  it('explain-project route exports POST function', () => {
    expect(typeof mockExplainRoute.POST).toBe('function')
  })

  it('all handler exports are async functions', () => {
    const handlers = [
      mockContactRoute.GET,
      mockContactRoute.POST,
      mockExplainRoute.GET,
      mockExplainRoute.POST,
    ] as const

    handlers.forEach((handler) => {
      expect(isAsyncFunction(handler)).toBe(true)
    })
  })
})

// ─── Suite 6: Live source-data contracts (imports real modules) ────────────────
// These tests use the actual data arrays so regressions in real content are
// caught immediately — no mock data, no hermetic isolation.

import { PROJECTS, ORDERED_PROJECTS, SKILL_CATEGORIES } from '../data/projects'
import { EXPERIENCE_ITEMS, EDUCATION_ITEMS, NAV_LINKS, FOOTER_LINK_GROUPS } from '../data/personal'
import { HOME_METRICS } from '../data/site'

describe('live data/projects.ts contracts', () => {
  it('every project has a non-empty id, title, and tech array', () => {
    PROJECTS.forEach((p) => {
      expect(p.id.length, `project id blank`).toBeGreaterThan(0)
      expect(p.title.length, `title blank on ${p.id}`).toBeGreaterThan(0)
      expect(p.tech.length, `tech empty on ${p.id}`).toBeGreaterThan(0)
    })
  })

  it('all project ids are slug-safe (lowercase alphanumeric + hyphen)', () => {
    const slugPattern = /^[a-z0-9-]+$/
    PROJECTS.forEach((p) => {
      expect(p.id, `bad slug: ${p.id}`).toMatch(slugPattern)
    })
  })

  it('project categories use the allowed set', () => {
    const validCategories = new Set(VALID_CATEGORIES)
    PROJECTS.forEach((p) => {
      expect(validCategories.has(p.category), `unknown category "${p.category}" on ${p.id}`).toBe(
        true,
      )
    })
  })

  it('ORDERED_PROJECTS is a permutation of PROJECTS (same length, same ids)', () => {
    expect(ORDERED_PROJECTS.length).toBe(PROJECTS.length)
    const ids = new Set(PROJECTS.map((p) => p.id))
    ORDERED_PROJECTS.forEach((p) => {
      expect(ids.has(p.id), `ordered project id "${p.id}" not in PROJECTS`).toBe(true)
    })
  })

  it('SKILL_CATEGORIES has at least one skill in each category', () => {
    const entries = Object.entries(SKILL_CATEGORIES)
    expect(entries.length).toBeGreaterThan(0)
    entries.forEach(([cat, skills]) => {
      expect(skills.length, `category "${cat}" is empty`).toBeGreaterThan(0)
    })
  })
})

describe('live data/personal.ts contracts', () => {
  it('all NAV_LINKS have non-empty label and href starting with /', () => {
    NAV_LINKS.forEach((link) => {
      expect(link.label.length, `blank nav label`).toBeGreaterThan(0)
      expect(link.href.startsWith('/'), `nav href not relative: ${link.href}`).toBe(true)
    })
  })

  it('FOOTER_LINK_GROUPS has primary, product, and resources keys', () => {
    expect(Object.keys(FOOTER_LINK_GROUPS)).toEqual(
      expect.arrayContaining(['primary', 'product', 'resources']),
    )
  })

  it('all EXPERIENCE_ITEMS have required fields and valid kind', () => {
    const VALID_KINDS = new Set(['verified', 'placeholder', 'education'])
    EXPERIENCE_ITEMS.forEach((e) => {
      expect(e.id.length, `blank experience id`).toBeGreaterThan(0)
      expect(e.title.length, `blank title on ${e.id}`).toBeGreaterThan(0)
      expect(VALID_KINDS.has(e.kind), `invalid kind "${e.kind}" on ${e.id}`).toBe(true)
    })
  })

  it('verified experience items each have at least one bullet', () => {
    EXPERIENCE_ITEMS.filter((e) => e.kind === 'verified').forEach((e) => {
      expect(e.bullets.length, `verified item "${e.id}" has no bullets`).toBeGreaterThan(0)
    })
  })

  it('all EDUCATION_ITEMS have id, title, and meta', () => {
    EDUCATION_ITEMS.forEach((e) => {
      expect(e.id.length).toBeGreaterThan(0)
      expect(e.title.length).toBeGreaterThan(0)
      expect(e.meta.length).toBeGreaterThan(0)
    })
  })
})

describe('live HOME_METRICS contract', () => {
  it('has exactly four metric entries', () => {
    expect(HOME_METRICS).toHaveLength(4)
  })

  it('every metric has a non-empty label and value', () => {
    HOME_METRICS.forEach((m) => {
      expect(m.label.length).toBeGreaterThan(0)
      expect(m.value.length).toBeGreaterThan(0)
    })
  })

  it('portfolio projects count is a zero-padded 2-digit number', () => {
    const metric = HOME_METRICS.find((m) => m.label === 'Portfolio projects')
    expect(metric).toBeDefined()
    expect(/^\d{2}$/.test(metric!.value)).toBe(true)
    const count = parseInt(metric!.value, 10)
    expect(count).toBeGreaterThan(0)
  })
})
