"use client"

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_PROFILE } from '../lib/data'

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'sending' | 'success' | 'error'

export interface QuickContactModalProps {
  open: boolean
  onClose: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email)
}

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  type?: 'text' | 'email' | 'textarea'
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
  disabled?: boolean
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  disabled = false,
}: FieldProps) {
  const sharedStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--ds-space-3) var(--ds-space-4)',
    background: 'var(--ds-bg-raised)',
    border: '1px solid var(--ds-border)',
    borderRadius: 'var(--ds-radius-sm)',
    color: 'var(--ds-text)',
    fontFamily: 'var(--ds-font-body)',
    fontSize: '13px',
    lineHeight: 1.6,
    outline: 'none',
    transition: 'border-color 0.18s',
    resize: type === 'textarea' ? 'vertical' : undefined,
    opacity: disabled ? 0.6 : 1,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-1)' }}>
      <label
        htmlFor={id}
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--ds-text-dim)',
          fontFamily: 'var(--ds-font-mono)',
        }}
      >
        {label}
        {required && (
          <span style={{ color: 'var(--ds-primary)', marginLeft: '3px' }} aria-hidden>
            *
          </span>
        )}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          style={sharedStyle}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ds-border-strong)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--ds-border)')}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          style={sharedStyle}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--ds-border-strong)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--ds-border)')}
        />
      )}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function QuickContactModal({ open, onClose }: QuickContactModalProps): JSX.Element {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus]   = useState<Status>('idle')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const dialogRef  = useRef<HTMLDivElement>(null)
  const firstInput = useRef<HTMLInputElement>(null)

  // Focus first input on open
  useEffect(() => {
    if (open) {
      window.setTimeout(() => firstInput.current?.focus(), 60)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape key
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Reset form on close
  useEffect(() => {
    if (!open) {
      window.setTimeout(() => {
        setName('')
        setEmail('')
        setMessage('')
        setStatus('idle')
        setFieldError(null)
      }, 300)
    }
  }, [open])

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, input, textarea, a[href], select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setFieldError(null)

    if (!name.trim()) { setFieldError('Please enter your name.'); return }
    if (!email.trim() || !isValidEmail(email)) { setFieldError('Please enter a valid email address.'); return }
    if (!message.trim()) { setFieldError('Please enter a message.'); return }

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: 'Quick contact request',
          message,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const firstValidationError =
          body?.errors && typeof body.errors === 'object'
            ? Object.values(body.errors).find((value): value is string => typeof value === 'string')
            : null

        setFieldError(
          firstValidationError ?? body?.error ?? 'Failed to send. Try emailing directly.',
        )
        setStatus('error')
        return
      }

      setStatus('success')
      window.setTimeout(onClose, 1800)
    } catch {
      // Fallback to mailto when API is unavailable
      const subject = encodeURIComponent(`Contact from ${name}`)
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
      window.open(`mailto:${SITE_PROFILE.email}?subject=${subject}&body=${body}`)
      setStatus('success')
      window.setTimeout(onClose, 1400)
    }
  }, [name, email, message, onClose])

  const isBusy    = status === 'sending'
  const isSuccess = status === 'success'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="qcm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 70,
              background: 'rgba(0,0,0,0.64)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Dialog */}
          <motion.div
            key="qcm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qcm-title"
            ref={dialogRef}
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 71,
              width: 'min(460px, calc(100vw - 2rem))',
              background: 'var(--ds-surface-strong)',
              border: '1px solid var(--ds-border-strong)',
              borderRadius: 'var(--ds-radius-lg)',
              boxShadow: 'var(--ds-shadow-lg)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--ds-space-5) var(--ds-space-6)',
                borderBottom: '1px solid var(--ds-border)',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 3px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--ds-primary)',
                    fontFamily: 'var(--ds-font-mono)',
                  }}
                >
                  Get in Touch
                </p>
                <h2
                  id="qcm-title"
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                    fontFamily: 'var(--ds-font-display)',
                    color: 'var(--ds-text-soft)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Send a Message
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact modal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--ds-radius-sm)',
                  background: 'transparent',
                  border: '1px solid var(--ds-border)',
                  color: 'var(--ds-text-dim)',
                  cursor: 'pointer',
                  transition: 'background 0.18s, color 0.18s',
                  flexShrink: 0,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 'var(--ds-space-6)' }}>
              <AnimatePresence mode="wait" initial={false}>
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--ds-space-3)',
                      padding: 'var(--ds-space-8) 0',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(122,154,122,0.12)',
                        border: '1px solid rgba(122,154,122,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--ds-success)',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--ds-text-soft)',
                        fontFamily: 'var(--ds-font-body)',
                      }}
                    >
                      Message sent!
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'var(--ds-text-dim)',
                        fontFamily: 'var(--ds-font-mono)',
                      }}
                    >
                      I'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ds-space-3)' }}>
                      <Field
                        id="qcm-name"
                        label="Name"
                        value={name}
                        onChange={setName}
                        placeholder="Your name"
                        required
                        disabled={isBusy}
                      />
                      <Field
                        id="qcm-email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="your@email.com"
                        required
                        disabled={isBusy}
                      />
                    </div>

                    <Field
                      id="qcm-message"
                      label="Message"
                      type="textarea"
                      value={message}
                      onChange={setMessage}
                      placeholder="What's on your mind?"
                      required
                      rows={4}
                      disabled={isBusy}
                    />

                    {/* Error */}
                    <AnimatePresence>
                      {fieldError && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          role="alert"
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#c04a3a',
                            fontFamily: 'var(--ds-font-mono)',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {fieldError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--ds-space-3)', paddingTop: 'var(--ds-space-1)', flexWrap: 'wrap' }}>
                      <a
                        href={`mailto:${SITE_PROFILE.email}`}
                        style={{
                          fontSize: '11px',
                          color: 'var(--ds-text-dim)',
                          fontFamily: 'var(--ds-font-mono)',
                          textDecoration: 'none',
                          letterSpacing: '0.03em',
                          transition: 'color 0.18s',
                        }}
                      >
                        or email directly →
                      </a>

                      <a
                        href={`tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}`}
                        style={{
                          fontSize: '11px',
                          color: 'var(--ds-text-dim)',
                          fontFamily: 'var(--ds-font-mono)',
                          textDecoration: 'none',
                          letterSpacing: '0.03em',
                          transition: 'color 0.18s',
                        }}
                      >
                        {SITE_PROFILE.phone}
                      </a>

                      <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
                        <button
                          type="button"
                          onClick={onClose}
                          disabled={isBusy}
                          style={{
                            padding: '8px 16px',
                            borderRadius: 'var(--ds-radius-sm)',
                            border: '1px solid var(--ds-border)',
                            background: 'transparent',
                            color: 'var(--ds-text-muted)',
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            fontFamily: 'var(--ds-font-mono)',
                            cursor: 'pointer',
                            transition: 'background 0.18s',
                          }}
                        >
                          Cancel
                        </button>

                        <motion.button
                          type="submit"
                          disabled={isBusy}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            padding: '8px 20px',
                            borderRadius: 'var(--ds-radius-sm)',
                            border: 'none',
                            background: isBusy ? 'var(--ds-border)' : 'var(--ds-primary)',
                            color: isBusy ? 'var(--ds-text-dim)' : 'var(--ds-bg)',
                            fontSize: '12px',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--ds-font-mono)',
                            cursor: isBusy ? 'default' : 'pointer',
                            boxShadow: isBusy ? 'none' : '0 4px 14px var(--ds-primary-soft)',
                            transition: 'background 0.22s, color 0.22s, box-shadow 0.22s',
                          }}
                        >
                          {isBusy ? 'Sending…' : 'Send'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
