/*
Add to globals.css or design-system.css:

.theme-transitioning * {
  transition: background-color 250ms ease, color 150ms ease,
              border-color 200ms ease !important;
}

[data-theme='light'] {
  --ds-bg: #ffffff;
  --ds-text-primary: #0f172a;
  --ds-text-secondary: #475569;
  --ds-border: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --ds-bg: #060a14;
  --ds-text-primary: #f8fafc;
  --ds-text-secondary: #94a3b8;
  --ds-border: rgba(255, 255, 255, 0.1);
}
*/

"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme         = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

export type ThemeContextValue = {
  theme:         Theme
  resolvedTheme: ResolvedTheme
  setTheme:      (theme: Theme) => void
  toggleTheme:   () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FALLBACK: ThemeContextValue = {
  theme:         'dark',
  resolvedTheme: 'dark',
  setTheme:      () => {},
  toggleTheme:   () => {},
}

export const ThemeContext = createContext<ThemeContextValue>(FALLBACK)

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'theme'
const ROOT_THEME_CLASSES = ['theme-dark', 'theme-minimal'] as const

function readStored(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'dark' || v === 'light' || v === 'system') return v
  } catch {}
  return 'dark'
}

function persist(theme: Theme) {
  try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolve(theme: Theme): ResolvedTheme {
  if (theme === 'system') return getSystemTheme()
  return theme
}

function applyToDOM(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.add('theme-transitioning')
  root.setAttribute('data-theme', resolved)
  root.classList.remove(...ROOT_THEME_CLASSES)
  root.classList.add(resolved === 'light' ? 'theme-minimal' : 'theme-dark')
  root.style.colorScheme = resolved

  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', resolved === 'light' ? '#f5efe5' : '#0a0906')
  }

  window.setTimeout(() => root.classList.remove('theme-transitioning'), 300)
}

// ─── Provider ────────────────────────────────────────────────────────────────

export default function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<Theme>(() => readStored())
  const [resolvedTheme, setResolved] = useState<ResolvedTheme>(() => resolve(readStored()))

  // Keep DOM in sync whenever resolvedTheme changes
  useEffect(() => {
    applyToDOM(resolvedTheme)
  }, [resolvedTheme])

  // System preference listener (only active when theme === 'system')
  useEffect(() => {
    if (theme !== 'system') return
    if (typeof window === 'undefined') return

    const mq      = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const next: ResolvedTheme = e.matches ? 'dark' : 'light'
      setResolved(next)
    }

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    const r = resolve(next)
    setThemeState(next)
    setResolved(r)
    persist(next)
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: next, resolved: r } }))
  }, [])

  // Cycles dark ↔ light (skips 'system' for simplicity)
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Expose toggleTheme via custom window event so ClientShell can call it
  useEffect(() => {
    const handler = () => toggleTheme()
    window.addEventListener('toggle-theme', handler)
    return () => window.removeEventListener('toggle-theme', handler)
  }, [toggleTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
