"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { RESUME_PROFILE } from '../lib/resume'
import { trackEvent } from '../lib/analytics'
import { generateHirePitch } from '../lib/pitch'

export default function CTAPanel(): JSX.Element {
  const [pitch, setPitch] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  const onHire = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    trackEvent('cta_click', { type: 'hire' })
    const p = generateHirePitch()
    setPitch(p)
    setVisible(true)
    // open mail client after a small delay so analytics/pitch render first
    setTimeout(() => {
      window.location.href = `mailto:${RESUME_PROFILE.email}`
    }, 300)
  }

  const onCollaborate = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault()
    trackEvent('cta_click', { type: 'collaborate' })
  }

  const onExplore = (e?: React.MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault()
    trackEvent('cta_click', { type: 'explore' })
  }

  return (
    <div className="cta-panel print:hidden">
      <div className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm">
        <button
          aria-label="Hire me"
          onClick={onHire}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          Hire
        </button>

        <Link
          href="/#contact"
          onClick={onCollaborate}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Collaborate
        </Link>

        <Link
          href="/projects"
          onClick={onExplore}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Explore Projects
        </Link>
      </div>

      {visible && pitch && (
        <div className="mx-auto mt-3 max-w-md rounded-md bg-slate-50 p-4 text-sm text-slate-800 shadow-sm">
          {pitch.split('\n').map((line, i) => (
            <p key={i} className={i === 0 ? 'font-semibold' : ''}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
