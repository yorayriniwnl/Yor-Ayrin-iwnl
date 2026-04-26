"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { STATIC_ACTIVITY, type Activity } from '../../lib/activity'

type FeedItem = Activity & { id: string }

type GitHubEvent = {
  type?: string
  created_at?: string
  createdAt?: string
  repo?: {
    name?: string
  }
  payload?: {
    action?: string
    ref?: string
    ref_type?: string
    commits?: Array<{message?: string}>
    pull_request?: {
      title?: string
    }
  }
}

function timeAgo(ts?: string) {
  if (!ts) return ''
  try {
    const d = Date.parse(ts)
    const delta = Math.floor((Date.now() - d) / 1000)
    if (delta < 60) return `${delta}s ago`
    if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
    if (delta < 3600 * 24) return `${Math.floor(delta / 3600)}h ago`
    return `${Math.floor(delta / (3600 * 24))}d ago`
  } catch { return ts }
}

export default function ActivityFeed(): JSX.Element {
  const [items, setItems] = useState<FeedItem[]>(() => STATIC_ACTIVITY.map((a) => ({ ...a })))
  const [terminal, setTerminal] = useState<boolean>(() => {
    try { return localStorage.getItem('activity_terminal') === '1' } catch { return false }
  })
  const [highlight, setHighlight] = useState(0)

  useEffect(() => { try { localStorage.setItem('activity_terminal', terminal ? '1' : '0') } catch {} }, [terminal])

  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

  useEffect(() => {
    let mounted = true

    async function fetchGitHub() {
      if (!username) return
      try {
        const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
        if (token) headers.Authorization = `token ${token}`
        const res = await fetch(`https://api.github.com/users/${username}/events?per_page=40`, { headers, cache: 'no-store' })
        if (!res.ok) return
        const events = await res.json() as GitHubEvent[]
        const mapped: FeedItem[] = events.map((e: GitHubEvent) => {
          const repo = e.repo?.name?.split('/')?.pop() || e.repo?.name || ''
          const ts = e.created_at || e.createdAt || new Date().toISOString()
          const id = `${e.type}-${repo}-${ts}`
          let message = ''
          if (e.type === 'PushEvent') {
            const cm = e.payload?.commits && e.payload.commits[0] && e.payload.commits[0].message
            message = cm ? `Pushed to ${repo}: ${cm}` : `Pushed new code to ${repo}`
          } else if (e.type === 'PullRequestEvent') {
            const title = e.payload?.pull_request?.title
            const action = e.payload?.action || 'Updated'
            message = title ? `${action} PR in ${repo}: ${title}` : `${action} PR in ${repo}`
          } else if (e.type === 'CreateEvent') {
            message = `Created ${e.payload?.ref_type || 'branch'} in ${repo}${e.payload?.ref ? ': ' + e.payload.ref : ''}`
          } else if (e.type === 'WatchEvent') {
            message = `Starred ${repo}`
          } else {
            message = `${e.type} on ${repo}`
          }

          return { id, message, ts, source: 'github' as const, badge: 'Auto-generated from GitHub', repo }
        }).filter(Boolean)

        if (!mounted) return
        setItems((prev) => {
          const merged = [...mapped, ...prev]
          const seen = new Set()
          const out: FeedItem[] = []
          for (const it of merged) {
            const key = it.id || it.message
            if (seen.has(key)) continue
            seen.add(key)
            out.push(it)
            if (out.length >= 40) break
          }
          return out
        })
      } catch (err) {
        // ignore
      }
    }

    fetchGitHub()
    const id = setInterval(fetchGitHub, 1000 * 60 * 10) // refresh every 10m
    return () => { mounted = false; clearInterval(id) }
  }, [username, token])

  // rotate highlight for subtle motion
  useEffect(() => {
    const id = setInterval(() => setHighlight((h) => (h + 1) % Math.max(1, Math.min(6, items.length))), 4200)
    return () => clearInterval(id)
  }, [items.length])

  const visible = useMemo(() => items.slice(0, 6), [items])

  return (
    <div className={`activity-feed fixed right-6 bottom-24 z-60 pointer-events-auto ${terminal ? 'terminal' : ''}`}>
      <div className="activity-box bg-black/70 text-white px-3 py-2 rounded-lg shadow-lg max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Activity</div>
          <div className="flex items-center gap-2">
            <button className="text-xs text-white/80" onClick={() => setTerminal((s) => !s)}>{terminal ? 'Minimal' : 'Terminal'}</button>
          </div>
        </div>

        <div className="activity-list text-sm leading-relaxed">
          {visible.map((it, idx) => (
            <div key={it.id} className={`activity-item py-1 ${idx === highlight ? 'highlight' : ''}`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <div className="truncate">{it.message}</div>
                  <div className="text-xs text-white/60 mt-0.5">{timeAgo(it.ts)}</div>
                </div>
                {it.badge && <div className="ml-2 text-[10px] px-2 py-0.5 rounded bg-white/8 text-white">{it.badge}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .activity-feed.terminal .activity-box { background: #010409; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace }
        .activity-feed.terminal .activity-item { color: #9ef08a }
        .activity-item.highlight { transform: translateY(-2px); transition: transform 180ms ease; }
        .activity-box { width: 320px }
        .activity-item .truncate { max-width: 220px }
      `}</style>
    </div>
  )
}
