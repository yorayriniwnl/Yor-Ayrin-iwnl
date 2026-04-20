'use client'

/**
 * app/search/page.tsx
 *
 * Dedicated full-page search for deep-linking (?q=query).
 *
 * • Reads `q` from the URL search params on mount.
 * • Updates the URL as the user types (replace, not push → no history spam).
 * • Debounced 200ms so the URL isn't thrashed on every keystroke.
 * • Groups results by type: Pages / Projects / Skills / Actions.
 * • Empty state (no query): shows ALL items grouped by type.
 * • No-results state: explanatory message + suggestions.
 */

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  search,
  getAllItems,
  type SearchItem,
  type SearchResult,
} from '../../lib/searchIndex'
import { SITE_PROFILE } from '../../lib/data'
import { openPluginPanel } from '../../lib/pluginPanels'

// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type GroupName = 'Pages' | 'Projects' | 'Skills' | 'Actions'

const TYPE_TO_GROUP: Record<SearchItem['type'], GroupName> = {
  page:    'Pages',
  project: 'Projects',
  skill:   'Skills',
  action:  'Actions',
}

const GROUP_ORDER: GroupName[] = ['Pages', 'Projects', 'Skills', 'Actions']

// ─────────────────────────────────────────────────────────────
// Style constants
// ─────────────────────────────────────────────────────────────

const DS = {
  bg:           '#060a14',
  surface:      'rgba(8,12,24,0.7)',
  border:       'rgba(255,255,255,0.07)',
  borderHover:  '#6366f1',
  text:         '#f0f4ff',
  muted:        '#8892aa',
  primary:      '#6366f1',
  groupColor:   '#64748b',
  divider:      '#1e293b',
}

const BADGE_COLORS: Record<GroupName, { bg: string; color: string }> = {
  Pages:    { bg: '#1e3a5f', color: '#60a5fa' },
  Projects: { bg: '#0f2a3a', color: '#06b6d4' },
  Skills:   { bg: '#14301e', color: '#10b981' },
  Actions:  { bg: '#2d1f3e', color: '#a78bfa' },
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function groupItems(
  items: (SearchItem | SearchResult)[]
): Array<{ group: GroupName; items: (SearchItem | SearchResult)[] }> {
  const map = new Map<GroupName, (SearchItem | SearchResult)[]>()
  for (const item of items) {
    const g = TYPE_TO_GROUP[item.type]
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(item)
  }
  return GROUP_ORDER
    .filter((g) => map.has(g))
    .map((g) => ({ group: g, items: map.get(g)! }))
}

function totalCount(
  groups: Array<{ group: GroupName; items: (SearchItem | SearchResult)[] }>
): number {
  return groups.reduce((acc, g) => acc + g.items.length, 0)
}

// ─────────────────────────────────────────────────────────────
// Sub-component: ResultCard
// ─────────────────────────────────────────────────────────────

interface ResultCardProps {
  item:    SearchItem | SearchResult
  onEnter: () => void
}

function ResultCard({ item, onEnter }: ResultCardProps): React.ReactElement {
  const [hovered, setHovered] = useState(false)
  const group  = TYPE_TO_GROUP[item.type]
  const badge  = BADGE_COLORS[group]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter') onEnter()
  }

  return (
    <a
      href={item.url}
      onClick={(e) => { e.preventDefault(); onEnter() }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        alignItems:     'flex-start',
        gap:            '16px',
        padding:        '18px 20px',
        background:     DS.surface,
        border:         `1px solid ${hovered ? DS.borderHover : DS.border}`,
        borderRadius:   '12px',
        textDecoration: 'none',
        transition:     'border-color 0.18s ease, box-shadow 0.18s ease',
        boxShadow:      hovered
          ? `0 4px 24px rgba(99,102,241,0.10)`
          : '0 2px 8px rgba(0,0,0,0.25)',
        cursor:         'pointer',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Icon */}
      <span
        aria-hidden
        style={{
          fontSize:   '24px',
          lineHeight: '28px',
          flexShrink: 0,
          marginTop:  '1px',
        }}
      >
        {item.icon ?? '📄'}
      </span>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '10px',
            flexWrap:   'wrap',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize:   '20px',
              fontWeight: 700,
              color:      DS.text,
              fontFamily: 'var(--ds-font-body, sans-serif)',
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </span>

          {/* Type badge */}
          <span
            style={{
              fontSize:      '10px',
              fontFamily:    'var(--ds-font-mono, monospace)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding:       '2px 8px',
              borderRadius:  '4px',
              background:    badge.bg,
              color:         badge.color,
              fontWeight:    700,
              flexShrink:    0,
            }}
          >
            {item.type}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            margin:     0,
            fontSize:   '15px',
            color:      DS.muted,
            lineHeight: 1.5,
            fontFamily: 'var(--ds-font-body, sans-serif)',
          }}
        >
          {item.body}
        </p>

        {/* URL preview */}
        <div
          style={{
            marginTop:     '6px',
            fontSize:      '12px',
            color:         '#475569',
            fontFamily:    'var(--ds-font-mono, monospace)',
            letterSpacing: '0.03em',
          }}
        >
          {item.url}
        </div>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────────
