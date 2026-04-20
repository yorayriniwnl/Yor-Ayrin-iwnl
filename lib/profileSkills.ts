export type ProfileSkill = {
  name: string
  pct: number
}

export const SKILLS_LEFT: ProfileSkill[] = [
  { name: 'React', pct: 82 },
  { name: 'HTML / CSS', pct: 82 },
  { name: 'TailwindCSS', pct: 80 },
  { name: 'TypeScript', pct: 65 },
  { name: 'Three.js', pct: 72 },
]

export const SKILLS_RIGHT: ProfileSkill[] = [
  { name: 'Python', pct: 84 },
  { name: 'OpenCV', pct: 76 },
  { name: 'Scikit-Learn', pct: 74 },
  { name: 'Streamlit', pct: 70 },
  { name: 'SQL', pct: 58 },
]

export const PROFILE_SKILLS: ProfileSkill[] = [...SKILLS_LEFT, ...SKILLS_RIGHT]
