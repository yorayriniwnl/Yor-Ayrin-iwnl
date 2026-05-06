"use client"

import React, { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { setLoadTime } from '../lib/perfStore'

// ─── Constants ────────────────────────────────────────────────────────────────

const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])'
const CUSTOM_CURSOR_OPT_OUT_SELECTOR = '[data-disable-custom-cursor="true"]'
const ONBOARDING_VISITED_KEY = 'hasVisited'

const LERP_FACTOR = 0.12

// ─── Cursor (desktop only) ────────────────────────────────────────────────────

interface CursorState {
  x: number
  y: number
}

function useCursor(
  dotRef: React.RefObject<HTMLDivElement>,
  ringRef: React.RefObject<HTMLDivElement>,
  enabled: boolean
) {
  const mouse     = useRef<CursorState>({ x: -200, y: -200 })
  const ringPos   = useRef<CursorState>({ x: -200, y: -200 })
  const rafHandle = useRef<number>(0)
  const hovering  = useRef(false)
  const suppressed = useRef(false)
  const enabledRef = useRef(enabled)
  const prevHtmlCursor = useRef<string>('')
  const prevBodyCursor = useRef<string>('')

  useEffect(() => {
    enabledRef.current = enabled

    if (!enabled) {
      document.documentElement.classList.remove('custom-cursor-enabled')
      document.documentElement.style.cursor = prevHtmlCursor.current
      document.body.style.cursor = prevBodyCursor.current
      return
    }

    prevHtmlCursor.current = document.documentElement.style.cursor
    prevBodyCursor.current = document.body.style.cursor
    document.documentElement.classList.add('custom-cursor-enabled')
    document.documentElement.style.cursor = 'none'
    document.body.style.cursor = 'none'

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
      document.documentElement.style.cursor = prevHtmlCursor.current
      document.body.style.cursor = prevBodyCursor.current
    }
  }, [enabled])

  useEffect(() => {
    const setCursorMode = (useNativeCursor: boolean) => {
      document.documentElement.classList.toggle('custom-cursor-enabled', !useNativeCursor)
      document.documentElement.style.cursor = useNativeCursor ? 'auto' : 'none'
      document.body.style.cursor = useNativeCursor ? 'auto' : 'none'
    }

    const applyHoverState = (hovered: boolean, x: number, y: number) => {
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) return

      hovering.current = hovered
      dot.style.opacity = '1'
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${hovered ? 2 : 1})`
      ring.style.borderColor = hovered ? 'rgba(232,201,110,0.95)' : 'rgba(201,168,76,0.7)'
    }

    const onMove = (e: MouseEvent) => {
      if (!enabledRef.current) return
      const dot = dotRef.current
      const ring = ringRef.current
      if (!dot || !ring) return

      mouse.current = { x: e.clientX, y: e.clientY }

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
      const disableCustomCursor = Boolean(hoveredElement?.closest(CUSTOM_CURSOR_OPT_OUT_SELECTOR))

      if (disableCustomCursor) {
        if (!suppressed.current) {
          suppressed.current = true
          dot.style.opacity = '0'
          ring.style.opacity = '0'
          setCursorMode(true)
        }
        return
      }

      if (suppressed.current) {
        suppressed.current = false
        ringPos.current = { x: e.clientX, y: e.clientY }
        dot.style.opacity = '1'
        ring.style.opacity = '1'
        setCursorMode(false)
      }

      const isInteractive = Boolean(hoveredElement?.closest(INTERACTIVE_SELECTOR))

      if (isInteractive !== hovering.current) {
        applyHoverState(isInteractive, e.clientX, e.clientY)
        return
      }

      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${hovering.current ? 2 : 1})`
    }

    const tick = () => {
      const ring = ringRef.current
      if (!ring || !enabledRef.current) {
        rafHandle.current = requestAnimationFrame(tick)
        return
      }

      const { x: mx, y: my } = mouse.current
      const { x: rx, y: ry } = ringPos.current
      const nx = rx + (mx - rx) * LERP_FACTOR
      const ny = ry + (my - ry) * LERP_FACTOR
      ringPos.current = { x: nx, y: ny }
      ring.style.transform = `translate3d(${nx}px, ${ny}px, 0) translate(-50%, -50%) scale(${hovering.current ? 1.5 : 1})`

      rafHandle.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    rafHandle.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafHandle.current)
      suppressed.current = false
    }
  }, [dotRef, ringRef])
}

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────

