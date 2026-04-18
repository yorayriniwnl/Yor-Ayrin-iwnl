"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { SITE_PROFILE } from '../lib/data'
import { usesMinimalChrome } from '../lib/chromeVisibility'
import QuickContactModal from './QuickContactModal'

// ─── Icons (inline SVG, no external deps) ────────────────────────────────────

function IconGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconResume() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ─── Action item definition ───────────────────────────────────────────────────

interface ActionItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  external?: boolean
  download?: boolean
  onClick?: () => void
  accent?: boolean
}

// ─── Single action button ─────────────────────────────────────────────────────

interface ActionButtonProps {
  item: ActionItem
  index: number
  totalActions: number
  expanded: boolean
}

function ActionButton({ item, index, totalActions, expanded }: ActionButtonProps) {
  const delay = (totalActions - 1 - index) * 0.045

  return (
    <motion.div
      initial={false}
      animate={expanded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.88 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 28,
        delay: expanded ? delay : 0,
      }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--ds-space-2)' }}
    >
      {/* Label tooltip */}
      <motion.span
        initial={false}
        animate={expanded ? { opacity: 1, x: 0 } : { opacity: 0, x: 6 }}
        transition={{ duration: 0.2, delay: expanded ? delay + 0.05 : 0 }}
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ds-text-dim)',
          fontFamily: 'var(--ds-font-mono)',
          pointerEvents: 'none',
        }}
      >
        {item.label}
      </motion.span>

      {/* Button */}
      {item.href ? (
        <a
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noopener noreferrer' : undefined}
          download={item.download ? true : undefined}
          aria-label={item.label}
          data-disable-custom-cursor="true"
          tabIndex={expanded ? 0 : -1}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--ds-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: item.accent ? 'var(--ds-primary)' : 'var(--ds-surface-strong)',
            border: `1px solid ${item.accent ? 'transparent' : 'var(--ds-border-strong)'}`,
            color: item.accent ? 'var(--ds-bg)' : 'var(--ds-text-muted)',
            textDecoration: 'none',
            boxShadow: 'var(--ds-shadow-sm)',
            transition: 'background 0.18s, color 0.18s, transform 0.12s',
            cursor: 'pointer',
          }}
        >
          {item.icon}
        </a>
      ) : (
        <button
          type="button"
          onClick={() => item.onClick?.()}
          aria-label={item.label}
          data-disable-custom-cursor="true"
          tabIndex={expanded ? 0 : -1}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--ds-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: item.accent ? 'var(--ds-primary)' : 'var(--ds-surface-strong)',
            border: `1px solid ${item.accent ? 'transparent' : 'var(--ds-border-strong)'}`,
            color: item.accent ? 'var(--ds-bg)' : 'var(--ds-text-muted)',
            boxShadow: 'var(--ds-shadow-sm)',
            transition: 'background 0.18s, color 0.18s, transform 0.12s',
            cursor: 'pointer',
          }}
        >
          {item.icon}
        </button>
      )}
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

function QuickActionsBody(): JSX.Element {
  const [expanded, setExpanded] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const actions: ActionItem[] = [
    {
      id: 'github',
      label: 'GitHub',
      icon: <IconGitHub />,
      href: SITE_PROFILE.githubHref,
      external: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: <IconLinkedIn />,
      href: SITE_PROFILE.linkedinHref,
      external: true,
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: <IconResume />,
      href: '/resume.pdf',
      download: true,
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <IconMail />,
      accent: true,
      onClick: () => {
        setExpanded(false)
        setContactOpen(true)
      },
    },
  ]

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && expanded) setExpanded(false)
  }, [expanded])

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setExpanded(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleKeyDown, handleOutsideClick])

  return (
    <>
      <div
        ref={containerRef}
        role="group"
        aria-label="Quick actions"
        style={{
          position: 'fixed',
          right: 'var(--ds-space-5)',
          bottom: '80px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 'var(--ds-space-2)',
        }}
      >
        {/* Action items */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="action-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-space-2)',
                alignItems: 'flex-end',
              }}
            >
              {actions.map((item, i) => (
                <ActionButton
                  key={item.id}
                  item={item}
                  index={i}
                  totalActions={actions.length}
                  expanded={expanded}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger button */}
        <motion.button
          type="button"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Close quick actions' : 'Open quick actions'}
          data-disable-custom-cursor="true"
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--ds-radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: expanded ? 'var(--ds-bg-raised)' : 'var(--ds-primary)',
            border: `1px solid ${expanded ? 'var(--ds-border-strong)' : 'transparent'}`,
            color: expanded ? 'var(--ds-text-muted)' : 'var(--ds-bg)',
            boxShadow: expanded ? 'var(--ds-shadow-sm)' : '0 4px 20px var(--ds-primary-soft)',
            cursor: 'pointer',
            transition: 'background 0.22s, color 0.22s, box-shadow 0.22s',
          }}
        >
          {expanded ? <IconClose /> : <IconPlus />}
        </motion.button>
      </div>

      <QuickContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}

export default function QuickActions(): JSX.Element {
  const pathname = usePathname()

  if (usesMinimalChrome(pathname)) return <></>

  return <QuickActionsBody />
}
