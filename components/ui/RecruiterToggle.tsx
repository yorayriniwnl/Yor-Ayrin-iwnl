"use client"

import React from 'react'
import { useAdaptive } from './AdaptiveProvider'

export default function RecruiterToggle(): JSX.Element {
  const { recruiterMode, setRecruiterMode } = useAdaptive()

  return (
    <div className="recruiter-toggle fixed top-4 right-4 z-80">
      <button
        aria-pressed={recruiterMode}
        title={recruiterMode ? 'Recruiter-friendly UI (interactive disabled)' : 'Interactive mode enabled'}
        onClick={() => setRecruiterMode(!recruiterMode)}
        className={`px-3 py-1 rounded-md text-sm font-semibold transition ${recruiterMode ? 'bg-amber-400 text-black' : 'bg-emerald-400 text-black'}`}
      >
        {recruiterMode ? 'Enable Interactive Mode' : 'Interactive Mode: On'}
      </button>
    </div>
  )
}
