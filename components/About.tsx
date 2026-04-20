"use client"

import React from 'react'
import { motion } from 'framer-motion'
import SplitIdentity from './SplitIdentity'

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SPLIT_DATA = {
  professional: {
    heading: 'How I Work',
    tagline: 'Engineering with intent and care.',
    points: [
      'Production-first thinking â€” I write code that ships, not just runs locally.',
      'Deep ownership â€” from design decisions to deployment configs.',
      'Performance as a feature â€” I profile before I optimize.',
      'Accessible by default â€” semantic HTML, keyboard navigation, ARIA done right.',
      'Documentation that actually helps the next developer.',
    ],
  },
  personal: {
    heading: 'Who I Am',
    tagline: 'A developer who is also just a person.',
    items: [
      { emoji: 'ðŸŽ®', label: 'Gamer',        detail: 'Elden Ring, Dark Souls, anything FromSoftware' },
      { emoji: 'ðŸ“š', label: 'Reader',       detail: 'SICP, DDIA, anything that changes how I think' },
      { emoji: 'ðŸŽ¸', label: 'Music',        detail: 'Lo-fi while coding, post-rock while thinking' },
      { emoji: 'ðŸŒ', label: 'Location',     detail: 'India, open to remote worldwide' },
      { emoji: 'âš¡', label: 'Early Adopter', detail: 'First to try new frameworks. Still alive.' },
      { emoji: 'ðŸ§©', label: 'Puzzle Lover', detail: 'Advent of Code every December' },
    ],
  },
}

const PHILOSOPHY_CARDS = [
  {
    title: 'Build to Ship',
    body:  'Code that never leaves localhost is a hobby. I build with deployment, performance, and maintainability in mind from the very first commit.',
    accent: '#6366f1',
  },
  {
    title: 'Make it Human',
    body:  "The best systems are invisible. The best interfaces feel obvious. I obsess over the gap between what's technically possible and what's actually usable.",
    accent: '#06b6d4',
  },
  {
    title: 'Own the Stack',
    body:  'I work across frontend, Python tooling, and ML/CV workflows, with each skill tied back to a real project.',
    accent: '#f59e0b',
  },
]

const NOW_ITEMS = [
  'ðŸ”¨ Building this portfolio with Next.js 16 + Three.js',
  'ðŸ“– Reading: Designing Data-Intensive Applications',
  'Open to internships, entry-level software roles, and remote collaboration',
  'Learning: OpenCV, Scikit-Learn, and Three.js',
]

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionSpacer() {
  return <div style={{ height: 'var(--ds-space-20)' }} aria-hidden="true" />
}

function SectionLabel({ children, color = 'var(--ds-primary)' }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      style={{
        margin: '0 0 var(--ds-space-3)',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color,
        fontFamily: 'var(--ds-font-mono)',
      }}
    >
      {children}
    </p>
  )
}

// â”€â”€â”€ Section 1: Hero intro â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function HeroSection() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--ds-space-6)',
      }}
    >
      {/* Avatar circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        aria-label="Ayush Roy initials"
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '2px solid #6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(99,102,241,0.2)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--ds-font-display)',
            fontSize: '56px',
            fontWeight: 700,
            color: '#6366f1',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            userSelect: 'none',
          }}
        >
          AR
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(38px, 6vw, 56px)',
            fontWeight: 700,
            fontFamily: 'var(--ds-font-display)',
            color: 'var(--ds-text-soft)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          I&apos;m Ayush Roy.
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: '#94a3b8',
            fontFamily: 'var(--ds-font-body)',
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          System Builder. Creative Developer. Open to Work.
        </p>
      </motion.div>
    </section>
  )
}

// â”€â”€â”€ Section 2: Story paragraph â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StorySection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}
    >
      <p
        style={{
          margin: 0,
          fontSize: '18px',
          lineHeight: 1.8,
          color: '#cbd5e1',
          fontFamily: 'var(--ds-font-body)',
        }}
      >
        I&apos;ve been building things on the web for 4+ years. I&apos;m most at home at the intersection
        of engineering and design â€” where the system is elegant, the interface is alive, and the user
        experience is thoughtful. I&apos;ve worked across the full stack: from React frontends and
        Node.js APIs to Three.js 3D scenes and Python ML pipelines. My goal is always to build
        something I&apos;d actually want to use.
      </p>
    </motion.section>
  )
}

// â”€â”€â”€ Section 3: Split identity (How I Work / Who I Am) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function IdentitySection() {
  return (
    <section aria-labelledby="identity-heading">
      <h2 id="identity-heading" className="sr-only">
        Professional and Personal Identity
      </h2>
      <SplitIdentity professional={SPLIT_DATA.professional} personal={SPLIT_DATA.personal} />
    </section>
  )
}

// â”€â”€â”€ Section 4: Philosophy cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function PhilosophySection() {
  return (
    <section aria-labelledby="philosophy-heading">
      <div style={{ textAlign: 'center', marginBottom: 'var(--ds-space-10)' }}>
        <SectionLabel>Philosophy</SectionLabel>
        <h2
          id="philosophy-heading"
          style={{
            margin: 0,
            fontSize: 'clamp(24px, 3.5vw, 34px)',
            fontWeight: 700,
            fontFamily: 'var(--ds-font-display)',
            color: 'var(--ds-text-soft)',
            letterSpacing: '-0.02em',
          }}
        >
          How I Think About Work
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--ds-space-5)',
        }}
      >
        {PHILOSOPHY_CARDS.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'var(--ds-space-6)',
              background: 'var(--ds-surface)',
              border: '1px solid var(--ds-border)',
              borderRadius: 'var(--ds-radius-md)',
              borderTop: `3px solid ${card.accent}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--ds-space-3)',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                fontFamily: 'var(--ds-font-display)',
                color: 'var(--ds-text-soft)',
                letterSpacing: '-0.01em',
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'var(--ds-text-muted)',
                fontFamily: 'var(--ds-font-body)',
              }}
            >
              {card.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

// â”€â”€â”€ Section 5: Current status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function NowSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby="now-heading"
      style={{
        padding: 'var(--ds-space-7)',
        background: 'var(--ds-surface)',
        border: '1px solid var(--ds-border)',
        borderLeft: '3px solid #6366f1',
        borderRadius: 'var(--ds-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-5)',
        maxWidth: '640px',
      }}
    >
      <h2
        id="now-heading"
        style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 700,
          fontFamily: 'var(--ds-font-display)',
          color: 'var(--ds-text-soft)',
          letterSpacing: '-0.01em',
        }}
      >
        What I&apos;m Up To Right Now
      </h2>

      <ul
        role="list"
        style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-space-3)',
        }}
      >
        {NOW_ITEMS.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: 'var(--ds-text)',
              fontFamily: 'var(--ds-font-body)',
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.section>
  )
}

// â”€â”€â”€ Main export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function About(): JSX.Element {
  return (
    <div
      style={{
        maxWidth: 'var(--ds-container)',
        margin: '0 auto',
        padding: '0 var(--ds-gutter)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <HeroSection />
      <SectionSpacer />
      <StorySection />
      <SectionSpacer />
      <IdentitySection />
      <SectionSpacer />
      <PhilosophySection />
      <SectionSpacer />
      <NowSection />
      <div style={{ height: 'var(--ds-space-20)' }} aria-hidden="true" />

      {/* sr-only utility used for section headings */}
      <style dangerouslySetInnerHTML={{ __html: `.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}` }} />
    </div>
  )
}

