import { RESUME_PROFILE, EXPERIENCE_ENTRIES, EDUCATION_ENTRIES, RESUME_ACHIEVEMENTS } from './resume'
import { PROJECTS } from './projects'
import { SKILL_CATEGORIES } from './data'

export type ResumeJSON = {
  profile: typeof RESUME_PROFILE
  experience: typeof EXPERIENCE_ENTRIES
  education: typeof EDUCATION_ENTRIES
  achievements: typeof RESUME_ACHIEVEMENTS
  projects: Array<{
    id: string
    title: string
    shortDescription: string
    fullDescription?: string
    tech: string[]
    outcome?: string
    github?: string
    featured?: boolean
    badge?: string
    tags?: string[]
    category?: string
  }>
  skills: Record<string, Array<string>>
  generatedAt: string
}

export function generateResumeJSON(): ResumeJSON {
  const projects = PROJECTS.map((p) => ({
    id: String(p.id),
    title: p.title,
    shortDescription: p.shortDescription || p.fullDescription || '',
    fullDescription: p.fullDescription,
    tech: p.tech || [],
    outcome: p.outcome,
    github: p.github,
    featured: p.featured || false,
    badge: p.badge,
    tags: p.tags || [],
    category: p.category || '',
  }))

  const skills: Record<string, string[]> = {}
  Object.entries(SKILL_CATEGORIES).forEach(([cat, list]) => {
    skills[cat] = list.map((s) => s.name)
  })

  return {
    profile: RESUME_PROFILE,
    experience: EXPERIENCE_ENTRIES,
    education: EDUCATION_ENTRIES,
    achievements: RESUME_ACHIEVEMENTS,
    projects,
    skills,
    generatedAt: new Date().toISOString(),
  }
}

export default generateResumeJSON
