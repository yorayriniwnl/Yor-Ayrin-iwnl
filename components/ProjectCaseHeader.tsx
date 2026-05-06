'use client'

import React, {
  useRef,
  useEffect,
  useState,
  Suspense,
  CSSProperties,
} from 'react'
import dynamic from 'next/dynamic'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectCaseHeaderProps = {
  projectId: 'zenith' | 'ai-detector' | 'mentor-mentee' | string
  title:     string
  subtitle:  string
}

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic scene imports — ssr:false so Three.js never runs on the server
// ─────────────────────────────────────────────────────────────────────────────

const SceneZenith = dynamic(
  () => import('./SceneZenith'),
  { ssr: false, loading: () => <GradientFallback /> },
)

const SceneAIDetector = dynamic(
  () => import('./SceneAIDetector'),
  { ssr: false, loading: () => <GradientFallback /> },
)

// ─────────────────────────────────────────────────────────────────────────────
// Gradient fallback — shown while the dynamic chunk loads
// ─────────────────────────────────────────────────────────────────────────────

function GradientFallback(): JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset:    0,
        background:
          'radial-gradient(ellipse at 30% 60%, rgba(99,102,241,0.22) 0%, transparent 65%),' +
          'radial-gradient(ellipse at 75% 30%, rgba(6,182,212,0.14) 0%, transparent 55%),' +
          'linear-gradient(135deg, #060a14 0%, #0d1226 50%, #060a14 100%)',
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic animated gradient plane (fallback for unknown projectId)
// ─────────────────────────────────────────────────────────────────────────────

function AnimatedGradientPlane(): JSX.Element {
  return (
    <>
      {/*
        keyframes injected inline — avoids needing a global CSS file.
        Each animation keyframe cycles through 3 muted accent colours.
      */}
      <style>{`
        @keyframes pch-gradient-cycle {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    [
            'linear-gradient(135deg,',
            '  #0d1127 0%,',
            '  #1a1040 33%,',
            '  #0a1a2e 66%,',
            '  #0d1127 100%',
            ')',
          ].join(''),
          backgroundSize:     '400% 400%',
          animation:          'pch-gradient-cycle 8s ease infinite',
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene selector
// ─────────────────────────────────────────────────────────────────────────────

function SceneForProject({ projectId }: { projectId: string }): JSX.Element {
  switch (projectId) {
    case 'zenith':
      return (
        <Suspense fallback={<GradientFallback />}>
          <SceneZenith />
        </Suspense>
      )
    case 'ai-detector':
      return (
        <Suspense fallback={<GradientFallback />}>
          <SceneAIDetector />
        </Suspense>
      )
    default:
      return <AnimatedGradientPlane />
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-fade hook
// Uses requestAnimationFrame for throttling — avoids scroll jank.
// ─────────────────────────────────────────────────────────────────────────────

function useScrollOpacity(maxScroll = 400): number {
  const [opacity, setOpacity] = useState<number>(1)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return // already queued
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const raw = 1 - window.scrollY / maxScroll
        setOpacity(Math.max(0, Math.min(1, raw)))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [maxScroll])

  return opacity
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function ProjectCaseHeader({
  projectId,
  title,
  subtitle,
}: ProjectCaseHeaderProps): JSX.Element {
  const scrollOpacity = useScrollOpacity(400)

  // ── Shared styles ──────────────────────────────────────────────────────────

  const wrapperStyle: CSSProperties = {
    position:   'relative',
    width:      '100%',
    height:     'clamp(360px, 50vw, 600px)',
    overflow:   'hidden',
    background: '#060a14',
  }

  const canvasWrapperStyle: CSSProperties = {
    position:   'absolute',
    inset:      0,
    opacity:    scrollOpacity,
    // will-change keeps GPU composite layer alive while scrolling
    willChange: 'opacity',
  }

  const overlayStyle: CSSProperties = {
    position:   'absolute',
    inset:      0,
    background: 'linear-gradient(to top, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0) 55%)',
    pointerEvents: 'none',
  }

  const contentStyle: CSSProperties = {
    position:  'absolute',
    bottom:    '2rem',
    left:      '2rem',
    right:     '2rem',
    zIndex:    10,
    maxWidth:  '52rem',
  }

  const titleStyle: CSSProperties = {
    fontFamily:  'var(--ds-font-display, "Playfair Display", Georgia, serif)',
    fontSize:    'clamp(1.75rem, 4vw, 3rem)',   // 48px desktop, scales down
    fontWeight:  700,
    lineHeight:  1.15,
    color:       '#ffffff',
    margin:      0,
    marginBottom: '0.55rem',
    letterSpacing: '-0.01em',
    textShadow:  '0 2px 20px rgba(6,10,20,0.7)',
  }

  const subtitleStyle: CSSProperties = {
    fontFamily:  'var(--ds-font-body, "DM Sans", ui-sans-serif, sans-serif)',
    fontSize:    'clamp(0.95rem, 1.5vw, 1.125rem)', // 18px desktop
    fontWeight:  400,
    lineHeight:  1.5,
    color:       '#94a3b8',
    margin:      0,
    textShadow:  '0 1px 12px rgba(6,10,20,0.6)',
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <header style={wrapperStyle} role="banner" aria-label={`${title} project hero`}>
      {/* 3-D / animated background, fades on scroll */}
      <div style={canvasWrapperStyle}>
        <SceneForProject projectId={projectId} />
      </div>

      {/* Dark gradient overlay, bottom to top */}
      <div style={overlayStyle} aria-hidden />

      {/* Text content */}
      <div style={contentStyle}>
        <h1 style={titleStyle}>{title}</h1>
        <p  style={subtitleStyle}>{subtitle}</p>
      </div>
    </header>
  )
}
