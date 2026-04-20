import {
  ACHIEVEMENT_ITEMS,
  EDUCATION_ITEMS,
  EXPERIENCE_ITEMS,
  PROJECTS,
  type AchievementItem,
  type ExperienceItem,
  type Project,
} from '../data/site'

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type TimelineKind =
  | 'experience'
  | 'education'
  | 'project'
  | 'achievement'

export type TimelineEntry = {
  id: string
  date: string
  dateDisplay: string
  title: string
  subtitle?: string
  description: string
  kind: TimelineKind
  tags?: string[]
  href?: string
  verified: boolean
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Legacy event type â€” preserved for backward compatibility with
// components/ui/Timeline.tsx which imports TimelineEvent
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type TimelineEvent = {
  id: string
  date: string
  title: string
  subtitle?: string
  description?: string
  type: 'education' | 'project' | 'milestone'
  link?: string
  tags?: string[]
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'portfolio-foundation',
    date: 'Current portfolio',
    title: 'Editorial product system',
    subtitle: 'Verified site work',
    description:
      'The portfolio itself now functions as a product system with shared tokens, reusable components, and route-level consistency.',
    type: 'milestone',
    link: '/stats',
    tags: ['Design system', 'Next.js'],
  },  {
    id: 'zenith',
    date: 'Flagship project',
    title: 'Yor Zenith - Solar Energy Planning',
    description:
      'Solar planning platform for rooftop feasibility analysis, generation estimation, subsidy-aware logic, and React/Three.js dashboards.',
    type: 'project',
    link: '/projects/zenith',
    tags: ['Solar', 'Python', 'React', 'Three.js'],
  },  {
    id: 'ai-detector',
    date: 'Public project',
    title: 'Yor AI vs Real Image',
    description:
      'Computer vision pipeline using OpenCV, LBP/GLCM features, Scikit-Learn SVM, and Streamlit.',
    type: 'project',
    link: '/projects/ai-detector',
    tags: ['AI', 'OpenCV', 'Scikit-Learn'],
  },  {
    id: 'mentor-mentee',
    date: 'Public project',
    title: 'Mentor-Mentee System',
    description:
      'Python mentorship coordination system with Flask API support, matching logic, SQLite, and Tkinter.',
    type: 'project',
    link: '/projects/mentor-mentee',
    tags: ['Python', 'Flask', 'SQLite'],
  },
  {
    id: 'verified-experience',
    date: 'Verified experience',
    title: 'Portfolio-led evidence',
    subtitle: 'Using public work instead of invented job history',
    description:
      'Professional history remains intentionally unfilled until verified details are available. The current timeline prioritizes public evidence over speculation.',
    type: 'milestone',
    link: '/experience',
    tags: ['Trust', 'Recruiter-ready'],
  },
  {
    id: 'education-kiit',
    date: 'Aug 2023',
    title: 'B.Tech CS & Communication Engineering - KIIT',
    subtitle: 'Expected Graduation: 2027',
    description:
      'Pursuing Computer Science & Communication Engineering at KIIT Deemed to be University, expected graduation 2027.',
    type: 'education',
    link: '/resume',
    tags: ['KIIT', 'CS Engineering', '2027'],
  },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function formatDateDisplay(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function compareDatesDesc(a: string, b: string): number {
  return new Date(b).getTime() - new Date(a).getTime()
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Builders â€” one per data source
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function entriesFromExperience(items: ExperienceItem[]): TimelineEntry[] {
  return items
    .filter((item) => Boolean(item.date))
    .map((item): TimelineEntry => ({
      id:          `exp-${item.id}`,
      date:        item.date as string,
      dateDisplay: item.dateDisplay ?? formatDateDisplay(item.date as string),
      title:       item.title,
      subtitle:    item.meta,
      description: item.summary,
      kind:        item.kind === 'education' ? 'education' : 'experience',
      verified:    item.kind === 'verified',
    }))
}

function entriesFromProjects(items: Project[]): TimelineEntry[] {
  return items
    .filter((item) => Boolean(item.date) && !item.autoGenerated)
    .map((item): TimelineEntry => ({
      id:          `proj-${item.id}`,
      date:        item.date as string,
      dateDisplay: formatDateDisplay(item.date as string),
      title:       item.title,
      description: item.shortDescription,
      kind:        'project',
      tags:        item.tags,
      href:        `/projects/${item.id}`,
      verified:    true,
    }))
}

function entriesFromAchievements(items: AchievementItem[]): TimelineEntry[] {
  return items
    .filter((item) => Boolean(item.date))
    .map((item): TimelineEntry => ({
      id:          `ach-${item.id}`,
      date:        item.date as string,
      dateDisplay: item.dateDisplay ?? formatDateDisplay(item.date as string),
      title:       item.title,
      description: item.detail,
      kind:        'achievement',
      href:        item.href,
      verified:    item.kind === 'verified',
    }))
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Public API
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Build a unified, deduplicated, chronologically sorted timeline from all
 * data sources. Newest first by default.
 *
 * Pass `ascending: true` if the page needs oldest-first order (e.g. a
 * career story that reads top-to-bottom).
 */
export function buildTimeline(options: { ascending?: boolean } = {}): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    ...entriesFromExperience([...EXPERIENCE_ITEMS, ...EDUCATION_ITEMS]),
    ...entriesFromProjects(PROJECTS),
    ...entriesFromAchievements(ACHIEVEMENT_ITEMS),
  ]

  const seen = new Set<string>()
  const unique = entries.filter((entry) => {
    if (seen.has(entry.id)) return false
    seen.add(entry.id)
    return true
  })

  unique.sort((a, b) => compareDatesDesc(a.date, b.date))

  return options.ascending ? unique.reverse() : unique
}

/**
 * A pre-built descending timeline exported as a constant so server
 * components can import it without calling the builder at runtime.
 */
export const TIMELINE: TimelineEntry[] = buildTimeline()

/**
 * A pre-built ascending timeline for story-arc pages that read top-to-bottom.
 */
export const TIMELINE_ASC: TimelineEntry[] = buildTimeline({ ascending: true })

/**
 * Returns counts by kind â€” useful for summary stats or hero metrics.
 */
export function timelineStats(entries: TimelineEntry[] = TIMELINE): Record<TimelineKind, number> {
  return entries.reduce(
    (acc, entry) => {
      acc[entry.kind] = (acc[entry.kind] ?? 0) + 1
      return acc
    },
    { experience: 0, education: 0, project: 0, achievement: 0 } as Record<TimelineKind, number>,
  )
}
