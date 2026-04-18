/**
 * data/home.ts
 *
 * Homepage-specific static data previously hardcoded inside HomeClient.tsx.
 * Imported by components/home/* section components.
 */

import { ORDERED_PROJECTS } from './projects'
import { SITE_PROFILE } from './personal'

// ---------------------------------------------------------------------------
// Ticker
// ---------------------------------------------------------------------------
export const HOME_TICKER_ITEMS = [
  'Studio Notes',
  'Case Study Thinking',
  'Interface Craft',
  'Systems in Practice',
  'Design Tokens',
  'Recruiter Mode',
  'Game Experiments',
  'Portfolio Architecture',
] as const

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

/** Top-9 GitHub-linked projects shown on the homepage grid. */
export const HOME_PROJECTS = ORDERED_PROJECTS.filter((p) => p.github).slice(0, 9)

/** GitHub owner extracted from SITE_PROFILE so there's a single source of truth. */
export const GITHUB_OWNER =
  SITE_PROFILE.githubHref.match(/github\.com\/([^/]+)/)?.[1] ?? 'yorayriniwnl'

/** CSS class applied to project badge by category. */
export const PROJECT_BADGE_CLASS_MAP: Record<string, string> = {
  Systems: 'badge-premium',
  'AI / ML': 'badge-premium',
  Python: 'badge-premium',
  Web: 'badge-premium',
  GitHub: 'badge-premium',
}

// ---------------------------------------------------------------------------
// Feature layer
// ---------------------------------------------------------------------------

export type HomeFeatureLink = {
  eyebrow: string
  title: string
  summary: string
  href: string
  status: string
}

export const HOME_FEATURE_LINKS: HomeFeatureLink[] = [
  {
    eyebrow: 'Dashboard',
    title: 'Portfolio command dashboard',
    summary:
      'A focused dashboard surface for metrics, recruiter signals, and portfolio operating context.',
    href: '/dashboard',
    status: 'Live',
  },
  {
    eyebrow: 'Profile',
    title: 'Profile and proof shell',
    summary:
      'Central profile page that keeps identity, contact paths, resume signals, and public proof connected.',
    href: '/profile',
    status: 'Live',
  },
  {
    eyebrow: 'Case Study',
    title: 'Project case-study route',
    summary:
      'Deep project pages for turning GitHub work into readable product, technical, and decision notes.',
    href: '/projects/zenith',
    status: 'Featured',
  },
  {
    eyebrow: 'Games',
    title: 'Playable game layer',
    summary:
      'Interactive games and experiments linked into the portfolio instead of sitting as hidden routes.',
    href: '/games',
    status: 'Interactive',
  },
  {
    eyebrow: 'Search',
    title: 'Search and command surface',
    summary:
      'A fast way to jump across pages, projects, skills, resume actions, and theme controls.',
    href: '/search',
    status: 'Utility',
  },
  {
    eyebrow: 'Archive',
    title: 'Gallery, timeline, and Steam layer',
    summary:
      'Visual proof, career timeline, and hobby-facing pages grouped into one scannable site layer.',
    href: '/gallery',
    status: 'Curated',
  },
]

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export type SkillGroup = {
  title: string
  items: [string, number][]
}

export const HOME_SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Frontend',
    items: [
      ['React', 82],
      ['Next.js', 84],
      ['HTML / CSS', 82],
      ['TailwindCSS', 80],
      ['TypeScript', 65],
      ['Three.js', 72],
    ],
  },
  {
    title: 'Backend',
    items: [
      ['FastAPI', 76],
      ['Flask', 74],
      ['Node.js', 68],
      ['WebSocket', 72],
    ],
  },
  {
    title: 'ML / CV',
    items: [
      ['Python', 84],
      ['OpenCV', 76],
      ['Scikit-Learn', 74],
      ['Streamlit', 70],
    ],
  },
  {
    title: 'Tools',
    items: [
      ['Docker', 64],
      ['Git / GitHub', 90],
      ['VS Code', 88],
      ['SQL', 58],
      ['Java / C basics', 52],
    ],
  },
]

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export type HomeExperienceItem = {
  title: string
  date?: string
  meta: string
  summary: string
  bullets: string[]
  kind: string
  kindClass: string
}

