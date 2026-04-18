"use client"

import React from 'react'
import { useTheme } from './ui/ThemeProvider'

export default function ThemeToggle(): JSX.Element {
  const { resolvedTheme, setTheme, theme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const label = theme === 'system' ? 'Auto' : isDark ? 'Light' : 'Dark'
  const title =
    theme === 'system'
      ? `System theme active (${resolvedTheme}). Click to set ${nextTheme} manually.`
      : `Switch to ${nextTheme} mode`
  const ariaLabel =
    theme === 'system'
      ? `Theme follows the system and is currently ${resolvedTheme}. Activate to set ${nextTheme} mode manually.`
      : `Switch to ${nextTheme} mode`

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={ariaLabel}
      aria-pressed={!isDark}
      title={title}
      data-disable-custom-cursor="true"
      className="ds-button ds-button--ghost ds-button--sm"
    >
      {label}
    </button>
  )
}
