'use client'

import React, { useEffect, useState } from 'react'

// ─── Mock data ────────────────────────────────────────────────────────────────

type ActivityType = 'push' | 'star' | 'pr' | 'other'

type ActivityItem = {
  id: string
  type: ActivityType
  repo: string
  message: string
  time: string
  isFallback?: boolean
}

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'push', repo: 'yor-website', message: 'Refactor hero section', time: '2 hours ago', isFallback: true },
  { id: '2', type: 'star', repo: 'three.js', message: 'Starred three.js', time: '1 day ago', isFallback: true },
  { id: '3', type: 'push', repo: 'yor-website', message: 'Add 3D skills constellation', time: '2 days ago', isFallback: true },
  { id: '4', type: 'pr', repo: 'next.js', message: 'Fix: App Router revalidation', time: '3 days ago', isFallback: true },
  { id: '5', type: 'push', repo: 'ai-detector', message: 'Improve model accuracy to 94%', time: '5 days ago', isFallback: true },
]

// ─── Type helpers ─────────────────────────────────────────────────────────────

const TYPE_ICON: Record<ActivityType, string> = {
  push: '↑',
  star: '★',
  pr:   '⤴',
  other: '•',
}

const TYPE_COLOR: Record<ActivityType, string> = {
  push: '#22c55e',
  star: '#eab308',
  pr:   '#a855f7',
  other: '#94a3b8',
}

function timeAgoFromISO(iso?: string): string {
  if (!iso) return 'just now'
  const d = Date.parse(iso)
  if (Number.isNaN(d)) return 'just now'
  const delta = Math.max(0, Math.floor((Date.now() - d) / 1000))
  if (delta < 60) return `${delta}s ago`
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
  if (delta < 86400) return `${Math.floor(delta / 3600)}h ago`
  return `${Math.floor(delta / 86400)}d ago`
}


type RawGitHubEvent = {
  type?: string
  repo?: { name?: string }
  created_at?: string
  payload?: {
    commits?: { message?: string }[]
    action?: string
    ref_type?: string
    ref?: string
    pull_request?: { title?: string }
    issue?: { title?: string }
    release?: { tag_name?: string; name?: string }
    forkee?: { full_name?: string }
    member?: { login?: string }
  }
}

