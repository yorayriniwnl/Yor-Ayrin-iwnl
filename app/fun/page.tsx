'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Container from '../../components/ui/Container'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Heading, Subheading, Eyebrow } from '../../components/ui/Typography'
import Text from '../../components/ui/Text'
import { ButtonLink } from '../../components/ui/Button'
import Divider from '../../components/ui/Divider'
import { useKonamiCode } from '../../hooks/useKonamiCode'

/* ─────────────────────────── data ─────────────────────────── */

const FUN_FACTS = [
  'Debugs with console.log() like everyone else',
  'Believes in semantic HTML and accessibility',
  'Coffee-driven development is not a joke',
  'Tabs vs spaces? Prettier handles it',
  'Dark mode enthusiast since forever',
  'Thinks CSS Grid is underrated',
  'Has a love-hate relationship with regex',
  'Prefers TypeScript over JavaScript',
]

const HOBBIES = [
  { emoji: '🎮', label: 'Gaming',               detail: 'Building and playing interactive experiences' },
  { emoji: '🎨', label: 'Design',               detail: 'Crafting premium interfaces and systems' },
  { emoji: '⌨️', label: 'Mechanical keyboards', detail: 'Appreciating the tactile craft' },
  { emoji: '🎵', label: 'Music',                detail: 'Lo-fi beats while coding' },
  { emoji: '📚', label: 'Reading',              detail: 'Tech docs, design systems, case studies' },
  { emoji: '🏃', label: 'Running',              detail: 'Clearing the mind between builds' },
]

const DEV_THOUGHTS = [
  'Good code is read more than written.',
  'Premature optimization is the root of all evil.',
  'Make it work, make it right, make it fast.',
  'Simple is harder than complex.',
  'The best error message is the one that never shows up.',
  'Design systems are love letters to future you.',
  'Ship early, iterate often.',
  'Code review is a gift, not a gatekeeper.',
  'Every portfolio needs a personality layer.',
  'Polish is in the details, not the animations.',
]

function getDailyThought(): string {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  return DEV_THOUGHTS[dayOfYear % DEV_THOUGHTS.length]
}

/* ─────────────────── Konami mobile sequence pad ───────────────────
   Renders a subtle row of 10 tap-buttons, only on touch screens
   (hidden at md breakpoint and above via md:hidden).
   Each button dispatches the matching key into the hook.
──────────────────────────────────────────────────────────────────── */

const MOBILE_PAD: { label: string; key: string }[] = [
  { label: '↑', key: 'ArrowUp'    },
  { label: '↑', key: 'ArrowUp'    },
  { label: '↓', key: 'ArrowDown'  },
  { label: '↓', key: 'ArrowDown'  },
  { label: '←', key: 'ArrowLeft'  },
  { label: '→', key: 'ArrowRight' },
  { label: '←', key: 'ArrowLeft'  },
  { label: '→', key: 'ArrowRight' },
  { label: 'B', key: 'b'          },
  { label: 'A', key: 'a'          },
]

