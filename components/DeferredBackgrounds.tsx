'use client'

/**
 * components/DeferredBackgrounds.tsx
 *
 * Defers all background animation components until two conditions are met:
 *   1. perfStore.interactiveDone === true
 *   2. document.visibilityState === 'visible'  (not in a background tab)
 *
 * While waiting: renders a static gradient placeholder that is
 * visually indistinguishable from the page background.
 * When conditions are met: mounts children with a 200ms CSS fade-in.
 */

import React, { useEffect, useState, useRef } from 'react'
import { onPerfChange, getPerfState } from '../lib/perfStore'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface DeferredBackgroundsProps {
  children: React.ReactNode
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const FADE_IN_MS = 200

/**
 * Static gradient used while backgrounds are deferred.
 * Matches the site's dark base colour so there is no flash.
 */
const STATIC_GRADIENT: React.CSSProperties = {
  position:   'absolute',
  inset:      0,
  width:      '100%',
  height:     '100%',
  background: 'linear-gradient(135deg, #060a14 0%, #0f172a 100%)',
  pointerEvents: 'none',
  zIndex:     0,
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function DeferredBackgrounds({
  children,
}: DeferredBackgroundsProps): React.ReactElement {
  /** Whether children have been injected into the DOM. */
  const [mounted,  setMounted]  = useState(false)
  /** Whether the fade-in opacity transition has been triggered. */
  const [fadeIn,   setFadeIn]   = useState(false)
  /** Prevents double-mount if both conditions arrive simultaneously. */
  const didMount = useRef(false)

  /**
   * Mount children + schedule a fade-in two rAFs later so the
   * browser paints them at opacity=0 first.
   */
  function triggerMount() {
    if (didMount.current) return
    didMount.current = true
    setMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFadeIn(true)
      })
    })
  }

  useEffect(() => {
    // SSR guard — document is not available on the server.
    if (typeof document === 'undefined') return

    /**
     * Check both conditions at the same time.
     * Either condition becoming true re-evaluates both.
     */
    function check() {
      const { interactiveDone } = getPerfState()
      const pageVisible = !document.hidden
      if (interactiveDone && pageVisible) {
        triggerMount()
      }
    }

    // ── Initial check on mount ──────────────────────────────
    check()

    // ── Subscribe to perfStore changes ─────────────────────
    const unsubPerf = onPerfChange(() => check())

    // ── Subscribe to page visibility changes ───────────────
    const onVisibility = () => check()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      unsubPerf()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  // triggerMount is defined in scope and does not change across renders;
  // the dep array is intentionally empty.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Static placeholder — always present until children are mounted */}
      {!mounted && (
        <div
          aria-hidden
          style={STATIC_GRADIENT}
        />
      )}

      {/* Background animations — mounted once interactiveDone + visible */}
      {mounted && (
        <div
          aria-hidden
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            opacity:    fadeIn ? 1 : 0,
            transition: `opacity ${FADE_IN_MS}ms ease`,
            willChange: 'opacity',
            pointerEvents: 'none',
            zIndex:     0,
          }}
        >
          {children}
        </div>
      )}
    </>
  )
}
