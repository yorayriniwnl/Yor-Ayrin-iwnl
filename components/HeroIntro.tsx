'use client'

import React, { useReducer, useEffect, useRef } from 'react'

const ROLES = [
  'System Builder',
  'Frontend Engineer',
  'Creative Developer',
  '3D Enthusiast',
  'Open Source Contributor',
  'Available for Work ✦',
]

type State = {
  phase: 'typing' | 'pausing' | 'deleting' | 'switching'
  currentText: string
  roleIndex: number
  charIndex: number
  pauseCounter: number
}

type Action = { type: 'TICK' }

const TYPING_SPEED = 60
const DELETING_SPEED = 30
const PAUSE_DURATION = 2000

function reducer(state: State, action: Action): State {
  if (action.type !== 'TICK') return state

  const currentRole = ROLES[state.roleIndex]

  switch (state.phase) {
    case 'typing': {
      if (state.charIndex < currentRole.length) {
        return {
          ...state,
          currentText: currentRole.slice(0, state.charIndex + 1),
          charIndex: state.charIndex + 1,
        }
      }
      return {
        ...state,
        phase: 'pausing',
        pauseCounter: 0,
      }
    }

    case 'pausing': {
      if (state.pauseCounter < PAUSE_DURATION) {
        return {
          ...state,
          pauseCounter: state.pauseCounter + TYPING_SPEED,
        }
      }
      return {
        ...state,
        phase: 'deleting',
      }
    }

    case 'deleting': {
      if (state.charIndex > 0) {
        return {
          ...state,
          currentText: currentRole.slice(0, state.charIndex - 1),
          charIndex: state.charIndex - 1,
        }
      }
      return {
        ...state,
        phase: 'switching',
      }
    }

    case 'switching': {
      const nextIndex = (state.roleIndex + 1) % ROLES.length
      return {
        phase: 'typing',
        currentText: '',
        roleIndex: nextIndex,
        charIndex: 0,
        pauseCounter: 0,
      }
    }

    default:
      return state
  }
}

export default function HeroIntro() {
  const [state, dispatch] = useReducer(reducer, {
    phase: 'typing',
    currentText: '',
    roleIndex: 0,
    charIndex: 0,
    pauseCounter: 0,
  })

  const liveRegionRef = useRef<HTMLSpanElement>(null)
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  useEffect(() => {
    if (prefersReducedMotion) return

    const speed = state.phase === 'deleting' ? DELETING_SPEED : TYPING_SPEED
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, speed)

    return () => clearInterval(interval)
  }, [state.phase, prefersReducedMotion])

  useEffect(() => {
    if (liveRegionRef.current && state.phase === 'pausing') {
      liveRegionRef.current.textContent = state.currentText
    }
  }, [state.phase, state.currentText])

  if (prefersReducedMotion) {
    return (
      <span style={{ 
        color: 'var(--ds-primary)', 
        fontFamily: 'var(--font-ds-mono)', 
        fontSize: 'inherit' 
      }}>
        {ROLES.join(', ')}
      </span>
    )
  }

  const showCursor = state.phase === 'typing' || state.phase === 'pausing'

  return (
    <>
      <span
        style={{
          color: 'var(--ds-primary)',
          fontFamily: 'var(--font-ds-mono)',
          fontSize: 'inherit',
        }}
      >
        {state.currentText}
      </span>
      {showCursor && (
        <span
          className="cursor"
          aria-hidden="true"
          style={{
            color: 'var(--ds-primary)',
            fontFamily: 'var(--font-ds-mono)',
            fontSize: 'inherit',
            animation: 'blink 1s step-end infinite',
          }}
        >
          |
        </span>
      )}
      <span
        ref={liveRegionRef}
        aria-live="polite"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