function mapEventToItem(e: RawGitHubEvent): ActivityItem {
  const repo = e?.repo?.name?.split('/')?.pop() || e?.repo?.name || 'unknown-repo'
  const created = e?.created_at || new Date().toISOString()
  const eventType = e?.type || 'Event'

  if (eventType === 'PushEvent') {
    const first = e?.payload?.commits?.[0]?.message
    return {
      id: `${eventType}-${repo}-${created}`,
      type: 'push',
      repo,
      message: first ? `Pushed: ${first}` : `Pushed new commits to ${repo}`,
      time: timeAgoFromISO(created),
    }
  }
  if (eventType === 'WatchEvent') {
    return {
      id: `${eventType}-${repo}-${created}`,
      type: 'star',
      repo,
      message: `Starred ${repo}`,
      time: timeAgoFromISO(created),
    }
  }
  if (eventType === 'PullRequestEvent') {
    const action = e?.payload?.action || 'updated'
    const title = e?.payload?.pull_request?.title
    return {
      id: `${eventType}-${repo}-${created}`,
      type: 'pr',
      repo,
      message: title ? `${action} PR: ${title}` : `${action} a pull request`,
      time: timeAgoFromISO(created),
    }
  }

  return {
    id: `${eventType}-${repo}-${created}`,
    type: 'other',
    repo,
    message: `${eventType} on ${repo}`,
    time: timeAgoFromISO(created),
  }
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow(): React.JSX.Element {
  return (
    <div className="af-skeleton-row" aria-hidden="true">
      <div className="af-skeleton-icon" />
      <div className="af-skeleton-body">
        <div className="af-skeleton-line af-skeleton-line--short" />
        <div className="af-skeleton-line af-skeleton-line--long" />
        <div className="af-skeleton-line af-skeleton-line--xs" />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityFeed(): React.JSX.Element {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'yorayriniwnl'
  const [items, setItems]       = useState<ActivityItem[] | null>(null)
  const [loading, setLoading]   = useState<boolean>(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://api.github.com/users/${username}/events?per_page=12`, {
          headers: { Accept: 'application/vnd.github.v3+json' },
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('GitHub request failed')
        const events = await res.json()
        const mapped: ActivityItem[] = Array.isArray(events)
          ? events.slice(0, 8).map(mapEventToItem)
          : []
        if (!mounted) return
        if (mapped.length > 0) {
          setItems(mapped)
        } else {
          setItems(MOCK_ACTIVITY)
        }
      } catch {
        if (mounted) setItems(MOCK_ACTIVITY)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void load()
    const intervalId = window.setInterval(() => { void load() }, 1000 * 60 * 10)
    return () => {
      mounted = false
      window.clearInterval(intervalId)
    }
  }, [username])

  return (
    <>
      <style>{`
        .af-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--ds-bg, #060a14);
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }

        /* header */
        .af-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          height: 52px;
          border-bottom: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          flex-shrink: 0;
        }
        .af-header__title {
          font-size: 14px;
          font-weight: 700;
          color: var(--ds-text, #e8effe);
          flex: 1;
        }
        .af-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
          animation: af-pulse 1.8s infinite;
        }
        @keyframes af-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }

        /* list */
        .af-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;
          scrollbar-width: thin;
          scrollbar-color: var(--ds-border, rgba(255,255,255,0.07)) transparent;
        }

        /* item */
        .af-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 16px;
          position: relative;
        }
        .af-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 2.5px;
          border-radius: 2px;
        }
        .af-item--push::before { background: #22c55e; }
        .af-item--star::before { background: #eab308; }
        .af-item--pr::before   { background: #a855f7; }

        .af-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--ds-surface, rgba(255,255,255,0.04));
          border: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .af-body {
          flex: 1;
          min-width: 0;
        }
        .af-repo {
          font-family: var(--font-ds-mono, ui-monospace, monospace);
          font-size: 12px;
          color: var(--ds-primary, #6366f1);
          font-weight: 600;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .af-message {
          font-size: 13.5px;
          color: var(--ds-text, #e8effe);
          line-height: 1.45;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .af-time {
          font-size: 11.5px;
          color: var(--ds-text-muted, #8892aa);
        }

        /* empty state */
        .af-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 13px;
          color: var(--ds-text-muted, #8892aa);
        }

        /* footer */
        .af-footer {
          flex-shrink: 0;
          padding: 12px 16px;
          border-top: 1px solid var(--ds-border, rgba(255,255,255,0.07));
        }
        .af-github-link {
          font-size: 13px;
          color: var(--ds-primary, #6366f1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.15s;
        }
        .af-github-link:hover { opacity: 0.75; }

        /* skeleton shimmer */
        .af-skeleton-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 16px;
        }
        .af-skeleton-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .af-skeleton-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .af-skeleton-line {
          height: 11px;
          border-radius: 5px;
        }
        .af-skeleton-line--short { width: 40%; }
        .af-skeleton-line--long  { width: 80%; }
        .af-skeleton-line--xs    { width: 28%; height: 9px; }

        .af-skeleton-icon,
        .af-skeleton-line {
          background: linear-gradient(
            90deg,
            var(--ds-surface, rgba(255,255,255,0.05)) 0%,
            rgba(255,255,255,0.10) 50%,
            var(--ds-surface, rgba(255,255,255,0.05)) 100%
          );
          background-size: 200% 100%;
          animation: af-shimmer 1.4s infinite linear;
        }
        @keyframes af-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .af-pulse, .af-skeleton-icon, .af-skeleton-line {
            animation: none;
          }
        }
      `}</style>

      <div className="af-root">
        {/* Header */}
        <div className="af-header">
          <span className="af-header__title">GitHub Activity</span>
          <span className="af-pulse" aria-label="Live" />
        </div>

        {items?.some((item) => item.isFallback) && (
          <div style={{ padding: '8px 16px 0', fontSize: '11px', color: 'var(--ds-text-muted, #8892aa)' }}>
            Showing sample activity (live GitHub events unavailable).
          </div>
        )}

        {/* List */}
        <div className="af-list" role="list" aria-label="GitHub activity items">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : !items || items.length === 0 ? (
            <div className="af-empty">No recent activity</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`af-item af-item--${item.type}`}
                role="listitem"
              >
                <span
                  className="af-icon"
                  style={{ color: TYPE_COLOR[item.type] }}
                  aria-hidden="true"
                >
                  {TYPE_ICON[item.type]}
                </span>
                <div className="af-body">
                  <div className="af-repo">{item.repo}</div>
                  <div className="af-message">{item.message}</div>
                  <div className="af-time">{item.time}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="af-footer">
          <a
            href="https://github.com/yorayriniwnl"
            target="_blank"
            rel="noopener noreferrer"
            className="af-github-link"
          >
            View on GitHub
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5l7-7M9.5 2.5H4M9.5 2.5v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
