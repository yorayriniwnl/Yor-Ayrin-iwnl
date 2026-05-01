import { SITE_PROFILE } from '../data/site'

export type ResumeEntry = {
  title: string
  summary: string
  meta: string
  bullets?: string[]
  linkLabel?: string
  linkHref?: string
}

export type ResumeSkillGroup = {
  title: string
  skills: string[]
}

export const RESUME_PROFILE = {
  name: SITE_PROFILE.name,
  role: 'Full-Stack Developer - Software Engineering Intern',
  summary:
    'B.Tech Computer Science student at KIIT University, graduating in 2027, with hands-on experience building full-stack web applications using React, Next.js, TypeScript, FastAPI, and Docker. Shipped 5 independent projects end-to-end across real-time WebSocket backends, 3D interactive frontends, REST API design, containerized deployments, and automated testing with 24 Vitest tests across 5 test suites.',
  email: SITE_PROFILE.email,
  phone: SITE_PROFILE.phone,
  location: 'Bhubaneswar, Odisha, India',
  availability: 'Open to remote',
  websiteLabel: SITE_PROFILE.websiteLabel,
  websiteHref: SITE_PROFILE.websiteHref,
  githubLabel: SITE_PROFILE.githubLabel,
  githubHref: SITE_PROFILE.githubHref,
  linkedinLabel: SITE_PROFILE.linkedinLabel,
  linkedinHref: SITE_PROFILE.linkedinHref,
  devpostLabel: 'devpost.com/yorayriniwnl',
  devpostHref: 'https://devpost.com/yorayriniwnl',
} as const

export const RESUME_SKILL_GROUPS: ResumeSkillGroup[] = [
  {
    title: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
  },
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'HTML5', 'CSS3', 'TailwindCSS', 'Three.js', 'React Three Fiber', 'Framer Motion'],
  },
  {
    title: 'Backend',
    skills: ['FastAPI', 'Flask', 'Node.js', 'REST APIs', 'WebSocket', 'SQLite'],
  },
  {
    title: 'Testing',
    skills: ['Vitest', 'Unit Testing', 'Integration Testing'],
  },
  {
    title: 'DevOps & Tools',
    skills: ['Docker', 'Docker Compose', 'Git', 'GitHub', 'Vercel', 'CI/CD', 'Linux', 'VS Code'],
  },
  {
    title: 'ML & Computer Vision',
    skills: ['OpenCV', 'Scikit-Learn', 'SVM', 'Streamlit'],
  },
]

export const EXPERIENCE_ENTRIES: ResumeEntry[] = [
  {
    title: 'Independent Full-Stack Developer',
    meta: 'Self-Directed / Open Source - Bhubaneswar, India (Remote) | Jan 2025 - Present',
    summary:
      'Designed, built, and deployed full-stack applications independently across frontend, backend, API, database, and DevOps layers.',
    bullets: [
      'Owned the complete development lifecycle: requirements, architecture, implementation, testing, and Vercel deployment.',
      'Authored 24 Vitest tests across 5 test suites to validate core application functionality before production release.',
      'Containerized backend services using Docker to keep local development and production environments aligned.',
      'Built WebSocket-based real-time data pipelines and REST API backends capable of supporting multiple concurrent clients.',
    ],
  },
]

