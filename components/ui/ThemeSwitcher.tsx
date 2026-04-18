"use client"
import React, { useState } from 'react'
import { useTheme, type Theme } from './ThemeProvider'

const OPTIONS: { id: Theme; label: string; emoji: string }[] = [
  { id: 'dark', label: 'Dark', emoji: '🌙' },
  { id: 'light', label: 'Light', emoji: '☀️' },
  { id: 'system', label: 'System', emoji: '🖥️' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const current = OPTIONS.find((o) => o.id === theme) ?? OPTIONS[0]

  return (
    <div className="fixed top-4 right-4 z-60">
      <div className="relative">
        <button
          aria-label="Theme"
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
                  setTheme(o.id)
                  setOpen(false)
                }}
                className={`w-full text-left px-2 py-1 rounded hover:bg-white/10 transition-colors ${o.id === theme ? 'font-semibold' : ''}`}
              >
                <span className="mr-2">{o.emoji}</span>
                {o.label}
              </button>
            ))}

            <div className="mt-2 border-t border-white/10 pt-2">
              <button
                onClick={() => {
                  toggleTheme()
                  setOpen(false)
                }}
                className="text-xs text-white/70"
              >
                Toggle theme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
