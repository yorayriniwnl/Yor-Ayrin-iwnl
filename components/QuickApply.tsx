"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_PROFILE } from '../lib/data'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LinkEntry {
  id: string
  label: string
  value: string
  description: string
  icon: React.ReactNode
}

type CopyState = 'idle' | 'copied' | 'error'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCopy() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconAllCopy() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  )
}

// ─── Individual link row ──────────────────────────────────────────────────────

interface LinkRowProps {
  entry: LinkEntry
  index: number
}

function LinkRow({ entry, index }: LinkRowProps) {
  const [state, setState] = useState<CopyState>('idle')

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(entry.value)
      setState('copied')
      window.setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('error')
      window.setTimeout(() => setState('idle'), 2000)
    }
  }, [entry.value])

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--ds-space-3)',
        padding: 'var(--ds-space-3) var(--ds-space-4)',
        borderRadius: 'var(--ds-radius-sm)',
        background: 'var(--ds-bg-raised)',
        border: '1px solid var(--ds-border)',
        transition: 'border-color 0.18s',
      }}
    >
      {/* Icon */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          borderRadius: 'var(--ds-radius-sm)',
          background: 'var(--ds-primary-soft)',
          color: 'var(--ds-primary)',
          flexShrink: 0,
        }}
      >
        {entry.icon}
      </span>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--ds-text-dim)',
            fontFamily: 'var(--ds-font-mono)',
          }}
        >
          {entry.label}
        </p>
        <p
          style={{
            margin: '1px 0 0',
            fontSize: '12px',
            color: 'var(--ds-text-muted)',
            fontFamily: 'var(--ds-font-mono)',
            letterSpacing: '0.02em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {entry.description}
        </p>
      </div>

      {/* Copy button */}
      <motion.button
        type="button"
        onClick={copy}
        aria-label={`Copy ${entry.label}`}
        whileTap={{ scale: 0.9 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: 'var(--ds-radius-sm)',
          background: state === 'copied' ? 'rgba(122,154,122,0.15)' : 'var(--ds-surface)',
          border: `1px solid ${state === 'copied' ? 'rgba(122,154,122,0.35)' : 'var(--ds-border)'}`,
          color: state === 'copied' ? 'var(--ds-success)' : 'var(--ds-text-dim)',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'background 0.18s, border-color 0.18s, color 0.18s',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === 'copied' ? (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            >
              <IconCheck />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.14 }}
            >
              <IconCopy />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          style={{
            position: 'fixed',
            bottom: 'var(--ds-space-8)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 90,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-space-2)',
            padding: 'var(--ds-space-3) var(--ds-space-5)',
            borderRadius: 'var(--ds-radius-pill)',
            background: 'var(--ds-surface-strong)',
            border: '1px solid var(--ds-border-strong)',
            boxShadow: 'var(--ds-shadow-md)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--ds-success)',
            fontFamily: 'var(--ds-font-mono)',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}
        >
          <IconCheck />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

const SITE_URL = typeof window !== 'undefined'
  ? window.location.origin
  : 'https://yorayriniwnl.vercel.app'

export default function QuickApply(): JSX.Element {
  const [toastVisible, setToastVisible] = useState(false)
  const [copying, setCopying] = useState(false)

  const links: LinkEntry[] = [
    {
      id: 'email',
      label: 'Email',
      value: SITE_PROFILE.email,
      description: SITE_PROFILE.email,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      value: SITE_PROFILE.phone,
      description: SITE_PROFILE.phone,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.35 1.9.66 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      id: 'github',
      label: 'GitHub',
      value: SITE_PROFILE.githubHref,
      description: SITE_PROFILE.githubLabel,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: SITE_PROFILE.linkedinHref,
      description: SITE_PROFILE.linkedinLabel,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      value: SITE_URL,
      description: SITE_PROFILE.websiteLabel,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
    },
    {
      id: 'resume',
      label: 'Resume PDF',
      value: `${SITE_URL}/resume.pdf`,
      description: '/resume.pdf',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
    },
  ]

  const copyAll = useCallback(async () => {
    if (copying) return
    setCopying(true)
    const text = [
      `${SITE_PROFILE.name} — ${SITE_PROFILE.role}`,
      '',
      `Email:     ${SITE_PROFILE.email}`,
      `Phone:     ${SITE_PROFILE.phone}`,
      `GitHub:    ${SITE_PROFILE.githubHref}`,
      `LinkedIn:  ${SITE_PROFILE.linkedinHref}`,
      `Portfolio: ${SITE_URL}`,
      `Resume:    ${SITE_URL}/resume.pdf`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setToastVisible(true)
      window.setTimeout(() => setToastVisible(false), 2600)
    } catch {}
    finally {
      window.setTimeout(() => setCopying(false), 600)
    }
  }, [copying])

  return (
    <>
      <section
        aria-labelledby="qa-heading"
        style={{
          padding: 'var(--ds-space-8)',
          background: 'var(--ds-surface)',
          border: '1px solid var(--ds-border-strong)',
          borderRadius: 'var(--ds-radius-lg)',
          boxShadow: 'var(--ds-shadow-md)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--ds-space-4)',
            marginBottom: 'var(--ds-space-6)',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ds-primary)',
                fontFamily: 'var(--ds-font-mono)',
              }}
            >
              Recruiter Shortcut
            </p>
            <h2
              id="qa-heading"
              style={{
                margin: '0 0 4px',
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: 'var(--ds-font-display)',
                color: 'var(--ds-text-soft)',
                letterSpacing: '-0.01em',
              }}
            >
              Quick Apply
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: 'var(--ds-text-dim)',
                fontFamily: 'var(--ds-font-body)',
                lineHeight: 1.5,
              }}
            >
              Copy any link individually, or grab everything at once.
            </p>
          </div>

          {/* Copy all button */}
          <motion.button
            type="button"
            onClick={copyAll}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy all contact links to clipboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--ds-space-2)',
              padding: 'var(--ds-space-3) var(--ds-space-5)',
              borderRadius: 'var(--ds-radius-sm)',
              background: copying ? 'rgba(122,154,122,0.12)' : 'var(--ds-primary)',
              border: `1px solid ${copying ? 'rgba(122,154,122,0.3)' : 'transparent'}`,
              color: copying ? 'var(--ds-success)' : 'var(--ds-bg)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--ds-font-mono)',
              cursor: copying ? 'default' : 'pointer',
              boxShadow: copying ? 'none' : '0 4px 18px var(--ds-primary-soft)',
              transition: 'background 0.22s, color 0.22s, border-color 0.22s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {copying ? <IconCheck /> : <IconAllCopy />}
            {copying ? 'Copied!' : 'Copy All'}
          </motion.button>
        </div>

        {/* Link rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-2)' }}>
          {links.map((entry, i) => (
            <LinkRow key={entry.id} entry={entry} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <p
          style={{
            margin: 'var(--ds-space-5) 0 0',
            fontSize: '11px',
            color: 'var(--ds-text-dim)',
            fontFamily: 'var(--ds-font-mono)',
            letterSpacing: '0.04em',
            textAlign: 'center',
          }}
        >
          {SITE_PROFILE.availability}
        </p>
      </section>

      <Toast message="All links copied to clipboard" visible={toastVisible} />
    </>
  )
}
