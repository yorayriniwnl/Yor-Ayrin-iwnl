'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type JourneyStep = {
  href: string
  label: string
  summary: string
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    href: '/',
    label: 'Home',
    summary: 'Start with the core narrative and profile signal.',
  },
  {
    href: '/about',
    label: 'About',
    summary: 'See background, values, and product direction.',
  },
  {
    href: '/projects',
    label: 'Projects',
    summary: 'Review shipped builds, systems, and outcomes.',
  },
  {
    href: '/experience',
    label: 'Experience',
    summary: 'Trace execution history, ownership, and growth.',
  },
  {
    href: '/skills',
    label: 'Skills',
    summary: 'Scan technical depth and current capability map.',
  },
  {
    href: '/hobbies',
    label: 'Explore Hobbies',
    summary: 'Personal curation across gallery, videos, music, and ideas.',
  },
  {
    href: '/resume',
    label: 'Resume',
    summary: 'Get the compact recruiter-ready summary.',
  },
  {
    href: '/contact',
    label: 'Contact',
    summary: 'Open the conversation and move to next steps.',
  },
]

const CANONICAL_ALIASES: Record<string, string> = {
  '/cv': '/resume',
  '/steam': '/projects',
  '/games': '/projects',
  '/stats': '/projects',
  '/media': '/hobbies',
  '/gallery': '/hobbies',
  '/timeline': '/experience',
  '/achievements': '/experience',
}

function canonicalizePath(pathname: string): string {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  if (trimmed.startsWith('/projects/')) return '/projects'
  if (trimmed.startsWith('/hobbies/')) return '/hobbies'
  if (trimmed.startsWith('/experience/')) return '/experience'
  if (trimmed.startsWith('/skills/')) return '/skills'
  if (trimmed.startsWith('/contact/')) return '/contact'
  if (trimmed.startsWith('/resume/')) return '/resume'

  return CANONICAL_ALIASES[trimmed] ?? trimmed
}

export default function FooterJourney(): JSX.Element {
  const pathname = usePathname() ?? '/'
  const canonicalPath = canonicalizePath(pathname)
  const currentIndex = JOURNEY_STEPS.findIndex((step) => step.href === canonicalPath)
  const hasKnownStep = currentIndex >= 0

  const current = hasKnownStep ? JOURNEY_STEPS[currentIndex] : null
  const previous = hasKnownStep && currentIndex > 0 ? JOURNEY_STEPS[currentIndex - 1] : null
  const next = hasKnownStep
    ? JOURNEY_STEPS[(currentIndex + 1) % JOURNEY_STEPS.length]
    : JOURNEY_STEPS[1]

  const chapterLabel = hasKnownStep
    ? `Chapter ${currentIndex + 1} of ${JOURNEY_STEPS.length}`
    : 'Guided journey'

  const leadCopy = hasKnownStep
    ? `You are in ${current?.label}. ${next.summary}`
    : 'Continue the intentional walkthrough instead of jumping randomly.'

  return (
    <section className="site-footer__journey" aria-label="Continue to next chapter">
      <div className="site-footer__journey-head">
        <span className="site-footer__journey-kicker">Continue to next</span>
        <p className="site-footer__journey-title">{chapterLabel}</p>
        <p className="site-footer__journey-copy">{leadCopy}</p>
      </div>

      <div className="site-footer__journey-actions">
        {previous ? (
          <Link href={previous.href} className="site-footer__journey-link site-footer__journey-link--ghost">
            Back: {previous.label}
          </Link>
        ) : (
          <span className="site-footer__journey-spacer" aria-hidden="true" />
        )}

        <Link href={next.href} className="site-footer__journey-link site-footer__journey-link--primary">
          Next: {next.label}
        </Link>
      </div>
    </section>
  )
}