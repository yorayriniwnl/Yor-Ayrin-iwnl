import {
  EDUCATION_ENTRIES,
  EXPERIENCE_ENTRIES,
  PROJECT_ENTRIES,
  RESUME_ACHIEVEMENTS,
  RESUME_CERTIFICATIONS,
  RESUME_PROFILE,
  RESUME_SKILL_GROUPS,
} from '../../../lib/resume'

function appendEntry(lines: string[], entry: { title: string; meta: string; summary: string; bullets?: readonly string[] }) {
  lines.push(entry.title)
  lines.push(entry.meta)
  lines.push(entry.summary)
  for (const bullet of entry.bullets ?? []) lines.push(`- ${bullet}`)
  lines.push('')
}

function buildText() {
  const lines: string[] = []
  lines.push(RESUME_PROFILE.name)
  lines.push(RESUME_PROFILE.role)
  lines.push('')
  lines.push(RESUME_PROFILE.summary)
  lines.push('')
  lines.push(`Email: ${RESUME_PROFILE.email}`)
  lines.push(`Phone: ${RESUME_PROFILE.phone}`)
  lines.push(`Location: ${RESUME_PROFILE.location}`)
  lines.push(`Portfolio: ${RESUME_PROFILE.websiteHref}`)
  lines.push(`GitHub: ${RESUME_PROFILE.githubHref}`)
  lines.push(`LinkedIn: ${RESUME_PROFILE.linkedinHref}`)
  lines.push(`Devpost: ${RESUME_PROFILE.devpostHref}`)
  lines.push('')

  lines.push('Technical Skills:')
  for (const group of RESUME_SKILL_GROUPS) {
    lines.push(`- ${group.title}: ${group.skills.join(', ')}`)
  }
  lines.push('')

  lines.push('Work Experience:')
  for (const entry of EXPERIENCE_ENTRIES) appendEntry(lines, entry)

  lines.push('Projects:')
  for (const entry of PROJECT_ENTRIES) appendEntry(lines, entry)

  lines.push('Education:')
  for (const entry of EDUCATION_ENTRIES) appendEntry(lines, entry)

  lines.push('Achievements:')
  for (const achievement of RESUME_ACHIEVEMENTS) lines.push(`- ${achievement}`)
  lines.push('')

  lines.push('Certifications:')
  for (const entry of RESUME_CERTIFICATIONS) appendEntry(lines, entry)

  lines.push('Generated from current resume data')
  return lines.join('\n')
}

export async function GET() {
  const text = buildText()
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="resume.txt"',
    },
  })
}