function MobilePad({ onPress }: { onPress: (key: string) => void }) {
  return (
    <div
      className="md:hidden"
      aria-label="Konami code touch pad"
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.35rem',
        paddingTop: '1rem',
        paddingBottom: '0.25rem',
        opacity: 0.3,
      }}
    >
      {MOBILE_PAD.map(({ label, key }, i) => (
        <button
          key={i}
          aria-label={`Konami key ${label}`}
          onClick={() => onPress(key)}
          style={{
            width: '1.75rem',
            height: '1.75rem',
            fontSize: '0.65rem',
            fontFamily: 'var(--ds-font-mono)',
            color: 'var(--ds-text-dim)',
            background: 'var(--ds-surface)',
            border: '1px solid var(--ds-border)',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            padding: 0,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/* ─────────────────── CSS-only particle burst overlay ─────────────────── */

const PARTICLE_STYLES = `
@keyframes konami-particle {
  0%   { transform: translate(0, 0) scale(1);   opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
@keyframes konami-fade-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes konami-slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes konami-shimmer {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.65; }
}
.konami-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: rgba(10, 9, 6, 0.92);
  cursor: pointer;
}
.konami-content {
  animation: konami-fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  text-align: center;
  padding: 2rem;
  max-width: 480px;
}
.konami-title {
  font-family: var(--ds-font-display);
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-weight: 700;
  color: var(--ds-primary);
  animation: konami-shimmer 2s ease-in-out infinite;
  margin-bottom: 1.5rem;
}
.konami-achievement {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--ds-primary);
  border-radius: 0.5rem;
  background: rgba(201, 168, 76, 0.08);
  font-family: var(--ds-font-mono);
  font-size: 0.9rem;
  color: var(--ds-primary);
  animation: konami-slide-up 0.5s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.konami-dismiss {
  margin-top: 1.25rem;
  font-size: 0.75rem;
  font-family: var(--ds-font-mono);
  color: var(--ds-text-dim);
  opacity: 0.6;
  animation: konami-fade-in 0.4s 0.6s both;
}
.konami-particle {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--ds-primary);
  animation: konami-particle var(--dur) ease-out both;
}
`

const PARTICLE_COUNT = 32

type ParticleSpec = {
  tx: number
  ty: number
  dur: number
  opacity: number
  size: number
}

function seededUnit(seed: number): number {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

function buildParticles(): ParticleSpec[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * 360
    const dist = 80 + seededUnit(i + 1) * 220
    const tx = Math.cos((angle * Math.PI) / 180) * dist
    const ty = Math.sin((angle * Math.PI) / 180) * dist

    return {
      tx,
      ty,
      dur: 0.6 + seededUnit(i + 101) * 0.8,
      opacity: 0.5 + seededUnit(i + 201) * 0.5,
      size: 4 + seededUnit(i + 301) * 5,
    }
  })
}

function ParticleField() {
  return (
    <>
      {buildParticles().map((particle, i) => (
        <div
          key={i}
          className="konami-particle"
          style={
            {
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              '--dur': `${particle.dur}s`,
              opacity: particle.opacity,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function KonamiOverlay({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="konami-overlay" onClick={onDismiss} role="dialog" aria-modal="true">
      <ParticleField />
      <div className="konami-content" onClick={(e) => e.stopPropagation()}>
        <p className="konami-title">You found the secret.<br />Welcome, dev.</p>
        <div className="konami-achievement">
          <span>🕹️</span>
          <span>Konami Master — Unlocked</span>
        </div>
        <p className="konami-dismiss">click anywhere · closes in 5 s</p>
      </div>
    </div>
  )
}

/* ──────────────────────────── page ──────────────────────────── */

export default function FunPage() {
  const dailyThought = getDailyThought()
  const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const [showOverlay, setShowOverlay] = useState(false)
  const handleActivate = useCallback(() => setShowOverlay(true), [])
  const { pressKey } = useKonamiCode({ onActivate: handleActivate })

  const handleDismiss = useCallback(() => setShowOverlay(false), [])

  return (
    <>
      {/* Inject keyframe styles once */}
      <style>{PARTICLE_STYLES}</style>

      {/* Konami overlay */}
      {showOverlay && <KonamiOverlay onDismiss={handleDismiss} />}

      <section className="ds-section" style={{ paddingTop: 'calc(var(--ds-header-height) + 2rem)' }}>
        <Container>
          <div className="ds-section-intro ds-section-intro--center">
            <Eyebrow>Playground</Eyebrow>
            <Heading className="mt-4">
              The <em>human</em> layer
            </Heading>
            <Text className="max-w-2xl" style={{ marginTop: 'var(--ds-space-4)' }}>
              Where the polished portfolio loosens up, and personality gets equal weight alongside project work.
            </Text>
          </div>
        </Container>
      </section>

      <section className="ds-section ds-section--soft">
        <Container>
          <div className="ds-stack ds-stack--loose">

            {/* Daily dev thought */}
            <Card as="article" style={{ borderColor: 'var(--ds-border-strong)' }}>
              <div className="ds-stack ds-stack--tight">
                <div className="flex items-center gap-2">
                  <Badge accent>Daily thought</Badge>
                  <Text
                    size="sm"
                    style={{ color: 'var(--ds-text-dim)', fontFamily: 'var(--ds-font-mono)' }}
                    suppressHydrationWarning
                  >
                    {todayLabel}
                  </Text>
                </div>
                <Subheading
                  style={{ fontStyle: 'italic', color: 'var(--ds-primary)' }}
                  suppressHydrationWarning
                >
                  &ldquo;{dailyThought}&rdquo;
                </Subheading>
              </div>
            </Card>

            <div className="ds-split ds-split--2">
              {/* Fun facts */}
              <Card as="article">
                <div className="ds-stack">
                  <Subheading>Fun facts about this dev</Subheading>
                  <Divider align="left" />
                  <div className="ds-stack ds-stack--tight">
                    {FUN_FACTS.map((fact, index) => (
                      <div key={index} style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--ds-primary)', fontSize: '0.75rem', marginTop: '0.15rem' }}>▸</span>
                        <Text size="sm">{fact}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Hobbies */}
              <Card as="article">
                <div className="ds-stack">
                  <Subheading>Outside the terminal</Subheading>
                  <Divider align="left" />
                  <div className="ds-stack ds-stack--tight">
                    {HOBBIES.map((hobby, index) => (
                      <div key={index} style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{hobby.emoji}</span>
                        <div>
                          <Text size="sm" style={{ color: 'var(--ds-text-soft)', fontWeight: 600 }}>
                            {hobby.label}
                          </Text>
                          <Text size="sm" style={{ color: 'var(--ds-text-muted)' }}>
                            {hobby.detail}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--ds-space-4)', flexWrap: 'wrap', justifyContent: 'center', paddingTop: 'var(--ds-space-6)' }}>
              <ButtonLink href="/games"  variant="primary"   size="lg">Play the car game</ButtonLink>
              <ButtonLink href="/steam"  variant="secondary" size="lg">Steam-style profile</ButtonLink>
              <ButtonLink href="/media"  variant="ghost"     size="lg">Media &amp; demos</ButtonLink>
            </div>

            {/* Mobile Konami pad — visible only on touch devices (hidden md+) */}
            <MobilePad onPress={pressKey} />

          </div>
        </Container>
      </section>
    </>
  )
}
