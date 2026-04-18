"use client"

import React, { useState } from 'react'
import type { Metadata } from 'next'
import { getDevLogEntries, getAllTags } from '../../lib/devlog'
import DevLog from '../../components/DevLog'
import { usePageView } from '../../lib/analytics'

// Note: metadata cannot be exported from a 'use client' file in Next.js App Router.
// Move metadata to a separate layout or use a server-component wrapper if needed.
// For now the page is client-only and SEO metadata is omitted per Next.js constraints.

const ALL_ENTRIES = getDevLogEntries()
const ALL_TAGS    = getAllTags()

export default function DevLogPage(): JSX.Element {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  usePageView()

  const filtered = activeTag
    ? ALL_ENTRIES.filter(e => e.tags.includes(activeTag))
    : ALL_ENTRIES

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
      <header style={{ marginBottom: 'var(--ds-space-10)' }}>
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
          Build diary
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
          DevLog
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
          A running diary of what I&apos;m building and learning.
        </p>
      </header>

      {/* Tag filter row */}
      <div
        role="group"
        aria-label="Filter by tag"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-4)',
        }}
      >
        {/* All pill */}
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 14px',
            borderRadius: 'var(--ds-radius-pill)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--ds-font-mono)',
            cursor: 'pointer',
            border: 'none',
            transition: 'background 0.18s, color 0.18s',
            background: activeTag === null ? 'var(--ds-primary)' : 'var(--ds-bg-raised)',
            color: activeTag === null ? 'var(--ds-bg)' : 'var(--ds-text-muted)',
            boxShadow: activeTag === null ? '0 2px 10px var(--ds-primary-soft)' : 'none',
          }}
        >
          All
        </button>

        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(prev => (prev === tag ? null : tag))}
            aria-pressed={activeTag === tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 14px',
              borderRadius: 'var(--ds-radius-pill)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
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

      {/* Entry count */}
      <p
        style={{
          margin: '0 0 var(--ds-space-6)',
          fontSize: '12px',
          color: 'var(--ds-text-dim)',
          fontFamily: 'var(--ds-font-mono)',
          letterSpacing: '0.06em',
        }}
      >
        Showing {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
        {activeTag ? ` tagged #${activeTag}` : ''}
      </p>

      {/* DevLog list */}
      <DevLog
        entries={filtered}
        activeTag={activeTag}
        onTagSelect={tag => setActiveTag(prev => (prev === tag ? null : tag))}
      />
    </main>
  )
}
