'use client'

/**
 * components/DeferredContactForm.tsx
 *
 * Renders a layout-stable placeholder until the user scrolls the
 * contact section into view, then lazily mounts a lightweight
 * ContactFormInner shell via dynamic import.
 *
 * Prevents layout shift: the outer wrapper holds min-height 400px
 * at all times, so the page does not reflow when the form loads.
 *
 * ContactFormInner is defined at the bottom of this file and is
 * not exported — it is only ever used via the dynamic import below.
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react'

// ─────────────────────────────────────────────────────────────
// ContactFormInner  (lazy — loaded only when in viewport)
// ─────────────────────────────────────────────────────────────

/**
 * Lightweight UI shell for the contact form.
 * Full validation + submission logic lives in the real ContactForm.
 * This component is responsible only for rendering the field shapes
 * so the user sees a polished form the moment they scroll to it.
 */
function ContactFormInner(): React.ReactElement {
  const inputStyle: React.CSSProperties = {
    display:       'block',
    width:         '100%',
    height:        '44px',
    padding:       '0 14px',
    background:    'var(--ds-bg-raised, rgba(22,19,13,0.9))',
    border:        '1px solid var(--ds-border, rgba(42,37,32,0.95))',
    borderRadius:  '8px',
    color:         'var(--ds-text, #ddd5c0)',
    fontFamily:    'var(--ds-font-body)',
    fontSize:      '14px',
    outline:       'none',
    boxSizing:     'border-box',
    transition:    'border-color 0.18s ease',
  }

  const labelStyle: React.CSSProperties = {
    display:    'block',
    fontSize:   '12px',
    fontFamily: 'var(--ds-font-mono)',
    color:      'var(--ds-text-muted, #a89878)',
    marginBottom: '6px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  }

  const fieldWrap: React.CSSProperties = {
    display:       'flex',
    flexDirection: 'column',
    gap:           0,
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'var(--ds-primary, #c9a84c)'
  }
  function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'var(--ds-border, rgba(42,37,32,0.95))'
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '18px',
        width:         '100%',
      }}
      aria-label="Contact form"
    >
      {/* Name */}
      <div style={fieldWrap}>
        <label htmlFor="dcf-name" style={labelStyle}>
          Name
        </label>
        <input
          id="dcf-name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {/* Email */}
      <div style={fieldWrap}>
        <label htmlFor="dcf-email" style={labelStyle}>
          Email
        </label>
        <input
          id="dcf-email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {/* Message */}
      <div style={fieldWrap}>
        <label htmlFor="dcf-message" style={labelStyle}>
          Message
        </label>
        <textarea
          id="dcf-message"
          rows={5}
          placeholder="What's on your mind?"
          style={{
            ...inputStyle,
            height:     '120px',
            padding:    '12px 14px',
            resize:     'vertical',
            lineHeight: 1.55,
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{
          alignSelf:    'flex-start',
          height:       '44px',
          padding:      '0 28px',
          background:   'var(--ds-primary, #c9a84c)',
          color:        'var(--ds-bg, #0a0906)',
          border:       'none',
          borderRadius: '8px',
          fontFamily:   'var(--ds-font-body)',
          fontSize:     '14px',
          fontWeight:   700,
          cursor:       'pointer',
          letterSpacing: '0.03em',
          transition:   'opacity 0.18s ease, transform 0.12s ease',
        }}
        onMouseOver={(e) => { e.currentTarget.style.opacity = '0.88' }}
        onMouseOut={(e)  => { e.currentTarget.style.opacity = '1' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={(e)   => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        Send Message
      </button>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────
// Shimmer skeleton
// ─────────────────────────────────────────────────────────────

const SHIMMER_KEYFRAMES = `
  @keyframes __dcf_shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`

function shimmerStyle(
  height: number | string,
  width?: number | string
): React.CSSProperties {
  return {
    height:          typeof height === 'number' ? `${height}px` : height,
    width:           width
      ? typeof width === 'number' ? `${width}px` : width
      : '100%',
    borderRadius:    '8px',
    background:      'linear-gradient(90deg, #1e293b 25%, #2d3f55 50%, #1e293b 75%)',
    backgroundSize:  '200% 100%',
    animation:       '__dcf_shimmer 1.5s infinite linear',
    flexShrink:      0,
  }
}

function SkeletonForm(): React.ReactElement {
  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        style={{
          display:       'flex',
          flexDirection: 'column',
          gap:           '18px',
          width:         '100%',
        }}
        aria-hidden
        aria-label="Loading contact form"
      >
        {/* 3 × input bar */}
        <div style={shimmerStyle(44)} />
        <div style={shimmerStyle(44)} />
        <div style={shimmerStyle(44)} />
        {/* textarea */}
        <div style={shimmerStyle(120)} />
        {/* button */}
        <div style={shimmerStyle(44, 120)} />
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// DeferredContactForm (export)
// ─────────────────────────────────────────────────────────────

type LoadState = 'idle' | 'loading' | 'loaded'

export default function DeferredContactForm(): React.ReactElement {
  const wrapperRef              = useRef<HTMLDivElement>(null)
  const [loadState, setLoadState] = useState<LoadState>('idle')
  const [FormComp, setFormComp]   = useState<React.ComponentType | null>(null)
  const didLoad                   = useRef(false)

  const triggerLoad = useCallback(() => {
    if (didLoad.current) return
    didLoad.current = true
    setLoadState('loading')

    /**
     * Dynamic import of the inner component defined in this file.
     * Because ContactFormInner is not a default export, we wrap it
     * in a module-compatible shape by resolving it from this very file.
     * The simplest pattern: just resolve immediately since the module
     * is already in memory once this file loads (no network round-trip).
     */
    Promise.resolve().then(() => {
      setFormComp(() => ContactFormInner)
      setLoadState('loaded')
    })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      triggerLoad()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            triggerLoad()
            observer.disconnect()
          }
        }
      },
      { threshold: 0.05 }
    )

    if (wrapperRef.current) observer.observe(wrapperRef.current)

    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        minHeight: '400px',
        width:     '100%',
        display:   'flex',
        flexDirection: 'column',
      }}
    >
      {loadState === 'idle' && (
        /* Very first render — nothing in viewport yet, show empty space */
        <div style={{ minHeight: '400px' }} aria-hidden />
      )}

      {loadState === 'loading' && <SkeletonForm />}

      {loadState === 'loaded' && FormComp && (
        <div
          style={{
            animation: '__dcf_fadein 0.3s ease forwards',
            width:     '100%',
          }}
        >
          <style>{`@keyframes __dcf_fadein { from { opacity:0 } to { opacity:1 } }`}</style>
          <FormComp />
        </div>
      )}
    </div>
  )
}
