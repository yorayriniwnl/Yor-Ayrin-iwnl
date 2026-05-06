'use client'

/**
 * components/DeferredMount.tsx
 *
 * Delays mounting of children until one of three conditions is met,
 * then crossfades them in. Prevents layout shift via a min-height
 * skeleton placeholder shown while waiting.
 *
 * Strategies:
 *   'visible' (default) — IntersectionObserver, mounts when element enters viewport
 *   'idle'              — requestIdleCallback (or setTimeout 50ms fallback)
 *   'delay'             — plain setTimeout(delay)
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type DeferredMountProps = {
  children:   React.ReactNode
  delay?:     number
  skeleton?:  React.ReactNode
  threshold?: number
  once?:      boolean
  strategy?:  'idle' | 'visible' | 'delay'
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const DEFAULT_DELAY     = 0
const DEFAULT_THRESHOLD = 0.1
const DEFAULT_STRATEGY  = 'visible' as const
const SKELETON_MIN_H    = 200    // px — prevents layout shift
const FADE_DURATION_MS  = 300   // matches the CSS transition below

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function DeferredMount({
  children,
  delay     = DEFAULT_DELAY,
  skeleton,
  threshold = DEFAULT_THRESHOLD,
  once      = true,
  strategy  = DEFAULT_STRATEGY,
}: DeferredMountProps): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null)

  /**
   * mounted  — whether children have been injected into the DOM.
   * visible  — whether the fade-in transition has been triggered.
   *            Kept separate so the DOM node exists before we flip opacity.
   */
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  /**
   * Trigger mount and, one rAF later, trigger the opacity transition.
   * Idempotent: calling it multiple times is safe.
   */
  const triggerMount = useCallback(() => {
    setMounted(true)
    // Give the browser one frame to paint the children at opacity=0
    // before flipping to opacity=1, ensuring a genuine crossfade.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setVisible(true)
      })
    })
  }, [])

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return

    let cleanup: (() => void) | undefined

    switch (strategy) {
      // ── strategy: 'idle' ──────────────────────────────────
      case 'idle': {
        if ('requestIdleCallback' in window) {
          const handle = (window as Window & { requestIdleCallback: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number }).requestIdleCallback(
            () => triggerMount(),
            { timeout: 2000 }
          )
          cleanup = () => {
            if ('cancelIdleCallback' in window) {
              (window as Window & { cancelIdleCallback: (handle: number) => void }).cancelIdleCallback(handle)
            }
          }
        } else {
          const tid = setTimeout(triggerMount, 50)
          cleanup   = () => clearTimeout(tid)
        }
        break
      }

      // ── strategy: 'delay' ─────────────────────────────────
      case 'delay': {
        const tid = setTimeout(triggerMount, delay)
        cleanup   = () => clearTimeout(tid)
        break
      }

      // ── strategy: 'visible' (default) ─────────────────────
      case 'visible':
      default: {
        if (!('IntersectionObserver' in window)) {
          // Fallback for environments without IntersectionObserver
          const tid = setTimeout(triggerMount, 100)
          cleanup   = () => clearTimeout(tid)
          break
        }

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                triggerMount()
                if (once) observer.disconnect()
              }
            }
          },
          { threshold }
        )

        if (wrapperRef.current) {
          observer.observe(wrapperRef.current)
        }

        cleanup = () => observer.disconnect()
        break
      }
    }

    return cleanup
  // triggerMount is stable (useCallback with empty deps)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategy, delay, threshold, once])

  // ── Skeleton / placeholder ───────────────────────────────
  const placeholder = skeleton ?? (
    <div
      aria-hidden
      style={{
        minHeight:   `${SKELETON_MIN_H}px`,
        width:       '100%',
        background:  'transparent',
      }}
    />
  )

  return (
    <>
      {/*
       * Injected keyframe — minimal, no class-name collisions.
       * Only rendered once because it's inside the same component.
       */}
      <style>{`
        @keyframes __dfm_fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Sentinel div observed by IntersectionObserver */}
      <div
        ref={wrapperRef}
        style={{ display: 'contents' }}
        aria-live="polite"
      >
        {!mounted ? (
          placeholder
        ) : (
          <div
            style={{
              opacity:    visible ? 1 : 0,
              transition: `opacity ${FADE_DURATION_MS}ms ease`,
              willChange: 'opacity',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </>
  )
}
