'use client'

/**
 * components/CommandPalette.tsx
 *
 * Global command palette for Ayush Roy's portfolio.
 * Trigger: Cmd+K (Mac) / Ctrl+K (Win/Linux), or call openCommandPalette().
 *
 * The open state is managed via a module-level variable + a custom DOM event
 * so the palette can be opened from anywhere (e.g. Navbar) without prop drilling.
 *
 * Animations: Framer Motion (backdrop fade, palette scale-in spring).
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SITE_PROFILE } from '../lib/data'
import { openPluginPanel } from '../lib/pluginPanels'
import {
  search,
  getRecentItems,
  getActionItems,
  type SearchItem,
  type SearchResult,
} from '../lib/searchIndex'

// ─────────────────────────────────────────────────────────────
// Module-level open/close API  (no React state, no prop drilling)
// ─────────────────────────────────────────────────────────────

const PALETTE_OPEN_EVENT  = 'open-command-palette'
const PALETTE_CLOSE_EVENT = 'close-overlays'

/** Call this from anywhere to open the palette. */
export function openCommandPalette(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PALETTE_OPEN_EVENT))
  }
}

/** Call this from anywhere to close the palette. */
export function closeCommandPalette(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PALETTE_CLOSE_EVENT))
  }
}

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

const PALETTE_BG     = '#0f172a'
const BORDER_COLOR   = '#334155'
const DIVIDER_COLOR  = '#1e293b'
const SELECTED_BG    = '#1e293b'
const SELECTED_LEFT  = '#6366f1'
const GROUP_COLOR    = '#64748b'
const BODY_COLOR     = '#8892aa'
const BADGE_COLORS: Record<GroupName, { bg: string; color: string }> = {
  Pages:    { bg: '#1e3a5f', color: '#60a5fa' },
  Projects: { bg: '#1e293b', color: '#06b6d4' },
  Skills:   { bg: '#14301e', color: '#10b981' },
  Actions:  { bg: '#2d1f3e', color: '#a78bfa' },
}

// ─────────────────────────────────────────────────────────────
// Helper: group results by type
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

// ─────────────────────────────────────────────────────────────
// Sub-component: ResultItem
// ─────────────────────────────────────────────────────────────

interface ResultItemProps {
  item:     SearchItem | SearchResult
  selected: boolean
  onClick:  () => void
  onMouseEnter: () => void
}

function ResultItem({ item, selected, onClick, onMouseEnter }: ResultItemProps) {
  const group = TYPE_TO_GROUP[item.type]
  const badge = BADGE_COLORS[group]

  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        display:         'flex',
        alignItems:      'center',
        gap:             '12px',
        padding:         '10px 16px',
        cursor:          'pointer',
        borderLeft:      selected ? `2px solid ${SELECTED_LEFT}` : '2px solid transparent',
        background:      selected ? SELECTED_BG : 'transparent',
        transition:      'background 0.08s ease, border-color 0.08s ease',
        userSelect:      'none',
        WebkitUserSelect: 'none',
      }}
      onMouseOver={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.background = `${SELECTED_BG}33`
        }
      }}
      onMouseOut={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLDivElement).style.background = 'transparent'
        }
      }}
    >
      {/* Icon */}
      <span
        aria-hidden
        style={{
          width:      '20px',
          height:     '20px',
          fontSize:   '16px',
          flexShrink: 0,
          lineHeight: '20px',
          textAlign:  'center',
        }}
      >
        {item.icon ?? '📄'}
      </span>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <div
          style={{
            fontSize:     '15px',
            fontWeight:   500,
            color:        '#f0f4ff',
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize:     '13px',
            color:        BODY_COLOR,
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            marginTop:    '1px',
          }}
        >
          {item.body}
        </div>
      </div>

      {/* Type badge */}
      <span
        aria-label={`type: ${item.type}`}
        style={{
          fontSize:      '10px',
          fontFamily:    'var(--ds-font-mono, monospace)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding:       '2px 7px',
          borderRadius:  '4px',
          background:    badge.bg,
          color:         badge.color,
          flexShrink:    0,
          fontWeight:    600,
        }}
      >
        {item.type}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Sub-component: GroupHeader
// ─────────────────────────────────────────────────────────────

