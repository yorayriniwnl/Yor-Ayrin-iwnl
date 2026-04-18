"use client"

import React from 'react'
import { useTheme } from './ui/ThemeProvider'

export default function ThemeToggle(): JSX.Element {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const label = theme === 'system' ? 'Auto' : isDark ? 'Dark' : 'Light'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-pressed={!isDark}
      title={
        theme === 'system'
          ? `System theme active (${isDark ? 'dark' : 'light'}). Click to set ${isDark ? 'light' : 'dark'} manually.`
          : isDark
            ? 'Switch to light mode'
            : 'Switch to dark mode'
      }
      className="ds-button ds-button--ghost ds-button--sm"
    >
      {label}
    </button>
  )
}
