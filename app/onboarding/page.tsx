'use client'

/**
 * Onboarding page — shown on first visit.
 *
 * How to wire into layout.tsx:
 *   In your root layout (or a middleware), check:
 *     const hasVisited = cookies().get('hasVisited') or
 *     typeof window !== 'undefined' && localStorage.getItem('hasVisited')
 *   If not set, redirect to /onboarding.
 *   After the user completes onboarding or clicks Skip,
 *   set localStorage 'hasVisited' = '1' and navigate to '/'.
 */

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Step  = 1 | 2
type Role  = 'recruiter' | 'developer' | 'curious'

type RoleCard = {
  id: Role
  emoji: string
  title: string
  subtitle: string
}

type CtaCard = {
  emoji: string
  title: string
  subtitle: string
  href: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROLE_CARDS: RoleCard[] = [
  { id: 'recruiter', emoji: '👔', title: 'Recruiter',     subtitle: "I'm evaluating Ayush for a role."             },
  { id: 'developer', emoji: '👨‍💻', title: 'Developer',     subtitle: "I'm a fellow engineer checking out the stack." },
  { id: 'curious',   emoji: '✨', title: 'Just Curious', subtitle: 'I found this and want to explore.'             },
]

const CTA_BY_ROLE: Record<Role, { heading: string; ctas: CtaCard[]; buttonLabel: string; buttonHref: string }> = {
  recruiter: {
    heading: "Here's what matters most to you.",
    ctas: [
      { emoji: '📄', title: 'Download Resume',  subtitle: 'PDF, one click',                 href: '/resume'   },
      { emoji: '💼', title: 'View Projects',     subtitle: 'Production work & case studies', href: '/projects' },
      { emoji: '📬', title: 'Contact Ayush',     subtitle: 'Get in touch directly',          href: '/contact'  },
    ],
    buttonLabel: 'Go to Dashboard →',
    buttonHref:  '/dashboard',
  },
  developer: {
    heading: "Let's get into the details.",
    ctas: [
      { emoji: '⭐', title: 'GitHub Profile', subtitle: 'Browse code & repos',        href: 'https://github.com/yorayriniwnl' },
      { emoji: '🔧', title: 'View Tech Stack', subtitle: 'What runs under the hood',  href: '/skills'   },
      { emoji: '📖', title: 'Read DevLog',     subtitle: 'Engineering deep-dives',    href: '/devlog'   },
    ],
    buttonLabel: 'Explore the Site →',
    buttonHref:  '/',
  },
  curious: {
    heading: 'Start wherever looks interesting.',
    ctas: [
      { emoji: '🎮', title: 'Play a Game',    subtitle: 'Interactive experiments',   href: '/games'   },
      { emoji: '🌌', title: 'See 3D Skills',  subtitle: 'Three.js constellation',    href: '/skills'  },
      { emoji: '📸', title: 'View Gallery',   subtitle: 'Visuals & creative work',   href: '/gallery' },
    ],
    buttonLabel: 'Start Exploring →',
    buttonHref:  '/',
  },
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function markVisited(role?: Role): void {
  try {
    localStorage.setItem('hasVisited', '1')
    if (role) localStorage.setItem('userRole', role)
  } catch {}
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage(): React.JSX.Element {
  const [step, setStep] = useState<Step>(1)
  const [role, setRole] = useState<Role | null>(null)
  const router          = useRouter()
  const prefersReduced  = useReducedMotion()

  const handleRoleSelect = useCallback((selected: Role) => {
    setRole(selected)
    setTimeout(() => setStep(2), 200)
  }, [])

  function handleCtaClick(href: string): void {
    if (!role) return
    markVisited(role)
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      router.push(href)
    }
  }

  function handleSkip(): void {
    markVisited()
    router.push('/')
  }

  const currentCta = role ? CTA_BY_ROLE[role] : null

  // ── Variants ──────────────────────────────────────────────────────────────

  const pageVariants = prefersReduced
    ? {}
    : { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }

  const cardVariants: Variants | undefined = prefersReduced
    ? undefined
    : {
        hidden:  { opacity: 0, y: 18 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.08, ease: [0.22, 1, 0.36, 1], duration: 0.45 },
        }),
      }

  return (
    <>
      <style>{`
        .ob-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--ds-bg, #060a14);
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          position: relative;
          padding: 2rem 1.25rem;
        }

        /* subtle radial glow */
        .ob-root::before {
          content: '';
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 60%;
          background: radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 65%);
          pointer-events: none;
        }

        /* skip link */
        .ob-skip {
          position: fixed;
          top: 1.5rem;
          right: 1.75rem;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ds-text-muted, #8892aa);
          text-decoration: none;
          cursor: pointer;
          background: none;
          border: none;
          font-family: inherit;
          z-index: 10;
          padding: 6px 10px;
          border-radius: 6px;
          transition: color 0.15s;
        }
        .ob-skip:hover { color: var(--ds-text, #e8effe); }

        /* step indicator */
        .ob-steps {
          position: fixed;
          top: 1.6rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .ob-step-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--ds-border, rgba(255,255,255,0.15));
          transition: background 0.2s, width 0.2s;
        }
        .ob-step-dot--active {
          background: var(--ds-primary, #6366f1);
          width: 20px;
          border-radius: 3px;
        }

        /* inner wrapper */
        .ob-inner {
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          position: relative;
          z-index: 1;
        }

        /* headings */
        .ob-heading {
          font-family: var(--font-ds-display, 'Playfair Display', ui-serif, serif);
          font-size: clamp(2rem, 5vw, 2.5rem);
          font-weight: 900;
          color: var(--ds-text, #e8effe);
          text-align: center;
          margin: 0 0 0.625rem;
          line-height: 1.1;
        }
        .ob-subtext {
          font-size: 15px;
          color: var(--ds-text-muted, #8892aa);
          text-align: center;
          margin: 0 0 2.75rem;
        }

        /* role card grid */
        .ob-roles {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }
        @media (max-width: 560px) {
          .ob-roles { grid-template-columns: 1fr; }
        }

        .ob-role-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          aspect-ratio: 1;
          max-height: 180px;
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          border-radius: 16px;
          padding: 24px 16px;
          cursor: pointer;
          background: var(--ds-surface, rgba(255,255,255,0.03));
          text-align: center;
          font-family: inherit;
          color: var(--ds-text, #e8effe);
          transition: border-color 0.18s, background 0.18s;
        }
        .ob-role-card:hover {
          border-color: var(--ds-primary, #6366f1);
          background: rgba(99,102,241,0.07);
        }
        .ob-role-card__emoji { font-size: 32px; line-height: 1; }
        .ob-role-card__title {
          font-size: 15px;
          font-weight: 700;
          color: var(--ds-text, #e8effe);
        }
        .ob-role-card__sub {
          font-size: 12px;
          color: var(--ds-text-muted, #8892aa);
          line-height: 1.45;
        }

        /* CTA grid */
        .ob-ctas {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          margin-bottom: 2rem;
        }
        @media (max-width: 520px) {
          .ob-ctas { grid-template-columns: 1fr; }
        }

        .ob-cta-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px 16px;
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          border-radius: 16px;
          background: var(--ds-surface, rgba(255,255,255,0.03));
          cursor: pointer;
          font-family: inherit;
          color: var(--ds-text, #e8effe);
          text-align: center;
          text-decoration: none;
          transition: border-color 0.18s, background 0.18s;
        }
        .ob-cta-card:hover {
          border-color: var(--ds-primary, #6366f1);
          background: rgba(99,102,241,0.07);
        }
        .ob-cta-card__emoji { font-size: 28px; line-height: 1; }
        .ob-cta-card__title {
          font-size: 14px;
          font-weight: 700;
          color: var(--ds-text, #e8effe);
        }
        .ob-cta-card__sub {
          font-size: 11.5px;
          color: var(--ds-text-muted, #8892aa);
          line-height: 1.4;
        }

        /* primary CTA button */
        .ob-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 28px;
          border-radius: 9px;
          background: var(--ds-primary, #6366f1);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          border: none;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .ob-cta-btn:hover { opacity: 0.88; }
      `}</style>

      {/* Skip */}
      <button className="ob-skip" type="button" onClick={handleSkip} aria-label="Skip onboarding">
        Skip →
      </button>

      {/* Step dots */}
      <div className="ob-steps" aria-label="Step indicator">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`ob-step-dot${step === s ? ' ob-step-dot--active' : ''}`}
            aria-hidden="true"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            className="ob-inner"
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="ob-heading">Welcome. Who are you?</h1>
            <p className="ob-subtext">I'll personalize your experience.</p>

            <div className="ob-roles">
              {ROLE_CARDS.map((card, i) => (
                <motion.button
                  key={card.id}
                  type="button"
                  className="ob-role-card"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={prefersReduced ? {} : { scale: 1.03, borderColor: 'var(--ds-primary, #6366f1)' }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  onClick={() => handleRoleSelect(card.id)}
                  aria-label={`Select role: ${card.title}`}
                >
                  <span className="ob-role-card__emoji" aria-hidden="true">{card.emoji}</span>
                  <span className="ob-role-card__title">{card.title}</span>
                  <span className="ob-role-card__sub">{card.subtitle}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && currentCta && (
          <motion.div
            key="step2"
            className="ob-inner"
            initial={prefersReduced ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? {} : { opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="ob-heading">{currentCta.heading}</h1>

            <div className="ob-ctas">
              {currentCta.ctas.map((cta, i) => (
                <motion.button
                  key={cta.title}
                  type="button"
                  className="ob-cta-card"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={prefersReduced ? {} : { scale: 1.03 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  onClick={() => handleCtaClick(cta.href)}
                  aria-label={cta.title}
                >
                  <span className="ob-cta-card__emoji" aria-hidden="true">{cta.emoji}</span>
                  <span className="ob-cta-card__title">{cta.title}</span>
                  <span className="ob-cta-card__sub">{cta.subtitle}</span>
                </motion.button>
              ))}
            </div>

            <Link
              href={currentCta.buttonHref}
              className="ob-cta-btn"
              onClick={() => markVisited(role ?? undefined)}
            >
              {currentCta.buttonLabel}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