function GroupHeader({ label }: { label: string }) {
  return (
    <div
      aria-hidden
      style={{
        padding:       '6px 16px',
        fontSize:      '11px',
        color:         GROUP_COLOR,
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        fontFamily:    'var(--ds-font-mono, monospace)',
        fontWeight:    600,
      }}
    >
      {label}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function CommandPalette(): React.ReactElement | null {
  const router = useRouter()

  const [isOpen,        setIsOpen]        = useState(false)
  const [query,         setQuery]         = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [feedback,      setFeedback]      = useState<string | null>(null)

  const inputRef       = useRef<HTMLInputElement>(null)
  const scrollAreaRef  = useRef<HTMLDivElement>(null)
  const feedbackTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Derived data ────────────────────────────────────────
  const recentItems = useMemo(() => getRecentItems(), [])
  const actionItems = useMemo(() => getActionItems(), [])

  const results: SearchResult[] = useMemo(
    () => (query.trim() ? search(query) : []),
    [query]
  )

  /**
   * Flat list of all visible items for keyboard index tracking.
   * When query is empty: recents then actions.
   * When query has text: grouped search results flattened.
   */
  const flatItems: (SearchItem | SearchResult)[] = useMemo(() => {
    if (!query.trim()) {
      return [...recentItems, ...actionItems]
    }
    return results
  }, [query, results, recentItems, actionItems])

  // ── Open / close helpers ─────────────────────────────────
  const openPalette = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setSelectedIndex(0)
    setFeedback(null)
  }, [])

  const closePalette = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
    setFeedback(null)
  }, [])

  // ── Focus input on open ──────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Defer slightly so AnimatePresence mounts the element first
      const tid = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(tid)
    }
  }, [isOpen])

  // ── Scroll selected item into view ───────────────────────
  useEffect(() => {
    if (!scrollAreaRef.current) return
    const el = scrollAreaRef.current.querySelector(
      `[data-idx="${selectedIndex}"]`
    ) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  // ── Listen to module-level open/close events ─────────────
  useEffect(() => {
    const onOpen  = () => openPalette()
    const onClose = () => closePalette()
    window.addEventListener(PALETTE_OPEN_EVENT,  onOpen)
    window.addEventListener(PALETTE_CLOSE_EVENT, onClose)
    return () => {
      window.removeEventListener(PALETTE_OPEN_EVENT,  onOpen)
      window.removeEventListener(PALETTE_CLOSE_EVENT, onClose)
    }
  }, [openPalette, closePalette])

  // ── Global Cmd+K / Ctrl+K listener ──────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) closePalette()
        else openPalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, openPalette, closePalette])

  // ── Item execution ───────────────────────────────────────
  const executeItem = useCallback(
    (item: SearchItem | SearchResult) => {
      switch (item.type) {
        case 'page':
        case 'project':
        case 'skill':
          router.push(item.url)
          closePalette()
          break
        case 'action':
          switch (item.id) {
            case 'download-resume':
              window.open('/resume.pdf', '_blank')
              closePalette()
              break
            case 'copy-email':
              navigator.clipboard
                .writeText(SITE_PROFILE.email)
                .then(() => {
                  setFeedback('Copied!')
                  if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
                  feedbackTimer.current = setTimeout(() => setFeedback(null), 1500)
                })
                .catch(() => setFeedback('Failed to copy'))
              break
            case 'copy-phone':
              navigator.clipboard
                .writeText(SITE_PROFILE.phone)
                .then(() => {
                  setFeedback('Copied!')
                  if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
                  feedbackTimer.current = setTimeout(() => setFeedback(null), 1500)
                })
                .catch(() => setFeedback('Failed to copy'))
              break
            case 'toggle-theme':
              window.dispatchEvent(new CustomEvent('toggle-theme'))
              closePalette()
              break
            case 'open-assistant':
              openPluginPanel('ai-assistant')
              closePalette()
              break
            case 'open-activity-feed':
              openPluginPanel('activity-feed')
              closePalette()
              break
            case 'github':
              window.open(item.url, '_blank')
              closePalette()
              break
            default:
              router.push(item.url)
              closePalette()
          }
          break
      }
    },
    [router, closePalette]
  )

  // ── Keyboard navigation inside palette ───────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const len = flatItems.length

      switch (e.key) {
        case 'ArrowDown':
        case 'Tab': {
          if (e.key === 'Tab') e.preventDefault() // prevent focus leaving input
          setSelectedIndex((i) => (i + 1) % len)
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          setSelectedIndex((i) => (i - 1 + len) % len)
          break
        }
        case 'Enter': {
          e.preventDefault()
          const item = flatItems[selectedIndex]
          if (item) executeItem(item)
          break
        }
        case 'Escape': {
          e.preventDefault()
          closePalette()
          break
        }
      }
    },
    [flatItems, selectedIndex, executeItem, closePalette]
  )

  // Cleanup feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    }
  }, [])

  // ── Render: grouped items ─────────────────────────────────
  function renderEmptyState() {
    // Two sections: Recent + Actions
    let flatIdx = 0
    const nodes: React.ReactNode[] = []

    const recent = recentItems
    const actions = actionItems

    if (recent.length > 0) {
      nodes.push(<GroupHeader key="recent-hdr" label="Recent" />)
      for (const item of recent) {
        const idx = flatIdx++
        nodes.push(
          <ResultItem
            key={item.id}
            item={item}
            selected={selectedIndex === idx}
            onClick={() => executeItem(item)}
            onMouseEnter={() => setSelectedIndex(idx)}
          />
        )
      }
    }

    if (actions.length > 0) {
      nodes.push(
        <div
          key="sep"
          aria-hidden
          style={{
            margin:     '4px 0',
            height:     '1px',
            background: DIVIDER_COLOR,
          }}
        />
      )
      nodes.push(<GroupHeader key="actions-hdr" label="Actions" />)
      for (const item of actions) {
        const idx = flatIdx++
        nodes.push(
          <ResultItem
            key={item.id}
            item={item}
            selected={selectedIndex === idx}
            onClick={() => executeItem(item)}
            onMouseEnter={() => setSelectedIndex(idx)}
          />
        )
      }
    }

    return nodes
  }

  function renderQueryState() {
    if (results.length === 0) {
      return (
        <div
          style={{
            height:         '80px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          BODY_COLOR,
            fontSize:       '14px',
          }}
        >
          No results for &ldquo;{query}&rdquo;
        </div>
      )
    }

    const groups = groupByType(results)
    let flatIdx = 0
    const nodes: React.ReactNode[] = []

    for (const { group, items } of groups) {
      nodes.push(<GroupHeader key={`hdr-${group}`} label={group} />)
      for (const item of items) {
        const idx = flatIdx++
        nodes.push(
          <ResultItem
            key={item.id}
            item={item as SearchItem | SearchResult}
            selected={selectedIndex === idx}
            onClick={() => executeItem(item as SearchItem)}
            onMouseEnter={() => setSelectedIndex(idx)}
          />
        )
      }
    }

    return nodes
  }

  // ── SSR guard ────────────────────────────────────────────
  if (typeof window === 'undefined') return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ──────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closePalette}
            aria-hidden
            style={{
              position:   'fixed',
              inset:      0,
              background: 'rgba(0,0,0,0.6)',
              zIndex:     200,
            }}
          />

          {/* ── Palette panel ─────────────────────────────── */}
          <motion.div
            key="palette"
            role="dialog"
            aria-modal
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32, duration: 0.18 }}
            style={{
              position:     'fixed',
              top:          '20%',
              left:         '50%',
              transform:    'translateX(-50%)',
              width:        '560px',
              maxWidth:     'calc(100vw - 32px)',
              background:   PALETTE_BG,
              border:       `1px solid ${BORDER_COLOR}`,
              borderRadius: '16px',
              zIndex:       201,
              overflow:     'hidden',
              boxShadow:    '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* ── Input row ─────────────────────────────── */}
            <div
              style={{
                borderBottom: `1px solid ${DIVIDER_COLOR}`,
                display:      'flex',
                alignItems:   'center',
                padding:      '0 4px',
              }}
            >
              {/* Search icon */}
              <span
                aria-hidden
                style={{
                  padding:    '0 12px',
                  fontSize:   '16px',
                  color:      GROUP_COLOR,
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                🔍
              </span>

              <input
                ref={inputRef}
                type="text"
                value={feedback ?? query}
                onChange={(e) => {
                  if (feedback) return
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, projects, skills..."
                aria-label="Search"
                aria-autocomplete="list"
                aria-controls="cp-listbox"
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex:        1,
                  padding:     '16px 4px',
                  fontSize:    '16px',
                  background:  'transparent',
                  border:      'none',
                  outline:     'none',
                  color:       feedback ? '#10b981' : '#f0f4ff',
                  fontFamily:  'var(--ds-font-body, inherit)',
                  caretColor:  '#6366f1',
                }}
              />

              {/* Kbd hint */}
              <span
                aria-hidden
                style={{
                  padding:    '0 14px',
                  fontSize:   '11px',
                  color:      '#334155',
                  fontFamily: 'var(--ds-font-mono, monospace)',
                  flexShrink: 0,
                }}
              >
                ESC
              </span>
            </div>

            {/* ── Results ──────────────────────────────────── */}
            <div
              id="cp-listbox"
              ref={scrollAreaRef}
              role="listbox"
              aria-label="Search results"
              style={{
                maxHeight: '420px',
                overflowY: 'auto',
                padding:   '6px 0',
                // Custom scrollbar
                scrollbarWidth: 'thin',
                scrollbarColor: '#1e293b transparent',
              }}
            >
              {query.trim() ? renderQueryState() : renderEmptyState()}
            </div>

            {/* ── Footer hint ──────────────────────────────── */}
            <div
              aria-hidden
              style={{
                display:       'flex',
                gap:           '16px',
                padding:       '8px 16px',
                borderTop:     `1px solid ${DIVIDER_COLOR}`,
                fontSize:      '11px',
                color:         '#334155',
                fontFamily:    'var(--ds-font-mono, monospace)',
              }}
            >
              <span><kbd style={{ color: '#64748b' }}>↑↓</kbd> navigate</span>
              <span><kbd style={{ color: '#64748b' }}>↵</kbd> select</span>
              <span><kbd style={{ color: '#64748b' }}>esc</kbd> close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
