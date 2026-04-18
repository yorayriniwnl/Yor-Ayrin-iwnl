"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePageView } from '../../lib/analytics'
import { PROJECTS } from '../../lib/data'

type DayPoint = {
  date: string
  count: number
}

type ActivityPayload = {
  windowDays: number
  github: {
    username: string
    profileUrl: string
    available: boolean
    points: DayPoint[]
  }
  leetcode: {
    username: string
    profileUrl: string
    available: boolean
    points: DayPoint[]
  }
}

type ChessModeSummary = {
  rating: number
  best: number
  wins: number
  losses: number
  draws: number
}

type GamingProfilesPayload = {
  updatedAt: string
  chess: {
    username: string
    profileUrl: string
    live: boolean
    followers: number
    league: string
    joinedAt: string | null
    lastOnlineAt: string | null
    rapid: ChessModeSummary
    blitz: ChessModeSummary
    daily: ChessModeSummary
  }
  clashRoyale: {
    tag: string
    lookupUrl: string
    note: string
  }
  clashOfClans: {
    tag: string
    lookupUrl: string
    note: string
  }
}

const GAMING_PROFILES_FALLBACK: GamingProfilesPayload = {
  updatedAt: '',
  chess: {
    username: 'yorayriniwnl',
    profileUrl: 'https://www.chess.com/member/yorayriniwnl',
    live: false,
    followers: 0,
    league: 'Profile linked',
    joinedAt: null,
    lastOnlineAt: null,
    rapid: { rating: 0, best: 0, wins: 0, losses: 0, draws: 0 },
    blitz: { rating: 0, best: 0, wins: 0, losses: 0, draws: 0 },
    daily: { rating: 0, best: 0, wins: 0, losses: 0, draws: 0 },
  },
  clashRoyale: {
    tag: '990VPUVR2',
    lookupUrl: 'https://royaleapi.com/player/990VPUVR2',
    note:
      'Live profile lookup opens RoyaleAPI because official Clash Royale stats require an authenticated API token.',
  },
  clashOfClans: {
    tag: 'YPLR2PQRL',
    lookupUrl: 'https://www.clashofstats.com/players/YPLR2PQRL/summary',
    note:
      'Live profile lookup opens Clash of Stats because official Clash of Clans stats require an authenticated API token.',
  },
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = {
  projects: PROJECTS.length,
  techCount: 24,
  yearsExp: 4,
  githubStars: 340,
  linesOfCode: 48000,
  coffeesCoded: 1200,
  topTechs: [
    { name: 'React/Next.js', count: 9 },
    { name: 'TypeScript',    count: 11 },
    { name: 'Three.js',      count: 4 },
    { name: 'Python',        count: 5 },
    { name: 'Node.js',       count: 7 },
    { name: 'CSS/Tailwind',  count: 10 },
  ],
}

function formatRecord(mode: ChessModeSummary): string {
  return `${mode.wins}-${mode.losses}-${mode.draws}`
}

function formatDateLabel(value: string | null | undefined): string {
  if (!value) return 'Unavailable'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  value: string | number
  label: string
  index: number
}

function StatCard({ value, label, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: 'var(--ds-space-6)',
        background: 'var(--ds-surface)',
        border: '1px solid var(--ds-border)',
        borderRadius: 'var(--ds-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-2)',
      }}
    >
      <span
        style={{
          fontSize: '40px',
          fontWeight: 700,
          fontFamily: 'var(--ds-font-display)',
          color: 'var(--ds-primary)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--ds-text-muted)',
          fontFamily: 'var(--ds-font-mono)',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </motion.div>
  )
}

// ─── Animated bar chart row ───────────────────────────────────────────────────

interface BarRowProps {
  name: string
  count: number
  maxCount: number
  index: number
  triggered: boolean
}

function BarRow({ name, count, maxCount, index, triggered }: BarRowProps) {
  const pct = Math.round((count / maxCount) * 100)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--ds-space-4)',
      }}
    >
      {/* Label */}
      <span
        style={{
          width: '120px',
          flexShrink: 0,
          fontSize: '12px',
          fontFamily: 'var(--ds-font-mono)',
          color: 'var(--ds-text-muted)',
          letterSpacing: '0.04em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </span>

      {/* Bar track */}
      <div
        style={{
          flex: 1,
          height: '8px',
          borderRadius: '4px',
          background: 'var(--ds-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(90deg, var(--ds-primary) 0%, var(--ds-primary-strong) 100%)',
            width: triggered ? `${pct}%` : '0%',
            transition: `width 800ms ease-out ${index * 80}ms`,
          }}
        />
      </div>

      {/* Count */}
      <span
        style={{
          width: '24px',
          flexShrink: 0,
          textAlign: 'right',
          fontSize: '11px',
          fontFamily: 'var(--ds-font-mono)',
          color: 'var(--ds-text-dim)',
        }}
      >
        {count}
      </span>
    </div>
  )
}

