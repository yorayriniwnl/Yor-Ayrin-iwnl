import {
  FOOTER_LINK_GROUPS,
  NAV_LINKS,
  NAV_MENU_GROUPS,
  ORDERED_PROJECTS,
  SITE_PROFILE,
  SKILL_CATEGORIES,
} from './data'

export type SearchItem = {
  type: 'page' | 'project' | 'skill' | 'action'
  id: string
  title: string
  body: string
  url: string
  tags: string[]
  icon?: string
}

export type SearchResult = SearchItem & {
  score: number
  matchedTerms: string[]
}

export type SearchActionId =
  | 'download-resume'
  | 'copy-email'
  | 'copy-phone'
  | 'toggle-theme'
  | 'github'
  | 'open-assistant'
  | 'open-activity-feed'

const STOPWORDS = new Set(['a', 'an', 'the', 'is', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or'])

function tokenize(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/\W+/)
    .filter((token) => token.length > 0 && !STOPWORDS.has(token))
}

function iconForLabel(label: string): string {
  return label.slice(0, 1).toUpperCase() || '?'
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    const key = getKey(item)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function routeTags(label: string, href: string): string[] {
  const routeTokens = href
    .split('/')
    .filter(Boolean)
    .flatMap((segment) => segment.split('-'))

  return uniqueBy([...tokenize(label), ...routeTokens], (tag) => tag)
}

function buildPageItems(): SearchItem[] {
  const linkedPages = [
    ...NAV_LINKS,
    ...NAV_MENU_GROUPS.flatMap((group) => group.links),
    ...Object.values(FOOTER_LINK_GROUPS).flatMap((group) => group),
  ].filter((link) => !link.external && link.href.startsWith('/'))

  return uniqueBy(linkedPages, (link) => link.href).map((link) => ({
    type: 'page',
    id: link.href === '/' ? 'home' : link.href.slice(1).replace(/\//g, '-'),
    title: link.label,
    body: `${link.label} page`,
    url: link.href,
    tags: routeTags(link.label, link.href),
    icon: iconForLabel(link.label),
  }))
}

function buildProjectItems(): SearchItem[] {
  return ORDERED_PROJECTS.map((project) => ({
    type: 'project',
    id: project.id,
    title: project.title,
    body: project.shortDescription,
    url: `/projects/${project.id}`,
    tags: uniqueBy(
      [
        ...tokenize(project.title),
        ...tokenize(project.shortDescription),
        ...project.tech.map((tech) => tech.toLowerCase()),
        ...(project.tags ?? []).map((tag) => tag.toLowerCase()),
        project.category.toLowerCase(),
      ],
      (tag) => tag,
    ),
    icon: iconForLabel(project.title),
  }))
}

function buildSkillItems(): SearchItem[] {
  const skills = uniqueBy(
    Object.values(SKILL_CATEGORIES).flat(),
    (skill) => skill.name.toLowerCase(),
  )

  return skills.map((skill) => ({
    type: 'skill',
    id: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    title: skill.name,
    body: skill.desc ?? `Skill signal: ${skill.value}%`,
    url: `/skills#${skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    tags: uniqueBy(
      [...tokenize(skill.name), ...tokenize(skill.desc ?? ''), String(skill.value)],
      (tag) => tag,
    ),
    icon: iconForLabel(skill.name),
  }))
}

function buildActionItem(
  id: SearchActionId,
  title: string,
  body: string,
  url: string,
  tags: string[],
): SearchItem {
  return {
    type: 'action',
    id,
    title,
    body,
    url,
    tags,
    icon: iconForLabel(title),
  }
}

export const SEARCH_ITEMS: SearchItem[] = [
  ...buildPageItems(),
  ...buildProjectItems(),
  ...buildSkillItems(),
  buildActionItem(
    'download-resume',
    'Download Resume',
    'Download the recruiter-ready PDF resume.',
    '/resume.pdf',
    ['download', 'resume', 'pdf'],
  ),
  buildActionItem(
    'copy-email',
    'Copy Email',
    `Copy ${SITE_PROFILE.email} to your clipboard.`,
    '#copy-email',
    ['email', 'contact', 'clipboard'],
  ),
  buildActionItem(
    'copy-phone',
    'Copy Phone',
    `Copy ${SITE_PROFILE.phone} to your clipboard.`,
    '#copy-phone',
    ['phone', 'mobile', 'call', 'contact', 'clipboard'],
  ),
  buildActionItem(
    'toggle-theme',
    'Toggle Theme',
    'Switch between light and dark themes.',
    '#toggle-theme',
    ['theme', 'dark', 'light'],
  ),
  buildActionItem(
    'github',
    'Open GitHub',
    `View ${SITE_PROFILE.githubLabel}.`,
    SITE_PROFILE.githubHref,
    ['github', 'repos', 'code'],
  ),
  buildActionItem(
    'open-assistant',
    'Open Assistant',
    'Launch the built-in AI assistant panel.',
    '#open-assistant',
    ['assistant', 'ai', 'panel'],
  ),
  buildActionItem(
    'open-activity-feed',
    'Open Activity Feed',
    'Launch the GitHub activity feed panel.',
    '#open-activity-feed',
    ['activity', 'github', 'feed'],
  ),
]

export function search(query: string): SearchResult[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const results: SearchResult[] = []

  for (const item of SEARCH_ITEMS) {
    const titleLower = item.title.toLowerCase()
    const bodyLower = item.body.toLowerCase()
    let score = 0
    const matched = new Set<string>()

    for (const token of tokens) {
      let tokenScore = 0

      if (titleLower === token) tokenScore += 20
      else if (titleLower.startsWith(token)) tokenScore += 15
      else if (titleLower.includes(token)) tokenScore += 10

      if (bodyLower.includes(token)) tokenScore += 5

      for (const tag of item.tags) {
        if (tag === token) {
          tokenScore += 8
          break
        }

        if (tag.includes(token)) tokenScore += 4
      }

      if (tokenScore > 0) {
        score += tokenScore
        matched.add(token)
      }
    }

    if (item.type === 'action' && score > 0) score += 2

    if (tokens.length > 1) {
      const phrase = tokens.join(' ')
      if (titleLower.includes(phrase)) score += 10
    }

    if (score > 0) {
      results.push({
        ...item,
        score,
        matchedTerms: Array.from(matched),
      })
    }
  }

  return results.sort((left, right) => right.score - left.score).slice(0, 10)
}

export function getRecentItems(limit = 5): SearchItem[] {
  const preferredOrder = ['home', 'projects', 'resume', 'search', 'contact', 'dashboard']

  return preferredOrder
    .map((id) => SEARCH_ITEMS.find((item) => item.id === id && item.type === 'page'))
    .filter((item): item is SearchItem => Boolean(item))
    .slice(0, limit)
}

export function getActionItems(): SearchItem[] {
  return SEARCH_ITEMS.filter((item) => item.type === 'action')
}

export function getAllItems(): SearchItem[] {
  return [...SEARCH_ITEMS]
}
