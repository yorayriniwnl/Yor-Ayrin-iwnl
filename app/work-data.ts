export type WorkProject = {
  slug: string
  number: string
  title: string
  shortTitle: string
  discipline: string
  thesis: string
  challenge: string
  contribution: string
  outcome: string
  stack: string[]
  live?: string
  source: string
  status: string
  evidence: string
  accent: 'ember' | 'cobalt' | 'teal' | 'plum'
}

export const projects: WorkProject[] = [
  {
    slug: 'yor-zenith',
    number: '01',
    title: 'Yor Zenith',
    shortTitle: 'Zenith',
    discipline: 'Decision support · energy systems',
    thesis: 'Make a high-stakes technical decision feel inspectable before it feels simple.',
    challenge: 'Rooftop feasibility, yield, subsidy assumptions, and long-term return usually arrive as disconnected answers.',
    contribution: 'Product direction, interaction model, frontend system, 3D visualization, and modeling integration.',
    outcome: 'One decision surface that keeps the reasoning visible from first input to final recommendation.',
    stack: ['Next.js', 'TypeScript', 'Three.js', 'Python'],
    live: 'https://zenith-xi-snowy.vercel.app/',
    source: 'https://github.com/yorayriniwnl/Yor-Zenith',
    status: 'Live build',
    evidence: '/screenshots/zenith-case-screenshot.svg',
    accent: 'ember',
  },
  {
    slug: 'yor-ai-vs-real',
    number: '02',
    title: 'Yor AI vs Real',
    shortTitle: 'AI vs Real',
    discipline: 'Computer vision · explainability',
    thesis: 'A prediction is useful only when the person reviewing it can understand why it deserves trust.',
    challenge: 'Binary labels hide uncertainty and make classical image features feel like an inaccessible black box.',
    contribution: 'Vision pipeline, feature strategy, SVM inference flow, and the human-readable review experience.',
    outcome: 'A compact inspection workflow that presents classification and supporting evidence together.',
    stack: ['Python', 'OpenCV', 'Scikit-Learn', 'Streamlit'],
    live: 'https://yor-ai-vs-real-image.vercel.app',
    source: 'https://github.com/yorayriniwnl/Yor-Ai-vs-real-image',
    status: 'Live build',
    evidence: '/screenshots/projects-screenshot.svg',
    accent: 'cobalt',
  },
  {
    slug: 'mentor-mentee',
    number: '03',
    title: 'Mentor / Mentee',
    shortTitle: 'Mentor / Mentee',
    discipline: 'Workflow design · matching systems',
    thesis: 'Turn an invisible coordination process into a workflow people can review, adjust, and repeat.',
    challenge: 'Mentor matching often lives inside spreadsheets and tacit judgment, making good decisions hard to reproduce.',
    contribution: 'Weighted matching logic, shared domain model, Flask API, SQLite persistence, and desktop workflow.',
    outcome: 'A traceable matching system with less manual repetition and clearer human control.',
    stack: ['Python', 'Flask', 'SQLite', 'SQLAlchemy'],
    source: 'https://github.com/yorayriniwnl/mentor-mentee-system',
    status: 'Source study',
    evidence: '/screenshots/hero-screenshot.svg',
    accent: 'teal',
  },
  {
    slug: 'yor-smriti',
    number: '04',
    title: 'Yor Smriti',
    shortTitle: 'Smriti',
    discipline: 'Narrative interface · personal software',
    thesis: 'Some information should be experienced with pace and atmosphere, not flattened into another feed.',
    challenge: 'Memory products often optimize storage while losing the emotional rhythm that makes a moment worth revisiting.',
    contribution: 'Narrative structure, visual direction, interaction pacing, responsive implementation, and delivery.',
    outcome: 'A focused digital space where chronology, mood, and motion carry the story together.',
    stack: ['React', 'TypeScript', 'Motion', 'CSS'],
    live: 'https://yor-smriti.vercel.app',
    source: 'https://github.com/yorayriniwnl/Yor-Smriti',
    status: 'Experience build',
    evidence: '/screenshots/hero-screenshot.svg',
    accent: 'plum',
  },
]

export const capabilities = [
  {
    number: '01',
    title: 'Frame the problem',
    text: 'I turn dense requirements into a decision model, useful states, and a surface that tells people what happens next.',
    tags: ['Product thinking', 'UX systems', 'Prototyping'],
  },
  {
    number: '02',
    title: 'Build through the seams',
    text: 'I move across interface, application state, API boundaries, and persistence without losing the reason the product exists.',
    tags: ['React / Next.js', 'TypeScript', 'Python / SQL'],
  },
  {
    number: '03',
    title: 'Finish what ships',
    text: 'Feedback, motion, keyboard and touch behavior, responsive composition, and performance are part of the product—not polish after it.',
    tags: ['Interaction', 'Accessibility', 'Performance'],
  },
]

export const timeline = [
  {
    period: '2025 — now',
    title: 'Independent product engineering',
    body: 'Shipping decision tools, computer-vision interfaces, workflow systems, and personal software in public.',
  },
  {
    period: '2023 — 2027',
    title: 'B.Tech · CS & Communication Engineering',
    body: 'KIIT Deemed to be University · building the engineering range behind the product work.',
  },
  {
    period: 'Current',
    title: 'Open to the right team',
    body: 'Internships, entry-level product engineering, and ambitious collaborations with room for craft.',
  },
]
