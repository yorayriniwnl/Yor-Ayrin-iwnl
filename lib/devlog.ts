export type DevLogEntry = {
  id: string
  date: string
  title: string
  body: string
  tags: string[]
}

const DEVLOG_ENTRIES: DevLogEntry[] = [
  {
    id: 'd1',
    date: '2024-11-10',
    title: 'Rebuilt the hero section from scratch',
    body: 'Spent 3 hours fighting CSS perspective transforms. The parallax finally feels right. Key insight: compositor-only transforms are everything for 60fps.',
    tags: ['css', 'performance', 'hero'],
  },
  {
    id: 'd2',
    date: '2024-11-05',
    title: 'Added Three.js to the skills page',
    body: 'First time using @react-three/fiber in production. The dynamic import pattern with ssr:false saves the day every single time.',
    tags: ['threejs', 'r3f', '3d'],
  },
  {
    id: 'd3',
    date: '2024-10-28',
    title: 'Fixed the contact form rate limiting bug',
    body: 'The in-memory Map was being garbage collected between serverless function cold starts. Solution: moved to a request-scoped approach with proper TTL headers.',
    tags: ['backend', 'api', 'bug'],
  },
  {
    id: 'd4',
    date: '2024-10-20',
    title: 'Shipped the recruiter dashboard',
    body: 'Built a full single-screen recruiter view. The hardest part was making it feel fast to scan. Ended up removing 40% of what I originally planned.',
    tags: ['ui', 'recruiter', 'design'],
  },
  {
    id: 'd5',
    date: '2024-10-12',
    title: 'Migrated to Next.js 16 App Router',
    body: 'The layout.tsx nesting is elegant once you stop fighting it. Server components cut my bundle size by 30%. Worth the migration pain.',
    tags: ['nextjs', 'migration', 'performance'],
  },
]

export function getDevLogEntries(): DevLogEntry[] {
  return DEVLOG_ENTRIES.slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getDevLogByTag(tag: string): DevLogEntry[] {
  return getDevLogEntries().filter(entry => entry.tags.includes(tag))
}

export function getAllTags(): string[] {
  const set = new Set<string>()
  DEVLOG_ENTRIES.forEach(entry => entry.tags.forEach(t => set.add(t)))
  return Array.from(set).sort()
}
