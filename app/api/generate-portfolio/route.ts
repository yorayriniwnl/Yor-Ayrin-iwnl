import { NextResponse } from 'next/server'
import { buildPortfolioDocument, type UserProfile } from '../../../lib/portfolio'

type RepoInput = string | { name?: string; full_name?: string; html_url?: string; description?: string; language?: string; topics?: string[]; stargazers_count?: number; forks_count?: number; watchers_count?: number; size?: number }

function normalizeRepoInput(r: RepoInput) {
  if (!r) return null
  if (typeof r === 'string') {
    const s = r.trim()
    // try to parse github URL: github.com/owner/repo
    try {
      const u = new URL(s)
      const parts = u.pathname.replace(/^\//, '').split('/')
      if (parts.length >= 2) {
        const full = `${parts[0]}/${parts[1]}`
        return { name: parts[1], full_name: full, html_url: s }
      }
    } catch (_e) {
      // not a URL — treat as repo name or owner/repo
      const parts = s.split('/')
      if (parts.length === 2) return { name: parts[1], full_name: s, html_url: `https://github.com/${s}` }
      return { name: s, full_name: s, html_url: s }
    }
  }
  // assume object-like
  if (typeof r === 'object' && r !== null) {
    const o: any = r
    return { name: o.name || o.full_name || '', full_name: o.full_name || o.name || '', html_url: o.html_url || '' }
  }
  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const profile: UserProfile | undefined = body?.profile || undefined
    const rawRepos = body?.repos || []
    const inputs: RepoInput[] = Array.isArray(rawRepos) ? rawRepos : String(rawRepos || '').split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    const repos = inputs.map(normalizeRepoInput).filter(Boolean)

    const portfolio = buildPortfolioDocument(profile, repos as any)
    return NextResponse.json({ ok: true, portfolio })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
