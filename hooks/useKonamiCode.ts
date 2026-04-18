'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

type UseKonamiCodeOptions = {
  onActivate?: () => void
}

export function useKonamiCode(options: UseKonamiCodeOptions = {}): {
  activated: boolean
  pressKey: (key: string) => void
} {
  const { onActivate } = options
  const [activated, setActivated] = useState(false)
  const bufferRef = useRef<string[]>([])
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkSequence = useCallback((buffer: string[]) => {
    if (buffer.length < KONAMI_SEQUENCE.length) return false
    const tail = buffer.slice(-KONAMI_SEQUENCE.length)
    return tail.every((key, i) => key === KONAMI_SEQUENCE[i])
  }, [])

  const pressKey = useCallback(
    (key: string) => {
      bufferRef.current = [...bufferRef.current, key].slice(-KONAMI_SEQUENCE.length)

      if (checkSequence(bufferRef.current)) {
        setActivated(true)
        onActivate?.()
        bufferRef.current = []

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
          setActivated(false)
        }, 3000)
      }
    },
    [checkSequence, onActivate]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Normalise letter keys to lowercase so 'B' and 'b' both match
      const key =
        e.key.length === 1 ? e.key.toLowerCase() : e.key
      pressKey(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [pressKey])

  return { activated, pressKey }
}
