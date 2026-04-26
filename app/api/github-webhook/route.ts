import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

type CommitPayload = {
  message?: string
  timestamp?: string
  url?: string
}

type WebhookPayload = {
  repository?: { full_name?: string; name?: string }
  ref?: string
  head_commit?: CommitPayload
  commits?: CommitPayload[]
}

export async function POST(req: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  const signature = req.headers.get('x-hub-signature-256') || req.headers.get('x-hub-signature')

  const bodyRaw = await req.text()

  if (secret && signature) {
    try {
      const hmac = crypto.createHmac('sha256', secret).update(bodyRaw).digest('hex')
      const expected = `sha256=${hmac}`
      const sigBuf = Buffer.from(signature)
      const expBuf = Buffer.from(expected)
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return new NextResponse(JSON.stringify({ ok: false, error: 'Invalid signature' }), {
          status: 401,
        })
      }
    } catch {
      return new NextResponse(
        JSON.stringify({ ok: false, error: 'Signature verification failed' }),
        { status: 500 },
      )
    }
  }

  let payload: WebhookPayload
  try {
    payload = JSON.parse(bodyRaw) as WebhookPayload
  } catch {
    return new NextResponse(JSON.stringify({ ok: false, error: 'Invalid JSON payload' }), {
      status: 400,
    })
  }

  const repoName =
    payload?.repository?.full_name ?? payload?.repository?.name ?? 'unknown'
  const head = payload?.head_commit
  const commits = Array.isArray(payload?.commits) ? payload.commits : []
  const last = head ?? commits[commits.length - 1] ?? null
  const message = last?.message ?? 'no message'
  const timestamp = last?.timestamp ?? new Date().toISOString()
  const url = last?.url ?? null

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    repo: repoName,
    message,
    timestamp,
    url,
    raw: { ref: payload?.ref },
  }

  const dataPath = path.join(process.cwd(), 'data', 'github-activity.json')

  try {
    await fs.promises.mkdir(path.dirname(dataPath), { recursive: true })
    let list: typeof entry[] = []
    try {
      const cur = await fs.promises.readFile(dataPath, 'utf8')
      list = JSON.parse(cur || '[]') as typeof entry[]
    } catch {
      list = []
    }

    list.unshift(entry)
    list = list.slice(0, 50)
    await fs.promises.writeFile(dataPath, JSON.stringify(list, null, 2), 'utf8')

    return NextResponse.json({ ok: true, entry })
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
