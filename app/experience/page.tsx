'use client'

import React, { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Metadata } from 'next'
import { EDUCATION_ITEMS, EXPERIENCE_ITEMS, PROJECTS } from '../../lib/data'
import type { ExperienceItem } from '../../data/site'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import { DisplayTitle, Eyebrow, Heading } from '../../components/ui/Typography'
import { ButtonLink } from '../../components/ui/Button'
import PageHero from '../../components/sections/PageHero'

// ─────────────────────────────────────────────────────────────────────────────
// Visual config per kind
// ─────────────────────────────────────────────────────────────────────────────

const KIND_META: Record<
  ExperienceItem['kind'],
  { label: string; accent: string; border: string; bg: string }
> = {
  verified: {
    label:  'Verified',
    accent: 'var(--ds-success)',
    border: 'rgba(122,154,122,0.35)',
    bg:     'rgba(122,154,122,0.07)',
  },
  placeholder: {
    label:  'Placeholder',
    accent: 'var(--ds-text-dim)',
    border: 'var(--ds-border)',
    bg:     'transparent',
  },
  education: {
    label:  'Education',
    accent: 'var(--ds-info)',
    border: 'rgba(122,122,170,0.35)',
    bg:     'rgba(122,122,170,0.07)',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Single expandable experience card
// ─────────────────────────────────────────────────────────────────────────────

interface ExperienceCardProps {
  item: ExperienceItem
  index: number
}

function ExperienceCard({ item, index }: ExperienceCardProps): JSX.Element {
  const [open, setOpen] = useState(item.kind === 'verified' && index === 0)
  const cfg             = KIND_META[item.kind]
  const bulletId        = useId()
  const isPlaceholder   = item.kind === 'placeholder'

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.42, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position:     'relative',
        borderRadius: 'var(--ds-radius-lg)',
        border:       isPlaceholder
          ? '1px dashed var(--ds-border)'
          : '1px solid var(--ds-border)',
        background:   isPlaceholder
          ? 'rgba(17,16,9,0.5)'
          : 'linear-gradient(180deg, rgba(26,23,16,0.96), rgba(17,16,9,0.94))',
        boxShadow:    isPlaceholder ? 'none' : 'var(--ds-shadow-sm)',
        opacity:      isPlaceholder ? 0.65 : 1,
        overflow:     'hidden',
      }}
    >
      {/* Top shimmer — verified only */}
      {!isPlaceholder && (
        <div
          aria-hidden
          style={{
            position:   'absolute',
            inset:      '0 0 auto',
            height:     1,
            background: `linear-gradient(90deg, transparent, ${cfg.border}, transparent)`,
          }}
        />
      )}

      {/* ── Header (always visible) ── */}
      <div style={{ padding: 'var(--ds-space-6)' }}>
        {/* Kind + date row */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            'var(--ds-space-3)',
            marginBottom:   'var(--ds-space-4)',
          }}
        >
          <span
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '0.35rem',
              fontSize:      '0.7rem',
              fontFamily:    'var(--ds-font-mono)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding:       '0.2rem 0.65rem',
              borderRadius:  'var(--ds-radius-pill)',
              border:        `1px solid ${cfg.border}`,
              background:    cfg.bg,
              color:         cfg.accent,
            }}
          >
            {item.kind === 'verified' && (
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" />
                <path d="M2.5 5.2L4.2 6.8L7.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {cfg.label}
          </span>

          {item.dateDisplay && (
            <span
              style={{
                fontSize:   '0.75rem',
                fontFamily: 'var(--ds-font-mono)',
                color:      'var(--ds-text-dim)',
              }}
            >
              {item.dateDisplay}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize:      'clamp(1rem, 1.3vw, 1.15rem)',
            fontFamily:    'var(--ds-font-display)',
            fontWeight:    700,
            lineHeight:    1.3,
            letterSpacing: '-0.01em',
            color:         isPlaceholder ? 'var(--ds-text-dim)' : 'var(--ds-text-soft)',
            margin:        '0 0 var(--ds-space-2)',
          }}
        >
          {item.title}
        </h3>

        {/* Meta */}
        <p
          style={{
            fontSize:   '0.8rem',
            fontFamily: 'var(--ds-font-mono)',
            color:      'var(--ds-text-dim)',
            margin:     '0 0 var(--ds-space-4)',
          }}
        >
          {item.meta}
        </p>

        {/* Summary */}
        <p
          style={{
            fontSize:   '0.9rem',
            lineHeight: 1.7,
            color:      isPlaceholder ? 'var(--ds-text-dim)' : 'var(--ds-text-muted)',
            margin:     0,
          }}
        >
          {item.summary}
        </p>

        {/* Expand toggle — only when there are bullets */}
        {item.bullets.length > 0 && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={bulletId}
            onClick={() => setOpen((prev) => !prev)}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.4rem',
              marginTop:      'var(--ds-space-5)',
              padding:        '0.35rem 0.85rem',
              borderRadius:   'var(--ds-radius-pill)',
              border:         '1px solid var(--ds-border)',
              background:     open ? 'var(--ds-bg-raised)' : 'transparent',
              fontSize:       '0.75rem',
              fontFamily:     'var(--ds-font-mono)',
              letterSpacing:  '0.04em',
              color:          open ? 'var(--ds-text)' : 'var(--ds-text-dim)',
              cursor:         'pointer',
              transition:     'background 160ms ease, color 160ms ease, border-color 160ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = cfg.border
              el.style.color       = cfg.accent
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = 'var(--ds-border)'
              el.style.color       = open ? 'var(--ds-text)' : 'var(--ds-text-dim)'
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden
              style={{
                transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 220ms ease',
              }}
            >
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {open ? 'Collapse highlights' : `Show ${item.bullets.length} highlight${item.bullets.length > 1 ? 's' : ''}`}
          </button>
        )}
      </div>

      {/* ── Expandable bullets ── */}
      <AnimatePresence initial={false}>
        {open && item.bullets.length > 0 && (
          <motion.div
            id={bulletId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                borderTop:   '1px solid var(--ds-border)',
                padding:     'var(--ds-space-5) var(--ds-space-6) var(--ds-space-6)',
                background:  'rgba(0,0,0,0.18)',
              }}
            >
              <ul
                style={{
                  listStyle:   'none',
                  margin:      0,
                  padding:     0,
                  display:     'grid',
                  gap:         'var(--ds-space-3)',
                }}
              >
                {item.bullets.map((bullet, bi) => (
                  <motion.li
                    key={bi}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: bi * 0.055 }}
                    style={{
                      display:    'flex',
                      alignItems: 'flex-start',
                      gap:        'var(--ds-space-3)',
                      fontSize:   '0.875rem',
                      lineHeight: 1.65,
                      color:      isPlaceholder ? 'var(--ds-text-dim)' : 'var(--ds-text-muted)',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        marginTop:  '0.45rem',
                        width:      5,
                        height:     5,
                        borderRadius: '50%',
                        background: cfg.accent,
                        flexShrink: 0,
                        opacity:    isPlaceholder ? 0.4 : 0.85,
                      }}
                    />
                    {bullet}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section block
// ─────────────────────────────────────────────────────────────────────────────

interface ExperienceSectionProps {
  title: string
  description: string
  items: ExperienceItem[]
  soft?: boolean
}

function ExperienceSection({
  title,
  description,
  items,
  soft = false,
}: ExperienceSectionProps): JSX.Element {
  return (
    <section className={`ds-section${soft ? ' ds-section--soft' : ''}`}>
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>{title}</Heading>
            <p
              style={{
                fontSize:   '0.95rem',
                lineHeight: 1.7,
                color:      'var(--ds-text-muted)',
                maxWidth:   '38rem',
              }}
            >
              {description}
            </p>
          </div>

          <Divider align="left" />

          <div
            style={{
              display: 'grid',
              gap:     'var(--ds-space-5)',
            }}
          >
            {items.map((item, i) => (
              <ExperienceCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ExperiencePage(): JSX.Element {
  const verifiedCount = EXPERIENCE_ITEMS.filter((e) => e.kind === 'verified').length
  const totalRoles    = EXPERIENCE_ITEMS.length + EDUCATION_ITEMS.length
  const publicProjectsCount = PROJECTS.filter((project) => Boolean(project.github)).length

  return (
    <>
      <PageHero
        eyebrow="Experience"
        title={
          <>
            Verified work,<br />
            <em>honest about the gaps.</em>
          </>
        }
        description="This page separates verified public work from placeholder employment and education slots. Project-backed evidence takes priority over invented job history."
        metrics={[
          { label: 'Verified roles',   value: String(verifiedCount).padStart(2, '0') },
          { label: 'Total entries',    value: String(totalRoles).padStart(2, '0') },
          { label: 'Public projects',  value: String(publicProjectsCount).padStart(2, '0') },
        ]}
        actions={
          <>
            <ButtonLink href="/projects" variant="primary" size="lg">
              Review project evidence
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary" size="lg">
              Open resume
            </ButtonLink>
          </>
        }
      />

      <ExperienceSection
        title="Work experience"
        description="Verified project work and portfolio architecture — backed by public repositories and shipped interfaces."
        items={EXPERIENCE_ITEMS}
      />

      <ExperienceSection
        title="Education"
        description="This section remains a placeholder until verified institution and credential details are confirmed."
        items={EDUCATION_ITEMS}
        soft
      />
    </>
  )
}
