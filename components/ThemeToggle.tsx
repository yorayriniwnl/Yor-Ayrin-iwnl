"use client"

import React from 'react'
import { useTheme } from './ui/ThemeProvider'

export default function ThemeToggle(): JSX.Element {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme, theme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const label = !mounted ? 'Theme' : theme === 'system' ? 'Auto' : isDark ? 'Light' : 'Dark'
  const title =
    !mounted
      ? 'Toggle theme'
      : theme === 'system'
      ? `System theme active (${resolvedTheme}). Click to set ${nextTheme} manually.`
      : `Switch to ${nextTheme} mode`
  const ariaLabel =
    !mounted
      ? 'Toggle theme'
      : theme === 'system'
      ? `Theme follows the system and is currently ${resolvedTheme}. Activate to set ${nextTheme} mode manually.`
      : `Switch to ${nextTheme} mode`

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={ariaLabel}
      aria-pressed={mounted ? !isDark : false}
      title={title}
      data-disable-custom-cursor="true"
      className="ds-button ds-button--ghost ds-button--sm"
    >
      {label}
    </button>
  )
}
