import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const dataPath = path.join(process.cwd(), 'data', 'github-activity.json')
  try {
    const cur = await fs.promises.readFile(dataPath, 'utf8')
    const list = JSON.parse(cur || '[]')
    return NextResponse.json({ ok: true, activity: list })
  } catch (e) {
    return NextResponse.json({ ok: true, activity: [] })
  }
}
