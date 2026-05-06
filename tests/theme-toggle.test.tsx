import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ThemeToggle from '../components/ThemeToggle'
import { ThemeContext, type ThemeContextValue } from '../components/ui/ThemeProvider'

let container: HTMLDivElement | null = null
let root: Root | null = null

function renderWithTheme(value: Partial<ThemeContextValue>) {
  const fallback: ThemeContextValue = {
    theme: 'dark',
    resolvedTheme: 'dark',
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }

  const contextValue = { ...fallback, ...value }

  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)

  act(() => {
    root?.render(
      <ThemeContext.Provider value={contextValue}>
        <ThemeToggle />
      </ThemeContext.Provider>,
    )
  })

  const button = container.querySelector('button')
  if (!button) throw new Error('Theme toggle button did not render')

  return { button, contextValue }
}

afterEach(() => {
  act(() => {
    root?.unmount()
  })
  root = null

  if (container) {
    container.remove()
  }
  container = null
})

describe('ThemeToggle', () => {
  it('shows the next mode when a manual theme is active', () => {
    const { button } = renderWithTheme({ theme: 'dark', resolvedTheme: 'dark' })

    expect(button.textContent).toBe('Light')
    expect(button.getAttribute('aria-label')).toBe('Switch to light mode')
  })

  it('toggles to the opposite manual theme when clicked', () => {
    const { button, contextValue } = renderWithTheme({ theme: 'light', resolvedTheme: 'light' })

    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(contextValue.setTheme).toHaveBeenCalledWith('dark')
  })

  it('keeps the auto label when the system theme is active', () => {
    const { button } = renderWithTheme({ theme: 'system', resolvedTheme: 'dark' })

    expect(button.textContent).toBe('Auto')
    expect(button.getAttribute('aria-label')).toBe(
      'Theme follows the system and is currently dark. Activate to set light mode manually.',
    )
  })
})
