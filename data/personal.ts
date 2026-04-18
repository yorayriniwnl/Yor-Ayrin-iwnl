// ─── Types ───────────────────────────────────────────────────────────────────

export type NavLink = {
  label: string
  href: string
  external?: boolean
}

export type ExperienceItem = {
  id: string
  title: string
  meta: string
  summary: string
  bullets: string[]
  kind: 'verified' | 'placeholder' | 'education'
  date?: string
  dateDisplay?: string
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export const SITE_PROFILE = {
  name: 'Ayush Roy',
  alias: 'Yor Ayrin Iwnl',
  role: 'Full Stack Developer Intern Candidate - Product Builder',
  summary:
    'Full-stack focused B.Tech Computer Science and Communication Engineering student at KIIT building Next.js product surfaces, Python backend systems, realtime dashboards, computer-vision tools, and interactive web experiences.',
  recruiterSummary:
    'Full-stack developer intern candidate at KIIT, expected graduation 2027, with hands-on project work across Next.js, React, TypeScript, FastAPI, Flask, Python, SQL, Three.js, OpenCV, Scikit-Learn, Docker, and GitHub-driven product delivery.',
  seekingStatement: 'I am currently seeking full stack developer internship opportunities where product thinking and engineering execution both matter.',
  availability: 'Open to internships, entry-level software roles, and remote collaboration.',
  email: 'yorayriniwnl@gmail.com',
  phone: '+91 8918940799',
  githubLabel: 'github.com/yorayriniwnl',
  githubHref: 'https://github.com/yorayriniwnl',
  linkedinLabel: 'linkedin.com/in/yorayriniwnl',
  linkedinHref: 'https://linkedin.com/in/yorayriniwnl',
  steamLabel: 'steamcommunity.com/id/YorAyriniwnl',
  steamHref: process.env.NEXT_PUBLIC_STEAM_PROFILE_URL ?? 'https://steamcommunity.com/id/YorAyriniwnl',
  websiteLabel: 'yorayriniwnl.vercel.app',
  websiteHref: 'https://yorayriniwnl.vercel.app',
  avatarSrc: '/images/profile.svg',
} as const

// ─── Links ────────────────────────────────────────────────────────────────────

export const SITE_LINKS = [
  { id: 'github', label: SITE_PROFILE.githubLabel, href: SITE_PROFILE.githubHref },
  { id: 'linkedin', label: SITE_PROFILE.linkedinLabel, href: SITE_PROFILE.linkedinHref },
  { id: 'email', label: SITE_PROFILE.email, href: `mailto:${SITE_PROFILE.email}` },
  { id: 'resume', label: 'Resume PDF', href: '/resume.pdf' },
] as const

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Skills', href: '/skills' },
  { label: 'Games', href: '/games' },
  { label: 'Steam', href: '/steam' },
  { label: 'Hobbies', href: '/hobbies' },
  { label: 'Contact', href: '/contact' },
]

export const FOOTER_LINK_GROUPS: Record<'primary' | 'product' | 'resources', NavLink[]> = {
  primary: [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Experience', href: '/experience' },
    { label: 'Skills', href: '/skills' },
  ],
  product: [
    { label: 'Games', href: '/games' },
    { label: 'Achievements', href: '/achievements' },
    { label: 'Steam Profile', href: '/steam' },
    { label: 'Stats', href: '/stats' },
    { label: 'Value Education', href: '/value-education' },
    { label: 'Settings', href: '/settings' },
  ],
  resources: [
    { label: 'Resume', href: '/resume' },
    { label: 'CV', href: '/cv' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Media', href: '/media' },
    { label: 'Hobbies', href: '/hobbies' },
    { label: 'GitHub', href: SITE_PROFILE.githubHref, external: true },
  ],
}

export const SECTIONS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'experience', label: 'Experience', href: '/experience' },
  { id: 'skills', label: 'Skills', href: '/skills' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

// ─── Experience ───────────────────────────────────────────────────────────────

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'verified-portfolio-work',
    title: 'Independent Project Work',
    meta: 'Self-directed - Resume and GitHub verified',
    summary:
      'Built internship-ready full-stack projects across realtime systems, decision-support products, and computer vision, supported by public GitHub repositories.',
    bullets: [
      'Built Yor Helios using FastAPI, WebSocket alert streaming, and dashboard workflows for realtime operational monitoring.',
      'Designed and built Yor Zenith, a solar planning platform with React and Three.js dashboards for rooftop feasibility and energy generation simulation.',
      'Developed an ML image classifier using OpenCV, LBP/GLCM features, Scikit-Learn SVM, and Streamlit to classify AI-generated versus real photographs.',
      'Maintains public GitHub repositories spanning Next.js web products, Python backend systems, and applied ML/CV projects.',
    ],
    kind: 'verified',
    date: '2026-04-13',
    dateDisplay: 'Resume verified',
  },
  {
    id: 'portfolio-platform',
    title: 'Portfolio Platform',
    meta: 'Personal site - yorayriniwnl.vercel.app',
    summary:
      'Maintains this portfolio as a recruiter-facing product surface with Next.js routing, resume workflows, GitHub-backed data, AI/chat helpers, and interactive sections.',
    bullets: [
      'Architected multi-page routing, shared design tokens, and a consistent editorial system across 18+ active routes.',
      'Integrated public GitHub activity, an AI chat widget, and Three.js experiments while preserving product clarity.',
      'Reconciled stale portfolio claims against live GitHub repositories and resume data for recruiter-facing accuracy.',
    ],
    kind: 'verified',
    date: '2026-01-01',
    dateDisplay: 'Jan 2026 - Present',
  },
]

export const EDUCATION_ITEMS: ExperienceItem[] = [
  {
    id: 'kiit-btech',
    title: 'B.Tech - Computer Science & Communication Engineering',
    meta: 'KIIT Deemed to be University - Expected Graduation: 2027',
    summary:
      'Pursuing B.Tech in Computer Science and Communication Engineering at KIIT Deemed to be University.',
    bullets: [
      'Expected graduation: 2027.',
      'Resume-backed technical focus includes web development, machine learning, computer vision, and SQL fundamentals.',
      'Active in self-directed development work alongside university curriculum.',
    ],
    kind: 'education',
    date: '2023-08-01',
    dateDisplay: '2023 - 2027 expected',
  },
  {
    id: 'kv-burdwan',
    title: 'CBSE - Class XII & X',
    meta: 'Kendriya Vidyalaya, Burdwan',
    summary:
      'Completed secondary and senior secondary education under the Central Board of Secondary Education.',
    bullets: [],
    kind: 'education',
    date: '2022-05-01',
    dateDisplay: 'Completed 2022',
  },
]
