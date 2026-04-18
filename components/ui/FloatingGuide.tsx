"use client"

import React, { useEffect, useRef, useState } from 'react'

type Variant = 'orb' | 'avatar'

const DEFAULT_HINTS = [
  'Press / to open the command palette',
  'Click project nodes to focus them',
  'Try asking me about the projects',
  'I can highlight skills — ask me!' ,
]

export default function FloatingGuide({ variant = 'orb' as Variant, position = 'bottom-left' }:{variant?:Variant; position?: 'bottom-left' | 'bottom-right' | 'top-right' | 'top-left'}){
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [pulse, setPulse] = useState(false)
  const hintIdx = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const showMessage = (msg: string) => {
      setMessage(msg)
      setPulse(true)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        setPulse(false)
        setMessage(null)
      }, 4200)
    }

    const onSectionFocus = (e: Event) => {
      const detail = (e as CustomEvent)?.detail
      const sec = detail?.section ?? detail?.id ?? 'this section'
      showMessage(`Viewing ${sec}`)
    }

    const onFocusProject = (e: Event) => {
      const detail = (e as CustomEvent)?.detail
      const title = detail?.title ?? detail?.id ?? 'a project'
      showMessage(`Focusing project: ${title}`)
    }

    const onIntroEnd = () => showMessage('Welcome! I can guide you — click me.')

    window.addEventListener('section-focus', onSectionFocus as EventListener)
    window.addEventListener('focus-project', onFocusProject as EventListener)
    window.addEventListener('focus-panel', onFocusProject as EventListener)
    window.addEventListener('intro-end', onIntroEnd as EventListener)
    window.addEventListener('assets-loaded', () => showMessage('Scene ready'))

    const hintInterval = window.setInterval(() => {
      const h = DEFAULT_HINTS[hintIdx.current % DEFAULT_HINTS.length]
      hintIdx.current += 1
      showMessage(h)
    }, 22000)

    return () => {
      window.removeEventListener('section-focus', onSectionFocus as EventListener)
      window.removeEventListener('focus-project', onFocusProject as EventListener)
      window.removeEventListener('focus-panel', onFocusProject as EventListener)
      window.removeEventListener('intro-end', onIntroEnd as EventListener)
      window.clearInterval(hintInterval)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const toggleOpen = () => {
    setOpen(s => !s)
    if (!open) setMessage('Need a hint? Try "Show projects"')
    else setMessage(null)
  }

  const sendSectionFocus = (section: string) => {
    window.dispatchEvent(new CustomEvent('section-focus', { detail: { section } }))
  }

  const focusZenith = () => {
    window.dispatchEvent(new CustomEvent('focus-panel', { detail: { panel: 'zenith' } }))
  }

  const cls = `floating-guide floating-guide--${position} ${pulse ? 'floating-guide--pulse' : ''}`

  return (
    <div className={cls} aria-hidden={false}>
      <div
        role="button"
        aria-label="Site guide"
        tabIndex={0}
        className={`guide-root ${open ? 'open' : ''}`}
        onClick={toggleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleOpen()
          }
        }}
        onMouseEnter={() => setPulse(true)}
        onMouseLeave={() => setPulse(false)}
      >
        {variant === 'orb' ? (
          <div className={`guide-orb ${open ? 'open' : ''}`} />
        ) : (
          <div className={`guide-avatar ${open ? 'open' : ''}`}>
            <div className="avatar-eyes"><span/><span/></div>
          </div>
        )}
      </div>

      {message && (
        <div className="guide-tooltip" role="status">{message}</div>
      )}

      {open && (
        <div className="guide-panel" role="dialog" aria-label="Guide hints">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
            <strong>Guide</strong>
            <button className="guide-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <p style={{margin:0, color:'rgba(255,255,255,0.9)', marginBottom:8}}>Quick actions to explore the site:</p>

          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button className="guide-btn" onClick={() => sendSectionFocus('projects')}>Show Projects</button>
            <button className="guide-btn" onClick={() => sendSectionFocus('skills')}>Show Skills</button>
            <button className="guide-btn" onClick={() => focusZenith()}>Center Scene</button>
            <button className="guide-btn" onClick={() => sendSectionFocus('devlog')}>Open Dev Log</button>
          </div>
        </div>
      )}
    </div>
  )
}
