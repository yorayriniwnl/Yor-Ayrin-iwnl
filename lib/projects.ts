import { PROJECTS as DATA_PROJECTS, type Project as DataProject } from './data'
import { GENERATED_PROJECTS } from './generated_projects'

export type Project = DataProject

// Curated manual projects take precedence over auto-generated ones.
// Dedup by: (1) exact id match (case-insensitive), (2) same github URL.
const manualGithubUrls = new Set(
  DATA_PROJECTS.map(p => p.github?.toLowerCase()).filter(Boolean)
)
const manualIds = new Set(DATA_PROJECTS.map(p => p.id.toLowerCase()))
const excludedGeneratedIds = new Set(['yorayriniwnl'])

const filteredGenerated = GENERATED_PROJECTS.filter(g => {
  const excluded      = excludedGeneratedIds.has(String(g.id).toLowerCase())
  const idOverlap     = manualIds.has(String(g.id).toLowerCase())
  const githubOverlap = !!g.github && manualGithubUrls.has(g.github.toLowerCase())
  return !excluded && !idOverlap && !githubOverlap
})

const merged: Project[] = [...DATA_PROJECTS, ...filteredGenerated]

export const PROJECTS: Project[] = merged

export function getAllProjects() {
  return PROJECTS
}

export function getProjectById(id: string) {
  return PROJECTS.find((project) => project.id === id)
}
