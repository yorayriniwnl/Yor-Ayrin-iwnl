'use client'

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FocusEvent,
  FormEvent,
} from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'sending' | 'success' | 'error' | 'ratelimit'

type FormFields = {
  name: string
  email: string
  subject: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormFields, string>>

const INITIAL_FIELDS: FormFields = {
  name:    '',
  email:   '',
  subject: '',
  message: '',
}

const SUBJECT_OPTIONS = [
  'General Inquiry',
  'Job Opportunity',
  'Collaboration',
  'Feedback',
  'Other',
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MESSAGE_MAX = 2000

// ─── Per-field validation ─────────────────────────────────────────────────────

function validateField(field: keyof FormFields, value: string): string {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Name is required.'
      if (value.trim().length < 2) return 'Name must be at least 2 characters.'
      return ''
    case 'email':
      if (!value.trim()) return 'Email is required.'
      if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.'
      return ''
    case 'subject':
      if (!value) return 'Please select a subject.'
      return ''
    case 'message':
      if (!value.trim()) return 'Message is required.'
      if (value.trim().length < 10) return 'Message must be at least 10 characters.'
      if (value.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`
      return ''
    default:
      return ''
  }
}

function validateAll(fields: FormFields): FieldErrors {
  const errors: FieldErrors = {}
  ;(Object.keys(fields) as Array<keyof FormFields>).forEach((key) => {
    const err = validateField(key, fields[key])
    if (err) errors[key] = err
  })
  return errors
}

// ─── Success card ─────────────────────────────────────────────────────────────

function SuccessCard({ email }: { email: string }): React.JSX.Element {
  const prefersReduced = useReducedMotion()
  return (
    <motion.div
      className="cf-success"
      initial={prefersReduced ? false : { opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      role="status"
      aria-live="polite"
    >
      <div className="cf-success__icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="15" stroke="#22c55e" strokeWidth="1.8" />
          <path d="M9 16.5l5 5 9-10" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="cf-success__title">Message sent!</h3>
      <p className="cf-success__sub">
        I'll reply to <strong>{email}</strong> within 24 hours.
      </p>
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContactForm(): React.JSX.Element {
  const [fields,      setFields]      = useState<FormFields>(INITIAL_FIELDS)
  const [errors,      setErrors]      = useState<FieldErrors>({})
  const [touched,     setTouched]     = useState<Partial<Record<keyof FormFields, boolean>>>({})
  const [status,      setStatus]      = useState<Status>('idle')
  const [globalError, setGlobalError] = useState<string>('')
  const [retryAfter,  setRetryAfter]  = useState<number>(0)
  const [countdown,   setCountdown]   = useState<number>(0)

  // Countdown ticker
  useEffect(() => {
    if (status !== 'ratelimit' || countdown <= 0) {
      if (status === 'ratelimit' && countdown <= 0) {
        setStatus('idle')
        setGlobalError('')
      }
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [status, countdown])

  // Kick off countdown when retryAfter changes
  useEffect(() => {
    if (retryAfter > 0) setCountdown(retryAfter)
  }, [retryAfter])

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (touched[name as keyof FormFields]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof FormFields, value),
      }))
    }
  }

  function handleBlur(
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ): void {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof FormFields, value),
    }))
  }

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()
      if (status === 'sending') return

      setTouched({ name: true, email: true, subject: true, message: true })
      const errs = validateAll(fields)
      setErrors(errs)
      if (Object.keys(errs).length > 0) return

      setStatus('sending')
      setGlobalError('')

      try {
        const res  = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields),
        })
        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          return
        }

        if (res.status === 400) {
          if (data.errors && typeof data.errors === 'object') {
            setErrors(data.errors as FieldErrors)
          } else {
            setGlobalError(data.error ?? 'Validation failed. Please check your inputs.')
          }
          setStatus('error')
          return
        }

        if (res.status === 429) {
          const secs = typeof data.retryAfter === 'number' ? data.retryAfter : 3600
          setRetryAfter(secs)
          setStatus('ratelimit')
          return
        }

        setGlobalError(
          'Something went wrong. Please try again or email directly at ayush@example.com',
        )
        setStatus('error')
      } catch {
        setGlobalError(
          'Something went wrong. Please try again or email directly at ayush@example.com',
        )
        setStatus('error')
      }
    },
    [fields, status],
  )

  const isDisabled = status === 'sending' || status === 'ratelimit'
  const charCount  = fields.message.length
  const charOver   = charCount > 1800

  function fmtCountdown(sec: number): string {
    if (sec <= 0) return '0s'
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  return (
    <>
      <style>{`
        .cf-root { width: 100%; }

        /* banners */
        .cf-banner {
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13.5px;
          line-height: 1.55;
          margin-bottom: 20px;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }
        .cf-banner--error {
          background: rgba(239,68,68,0.09);
          border: 1px solid rgba(239,68,68,0.28);
          color: #fca5a5;
        }
        .cf-banner--ratelimit {
          background: rgba(234,179,8,0.09);
          border: 1px solid rgba(234,179,8,0.28);
          color: #fde68a;
        }

        /* form */
        .cf-form { display: flex; flex-direction: column; gap: 20px; }
        .cf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 500px) { .cf-row-2 { grid-template-columns: 1fr; } }

        /* field */
        .cf-field { display: flex; flex-direction: column; gap: 6px; }
        .cf-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--ds-text-muted, #8892aa);
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }
        .cf-label__req { color: var(--ds-primary, #6366f1); margin-left: 2px; }

        /* inputs */
        .cf-input, .cf-select, .cf-textarea {
          width: 100%;
          box-sizing: border-box;
          background: var(--ds-surface, rgba(255,255,255,0.04));
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14.5px;
          color: var(--ds-text, #e8effe);
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          appearance: none;
          -webkit-appearance: none;
        }
        .cf-input::placeholder, .cf-textarea::placeholder {
          color: var(--ds-text-muted, #8892aa);
          opacity: 0.6;
        }
        .cf-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%238892aa' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
          cursor: pointer;
        }
        .cf-select option { background: #0f172a; color: #e2e8f0; }
        .cf-textarea { resize: vertical; min-height: 130px; line-height: 1.65; }

        .cf-input:focus, .cf-select:focus, .cf-textarea:focus {
          border-color: var(--ds-primary, #6366f1);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.13);
        }
        .cf-input--err, .cf-select--err, .cf-textarea--err {
          border-color: rgba(239,68,68,0.5);
        }
        .cf-input--err:focus, .cf-select--err:focus, .cf-textarea--err:focus {
          box-shadow: 0 0 0 3px rgba(239,68,68,0.11);
        }
        .cf-input:disabled, .cf-select:disabled, .cf-textarea:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        /* textarea char count */
        .cf-textarea-wrap { position: relative; }
        .cf-charcount {
          position: absolute;
          bottom: 9px;
          right: 11px;
          font-size: 11px;
          color: var(--ds-text-muted, #8892aa);
          pointer-events: none;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          background: var(--ds-surface, rgba(8,10,20,0.85));
          padding: 1px 5px;
          border-radius: 4px;
          transition: color 0.15s;
        }
        .cf-charcount--over { color: #f87171; }

        /* field errors */
        .cf-ferr {
          font-size: 12.5px;
          color: #f87171;
          opacity: 0;
          max-height: 0;
          overflow: hidden;
          transition: opacity 0.18s, max-height 0.18s;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }
        .cf-ferr--show { opacity: 1; max-height: 3em; }

        /* submit */
        .cf-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 30px;
          border-radius: 8px;
          background: var(--ds-primary, #6366f1);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          border: none;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.12s;
          align-self: flex-start;
          min-width: 148px;
        }
        .cf-submit:hover:not(:disabled) { opacity: 0.87; }
        .cf-submit:active:not(:disabled) { transform: scale(0.98); }
        .cf-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        /* CSS spinner */
        .cf-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.28);
          border-top-color: #fff;
          border-radius: 50%;
          animation: cf-spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes cf-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .cf-spinner { animation: none; border-top-color: rgba(255,255,255,0.6); }
        }

        /* success */
        .cf-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 52px 32px;
          background: var(--ds-surface, rgba(255,255,255,0.03));
          border: 1px solid rgba(34,197,94,0.18);
          border-radius: 14px;
          text-align: center;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }
        .cf-success__icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(34,197,94,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cf-success__title {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
          color: var(--ds-text, #e8effe);
          font-family: var(--font-ds-display, 'Playfair Display', ui-serif, serif);
        }
        .cf-success__sub {
          margin: 0;
          font-size: 15px;
          color: var(--ds-text-muted, #8892aa);
          line-height: 1.65;
        }
      `}</style>

      <div className="cf-root">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <SuccessCard key="success" email={fields.email} />
          ) : (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {/* Error banner */}
              {status === 'error' && globalError && (
                <div className="cf-banner cf-banner--error" role="alert">
                  {globalError}
                </div>
              )}

              {/* Rate limit banner */}
              {status === 'ratelimit' && (
                <div className="cf-banner cf-banner--ratelimit" role="alert">
                  Too many messages. Try again in <strong>{fmtCountdown(countdown)}</strong>.
                </div>
              )}

              <form className="cf-form" onSubmit={handleSubmit} noValidate>
                {/* Name + Email row */}
                <div className="cf-row-2">
                  {/* Name */}
                  <div className="cf-field">
                    <label htmlFor="cf-name" className="cf-label">
                      Name<span className="cf-label__req">*</span>
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={`cf-input${touched.name && errors.name ? ' cf-input--err' : ''}`}
                      placeholder="Your name"
                      value={fields.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isDisabled}
                      aria-describedby="cf-name-err"
                      aria-invalid={!!(touched.name && errors.name)}
                    />
                    <span
                      id="cf-name-err"
                      className={`cf-ferr${touched.name && errors.name ? ' cf-ferr--show' : ''}`}
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.name}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="cf-field">
                    <label htmlFor="cf-email" className="cf-label">
                      Email<span className="cf-label__req">*</span>
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`cf-input${touched.email && errors.email ? ' cf-input--err' : ''}`}
                      placeholder="you@example.com"
                      value={fields.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isDisabled}
                      aria-describedby="cf-email-err"
                      aria-invalid={!!(touched.email && errors.email)}
                    />
                    <span
                      id="cf-email-err"
                      className={`cf-ferr${touched.email && errors.email ? ' cf-ferr--show' : ''}`}
                      role="alert"
                      aria-live="polite"
                    >
                      {errors.email}
                    </span>
                  </div>
                </div>

                {/* Subject */}
                <div className="cf-field">
                  <label htmlFor="cf-subject" className="cf-label">
                    Subject<span className="cf-label__req">*</span>
                  </label>
                  <select
                    id="cf-subject"
                    name="subject"
                    className={`cf-select${touched.subject && errors.subject ? ' cf-select--err' : ''}`}
                    value={fields.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isDisabled}
                    aria-describedby="cf-subject-err"
                    aria-invalid={!!(touched.subject && errors.subject)}
                  >
                    <option value="">Select a topic…</option>
                    {SUBJECT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <span
                    id="cf-subject-err"
                    className={`cf-ferr${touched.subject && errors.subject ? ' cf-ferr--show' : ''}`}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.subject}
                  </span>
                </div>

                {/* Message */}
                <div className="cf-field">
                  <label htmlFor="cf-message" className="cf-label">
                    Message<span className="cf-label__req">*</span>
                  </label>
                  <div className="cf-textarea-wrap">
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={5}
                      className={`cf-textarea${touched.message && errors.message ? ' cf-textarea--err' : ''}`}
                      placeholder="What's on your mind?"
                      value={fields.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isDisabled}
                      maxLength={MESSAGE_MAX}
                      aria-describedby="cf-message-err"
                      aria-invalid={!!(touched.message && errors.message)}
                    />
                    <span
                      className={`cf-charcount${charOver ? ' cf-charcount--over' : ''}`}
                      aria-live="polite"
                    >
                      {charCount} / {MESSAGE_MAX}
                    </span>
                  </div>
                  <span
                    id="cf-message-err"
                    className={`cf-ferr${touched.message && errors.message ? ' cf-ferr--show' : ''}`}
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.message}
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="cf-submit"
                  disabled={isDisabled}
                  aria-label={status === 'sending' ? 'Sending message…' : 'Send message'}
                >
                  {status === 'sending' && (
                    <span className="cf-spinner" aria-hidden="true" />
                  )}
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
