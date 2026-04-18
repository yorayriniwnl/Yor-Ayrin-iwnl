// ─── Types ───────────────────────────────────────────────────────────────────

export type BlogNote = {
  category: string
  date: string
  excerpt: string
  featured?: boolean
  readTime: string
  title: string
  tone: 'life' | 'personal' | 'real' | 'thoughts'
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const BLOG_TICKER_ITEMS = [
  'Resume Evidence',
  'GitHub Projects',
  'Solar Planning',
  'Computer Vision',
  'Interface Craft',
  'Learning Systems',
  'Portfolio Architecture',
  'Recruiter Mode',
]

export const BLOG_POSTS: BlogNote[] = [
  {
    category: 'Case Study',
    date: 'Apr 13, 2026',
    excerpt:
      'Refreshing the portfolio meant replacing stretched claims with resume-backed skills, live GitHub repositories, and project descriptions that match the evidence.',
    featured: true,
    readTime: '6 min read',
    title: 'Turning Portfolio Claims into Verified Signals',
    tone: 'real',
  },
  {
    category: 'Project Notes',
    date: 'Apr 12, 2026',
    excerpt:
      'Yor Zenith is strongest when it stays focused on rooftop feasibility, generation forecasting, subsidy logic, and 3D visualization.',
    readTime: '5 min read',
    title: 'What Yor Zenith Proves About Decision-Support Interfaces',
    tone: 'personal',
  },
  {
    category: 'ML Notes',
    date: 'Apr 12, 2026',
    excerpt:
      'The AI detector is a good example of a lightweight classical ML pipeline: OpenCV features, LBP/GLCM texture analysis, SVM training, and Streamlit review.',
    readTime: '4 min read',
    title: 'A Practical Image Classifier Without Inflated Claims',
    tone: 'thoughts',
  },
  {
    category: 'Systems',
    date: 'Apr 11, 2026',
    excerpt:
      'The mentor-mentee system adds Python workflow evidence through Flask, Tkinter, SQLite, and matching logic.',
    readTime: '4 min read',
    title: 'Small Tools Still Need Clear Data Models',
    tone: 'life',
  },
  {
    category: 'Build Log',
    date: 'Apr 10, 2026',
    excerpt:
      'A portfolio works better when missing information stays labeled and real signals stay visible.',
    readTime: '4 min read',
    title: 'Accuracy Is Part of the Interface',
    tone: 'real',
  },
]