export const PROJECT_ENTRIES: ResumeEntry[] = [
  {
    title: 'Personal Developer Portfolio',
    meta: 'Mar 2026 - Apr 2026 | Next.js 16, TypeScript, Three.js, React Three Fiber, Framer Motion, Vitest, Vercel',
    linkLabel: 'yorayriniwnl.vercel.app',
    linkHref: SITE_PROFILE.websiteHref,
    summary:
      'Production-grade portfolio platform with a lazy-loaded plugin architecture, live GitHub sync, and recruiter-focused resume surfaces.',
    bullets: [
      'Built and deployed the portfolio using Next.js 16 and TypeScript while keeping the initial bundle lean through modular feature loading.',
      'Implemented a GPU-accelerated 3D particle system rendering 4,000 points in real time with React Three Fiber.',
      'Covered core application features with 24 unit tests across 5 Vitest test suites before deployment.',
    ],
  },
  {
    title: 'Yor Helios - Real-Time Energy Monitoring Dashboard',
    meta: 'Jan 2026 - Present | Python, FastAPI, TypeScript, Docker, WebSocket | In Development',
    linkLabel: 'github.com/yorayriniwnl/Yor-Helios',
    linkHref: 'https://github.com/yorayriniwnl/Yor-Helios',
    summary:
      'Full-stack energy monitoring platform with a FastAPI REST backend, TypeScript frontend, Docker orchestration, and real-time alerting.',
    bullets: [
      'Architected a reproducible FastAPI and TypeScript stack with Docker Compose for one-command local and production-aligned deployments.',
      'Built WebSocket-based alert streaming with per-channel operator dashboards and configurable anomaly thresholds.',
      'Engineered a continuous anomaly engine that monitors energy consumption patterns and dispatches targeted alerts on threshold breaches.',
    ],
  },
  {
    title: 'Yor Zenith - Solar Energy Planning and Decision Support',
    meta: 'Jan 2025 - Dec 2025 | React, TypeScript, Three.js, Python, FastAPI, Vercel',
    linkLabel: 'zenith-xi-snowy.vercel.app',
    linkHref: 'https://zenith-xi-snowy.vercel.app',
    summary:
      'Full-stack solar feasibility platform with a React and Three.js 3D frontend connected to a Python FastAPI backend.',
    bullets: [
      'Designed and built a 3D solar feasibility workflow for rooftop planning and panel placement analysis.',
      'Engineered a simulation engine that ingests irradiance data and models solar panel placement across roof configurations.',
      'Integrated subsidies, payback period, and ROI into a single interactive dashboard to reduce separate reporting work.',
    ],
  },
  {
    title: 'Yor AI vs. Real Image Detector',
    meta: 'Dec 2025 - Apr 2026 | Python, OpenCV, Scikit-Learn, SVM, Streamlit, Vercel',
    linkLabel: 'yor-ai-vs-real-image.vercel.app',
    linkHref: 'https://yor-ai-vs-real-image.vercel.app',
    summary:
      'Classical computer-vision classifier that detects AI-generated versus real images using texture features and an SVM model.',
    bullets: [
      'Trained an SVM classifier on LBP and GLCM texture features, reaching 78% accuracy on a held-out test set.',
      'Kept local inference under 2 seconds on test hardware.',
      'Built a Streamlit interface with lighting-invariant preprocessing and real-time confidence scoring.',
    ],
  },
  {
    title: 'Yor Mentor-Mentee Platform',
    meta: 'Apr 2026 | Python, Flask, SQLite, Tkinter',
    linkLabel: 'github.com/yorayriniwnl/Mentor-Mentee',
    linkHref: 'https://github.com/yorayriniwnl/Mentor-Mentee',
    summary:
      'Mentorship platform with a RESTful Flask API backend, SQLite persistence layer, and Tkinter desktop frontend.',
    bullets: [
      'Developed automated pairing logic that matches participants by declared skills, goals, and availability.',
      'Supported both headless API integration and standalone desktop usage.',
    ],
  },
]

export const EDUCATION_ENTRIES: ResumeEntry[] = [
  {
    title: 'B.Tech - Computer Science and Communication Engineering',
    meta: 'KIIT Deemed University, Bhubaneswar, Odisha | 2023 - 2027 (Expected)',
    summary:
      'Relevant coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, and Object-Oriented Programming.',
  },
]

export const RESUME_ACHIEVEMENTS = [
  'Shipped 3 competitive full-stack prototypes in Devpost hackathons under strict time constraints.',
  'Earned Pratham, Dwitiya, and Tritiya Sopan certifications through Bharat Scouts and Guides.',
] as const

export const RESUME_CERTIFICATIONS: ResumeEntry[] = [
  {
    title: 'Business for Good: Fundamentals of Corporate Responsibility',
    meta: 'London Business School | Issued March 2026',
    summary: 'Credential ID: Z3LLTNQK95BM',
  },
  {
    title: 'Ethical Decision Making for Success in the Tech Industry',
    meta: 'University of Colorado Boulder | Issued March 2026',
    summary: 'Credential ID: RJKGJPEH6M9Q',
  },
  {
    title: 'Corporate Governance',
    meta: 'Coursera | Issued March 2026',
    summary: 'Credential ID: ELSNKURGPFGA',
  },
]