function DailyActivityChart({
  title,
  profileUrl,
  handle,
  points,
  available,
}: {
  title: string
  profileUrl: string
  handle: string
  points: DayPoint[]
  available: boolean
}) {
  const max = Math.max(1, ...points.map((p) => p.count))
  const activeDays = points.filter((p) => p.count > 0).length

  return (
    <div
      style={{
        padding: 'var(--ds-space-6)',
        background: 'var(--ds-surface)',
        border: '1px solid var(--ds-border)',
        borderRadius: 'var(--ds-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--ds-space-3)' }}>
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-soft)',
            }}
          >
            {title}
          </h3>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--ds-text-muted)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
            Last {points.length || 30} days
          </p>
        </div>
        <a href={profileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--ds-primary)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
          @{handle}
        </a>
      </div>

      {!available ? (
        <p style={{ margin: 0, color: 'var(--ds-text-dim)', fontSize: '13px' }}>
          Live activity is temporarily unavailable. Profile link remains active for direct verification.
        </p>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(points.length, 1)}, minmax(0, 1fr))`, gap: '4px', alignItems: 'end', height: '92px' }}>
        {points.map((point) => {
          const height = point.count === 0 ? 8 : Math.max(12, Math.round((point.count / max) * 92))
          return (
            <div
              key={`${title}-${point.date}`}
              title={`${point.date}: ${point.count} active event${point.count === 1 ? '' : 's'}`}
              style={{
                height: `${height}px`,
                borderRadius: '4px',
                background: point.count > 0
                  ? 'linear-gradient(180deg, var(--ds-primary-strong), var(--ds-primary))'
                  : 'rgba(255,255,255,0.08)',
                opacity: available ? 1 : 0.45,
              }}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ds-text-dim)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
        <span>Active days: {activeDays}</span>
        <span>Peak/day: {max}</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const HEADLINE_STATS = [
  { value: STATS.projects,    label: 'Projects built'   },
  { value: STATS.techCount,   label: 'Tech in stack'    },
  { value: STATS.yearsExp,    label: 'Years experience' },
  { value: STATS.githubStars, label: 'GitHub stars'     },
]

export default function StatsPage(): JSX.Element {
  const chartRef   = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [activity, setActivity] = useState<ActivityPayload | null>(null)
  const [activityLoading, setActivityLoading] = useState(true)
  const [gamingProfiles, setGamingProfiles] = useState<GamingProfilesPayload | null>(null)
  const [gamingProfilesLoading, setGamingProfilesLoading] = useState(true)

  usePageView()

  useEffect(() => {
    let cancelled = false
    const github = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'yorayriniwnl'
    const leetcode = process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? 'yorayriniwnl'

    const loadActivity = async () => {
      setActivityLoading(true)
      try {
        const res = await fetch(`/api/activity-charts?github=${encodeURIComponent(github)}&leetcode=${encodeURIComponent(leetcode)}`)
        if (!res.ok) throw new Error('Failed to load activity charts')
        const payload = (await res.json()) as ActivityPayload
        if (!cancelled) setActivity(payload)
      } catch {
        if (!cancelled) {
          setActivity({
            windowDays: 30,
            github: {
              username: github,
              profileUrl: `https://github.com/${github}`,
              available: false,
              points: Array.from({ length: 30 }).map((_, idx) => ({ date: `day-${idx}`, count: 0 })),
            },
            leetcode: {
              username: leetcode,
              profileUrl: `https://leetcode.com/${leetcode}`,
              available: false,
              points: Array.from({ length: 30 }).map((_, idx) => ({ date: `day-${idx}`, count: 0 })),
            },
          })
        }
      } finally {
        if (!cancelled) setActivityLoading(false)
      }
    }

    void loadActivity()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadGamingProfiles = async () => {
      setGamingProfilesLoading(true)
      try {
        const res = await fetch('/api/gaming-profiles')
        if (!res.ok) throw new Error('Failed to load gaming profiles')
        const payload = (await res.json()) as GamingProfilesPayload
        if (!cancelled) setGamingProfiles(payload)
      } catch {
        if (!cancelled) setGamingProfiles(GAMING_PROFILES_FALLBACK)
      } finally {
        if (!cancelled) setGamingProfilesLoading(false)
      }
    }

    void loadGamingProfiles()
    return () => {
      cancelled = true
    }
  }, [])

  // Trigger bar animations when chart section enters viewport
  useEffect(() => {
    const el = chartRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const maxCount = Math.max(...STATS.topTechs.map(t => t.count))

  return (
    <main
      style={{
        maxWidth: 'var(--ds-container)',
        margin: '0 auto',
        padding:
          'calc(var(--ds-header-height, 5rem) + var(--ds-section-y)) var(--ds-gutter) var(--ds-section-y)',
      }}
    >
      {/* Page header */}
      <header style={{ marginBottom: 'var(--ds-space-12)' }}>
        <p
          style={{
            margin: '0 0 var(--ds-space-3)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ds-primary)',
            fontFamily: 'var(--ds-font-mono)',
          }}
        >
          Metrics
        </p>

        <h1
          style={{
            margin: '0 0 var(--ds-space-4)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            fontFamily: 'var(--ds-font-display)',
            color: 'var(--ds-text-soft)',
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
          }}
        >
          By the Numbers
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '15px',
            color: 'var(--ds-text-muted)',
            fontFamily: 'var(--ds-font-body)',
            lineHeight: 1.65,
            maxWidth: '480px',
          }}
        >
          A few metrics from years of building.
        </p>
      </header>

      {/* Headline stat cards */}
      <section
        aria-label="Headline statistics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 'var(--ds-space-4)',
          marginBottom: 'var(--ds-space-14)',
        }}
      >
        {HEADLINE_STATS.map((s, i) => (
          <StatCard key={s.label} value={s.value} label={s.label} index={i} />
        ))}
      </section>

      <section aria-label="Competitive profiles" style={{ marginBottom: 'var(--ds-space-14)' }}>
        <h2
          style={{
            margin: '0 0 var(--ds-space-6)',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'var(--ds-font-display)',
            color: 'var(--ds-text-soft)',
            letterSpacing: '-0.01em',
          }}
        >
          Competitive Profiles
        </h2>

        {gamingProfilesLoading ? (
          <div style={{ padding: 'var(--ds-space-6)', background: 'var(--ds-surface)', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-md)', color: 'var(--ds-text-dim)' }}>
            Loading Chess.com and game profile details...
          </div>
        ) : gamingProfiles ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--ds-space-5)' }}>
            <div
              style={{
                padding: 'var(--ds-space-6)',
                background: 'var(--ds-surface)',
                border: '1px solid var(--ds-border)',
                borderRadius: 'var(--ds-radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-space-4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--ds-space-3)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--ds-font-display)', color: 'var(--ds-text-soft)' }}>
                    Chess.com
                  </h3>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--ds-text-muted)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
                    @{gamingProfiles.chess.username}
                  </p>
                </div>
                <a href={gamingProfiles.chess.profileUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--ds-primary)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
                  Open profile
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--ds-space-3)' }}>
                <div style={{ padding: '0.85rem', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-sm)' }}>
                  <p style={{ margin: 0, color: 'var(--ds-text-muted)', fontSize: '11px', fontFamily: 'var(--ds-font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rapid</p>
                  <p style={{ margin: '0.45rem 0 0', color: 'var(--ds-text-soft)', fontSize: '1.35rem', fontWeight: 700 }}>{gamingProfiles.chess.rapid.rating}</p>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--ds-text-dim)', fontSize: '12px' }}>Best {gamingProfiles.chess.rapid.best}</p>
                </div>
                <div style={{ padding: '0.85rem', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-sm)' }}>
                  <p style={{ margin: 0, color: 'var(--ds-text-muted)', fontSize: '11px', fontFamily: 'var(--ds-font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Blitz</p>
                  <p style={{ margin: '0.45rem 0 0', color: 'var(--ds-text-soft)', fontSize: '1.35rem', fontWeight: 700 }}>{gamingProfiles.chess.blitz.rating}</p>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--ds-text-dim)', fontSize: '12px' }}>Best {gamingProfiles.chess.blitz.best}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.45rem', color: 'var(--ds-text-dim)', fontSize: '13px' }}>
                <p style={{ margin: 0 }}>Rapid record: {formatRecord(gamingProfiles.chess.rapid)}</p>
                <p style={{ margin: 0 }}>Blitz record: {formatRecord(gamingProfiles.chess.blitz)}</p>
                <p style={{ margin: 0 }}>Daily record: {formatRecord(gamingProfiles.chess.daily)}</p>
                <p style={{ margin: 0 }}>League: {gamingProfiles.chess.league} • Followers: {gamingProfiles.chess.followers}</p>
                <p style={{ margin: 0 }}>Joined: {formatDateLabel(gamingProfiles.chess.joinedAt)}</p>
                <p style={{ margin: 0 }}>Last online: {formatDateLabel(gamingProfiles.chess.lastOnlineAt)}</p>
                <p style={{ margin: 0 }}>
                  {gamingProfiles.updatedAt
                    ? `Last checked: ${formatDateLabel(gamingProfiles.updatedAt)}`
                    : 'Last checked: Stored local fallback'}
                </p>
              </div>

              <p style={{ margin: 0, color: 'var(--ds-text-muted)', fontSize: '12px', lineHeight: 1.6 }}>
                {gamingProfiles.chess.live
                  ? 'Pulled from the official public Chess.com API.'
                  : 'Showing the latest verified fallback snapshot because the live API could not be reached.'}
              </p>
            </div>

            <div
              style={{
                padding: 'var(--ds-space-6)',
                background: 'var(--ds-surface)',
                border: '1px solid var(--ds-border)',
                borderRadius: 'var(--ds-radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-space-4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--ds-space-3)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--ds-font-display)', color: 'var(--ds-text-soft)' }}>
                    Clash Royale
                  </h3>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--ds-text-muted)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
                    Player tag
                  </p>
                </div>
                <a href={gamingProfiles.clashRoyale.lookupUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--ds-primary)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
                  Open lookup
                </a>
              </div>

              <code style={{ padding: '0.85rem 1rem', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-border)', color: 'var(--ds-text-soft)', background: 'rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                #{gamingProfiles.clashRoyale.tag}
              </code>

              <p style={{ margin: 0, color: 'var(--ds-text-muted)', fontSize: '13px', lineHeight: 1.7 }}>
                {gamingProfiles.clashRoyale.note}
              </p>
            </div>

            <div
              style={{
                padding: 'var(--ds-space-6)',
                background: 'var(--ds-surface)',
                border: '1px solid var(--ds-border)',
                borderRadius: 'var(--ds-radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-space-4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--ds-space-3)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--ds-font-display)', color: 'var(--ds-text-soft)' }}>
                    Clash of Clans
                  </h3>
                  <p style={{ margin: '0.35rem 0 0', color: 'var(--ds-text-muted)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
                    Player tag
                  </p>
                </div>
                <a href={gamingProfiles.clashOfClans.lookupUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--ds-primary)', fontSize: '12px', fontFamily: 'var(--ds-font-mono)' }}>
                  Open lookup
                </a>
              </div>

              <code style={{ padding: '0.85rem 1rem', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-border)', color: 'var(--ds-text-soft)', background: 'rgba(255,255,255,0.03)', fontSize: '0.95rem' }}>
                #{gamingProfiles.clashOfClans.tag}
              </code>

              <p style={{ margin: 0, color: 'var(--ds-text-muted)', fontSize: '13px', lineHeight: 1.7 }}>
                {gamingProfiles.clashOfClans.note}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: 'var(--ds-space-6)', background: 'var(--ds-surface)', border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius-md)', color: 'var(--ds-text-dim)' }}>
            Gaming profiles are temporarily unavailable.
          </div>
        )}
      </section>

      {/* Tech frequency chart */}
      <section
        ref={chartRef}
        aria-label="Most used technologies"
        style={{ marginBottom: 'var(--ds-space-14)' }}
      >
        <h2
          style={{
            margin: '0 0 var(--ds-space-6)',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'var(--ds-font-display)',
            color: 'var(--ds-text-soft)',
            letterSpacing: '-0.01em',
          }}
        >
          Most Used Technologies
        </h2>

        <div
          style={{
            padding: 'var(--ds-space-6)',
            background: 'var(--ds-surface)',
            border: '1px solid var(--ds-border)',
            borderRadius: 'var(--ds-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-space-4)',
          }}
        >
          {STATS.topTechs.map((tech, i) => (
            <BarRow
              key={tech.name}
              name={tech.name}
              count={tech.count}
              maxCount={maxCount}
              index={i}
              triggered={triggered}
            />
          ))}
        </div>
      </section>

      <section aria-label="Daily coding activity" style={{ marginBottom: 'var(--ds-space-14)' }}>
        <h2
          style={{
            margin: '0 0 var(--ds-space-6)',
            fontSize: '20px',
            fontWeight: 700,
            fontFamily: 'var(--ds-font-display)',
            color: 'var(--ds-text-soft)',
            letterSpacing: '-0.01em',
          }}
        >
          Daily Activity Charts
        </h2>

        {activityLoading || !activity ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--ds-space-5)' }}>
            {['GitHub', 'LeetCode'].map((name) => (
              <div
                key={name}
                style={{
                  padding: 'var(--ds-space-6)',
                  background: 'var(--ds-surface)',
                  border: '1px solid var(--ds-border)',
                  borderRadius: 'var(--ds-radius-md)',
                  minHeight: '190px',
                  color: 'var(--ds-text-dim)',
                }}
              >
                Loading {name} activity...
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--ds-space-5)' }}>
            <DailyActivityChart
              title="GitHub"
              handle={activity.github.username}
              profileUrl={activity.github.profileUrl}
              available={activity.github.available}
              points={activity.github.points}
            />
            <DailyActivityChart
              title="LeetCode"
              handle={activity.leetcode.username}
              profileUrl={activity.leetcode.profileUrl}
              available={activity.leetcode.available}
              points={activity.leetcode.points}
            />
          </div>
        )}
      </section>

      {/* Fun stats */}
      <section aria-label="Fun statistics">
        <div
          style={{
            padding: 'var(--ds-space-10) var(--ds-space-8)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-space-3)',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: 0,
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontStyle: 'italic',
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-dim)',
              letterSpacing: '-0.01em',
              lineHeight: 1.5,
            }}
          >
            &#8220;~{STATS.linesOfCode.toLocaleString()} lines of code written&#8221;
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{
              margin: 0,
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontStyle: 'italic',
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-dim)',
              letterSpacing: '-0.01em',
              lineHeight: 1.5,
            }}
          >
            &#8220;~{STATS.coffeesCoded.toLocaleString()} coffees consumed&#8221;
          </motion.p>
        </div>
      </section>
    </main>
  )
}