export const HOME_EXPERIENCE_ITEMS: HomeExperienceItem[] = [
  {
    title: 'Independent Project Work',
    date: 'Resume verified',
    meta: 'Full-stack product builds, realtime systems, and ML/CV execution',
    summary:
      'The strongest internship-ready signal comes from shipped full-stack projects and current public repositories.',
    bullets: [
      'Built Yor Helios with FastAPI, WebSocket alerts, and dashboard workflows for realtime monitoring.',
      'Built Yor Zenith with React and Three.js dashboards for rooftop feasibility and solar generation planning.',
      'Built an AI-vs-real image classifier using OpenCV, LBP/GLCM features, Scikit-Learn SVM, and Streamlit.',
    ],
    kind: 'Verified',
    kindClass: 'kind-verified',
  },
  {
    title: 'Portfolio Platform',
    date: 'Jan 2026 - Present',
    meta: 'Current site work',
    summary:
      'This website is maintained as a product surface with resume pages, project pages, data files, GitHub imports, and recruiter-mode presentation.',
    bullets: [
      'Centralized profile, project, skill, education, and achievement data around resume and GitHub evidence.',
      'Preserved working features including contact, onboarding, 3D previews, and the playable game layer.',
      'Replaced stale claims and old repo links with current GitHub-backed project information.',
    ],
    kind: 'Verified',
    kindClass: 'kind-verified',
  },
  {
    title: 'B.Tech - Computer Science & Communication Engineering',
    meta: 'KIIT Deemed to be University - Expected Graduation: 2027',
    summary:
      'Pursuing B.Tech in Computer Science and Communication Engineering with self-directed project work alongside university coursework.',
    bullets: [
      'Resume-backed technical focus: web development, machine learning, computer vision, and SQL fundamentals.',
    ],
    kind: 'Education',
    kindClass: 'kind-education',
  },
  {
    title: 'CBSE Education',
    meta: 'Kendriya Vidyalaya, Burdwan',
    summary: 'Completed senior secondary and secondary education under CBSE.',
    bullets: ['Completed senior secondary and secondary education under CBSE.'],
    kind: 'Education',
    kindClass: 'kind-education',
  },
]

// ---------------------------------------------------------------------------
// Blog / Hobbies preview
// ---------------------------------------------------------------------------

export type HomeBlogPreview = {
  cat: string
  catClass: string
  title: string
  excerpt: string
  date: string
  read: string
  featured?: boolean
}

export const HOME_BLOG_PREVIEWS: HomeBlogPreview[] = [
  {
    cat: 'Case Study',
    catClass: 'cat-life',
    title: 'Turning One Strong Editorial Layout into a Full Product System',
    excerpt:
      'Refactoring the portfolio around the blog page meant turning a single strong surface into a reusable system instead of letting every route drift into its own aesthetic. This is how one decision propagated into eighteen pages.',
    date: 'Apr 09, 2026',
    read: '7 min read',
    featured: true,
  },
  {
    cat: 'Project Notes',
    catClass: 'cat-personal',
    title: 'What Yor Zenith Taught Me About Decision-Support Interfaces',
    excerpt:
      'Domain-heavy tools only feel premium when the interface explains complexity instead of hiding it.',
    date: 'Apr 08, 2026',
    read: '5 min read',
  },
  {
    cat: 'Build Log',
    catClass: 'cat-real',
    title: 'The Difference Between Fancy and Hireable UI',
    excerpt:
      'The most useful polish work was not animation. It was fixing spacing rhythm, card hierarchy, and information density.',
    date: 'Apr 07, 2026',
    read: '4 min read',
  },
  {
    cat: 'Systems',
    catClass: 'cat-thoughts',
    title: 'Designing Placeholder States Without Lying to the Viewer',
    excerpt:
      'Steam-inspired sections only work here if they tell the truth. Real signals stay real; missing data stays labeled.',
    date: 'Apr 06, 2026',
    read: '4 min read',
  },
  {
    cat: 'Playground',
    catClass: 'cat-personal',
    title: 'Why a Small Browser Game Belongs in a Serious Portfolio',
    excerpt:
      'The local arcade game changes the tone. It proves the site can carry playfulness without dropping product discipline.',
    date: 'Apr 05, 2026',
    read: '5 min read',
  },
]
