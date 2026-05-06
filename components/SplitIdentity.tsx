"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SplitIdentityProps = {
  professional: {
    heading: string
    tagline: string
    points: string[]
  }
  personal: {
    heading: string
    tagline: string
    items: { emoji: string; label: string; detail: string }[]
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmojiItem({ emoji, label, detail }: { emoji: string; label: string; detail: string }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '32px 1fr',
        gridTemplateRows: 'auto auto',
        columnGap: 'var(--ds-space-3)',
        rowGap: '1px',
        padding: 'var(--ds-space-3) 0',
      }}
    >
      <motion.span
        whileHover={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        style={{
          fontSize: '22px',
          lineHeight: 1,
          gridRow: '1 / 3',
          alignSelf: 'center',
          display: 'block',
          cursor: 'default',
        }}
        aria-hidden="true"
      >
        {emoji}
      </motion.span>
      <span
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--ds-text-soft)',
          fontFamily: 'var(--ds-font-body)',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '13px',
          color: 'var(--ds-text-muted)',
          fontFamily: 'var(--ds-font-body)',
          lineHeight: 1.5,
        }}
      >
        {detail}
      </span>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SplitIdentity({ professional, personal }: SplitIdentityProps): JSX.Element {
  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--ds-space-12)',
      }}
      className="split-identity"
    >
      {/* Desktop vertical divider */}
      <div
        aria-hidden="true"
        className="split-divider"
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          height: '80%',
          width: '1px',
          background: 'rgba(255,255,255,0.08)',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Left: Professional ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-5)' }}
      >
        <div>
          <p
            style={{
              margin: '0 0 var(--ds-space-3)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#6366f1',
              fontFamily: 'var(--ds-font-mono)',
            }}
          >
            Professional
          </p>
          <h2
            style={{
              margin: '0 0 var(--ds-space-2)',
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-soft)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {professional.heading}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '18px',
              color: 'var(--ds-text-muted)',
              fontFamily: 'var(--ds-font-body)',
              lineHeight: 1.5,
            }}
          >
            {professional.tagline}
          </p>
        </div>

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
          {professional.points.map((point, i) => (
            <li
              key={i}
              style={{
                borderLeft: '2px solid #6366f1',
                paddingLeft: '16px',
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'var(--ds-text)',
                fontFamily: 'var(--ds-font-body)',
              }}
            >
              {point}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Right: Personal ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-5)' }}
      >
        <div>
          <p
            style={{
              margin: '0 0 var(--ds-space-3)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#06b6d4',
              fontFamily: 'var(--ds-font-mono)',
            }}
          >
            Personal
          </p>
          <h2
            style={{
              margin: '0 0 var(--ds-space-2)',
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 700,
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-soft)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {personal.heading}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '18px',
              color: 'var(--ds-text-muted)',
              fontFamily: 'var(--ds-font-body)',
              lineHeight: 1.5,
            }}
          >
            {personal.tagline}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0 var(--ds-space-4)',
          }}
        >
          {personal.items.map((item, i) => (
            <EmojiItem key={i} emoji={item.emoji} label={item.label} detail={item.detail} />
          ))}
        </div>
      </motion.div>

      {/* Responsive collapse to single column */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 767px) {
              .split-identity { grid-template-columns: 1fr !important; gap: var(--ds-space-12) !important; }
              .split-divider { display: none !important; }
            }
          `,
        }}
      />
    </div>
  )
}
