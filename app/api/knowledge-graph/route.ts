import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const dataPath = path.join(process.cwd(), 'data', 'knowledge-graph.json')
  try {
    const raw = await fs.promises.readFile(dataPath, 'utf8')
    const graph = JSON.parse(raw || '{}')
    return NextResponse.json(graph)
  } catch (err) {
    return NextResponse.json({ nodes: [], edges: [] })
  }
}
