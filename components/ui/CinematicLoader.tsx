"use client"
import React, { useEffect, useRef, useState } from 'react'

export default function CinematicLoader({ duration = 1400 }: { duration?: number }): JSX.Element | null {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // quick fade
      setTimeout(() => setVisible(false), 150)
      return
    }

    const dur = Math.max(600, Math.min(2000, duration || 1400))
    startRef.current = performance.now()

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const pct = Math.min(1, elapsed / dur)
      setProgress(Math.round(pct * 100))
      if (elapsed >= dur) {
        setFadeOut(true)
        // wait for fade out to finish (match CSS transition)
        setTimeout(() => setVisible(false), 440)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [duration])

  if (!visible) return null

  return (
    <div className={`cinematic-loader ${fadeOut ? 'fade-out' : ''}`} role="status" aria-live="polite">
      <div className="loader-center">
        <div className="orb" />

        <div className="progress-bar" aria-hidden>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
