"use client"

import React, { useEffect, useRef, useState } from 'react'

function SignatureCursor({ active }: { active: boolean }) {
  const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, summary, [data-cursor]'
  const pointer = useRef({ x: -100, y: -100 })
  const tails = useRef(Array.from({ length: 8 }).map(() => ({ x: -100, y: -100 })))
  const rafRef = useRef<number | null>(null)
  const visibleRef = useRef(false)
  const interactiveRef = useRef(false)
  const pressedRef = useRef(false)
  const speedRef = useRef(0)
  const labelRef = useRef('')
  const [frame, setFrame] = useState({
    head: { x: -100, y: -100 },
    trail: Array.from({ length: 8 }).map(() => ({ x: -100, y: -100 })),
    visible: false,
    interactive: false,
    pressed: false,
    speed: 0,
    label: '',
  })

  useEffect(() => {
    if (!active) return

    const getLabel = (el: Element | null): string => {
      if (!el) return ''
      const d = el.getAttribute('data-cursor')
      if (d) return d.trim().slice(0, 18)
      const aria = el.getAttribute('aria-label')
      if (aria) return aria.trim().slice(0, 18)
      const t = el.tagName.toLowerCase()
      if (t === 'a') return 'Open'
      if (t === 'button') return 'Click'
      if (t === 'input' || t === 'textarea') return 'Type'
      return 'Interact'
    }

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - pointer.current.x
      const dy = e.clientY - pointer.current.y
      speedRef.current = Math.min(1, Math.hypot(dx, dy) / 28)
      pointer.current.x = e.clientX
      pointer.current.y = e.clientY

      const el = (e.target as Element | null)?.closest(INTERACTIVE_SELECTOR) ?? null
      interactiveRef.current = Boolean(el)
      labelRef.current = getLabel(el)
      visibleRef.current = true
    }

    const onDown = () => { pressedRef.current = true }
    const onUp = () => { pressedRef.current = false }
    const onLeave = () => { visibleRef.current = false }
    const onEnter = () => { visibleRef.current = true }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('pointerenter', onEnter, { passive: true })

    function loop() {
      const p = pointer.current
      const t = tails.current
      for (let i = 0; i < t.length; i++) {
        const target = i === 0 ? p : t[i - 1]
        t[i].x += (target.x - t[i].x) * (0.18 + i * 0.02)
        t[i].y += (target.y - t[i].y) * (0.18 + i * 0.02)
      }

      const trailSnapshot = t.map((pt) => ({ x: pt.x, y: pt.y }))
      setFrame({
        head: trailSnapshot[0] ?? { x: -100, y: -100 },
        trail: trailSnapshot,
        visible: visibleRef.current,
        interactive: interactiveRef.current,
        pressed: pressedRef.current,
        speed: speedRef.current,
        label: labelRef.current,
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove as EventListener)
      window.removeEventListener('pointerdown', onDown as EventListener)
      window.removeEventListener('pointerup', onUp as EventListener)
      window.removeEventListener('pointerleave', onLeave as EventListener)
      window.removeEventListener('pointerenter', onEnter as EventListener)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="signature-cursor-root" aria-hidden>
      <div
        className={`signature-cursor-aura ${frame.interactive ? 'is-interactive' : ''} ${frame.pressed ? 'is-pressed' : ''}`}
        style={{
          left: frame.head.x,
          top: frame.head.y,
          opacity: frame.visible ? 1 : 0,
          transform: `translate3d(-50%, -50%, 0) scale(${1 + frame.speed * 0.28})`,
        }}
      />

      <div
        className={`signature-cursor-main ${frame.interactive ? 'is-interactive' : ''} ${frame.pressed ? 'is-pressed' : ''}`}
        style={{
          left: frame.head.x,
          top: frame.head.y,
          opacity: frame.visible ? 1 : 0,
        }}
      >
        <div className="signature-cursor-core" />
      </div>

      {frame.trail.map((pt, i) => (
        <div
          key={i}
          className="signature-trail-dot"
          style={{
            left: pt.x,
            top: pt.y,
            width: 18 - i * 1.6,
            height: 18 - i * 1.6,
            opacity: frame.visible ? `${1 - i * 0.12}` : '0',
            transform: `translate3d(0,0,0) scale(${1 - i * 0.06})`,
          }}
        />
      ))}

      {frame.interactive && frame.label ? (
        <div
          className="signature-cursor-label"
          style={{
            left: frame.head.x + 20,
            top: frame.head.y - 14,
            opacity: frame.visible ? 1 : 0,
          }}
        >
          {frame.label}
        </div>
      ) : null}
    </div>
  )
}

export default function SignatureExperience(): JSX.Element {
  const [playing, setPlaying] = useState(false)
  const [active, setActive] = useState(true)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const mqlHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqlReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const ok = mqlHover.matches && !mqlReduce.matches
      setSupported(ok)
    }

    update()
    const onChange = () => update()
    mqlHover.addEventListener('change', onChange)
    mqlReduce.addEventListener('change', onChange)

    return () => {
      mqlHover.removeEventListener('change', onChange)
      mqlReduce.removeEventListener('change', onChange)
    }
  }, [])

  useEffect(() => {
    if (!supported || !active) {
      try { document.documentElement.classList.remove('signature-active') } catch {}
      return
    }

    try { document.documentElement.classList.add('signature-active') } catch {}
    return () => {
      try { document.documentElement.classList.remove('signature-active') } catch {}
    }
  }, [active, supported])

  const playSignature = () => {
    if (playing) return
    setPlaying(true)
    setActive(true)
    try { document.documentElement.classList.add('signature-active') } catch {}
    try { localStorage.setItem('signature_seen', '1') } catch {}

    // end bloom animation after ~2s
    window.setTimeout(() => setPlaying(false), 2000)
  }

  const toggle = () => {
    if (active) {
      setActive(false)
      try { document.documentElement.classList.remove('signature-active') } catch {}
    } else playSignature()
  }

  return (
    <>
      <div className="signature-toggle fixed left-6 bottom-6 z-80">
        <button className={`signature-btn ${active ? 'active' : ''}`} onClick={toggle} aria-pressed={active} title="Toggle signature cursor">
          <span className="signature-icon">✦</span>
          <span className="signature-label">Signature</span>
        </button>
      </div>

      {playing && (
        <div className="signature-overlay" onClick={() => setPlaying(false)}>
          <div className="signature-bloom" />
          <div className="signature-text">Ayush</div>
        </div>
      )}

      <SignatureCursor active={active && supported} />
    </>
  )
}
