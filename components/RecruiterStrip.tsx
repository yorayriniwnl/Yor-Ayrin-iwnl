"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { SITE_PROFILE } from '../lib/data'
import { usesMinimalChrome } from '../lib/chromeVisibility'
import QuickContactModal from './QuickContactModal'

function RecruiterStripBody(): JSX.Element {
  const [visible, setVisible] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const ticking = useRef(false)

  const checkScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.8)
        ticking.current = false
      })
      ticking.current = true
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => window.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="recruiter-strip"
            role="banner"
            aria-label="Recruiter quick-access strip"
            className="recruiter-strip-root"
            initial={{ y: 72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 72, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 60,
              background: 'var(--ds-surface-strong)',
              borderTop: '1px solid var(--ds-border-strong)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.38)',
            }}
          >
            <div
              style={{
                maxWidth: 'var(--ds-container)',
                margin: '0 auto',
                padding: '0 var(--ds-gutter)',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--ds-space-4)',
              }}
            >
              {/* Identity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--ds-space-3)',
                  minWidth: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Open-to-work dot */}
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--ds-success)',
                    boxShadow: '0 0 6px var(--ds-success)',
                  }}
                />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--ds-text-soft)',
                    fontFamily: 'var(--ds-font-display)',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {SITE_PROFILE.name}
                </span>
                <span
                  aria-hidden
                  style={{
                    width: '1px',
                    height: '14px',
                    background: 'var(--ds-border-strong)',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--ds-text-dim)',
                    fontFamily: 'var(--ds-font-mono)',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {SITE_PROFILE.role}
                </span>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--ds-space-2)',
                  flexShrink: 0,
                }}
              >
                <a
                  href="/resume.pdf"
                  download
                  aria-label="Download resume PDF"
                  data-disable-custom-cursor="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 13px',
                    borderRadius: 'var(--ds-radius-sm)',
                    border: '1px solid var(--ds-border)',
                    background: 'var(--ds-bg-raised)',
                    color: 'var(--ds-text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    fontFamily: 'var(--ds-font-mono)',
                    textDecoration: 'none',
                    transition: 'border-color 0.18s, color 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  <span className="strip-label-md">Download CV</span>
                </a>

                <a
                  href="/resume"
                  aria-label="View resume"
                  data-disable-custom-cursor="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 13px',
                    borderRadius: 'var(--ds-radius-sm)',
                    border: '1px solid var(--ds-border)',
                    background: 'var(--ds-bg-raised)',
                    color: 'var(--ds-text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    fontFamily: 'var(--ds-font-mono)',
                    textDecoration: 'none',
                    transition: 'border-color 0.18s, color 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="strip-label-lg">View Resume</span>
                  <span className="strip-label-sm">Resume</span>
                </a>

                <a
                  href={`tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}`}
                  aria-label="Call phone number"
                  data-disable-custom-cursor="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 13px',
                    borderRadius: 'var(--ds-radius-sm)',
                    border: '1px solid var(--ds-border)',
                    background: 'var(--ds-bg-raised)',
                    color: 'var(--ds-text-muted)',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.07em',
                    fontFamily: 'var(--ds-font-mono)',
                    textDecoration: 'none',
                    transition: 'border-color 0.18s, color 0.18s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="strip-label-md">Call</span>
                  <span className="strip-label-sm">Call</span>
                </a>

                <button
                  onClick={() => setContactOpen(true)}
                  aria-label="Open contact modal"
                  data-disable-custom-cursor="true"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 16px',
                    borderRadius: 'var(--ds-radius-sm)',
                    background: 'var(--ds-primary)',
                    border: 'none',
                    color: 'var(--ds-bg)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--ds-font-mono)',
                    cursor: 'pointer',
                    transition: 'background 0.18s, transform 0.12s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .strip-label-sm { display: none; }
            .strip-label-md { display: inline; }
            .strip-label-lg { display: inline; }
            @media (max-width: 480px) {
              .strip-label-sm { display: inline; }
              .strip-label-md { display: none; }
              .strip-label-lg { display: none; }
            }
            @media (min-width: 481px) and (max-width: 639px) {
              .strip-label-lg { display: none; }
            }
          `,
        }}
      />

      <QuickContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}

export default function RecruiterStrip(): JSX.Element {
  const pathname = usePathname()

  if (usesMinimalChrome(pathname)) return <></>

  return <RecruiterStripBody />
}
