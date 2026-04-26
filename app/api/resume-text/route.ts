import { PROJECTS, SKILL_CATEGORIES, LINKS, SITE_PROFILE } from '../../../lib/data'

function buildText() {
  const lines: string[] = []
  lines.push("I'm Ayush Roy (virtual alias: Yor Ayrin), a full-stack developer intern candidate at KIIT building Next.js product surfaces, Python backend systems, realtime dashboards, and computer-vision tools.")
  lines.push('')
  lines.push(SITE_PROFILE.seekingStatement)
  lines.push('')
  lines.push('My most credible, production-aligned work includes Yor Helios, Yor Zenith, Yor AI vs Real Image, and this portfolio platform.')
  lines.push('')
  lines.push('My portfolio uses my resume and GitHub as the single source of truth, so every project claim stays accurate, current, and easy to verify.')
  lines.push('')

  lines.push(`Email: ${SITE_PROFILE.email}`)
  lines.push(`Phone: ${SITE_PROFILE.phone}`)
  lines.push(`Portfolio: ${SITE_PROFILE.websiteHref}`)

  const github = LINKS.find((l) => l.id === 'github')
  const linkedin = LINKS.find((l) => l.id === 'linkedin')
  if (github) lines.push(`GitHub: ${github.href}`)
  if (linkedin) lines.push(`LinkedIn: ${linkedin.href}`)
  lines.push('')

  lines.push('Skills:')
  for (const cat of Object.keys(SKILL_CATEGORIES)) {
    lines.push(`- ${cat}:`)
    for (const s of SKILL_CATEGORIES[cat] ?? []) {
      lines.push(`  - ${s.name} (${s.value})${s.desc ? ' — ' + s.desc : ''}`)
    }
  }
  lines.push('')

  lines.push('Projects:')
  for (const p of PROJECTS) {
    lines.push(`${p.title}`)
    if (p.shortDescription) lines.push(`  ${p.shortDescription}`)
    if (p.tech && p.tech.length) lines.push(`  Tech: ${p.tech.join(', ')}`)
    if (p.outcome) lines.push(`  Outcome: ${p.outcome}`)
    if (p.github) lines.push(`  Repo: ${p.github}`)
    lines.push('')
  }

  lines.push('Generated from site data')
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
