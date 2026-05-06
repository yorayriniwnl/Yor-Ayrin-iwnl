"use client"
import React, { useState } from 'react'
import { useProfileMode, ProfileMode } from './ProfileModeProvider'

const OPTIONS: { id: ProfileMode; label: string; emoji: string }[] = [
  { id: 'recruiter', label: 'Recruiter', emoji: '🎯' },
  { id: 'developer', label: 'Developer', emoji: '👨‍💻' },
  { id: 'casual', label: 'Casual', emoji: '🙂' },
]

export default function ProfileModeSwitcher() {
  const { mode, setMode, cycleMode } = useProfileMode()
  const [open, setOpen] = useState(false)

  const current = OPTIONS.find((o) => o.id === mode) ?? OPTIONS[1]

  return (
    <div className="fixed top-4 right-20 z-60">
      <div className="relative">
        <button
          aria-label="Profile Mode"
          onClick={() => setOpen((s) => !s)}
          className="flex items-center gap-2 px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span className="text-lg">{current.emoji}</span>
          <span className="hidden sm:inline text-sm font-medium">{current.label}</span>
        </button>

        {open && (
          <div className="mt-2 right-0 absolute w-40 p-2 rounded bg-white/5 backdrop-blur-sm shadow-lg">
            {OPTIONS.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setMode(o.id)
                  setOpen(false)
                }}
                className={`w-full text-left px-2 py-1 rounded hover:bg-white/10 transition-colors ${o.id === mode ? 'font-semibold' : ''}`}
              >
                <span className="mr-2">{o.emoji}</span>
                {o.label}
              </button>
            ))}

            <div className="mt-2 border-t border-white/10 pt-2">
              <button
                onClick={() => {
                  cycleMode()
                  setOpen(false)
                }}
                className="text-xs text-white/70"
              >
                Cycle mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
