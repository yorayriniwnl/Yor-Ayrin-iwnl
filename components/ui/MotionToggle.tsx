"use client"

import React from 'react'
import { useAdaptive } from './AdaptiveProvider'

export default function MotionToggle(): JSX.Element {
  const { reducedMotion, setReducedMotion } = useAdaptive()

  return (
    <div className="motion-toggle fixed top-4 right-36 z-80">
      <button
        aria-pressed={reducedMotion}
        title={reducedMotion ? 'Reduced motion (prefers-reduced-motion)' : 'Normal motion'}
        onClick={() => setReducedMotion(!reducedMotion)}
        className={`px-3 py-1 rounded-md text-sm font-semibold transition ${reducedMotion ? 'bg-slate-400 text-white' : 'bg-sky-400 text-black'}`}
      >
        {reducedMotion ? 'Reduced Motion' : 'Motion: Normal'}
      </button>
    </div>
  )
}
