'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Skeleton from './ui/Skeleton'

// ─────────────────────────────────────────────────────────────────────────────
// Lazy-loaded heavy timeline component
// ─────────────────────────────────────────────────────────────────────────────

const TimelineUI = dynamic(() => import('./ui/Timeline'), {
  ssr: false,
  loading: () => <TimelineSkeleton />,
})

// ─────────────────────────────────────────────────────────────────────────────
// Lightweight skeleton shown during the deferred mount window
// ─────────────────────────────────────────────────────────────────────────────

function TimelineSkeleton(): JSX.Element {
  return (
    <div
      className="ds-container"
      style={{ paddingBlock: 'var(--ds-space-8)' }}
      aria-busy="true"
      aria-label="Loading timeline"
    >
      <div
        style={{
          display:       'grid',
          gap:           'var(--ds-space-6)',
          gridTemplateColumns: '1fr',
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="ds-card"
            style={{
              display:       'grid',
              gap:           'var(--ds-space-3)',
              padding:       'var(--ds-space-6)',
              opacity:       1 - i * 0.15,
            }}
          >
            <Skeleton height="0.75rem" className="w-24" />
            <Skeleton height="1.25rem" className="w-2/3" />
            <Skeleton height="0.875rem" className="w-full" />
            <Skeleton height="0.875rem" className="w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export — defers mount until after initial paint
// ─────────────────────────────────────────────────────────────────────────────

export default function DeferredTimeline(): JSX.Element {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Yield to the browser's first paint before mounting the heavier component.
    // requestIdleCallback gives even more breathing room on slow devices.
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void, opts?: object) => number })
        .requestIdleCallback(() => setMounted(true), { timeout: 600 })
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as Window & { cancelIdleCallback: (id: number) => void })
            .cancelIdleCallback(id)
        }
      }
    }

    const id = setTimeout(() => setMounted(true), 120)
    return () => clearTimeout(id)
  }, [])

  if (!mounted) return <TimelineSkeleton />

  return <TimelineUI />
}
