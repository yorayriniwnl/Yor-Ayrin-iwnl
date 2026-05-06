'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TIMELINE, timelineStats, type TimelineEntry, type TimelineKind } from '../../lib/timeline'
import Container from '../../components/ui/Container'
import { DisplayTitle, Eyebrow } from '../../components/ui/Typography'

// ─────────────────────────────────────────────────────────────────────────────
// Metadata (exported for the route segment — works because the file is a
// client component only from the interactive parts)
// ─────────────────────────────────────────────────────────────────────────────

// (metadata must be in a server component; kept here as a comment for reference)
// export const metadata = { title: 'Timeline — Yor Ayrin' }

// ─────────────────────────────────────────────────────────────────────────────
// Visual config per kind
// ─────────────────────────────────────────────────────────────────────────────

const KIND_CONFIG: Record<
  TimelineKind,
  { label: string; accent: string; dot: string }
> = {
  experience:  { label: 'Experience',  accent: 'var(--ds-success)',  dot: 'var(--ds-success)' },
  education:   { label: 'Education',   accent: 'var(--ds-info)',     dot: 'var(--ds-info)' },
  project:     { label: 'Project',     accent: 'var(--ds-primary)',  dot: 'var(--ds-primary)' },
  achievement: { label: 'Achievement', accent: 'var(--ds-primary-strong)', dot: 'var(--ds-primary-strong)' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat pill row
// ─────────────────────────────────────────────────────────────────────────────

function StatRow(): JSX.Element {
  const stats = timelineStats(TIMELINE)
  const items: { kind: TimelineKind; count: number }[] = (
    Object.entries(stats) as [TimelineKind, number][]
  )
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => ({ kind, count }))

  return (
    <div
      style={{
        display:    'flex',
        flexWrap:   'wrap',
        gap:        'var(--ds-space-3)',
        marginTop:  'var(--ds-space-6)',
      }}
    >
      {items.map(({ kind, count }) => {
        const cfg = KIND_CONFIG[kind]
        return (
          <span
            key={kind}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.4rem',
              padding:        '0.3rem 0.8rem',
              borderRadius:   'var(--ds-radius-pill)',
              border:         `1px solid ${cfg.dot}44`,
              background:     `${cfg.dot}11`,
              fontSize:       '0.78rem',
              fontFamily:     'var(--ds-font-mono)',
              color:          cfg.accent,
              letterSpacing:  '0.02em',
            }}
          >
            <span
              style={{
                width:         6,
                height:        6,
                borderRadius:  '50%',
                background:    cfg.dot,
                flexShrink:    0,
                boxShadow:     `0 0 6px 1px ${cfg.dot}88`,
              }}
            />
            {count} {cfg.label}{count !== 1 ? 's' : ''}
          </span>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Single timeline card
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineCardProps {
  entry: TimelineEntry
  side: 'left' | 'right'
  index: number
}

function TimelineCard({ entry, side, index }: TimelineCardProps): JSX.Element {
  const cfg = KIND_CONFIG[entry.kind]

  return (
    <motion.article
      initial={{ opacity: 0, x: side === 'left' ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        gridColumn:     side === 'left' ? '1' : '3',
        position:       'relative',
        background:     'linear-gradient(180deg, rgba(26,23,16,0.96), rgba(17,16,9,0.94))',
        border:         '1px solid var(--ds-border)',
        borderRadius:   'var(--ds-radius-lg)',
        padding:        'var(--ds-space-6)',
        boxShadow:      'var(--ds-shadow-sm)',
        transition:     'border-color 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = `${cfg.dot}55`
        el.style.boxShadow   = `var(--ds-shadow-md), 0 0 0 1px ${cfg.dot}22`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--ds-border)'
        el.style.boxShadow   = 'var(--ds-shadow-sm)'
      }}
    >
      {/* Top highlight bar matching card kind */}
      <div
        aria-hidden
        style={{
          position:     'absolute',
          inset:        '0 0 auto',
          height:       1,
          background:   `linear-gradient(90deg, transparent, ${cfg.dot}55, transparent)`,
          borderRadius: 'var(--ds-radius-lg) var(--ds-radius-lg) 0 0',
        }}
      />

      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        {/* Header row */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            'var(--ds-space-2)',
          }}
        >
          <span
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '0.35rem',
              fontSize:      '0.72rem',
              fontFamily:    'var(--ds-font-mono)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color:         cfg.accent,
              padding:       '0.2rem 0.6rem',
              borderRadius:  'var(--ds-radius-pill)',
              border:        `1px solid ${cfg.dot}33`,
              background:    `${cfg.dot}0f`,
            }}
          >
            <span
              style={{
                width:        5,
                height:       5,
                borderRadius: '50%',
                background:   cfg.dot,
                flexShrink:   0,
              }}
            />
            {cfg.label}
          </span>

          <time
            dateTime={entry.date}
            style={{
              fontSize:   '0.75rem',
              fontFamily: 'var(--ds-font-mono)',
              color:      'var(--ds-text-dim)',
            }}
          >
            {entry.dateDisplay}
          </time>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize:      'clamp(0.95rem, 1.2vw, 1.1rem)',
            fontFamily:    'var(--ds-font-display)',
            fontWeight:    700,
            color:         'var(--ds-text-soft)',
            lineHeight:    1.3,
            letterSpacing: '-0.01em',
            margin:        0,
          }}
        >
          {entry.title}
        </h3>

        {/* Subtitle */}
        {entry.subtitle && (
          <p
            style={{
              fontSize:   '0.8rem',
              fontFamily: 'var(--ds-font-mono)',
              color:      'var(--ds-text-dim)',
              margin:     0,
            }}
          >
            {entry.subtitle}
          </p>
        )}

        {/* Description */}
        <p
          style={{
            fontSize:   '0.875rem',
            lineHeight: 1.65,
            color:      'var(--ds-text-muted)',
            margin:     0,
          }}
        >
          {entry.description}
        </p>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-2)', marginTop: 'var(--ds-space-1)' }}>
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="ds-tag"
                style={{ fontSize: '0.7rem' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA link */}
        {entry.href && (
          <div style={{ marginTop: 'var(--ds-space-2)' }}>
            <Link
              href={entry.href}
              className="ds-button ds-button--secondary ds-button--sm"
              style={{ fontSize: '0.75rem' }}
            >
              View detail →
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Centre dot for the spine
// ─────────────────────────────────────────────────────────────────────────────

interface SpineDotProps {
  entry: TimelineEntry
  index: number
}

function SpineDot({ entry, index }: SpineDotProps): JSX.Element {
  const cfg = KIND_CONFIG[entry.kind]

  return (
    <motion.div
      aria-hidden
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.3, delay: index * 0.04 + 0.1 }}
      style={{
        gridColumn:   '2',
        justifySelf:  'center',
        alignSelf:    'start',
        marginTop:    'var(--ds-space-6)',
        width:        14,
        height:       14,
        borderRadius: '50%',
        background:   cfg.dot,
        boxShadow:    `0 0 0 4px var(--ds-bg-soft), 0 0 12px 2px ${cfg.dot}66`,
        flexShrink:   0,
        zIndex:       2,
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function TimelinePage(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="ds-section ds-page-hero">
        <Container wide>
          <div style={{ display: 'grid', gap: 'var(--ds-space-4)', maxWidth: '44rem' }}>
            <Eyebrow>Timeline</Eyebrow>
            <DisplayTitle>
              A career arc,<br />
              built in <em>public.</em>
            </DisplayTitle>
            <p
              style={{
                fontSize:   'clamp(1rem, 1.3vw, 1.125rem)',
                lineHeight: 1.7,
                color:      'var(--ds-text-muted)',
                maxWidth:   '38rem',
              }}
            >
              Every entry here is drawn from verified project work, portfolio
              infrastructure, and real shipping decisions — ordered newest first
              so the most current signal is always at the top.
            </p>
            <StatRow />
          </div>
        </Container>
      </section>

      {/* ── Timeline spine ── */}
      <section className="ds-section" style={{ paddingTop: 0 }}>
        <Container>
          {/* ── DESKTOP: alternating 3-column grid ── */}
          <div
            className="hidden md:grid"
            style={{
              gridTemplateColumns: '1fr 2rem 1fr',
              gap:                 'var(--ds-space-8) var(--ds-space-6)',
              position:            'relative',
            }}
          >
            {/* Vertical spine line */}
            <div
              aria-hidden
              style={{
                gridColumn:    '2',
                gridRow:       `1 / ${TIMELINE.length + 1}`,
                justifySelf:   'center',
                width:         1,
                background:    'linear-gradient(180deg, transparent, var(--ds-border) 8%, var(--ds-border) 92%, transparent)',
                borderRadius:  1,
                zIndex:        1,
              }}
            />

            {TIMELINE.map((entry, i) => {
              const side = i % 2 === 0 ? 'left' : 'right'
              return (
                <React.Fragment key={entry.id}>
                  {/* Left side: render card or empty cell */}
                  {side === 'left'
                    ? <TimelineCard entry={entry} side="left" index={i} />
                    : <div style={{ gridColumn: '1' }} />
                  }

                  {/* Centre dot */}
                  <SpineDot entry={entry} index={i} />

                  {/* Right side: render card or empty cell */}
                  {side === 'right'
                    ? <TimelineCard entry={entry} side="right" index={i} />
                    : <div style={{ gridColumn: '3' }} />
                  }
                </React.Fragment>
              )
            })}
          </div>

          {/* ── MOBILE: single column with left spine ── */}
          <div
            className="md:hidden"
            style={{
              display:  'grid',
              gap:      'var(--ds-space-6)',
              position: 'relative',
              paddingLeft: 'var(--ds-space-10)',
            }}
          >
            {/* Mobile spine */}
            <div
              aria-hidden
              style={{
                position:   'absolute',
                top:        0,
                bottom:     0,
                left:       '0.875rem',
                width:      1,
                background: 'linear-gradient(180deg, transparent, var(--ds-border) 5%, var(--ds-border) 95%, transparent)',
              }}
            />

            {TIMELINE.map((entry, i) => {
              const cfg = KIND_CONFIG[entry.kind]
              return (
                <div key={entry.id} style={{ position: 'relative' }}>
                  {/* Mobile dot */}
                  <motion.div
                    aria-hidden
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    style={{
                      position:     'absolute',
                      left:         'calc(-1 * var(--ds-space-10) + 0.5625rem)',
                      top:          'var(--ds-space-6)',
                      width:        12,
                      height:       12,
                      borderRadius: '50%',
                      background:   cfg.dot,
                      boxShadow:    `0 0 0 3px var(--ds-bg-soft), 0 0 8px 1px ${cfg.dot}66`,
                      zIndex:       2,
                    }}
                  />
                  <TimelineCard entry={entry} side="left" index={i} />
                </div>
              )
            })}
          </div>

          {/* End cap */}
          <div
            aria-hidden
            style={{
              display:       'flex',
              justifyContent: 'center',
              marginTop:     'var(--ds-space-12)',
            }}
          >
            <span
              style={{
                fontSize:      '0.7rem',
                fontFamily:    'var(--ds-font-mono)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         'var(--ds-text-dim)',
                padding:       '0.35rem 1rem',
                borderRadius:  'var(--ds-radius-pill)',
                border:        '1px solid var(--ds-border)',
                background:    'var(--ds-bg-soft)',
              }}
            >
              Start of record
            </span>
          </div>
        </Container>
      </section>
    </div>
  )
}