function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === 'k') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('open-command-palette'))
        return
      }

      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('close-overlays'))
        return
      }

      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        const search = document.querySelector<HTMLElement>('[data-search]')
        search?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}

// ─── Theme initialization ─────────────────────────────────────────────────────

// ─── Performance flag ─────────────────────────────────────────────────────────

function usePerfMark() {
  useEffect(() => {
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0

    const id = window.setTimeout(() => {
      if (typeof performance !== 'undefined') {
        setLoadTime(Math.round(performance.now() - t0 + 300))
      }
    }, 300)

    return () => window.clearTimeout(id)
  }, [])
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function ClientShell({ children }: { children?: React.ReactNode }): JSX.Element {
  const pathname = usePathname() ?? '/'
  const [mounted,   setMounted]   = useState(false)
  const [hasFinePointer, setHasFinePointer] = useState(true)

  const dotRef  = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    setMounted(true)

    const mqFine = window.matchMedia('(pointer: fine)')
    const mqAnyFine = window.matchMedia('(any-pointer: fine)')
    const mqAnyHover = window.matchMedia('(any-hover: hover)')

    const updatePointer = () => {
      setHasFinePointer(mqFine.matches || mqAnyFine.matches || mqAnyHover.matches)
    }

    updatePointer()

    const onMouseMove = () => {
      setHasFinePointer(true)
    }

    if (mqFine.addEventListener) {
      mqFine.addEventListener('change', updatePointer)
      mqAnyFine.addEventListener('change', updatePointer)
      mqAnyHover.addEventListener('change', updatePointer)
    } else {
      mqFine.addListener(updatePointer)
      mqAnyFine.addListener(updatePointer)
      mqAnyHover.addListener(updatePointer)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      if (mqFine.removeEventListener) {
        mqFine.removeEventListener('change', updatePointer)
        mqAnyFine.removeEventListener('change', updatePointer)
        mqAnyHover.removeEventListener('change', updatePointer)
      } else {
        mqFine.removeListener(updatePointer)
        mqAnyFine.removeListener(updatePointer)
        mqAnyHover.removeListener(updatePointer)
      }

      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!mounted || pathname !== '/') return

    try {
      if (window.localStorage.getItem(ONBOARDING_VISITED_KEY) !== '1') {
        window.location.replace('/onboarding')
      }
    } catch {
      // Ignore storage access failures and fall back to the homepage.
    }
  }, [mounted, pathname])

  const showCursor = mounted && hasFinePointer

  useCursor(dotRef, ringRef, showCursor)
  useKeyboardShortcuts()
  usePerfMark()

  return (
    <>
      {children}

      {showCursor && (
        <>
          {/* Cursor dot — follows mouse exactly */}
          <div
            ref={dotRef}
            id="yor-cursor"
            aria-hidden="true"
            style={{
              position:       'fixed',
              top:            0,
              left:           0,
              width:          '10px',
              height:         '10px',
              borderRadius:   '50%',
              background:     '#c9a84c',
              pointerEvents:  'none',
              zIndex:         9999,
              transform:      'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
              transition:     'opacity 0.15s, transform 0.1s, width 0.3s, height 0.3s',
              mixBlendMode:   'difference',
              willChange:     'transform',
            }}
          />

          {/* Cursor ring — lags behind via rAF lerp */}
          <div
            ref={ringRef}
            id="yor-cursor-ring"
            aria-hidden="true"
            style={{
              position:       'fixed',
              top:            0,
              left:           0,
              width:          '36px',
              height:         '36px',
              borderRadius:   '50%',
              border:         '1px solid rgba(201,168,76,0.7)',
              background:     'none',
              pointerEvents:  'none',
              zIndex:         9998,
              transform:      'translate3d(-200px, -200px, 0) translate(-50%, -50%)',
              transition:     'transform 0.18s cubic-bezier(.18,.89,.32,1.28), opacity 0.3s, border-color 0.2s',
              opacity:        0.6,
              willChange:     'transform',
            }}
          />
        </>
      )}
    </>
  )
}
