'use client'

import { useState, type FormEvent } from 'react'
import { SITE_PROFILE } from '../../data/personal'

type ContactFormState = {
  name: string
  email: string
  msg: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const INITIAL_FORM: ContactFormState = {
  name: '',
  email: '',
  msg: '',
}

function getFirstErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null

  const maybeErrors = (payload as { errors?: unknown }).errors
  if (!maybeErrors || typeof maybeErrors !== 'object') return null

  return Object.values(maybeErrors).find((value): value is string => typeof value === 'string') ?? null
}

export default function Contact() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM)
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')

    if (!form.name.trim()) {
      setStatus('error')
      setFeedback('Please enter your name.')
      return
    }

    if (!form.email.trim()) {
      setStatus('error')
      setFeedback('Please enter your email.')
      return
    }

    if (!form.msg.trim()) {
      setStatus('error')
      setFeedback('Please enter a message.')
      return
    }

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: 'Homepage inquiry',
          message: form.msg,
        }),
      })

      const body = await response.json().catch(() => ({}))

      if (!response.ok) {
        setStatus('error')
        setFeedback(
          getFirstErrorMessage(body) ??
            (typeof body?.error === 'string' ? body.error : 'Message failed to send.'),
        )
        return
      }

      setStatus('success')
      setFeedback("Message sent. I'll get back to you soon.")
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
      setFeedback(`Something went wrong. Email me directly at ${SITE_PROFILE.email}.`)
    }
  }

  const isBusy = status === 'sending'

  return (
    <section className="contact" id="contact">
      <div className="section-wrap">
        <div className="contact-inner">
          <div className="contact-left">
            <div className="section-label">Get in Touch</div>
            <h2 className="contact-heading">
              Let&apos;s build something <em>real.</em>
            </h2>
            <p className="contact-desc">
              Open to verified opportunities and collaboration conversations. If
              you&apos;re building something worth building, let&apos;s talk.
            </p>

            <div className="contact-links">
              <a className="contact-link-row" href={`mailto:${SITE_PROFILE.email}`}>
                <span className="contact-link-label">Email</span>
                <span className="contact-link-val">{SITE_PROFILE.email}</span>
                <span className="contact-link-arrow">-&gt;</span>
              </a>
              <a className="contact-link-row" href={`tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}`}>
                <span className="contact-link-label">Phone</span>
                <span className="contact-link-val">{SITE_PROFILE.phone}</span>
                <span className="contact-link-arrow">call</span>
              </a>
              <a
                className="contact-link-row"
                href={SITE_PROFILE.githubHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-link-label">GitHub</span>
                <span className="contact-link-val">{SITE_PROFILE.githubLabel}</span>
                <span className="contact-link-arrow">-&gt;</span>
              </a>
              <a
                className="contact-link-row"
                href={SITE_PROFILE.linkedinHref}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-link-label">LinkedIn</span>
                <span className="contact-link-val">{SITE_PROFILE.linkedinLabel}</span>
                <span className="contact-link-arrow">-&gt;</span>
              </a>
              <a className="contact-link-row" href="/resume.pdf" target="_blank" rel="noreferrer">
                <span className="contact-link-label">Resume</span>
                <span className="contact-link-val">Download PDF</span>
                <span className="contact-link-arrow">download</span>
              </a>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-bar">
                <span className="contact-form-title">send-message.md</span>
                <div className="form-dots">
                  <div className="form-dot" />
                  <div className="form-dot" />
                  <div className="form-dot" />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="contactName">Your Name</label>
                <input
                  id="contactName"
                  type="text"
                  placeholder="Who am I speaking to?"
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, name: event.target.value }))
                  }
                  disabled={isBusy}
                />
              </div>

              <div className="form-field">
                <label htmlFor="contactEmail">Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="Where should I reply?"
                  value={form.email}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, email: event.target.value }))
                  }
                  disabled={isBusy}
                />
              </div>

              <div className="form-field">
                <label htmlFor="contactMsg">Message</label>
                <textarea
                  id="contactMsg"
                  placeholder="What are you building? What's the opportunity?"
                  value={form.msg}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, msg: event.target.value }))
                  }
                  disabled={isBusy}
                />
              </div>

              <div className="form-footer">
                <span className="form-note">
                  {feedback || (status === 'success' ? "I'll reply within 24 hours." : 'Response within 24-48 hours')}
                </span>
                <button className="btn-send" type="submit" disabled={isBusy}>
                  {isBusy ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
