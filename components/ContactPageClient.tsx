'use client'

import React, { useState } from 'react'
import ContactForm from './ContactForm'
import { SITE_PROFILE } from '../lib/data'

// ─── FAQ data ─────────────────────────────────────────────────────────────────

type FaqItem = { question: string; answer: string }

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What type of roles are you looking for?',
    answer:
      'Frontend or full-stack roles focused on React, TypeScript, and modern web tech. Especially interested in companies building products where performance and UX actually matter.',
  },
  {
    question: 'Are you open to remote work?',
    answer:
      "Yes, fully remote or hybrid roles are both great. I'm based in India and have experience working across time zones.",
  },
  {
    question: "What's the best way to reach you?",
    answer:
      'The contact form is the fastest. For job inquiries, LinkedIn works well too. I check both daily.',
  },
]

// ─── FAQ accordion item ───────────────────────────────────────────────────────

function FaqRow({ item }: { item: FaqItem }): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-row${open ? ' faq-row--open' : ''}`}>
      <button
        type="button"
        className="faq-q"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{item.question}</span>
        <svg
          className="faq-arrow"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="faq-body" aria-hidden={!open}>
        <p className="faq-a">{item.answer}</p>
      </div>
    </div>
  )
}

// ─── Availability pulsing dot ─────────────────────────────────────────────────

function PulseDot(): React.JSX.Element {
  return <span className="pulse-dot" aria-hidden="true" />
}

// ─── Contact link row ─────────────────────────────────────────────────────────

function ContactLinkRow({
  icon,
  label,
  href,
  display,
  external,
}: {
  icon: string
  label: string
  href: string
  display: string
  external?: boolean
}): React.JSX.Element {
  return (
    <div className="cinfo-row">
      <span className="cinfo-icon" aria-hidden="true">{icon}</span>
      <span className="cinfo-label">{label}</span>
      <a
        href={href}
        className="cinfo-value"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {display}
      </a>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPageClient(): React.JSX.Element {
  return (
    <>
      <style>{`
        /* ── Page shell ── */
        .contact-page {
          min-height: 100vh;
          background: var(--ds-bg, #060a14);
          padding: 5rem 4rem 5rem;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          color: var(--ds-text, #e8effe);
        }
        @media (max-width: 767px) {
          .contact-page { padding: 4rem 1.5rem 4rem; }
        }

        .contact-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* ── Two-column grid ── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 4rem;
          align-items: flex-start;
        }
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        /* ── Left column ── */
        .contact-left {}
        .contact-heading {
          font-family: var(--font-ds-display, 'Playfair Display', ui-serif, serif);
          font-size: clamp(2.25rem, 5vw, 3rem);
          font-weight: 900;
          line-height: 1.06;
          letter-spacing: -0.025em;
          color: var(--ds-text, #e8effe);
          margin: 0 0 1rem;
        }
        .contact-sub {
          font-size: 15.5px;
          color: var(--ds-text-muted, #8892aa);
          line-height: 1.7;
          max-width: 500px;
          margin: 0 0 2.5rem;
        }

        /* ── Right column ── */
        .contact-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Cards ── */
        .ccard {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 24px;
        }
        .ccard__title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ds-text-muted, #8892aa);
          margin: 0 0 16px;
        }

        /* contact link rows */
        .cinfo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cinfo-row:last-child { border-bottom: none; }
        .cinfo-icon {
          font-size: 15px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        .cinfo-label {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--ds-text-muted, #8892aa);
          min-width: 62px;
        }
        .cinfo-value {
          font-size: 13.5px;
          color: var(--ds-text, #e8effe);
          text-decoration: none;
          flex: 1;
          text-align: right;
          transition: color 0.15s;
          word-break: break-all;
        }
        .cinfo-value:hover { color: var(--ds-primary, #6366f1); }

        /* availability card */
        .avail-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .avail-status {
          font-size: 15px;
          font-weight: 700;
          color: #22c55e;
        }
        .pulse-dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.4);
          animation: pulse-ring 1.8s infinite;
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-dot { animation: none; }
        }
        .avail-detail {
          font-size: 13.5px;
          color: var(--ds-text-muted, #8892aa);
          line-height: 1.7;
          margin: 0;
        }
        .avail-detail + .avail-detail { margin-top: 4px; }

        /* ── FAQ ── */
        .faq-section { margin-top: 3.5rem; }
        .faq-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ds-text-muted, #8892aa);
          margin: 0 0 16px;
        }

        .faq-row {
          border-bottom: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          overflow: hidden;
        }
        .faq-row:first-of-type { border-top: 1px solid var(--ds-border, rgba(255,255,255,0.07)); }

        .faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
          padding: 16px 0;
          background: none;
          border: none;
          color: var(--ds-text, #e8effe);
          font-size: 15px;
          font-weight: 600;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          cursor: pointer;
          text-align: left;
          transition: color 0.15s;
        }
        .faq-q:hover { color: var(--ds-primary, #6366f1); }

        .faq-arrow {
          flex-shrink: 0;
          color: var(--ds-text-muted, #8892aa);
          transition: transform 0.25s ease;
        }
        .faq-row--open .faq-arrow { transform: rotate(180deg); }

        .faq-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-row--open .faq-body { max-height: 200px; }
        .faq-a {
          margin: 0;
          padding: 0 0 18px;
          font-size: 14px;
          color: var(--ds-text-muted, #8892aa);
          line-height: 1.75;
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-body { transition: none; }
          .faq-arrow { transition: none; }
        }
      `}</style>

      <main className="contact-page">
        <div className="contact-inner">
          <div className="contact-grid">

            {/* ── Left: form ── */}
            <div className="contact-left">
              <h1 className="contact-heading">Get in Touch</h1>
              <p className="contact-sub">
                I'm currently available for new opportunities. Drop a message
                and I'll get back to you within 24 hours.
              </p>
              <ContactForm />

              {/* FAQ below form on all viewports */}
              <div className="faq-section">
                <p className="faq-title">Frequently Asked</p>
                {FAQ_ITEMS.map((item) => (
                  <FaqRow key={item.question} item={item} />
                ))}
              </div>
            </div>

            {/* ── Right: info cards ── */}
            <div className="contact-right">

              {/* Direct contact card */}
              <div className="ccard">
                <p className="ccard__title">Direct Contact</p>
                <ContactLinkRow
                  icon="✉"
                  label="Email"
                  href={`mailto:${SITE_PROFILE.email}`}
                  display={SITE_PROFILE.email}
                />
                <ContactLinkRow
                  icon="tel"
                  label="Phone"
                  href={`tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}`}
                  display={SITE_PROFILE.phone}
                />
                <ContactLinkRow
                  icon="⌥"
                  label="GitHub"
                  href={SITE_PROFILE.githubHref}
                  display={SITE_PROFILE.githubLabel}
                  external
                />
                <ContactLinkRow
                  icon="in"
                  label="LinkedIn"
                  href={SITE_PROFILE.linkedinHref}
                  display={SITE_PROFILE.linkedinLabel}
                  external
                />
              </div>

              {/* Availability card */}
              <div className="ccard">
                <p className="ccard__title">Availability</p>
                <div className="avail-top">
                  <PulseDot />
                  <span className="avail-status">Currently Available</span>
                </div>
                <p className="avail-detail">Open to: Full-time · Contract · Remote</p>
                <p className="avail-detail">Response time: &lt; 24 hours</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  )
}
