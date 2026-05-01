import {
  EDUCATION_ENTRIES,
  EXPERIENCE_ENTRIES,
  PROJECT_ENTRIES,
  RESUME_ACHIEVEMENTS,
  RESUME_CERTIFICATIONS,
  RESUME_PROFILE,
  RESUME_SKILL_GROUPS,
} from './resume'

export type ResumeJSON = {
  profile: typeof RESUME_PROFILE
  experience: typeof EXPERIENCE_ENTRIES
  education: typeof EDUCATION_ENTRIES
  achievements: typeof RESUME_ACHIEVEMENTS
  certifications: typeof RESUME_CERTIFICATIONS
  projects: typeof PROJECT_ENTRIES
  skills: typeof RESUME_SKILL_GROUPS
  generatedAt: string
}

export function generateResumeJSON(): ResumeJSON {
  return {
    profile: RESUME_PROFILE,
    experience: EXPERIENCE_ENTRIES,
    education: EDUCATION_ENTRIES,
    achievements: RESUME_ACHIEVEMENTS,
    certifications: RESUME_CERTIFICATIONS,
    projects: PROJECT_ENTRIES,
    skills: RESUME_SKILL_GROUPS,
    generatedAt: new Date().toISOString(),
  }
}

export default generateResumeJSON