// Sub-component: GroupSection
// ─────────────────────────────────────────────────────────────

interface GroupSectionProps {
  group: GroupName
  items: (SearchItem | SearchResult)[]
  onNavigate: (item: SearchItem | SearchResult) => void
}

function GroupSection({ group, items, onNavigate }: GroupSectionProps) {
  return (
    <section aria-label={group} style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          margin:        '0 0 12px',
          fontSize:      '11px',
          fontFamily:    'var(--ds-font-mono, monospace)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         DS.groupColor,
          fontWeight:    700,
        }}
      >
        {group}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item) => (
          <ResultCard
            key={item.id}
            item={item}
            onEnter={() => onNavigate(item)}
          />
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────

export default function SearchPage(): React.ReactElement {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // ── Initialise query from URL ──────────────────────────
  const [query,   setQuery]   = useState<string>(() => searchParams.get('q') ?? '')
  const [display, setDisplay] = useState<string>(() => searchParams.get('q') ?? '')

  const inputRef   = useRef<HTMLInputElement>(null)
  const debounceId = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // ── Debounced URL update ───────────────────────────────
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setDisplay(val)

      if (debounceId.current) clearTimeout(debounceId.current)
      debounceId.current = setTimeout(() => {
        setQuery(val)
        const url = val.trim()
          ? `/search?q=${encodeURIComponent(val.trim())}`
          : '/search'
        router.replace(url)
      }, 200)
    },
    [router]
  )

  useEffect(() => {
    return () => {
      if (debounceId.current) clearTimeout(debounceId.current)
    }
  }, [])

  // ── Computed results ───────────────────────────────────
  const allItems   = useMemo(() => getAllItems(), [])
  const hasQuery   = query.trim().length > 0
  const results    = useMemo(
    () => (hasQuery ? search(query) : allItems),
    [query, hasQuery, allItems]
  )
  const groups     = useMemo(() => groupByType(results), [results])
  const count      = useMemo(() => totalCount(groups), [groups])
  const noResults  = hasQuery && results.length === 0

  // ── Navigation ─────────────────────────────────────────
  const navigateTo = useCallback(
    (item: SearchItem | SearchResult) => {
      if (item.type === 'action') {
        switch (item.id) {
          case 'download-resume':
            window.open('/resume.pdf', '_blank')
            break
          case 'copy-email':
            navigator.clipboard.writeText(SITE_PROFILE.email).catch(() => {})
            break
          case 'toggle-theme':
            window.dispatchEvent(new CustomEvent('toggle-theme'))
            break
          case 'open-assistant':
            openPluginPanel('ai-assistant')
            break
          case 'open-activity-feed':
            openPluginPanel('activity-feed')
            break
          case 'github':
            window.open(item.url, '_blank')
            break
          default:
            router.push(item.url)
        }
      } else {
        router.push(item.url)
      }
    },
    [router]
  )

  // ── Input keyboard: Escape clears query ────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setDisplay('')
        setQuery('')
        router.replace('/search')
      }
    },
    [router]
  )

  return (
    <main
      style={{
        minHeight:  '100vh',
        background: DS.bg,
        padding:    'clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 3rem)',
        boxSizing:  'border-box',
      }}
    >
      <div
        style={{
          maxWidth:  '800px',
          margin:    '0 auto',
        }}
      >
        {/* ── Page heading ─────────────────────────────── */}
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              margin:        '0 0 6px',
              fontSize:      '11px',
              fontFamily:    'var(--ds-font-mono, monospace)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color:         DS.primary,
            }}
          >
            @yorayriniwnl · search
          </p>
          <h1
            style={{
              margin:     0,
              fontSize:   'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 900,
              fontFamily: 'var(--ds-font-display, serif)',
              color:      DS.text,
            }}
          >
            Find Anything
          </h1>
        </div>

        {/* ── Search input ──────────────────────────────── */}
        <div
          style={{
            position:   'relative',
            marginBottom: '1rem',
          }}
        >
          <span
            aria-hidden
            style={{
              position:  'absolute',
              left:      '18px',
              top:       '50%',
              transform: 'translateY(-50%)',
              fontSize:  '20px',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            🔍
          </span>

          <input
            ref={inputRef}
            type="text"
            value={display}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, projects, skills, actions..."
            aria-label="Search portfolio"
            spellCheck={false}
            autoComplete="off"
            style={{
              width:          '100%',
              fontSize:       '24px',
              padding:        '16px 20px 16px 54px',
              background:     'rgba(15,23,42,0.9)',
              border:         `1px solid ${DS.divider}`,
              borderRadius:   '14px',
              color:          DS.text,
              fontFamily:     'var(--ds-font-body, sans-serif)',
              outline:        'none',
              boxSizing:      'border-box',
              backdropFilter: 'blur(12px)',
              caretColor:     DS.primary,
              transition:     'border-color 0.18s ease, box-shadow 0.18s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = DS.primary
              e.currentTarget.style.boxShadow   = `0 0 0 3px rgba(99,102,241,0.15)`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = DS.divider
              e.currentTarget.style.boxShadow   = 'none'
            }}
          />
        </div>

        {/* ── Result count ─────────────────────────────── */}
        <p
          style={{
            margin:        '0 0 2rem',
            fontSize:      '13px',
            fontFamily:    'var(--ds-font-mono, monospace)',
            color:         DS.muted,
            letterSpacing: '0.04em',
          }}
          aria-live="polite"
          aria-atomic
        >
          {noResults
            ? `No results for "${query}"`
            : hasQuery
              ? `${count} result${count !== 1 ? 's' : ''} for "${query}"`
              : `${count} items`}
        </p>

        {/* ── No results state ──────────────────────────── */}
        {noResults && (
          <div
            style={{
              textAlign:  'center',
              padding:    '4rem 2rem',
              color:      DS.muted,
            }}
          >
            <p style={{ fontSize: '48px', marginBottom: '12px', lineHeight: 1 }}>
              🔍
            </p>
            <p
              style={{
                fontSize:   '18px',
                fontWeight: 600,
                color:      DS.text,
                marginBottom: '8px',
                fontFamily: 'var(--ds-font-body, sans-serif)',
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </p>
            <p
              style={{
                fontSize:   '14px',
                color:      DS.muted,
                fontFamily: 'var(--ds-font-body, sans-serif)',
              }}
            >
              Try:{' '}
              {['projects', 'React', 'Three.js', 'resume', 'contact'].map((s, i, arr) => (
                <React.Fragment key={s}>
                  <button
                    onClick={() => {
                      setDisplay(s)
                      setQuery(s)
                      router.replace(`/search?q=${encodeURIComponent(s)}`)
                    }}
                    style={{
                      background: 'none',
                      border:     'none',
                      color:      DS.primary,
                      cursor:     'pointer',
                      fontSize:   'inherit',
                      fontFamily: 'inherit',
                      padding:    0,
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                    }}
                  >
                    {s}
                  </button>
                  {i < arr.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </p>
          </div>
        )}

        {/* ── Grouped results ──────────────────────────── */}
        {!noResults && (
          <div>
            {groups.map(({ group, items }) => (
              <GroupSection
                key={group}
                group={group}
                items={items}
                onNavigate={navigateTo}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// ─────────────────────────────────────────────────────────────
// Re-export groupByType so GroupSection can call it (used above)
// ─────────────────────────────────────────────────────────────

function groupByType(
  items: (SearchItem | SearchResult)[]
): Array<{ group: GroupName; items: (SearchItem | SearchResult)[] }> {
  const map = new Map<GroupName, (SearchItem | SearchResult)[]>()
  for (const item of items) {
    const g = TYPE_TO_GROUP[item.type]
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(item)
  }
  return GROUP_ORDER
    .filter((g) => map.has(g))
    .map((g) => ({ group: g, items: map.get(g)! }))
}
