import { RESUME_PROFILE, RESUME_ACHIEVEMENTS } from './resume'

/**
 * Generate a concise 3-line hire pitch using the resume profile.
 * Returns a single string with line breaks. Designed to be short and copy-ready.
 */
export function generateHirePitch(): string {
  const profile = RESUME_PROFILE
  const achievements = RESUME_ACHIEVEMENTS || []

  const lines = [
    `${profile.name} — ${profile.role}.`,
    `${profile.summary}`,
    achievements[0] ? `${achievements[0]}` : `Available for hire: ${profile.email}`,
  ]

  return lines.join('\n')
}

export default generateHirePitch
