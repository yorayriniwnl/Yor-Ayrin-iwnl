"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { DevLogEntry } from '../lib/devlog'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DevLogProps {
  entries: DevLogEntry[]
  activeTag?: string | null
  onTagSelect: (tag: string | null) => void
}

// ─── Date formatter ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// ─── Single entry ─────────────────────────────────────────────────────────────

interface EntryProps {
  entry: DevLogEntry
  index: number
  activeTag: string | null
  onTagSelect: (tag: string | null) => void
}

function DevLogEntryCard({ entry, index, activeTag, onTagSelect }: EntryProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: 'var(--ds-space-6)',
        background: 'var(--ds-surface)',
        border: '1px solid var(--ds-border)',
        borderRadius: 'var(--ds-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-3)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Date */}
      <time
        dateTime={entry.date}
        style={{
          fontSize: '11px',
          fontFamily: 'var(--ds-font-mono)',
          color: 'var(--ds-text-dim)',
          letterSpacing: '0.08em',
        }}
      >
        {formatDate(entry.date)}
      </time>

      {/* Title — click to toggle expansion */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        style={{
          all: 'unset',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: 'var(--ds-font-display)',
          color: 'var(--ds-text-soft)',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-space-2)',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left' }}>{entry.title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          style={{
            flexShrink: 0,
            color: 'var(--ds-text-dim)',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Body — truncated or expanded */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: expanded ? '600px' : '3.4em',
          transition: 'max-height 0.3s ease',
        }}
        aria-hidden={!expanded && entry.body.length > 120 ? undefined : undefined}
      >
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'var(--ds-text-muted)',
            fontFamily: 'var(--ds-font-body)',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 2,
            WebkitBoxOrient: expanded ? undefined : 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}
        >
          {entry.body}
        </p>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-2)', marginTop: 'var(--ds-space-1)' }}>
          {entry.tags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagSelect(activeTag === tag ? null : tag)}
              aria-pressed={activeTag === tag}
              style={{
                all: 'unset',
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 10px',
                borderRadius: 'var(--ds-radius-pill)',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'lowercase',
                fontFamily: 'var(--ds-font-mono)',
                cursor: 'pointer',
                transition: 'background 0.18s, color 0.18s, border-color 0.18s',
                background: activeTag === tag ? 'var(--ds-primary)' : 'transparent',
                color: activeTag === tag ? 'var(--ds-bg)' : 'var(--ds-text-dim)',
                border: `1px solid ${activeTag === tag ? 'transparent' : 'var(--ds-border)'}`,
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </motion.article>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DevLog({ entries, activeTag, onTagSelect }: DevLogProps): JSX.Element {
  if (entries.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--ds-space-12)',
          textAlign: 'center',
          color: 'var(--ds-text-dim)',
          fontFamily: 'var(--ds-font-mono)',
          fontSize: '13px',
          letterSpacing: '0.06em',
        }}
      >
        No entries match this filter.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
      {entries.map((entry, i) => (
        <DevLogEntryCard
          key={entry.id}
          entry={entry}
          index={i}
          activeTag={activeTag ?? null}
          onTagSelect={onTagSelect}
        />
      ))}
    </div>
  )
}
