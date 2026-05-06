import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ACHIEVEMENT_ITEMS } from '../../lib/data'
import { STATIC_ACTIVITY } from '../../lib/activity'
import type { AchievementItem } from '../../data/site'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import { Heading } from '../../components/ui/Typography'
import { ButtonLink } from '../../components/ui/Button'
import PageHero from '../../components/sections/PageHero'

export const metadata: Metadata = {
  title: 'Achievements — Yor Ayrin',
  description:
    'A record of verified milestones, shipped projects, and explicit placeholders — honest about what is earned and what is still outstanding.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats derived from data
// ─────────────────────────────────────────────────────────────────────────────

const verified  = ACHIEVEMENT_ITEMS.filter((a) => a.kind === 'verified')
const pending   = ACHIEVEMENT_ITEMS.filter((a) => a.kind === 'placeholder')

// ─────────────────────────────────────────────────────────────────────────────
// Achievement card
// ─────────────────────────────────────────────────────────────────────────────

function AchievementCard({ item }: { item: AchievementItem }): JSX.Element {
  const isVerified = item.kind === 'verified'

  const card = (
    <article
      style={{
        position:       'relative',
        display:        'grid',
        gap:            'var(--ds-space-4)',
        padding:        'var(--ds-space-6)',
        borderRadius:   'var(--ds-radius-lg)',
        border:         isVerified
          ? '1px solid var(--ds-border)'
          : '1px dashed var(--ds-border)',
        background:     isVerified
          ? 'linear-gradient(160deg, rgba(26,23,16,0.96) 0%, rgba(17,16,9,0.94) 100%)'
          : 'rgba(17,16,9,0.5)',
        boxShadow:      isVerified ? 'var(--ds-shadow-sm)' : 'none',
        opacity:        isVerified ? 1 : 0.55,
        height:         '100%',
        overflow:       'hidden',
        transition:     'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
      }}
    >
      {/* Top shimmer line — only on verified */}
      {isVerified && (
        <div
          aria-hidden
          style={{
            position:   'absolute',
            inset:      '0 0 auto',
            height:     1,
            background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45), transparent)',
          }}
        />
      )}

      {/* Header row */}
      <div
        style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            'var(--ds-space-3)',
        }}
      >
        {/* Kind badge */}
        <span
          style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           '0.35rem',
            fontSize:      '0.7rem',
            fontFamily:    'var(--ds-font-mono)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding:       '0.2rem 0.6rem',
            borderRadius:  'var(--ds-radius-pill)',
            border:        isVerified
              ? '1px solid rgba(201,168,76,0.35)'
              : '1px solid var(--ds-border)',
            background:    isVerified
              ? 'rgba(201,168,76,0.09)'
              : 'transparent',
            color:         isVerified
              ? 'var(--ds-primary)'
              : 'var(--ds-text-dim)',
          }}
        >
          {isVerified ? (
            <>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" />
                <path d="M2.5 5.2L4.2 6.8L7.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified
            </>
          ) : (
            <>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
                <circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
              </svg>
              Placeholder
            </>
          )}
        </span>

        {/* Date if available */}
        {item.dateDisplay && (
          <span
            style={{
              fontSize:   '0.7rem',
              fontFamily: 'var(--ds-font-mono)',
              color:      'var(--ds-text-dim)',
              flexShrink: 0,
            }}
          >
            {item.dateDisplay}
          </span>
        )}
      </div>

      {/* Icon/label pill */}
      <div>
        <span
          style={{
            display:    'inline-block',
            fontSize:   '0.72rem',
            fontFamily: 'var(--ds-font-mono)',
            color:      isVerified ? 'var(--ds-text-muted)' : 'var(--ds-text-dim)',
            padding:    '0.15rem 0.5rem',
            borderRadius: 'var(--ds-radius-sm)',
            background:   'var(--ds-bg-raised)',
            border:       '1px solid var(--ds-border)',
          }}
        >
          {item.label}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize:      'clamp(0.95rem, 1.2vw, 1.05rem)',
          fontFamily:    'var(--ds-font-display)',
          fontWeight:    700,
          lineHeight:    1.3,
          letterSpacing: '-0.01em',
          color:         isVerified ? 'var(--ds-text-soft)' : 'var(--ds-text-dim)',
          margin:        0,
        }}
      >
        {item.title}
      </h3>

      {/* Detail */}
      <p
        style={{
          fontSize:   '0.875rem',
          lineHeight: 1.65,
          color:      isVerified ? 'var(--ds-text-muted)' : 'var(--ds-text-dim)',
          margin:     0,
          flex:       1,
        }}
      >
        {item.detail}
      </p>

      {/* Link */}
      {item.href && isVerified && (
        <div style={{ marginTop: 'auto', paddingTop: 'var(--ds-space-2)' }}>
          <Link
            href={item.href}
            className="ds-button ds-button--secondary ds-button--sm"
            style={{ fontSize: '0.75rem' }}
          >
            Open detail →
          </Link>
        </div>
      )}
    </article>
  )

  return card
}

