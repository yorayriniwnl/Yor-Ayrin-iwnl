"use client"

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence, motion } from 'framer-motion'
import { RESUME_PROFILE } from '../lib/resume'

const ContactForm = dynamic(() => import('./ContactForm'), {
  ssr: false,
  loading: () => <div className="skeleton" style={{ height: '14rem' }} />,
})

export default function StickyContactButton(): JSX.Element {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button type="button" className="ds-dock__link" onClick={() => setOpen(true)}>
        Contact
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="ds-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              className="ds-modal__backdrop"
              aria-label="Close contact dialog"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="ds-modal__panel"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <div className="ds-stack ds-stack--tight">
                <div className="flex items-start justify-between gap-4">
                  <div className="ds-stack ds-stack--tight">
                    <span className="ds-eyebrow">Direct Contact</span>
                    <h3 className="ds-subheading">Start a conversation</h3>
                    <p className="ds-text ds-text--small">
                      Send a quick note here, or reach out directly at{' '}
                      <a
                        href={`mailto:${RESUME_PROFILE.email}`}
                        className="ds-shell-link"
                      >
                        {RESUME_PROFILE.email}
                      </a>
                      {' '}or call{' '}
                      <a
                        href={`tel:${RESUME_PROFILE.phone.replace(/\s+/g, '')}`}
                        className="ds-shell-link"
                      >
                        {RESUME_PROFILE.phone}
                      </a>
                      .
                    </p>
                  </div>

                  <button
                    type="button"
                    className="ds-modal__close"
                    onClick={() => setOpen(false)}
                    aria-label="Close contact dialog"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="ds-divider" />
                <ContactForm />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
