import { NextResponse } from 'next/server'
import { getProjectById, type Project } from '../../../lib/projects'

function generateExplanation(project: Project) {
  const what =
    project.shortDescription ??
    project.fullDescription ??
    `A project called ${project.title}.`

  const howPieces: string[] = []
  if (project.solution) howPieces.push(project.solution)
  if (project.tech && project.tech.length > 0) {
    howPieces.push(`Built with ${project.tech.join(', ')}.`)
  }
  if (!project.solution && project.fullDescription) {
    howPieces.push(project.fullDescription.slice(0, 400))
  }
  const how = howPieces.join(' ')

  const whyPieces: string[] = []
  if (project.problem) whyPieces.push(project.problem)
  if (project.outcome) whyPieces.push(`Outcome: ${project.outcome}`)
  const why = whyPieces.join(' ')

  return {
    what: what.trim(),
    how: how.trim(),
    why: why.trim(),
    source: project.github ?? null,
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing project id' }, { status: 400 })
    }
    const project = getProjectById(id)
    if (!project) {
      return NextResponse.json({ ok: false, error: 'Project not found' }, { status: 404 })
    }
    const explanation = generateExplanation(project)
    return NextResponse.json({ ok: true, explanation })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { id?: unknown }
    const id = body?.id
    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json({ ok: false, error: 'Missing project id' }, { status: 400 })
    }
    const project = getProjectById(id.trim())
    if (!project) {
      return NextResponse.json({ ok: false, error: 'Project not found' }, { status: 404 })
    }
    const explanation = generateExplanation(project)
    return NextResponse.json({ ok: true, explanation })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