// ─────────────────────────────────────────────────────────────────────────────
// Recent activity row
// ─────────────────────────────────────────────────────────────────────────────

function ActivityRow(): JSX.Element {
  const items = STATIC_ACTIVITY.slice(0, 6)

  return (
    <section className="ds-section ds-section--soft">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>Recent unlocks</Heading>
            <p
              style={{
                fontSize:   '0.95rem',
                lineHeight: 1.7,
                color:      'var(--ds-text-muted)',
                maxWidth:   '38rem',
              }}
            >
              Activity updates add cadence to the achievement page without
              pretending to be a live game service.
            </p>
          </div>

          <Divider align="left" />

          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
              gap:                 'var(--ds-space-5)',
            }}
          >
            {items.map((item) => (
              <article
                key={item.id}
                style={{
                  display:      'grid',
                  gap:          'var(--ds-space-3)',
                  padding:      'var(--ds-space-5)',
                  borderRadius: 'var(--ds-radius-lg)',
                  border:       '1px solid var(--ds-border)',
                  background:   'linear-gradient(180deg, rgba(26,23,16,0.92), rgba(17,16,9,0.9))',
                }}
              >
                <span
                  style={{
                    fontSize:      '0.7rem',
                    fontFamily:    'var(--ds-font-mono)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color:         'var(--ds-primary)',
                    padding:       '0.18rem 0.55rem',
                    borderRadius:  'var(--ds-radius-pill)',
                    border:        '1px solid rgba(201,168,76,0.3)',
                    background:    'rgba(201,168,76,0.07)',
                    display:       'inline-block',
                    width:         'fit-content',
                  }}
                >
                  {item.source ?? 'update'}
                </span>
                <p
                  style={{
                    fontSize:   '0.875rem',
                    lineHeight: 1.55,
                    color:      'var(--ds-text-muted)',
                    margin:     0,
                  }}
                >
                  {item.message}
                </p>
                {item.ts && (
                  <time
                    dateTime={new Date(item.ts).toISOString()}
                    style={{
                      fontSize:   '0.72rem',
                      fontFamily: 'var(--ds-font-mono)',
                      color:      'var(--ds-text-dim)',
                    }}
                  >
                    {new Date(item.ts).toLocaleDateString('en-US', {
                      month: 'short',
                      day:   'numeric',
                      year:  'numeric',
                    })}
                  </time>
                )}
              </article>
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

export default function AchievementsPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Achievements"
        title={
          <>
            Milestones that are<br />
            <em>earned, not decorated.</em>
          </>
        }
        description="Achievements pull from real project and site work. Each verified entry links to evidence. Placeholder slots are labeled honestly rather than filled with invented accomplishments."
        metrics={[
          { label: 'Verified',     value: String(verified.length).padStart(2, '0') },
          { label: 'Outstanding',  value: String(pending.length).padStart(2, '0') },
          { label: 'Total signals', value: String(ACHIEVEMENT_ITEMS.length).padStart(2, '0') },
        ]}
        actions={
          <>
            <ButtonLink href="/projects" variant="primary" size="lg">
              Review projects
            </ButtonLink>
            <ButtonLink href="/timeline" variant="secondary" size="lg">
              Full timeline
            </ButtonLink>
          </>
        }
      />

      {/* ── Verified achievements ── */}
      {verified.length > 0 && (
        <section className="ds-section">
          <Container>
            <div className="ds-stack ds-stack--loose">
              <div className="ds-section-intro" style={{ marginBottom: 0 }}>
                <Heading>Verified achievements</Heading>
                <p
                  style={{
                    fontSize:   '0.95rem',
                    lineHeight: 1.7,
                    color:      'var(--ds-text-muted)',
                    maxWidth:   '38rem',
                  }}
                >
                  Each of these links to public evidence — a shipped project,
                  a working demo, or a documented system.
                </p>
              </div>

              <Divider align="left" />

              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
                  gap:                 'var(--ds-space-6)',
                  alignItems:          'start',
                }}
              >
                {verified.map((item) => (
                  <AchievementCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Pending / placeholder ── */}
      {pending.length > 0 && (
        <section className="ds-section ds-section--soft">
          <Container>
            <div className="ds-stack ds-stack--loose">
              <div className="ds-section-intro" style={{ marginBottom: 0 }}>
                <Heading>Outstanding slots</Heading>
                <p
                  style={{
                    fontSize:   '0.95rem',
                    lineHeight: 1.7,
                    color:      'var(--ds-text-muted)',
                    maxWidth:   '38rem',
                  }}
                >
                  These slots are held for real milestones that are not yet
                  confirmed. They are shown here as explicit placeholders
                  rather than hidden or invented.
                </p>
              </div>

              <Divider align="left" />

              <div
                style={{
                  display:             'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))',
                  gap:                 'var(--ds-space-6)',
                  alignItems:          'start',
                }}
              >
                {pending.map((item) => (
                  <AchievementCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Recent activity ── */}
      <ActivityRow />
    </>
  )
}
