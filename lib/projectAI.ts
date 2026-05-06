import type { Project } from './projects'

export function explainProject(project: Project) {
  const what = project.shortDescription || project.fullDescription || `A project called ${project.title}.`

  const howPieces: string[] = []
  if (project.solution) howPieces.push(project.solution)
  if (project.tech && project.tech.length) howPieces.push(`Built with ${project.tech.join(', ')}.`)
  if (!project.solution && project.fullDescription) howPieces.push(project.fullDescription.slice(0, 400))
  const how = howPieces.join(' ')

  const whyPieces: string[] = []
  if (project.problem) whyPieces.push(project.problem)
  if (project.outcome) whyPieces.push(`Outcome: ${project.outcome}`)
  const why = whyPieces.join(' ')

  return {
    what: what.trim(),
    how: how.trim(),
    why: why.trim(),
    source: project.github || null,
  }
}

export default explainProject
