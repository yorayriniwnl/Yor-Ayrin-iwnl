import { NextResponse } from 'next/server'
import { getProjectById } from '../../../lib/projects'

function generateExplanation(project: any) {
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Missing project id' }, { status: 400 })
    const project = getProjectById(id)
    if (!project) return NextResponse.json({ ok: false, error: 'Project not found' }, { status: 404 })
    const explanation = generateExplanation(project)
    return NextResponse.json({ ok: true, explanation })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const id = body?.id
    if (!id) return NextResponse.json({ ok: false, error: 'Missing project id' }, { status: 400 })
    const project = getProjectById(id)
    if (!project) return NextResponse.json({ ok: false, error: 'Project not found' }, { status: 404 })
    const explanation = generateExplanation(project)
    return NextResponse.json({ ok: true, explanation })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 })
  }
}
