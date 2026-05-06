"use client"

import React, { useEffect, useRef, useState } from 'react'

type CounterProps = {
  to: number
  duration?: number
  className?: string
}

export default function Counter({ to, duration = 1000, className = '' }: CounterProps) {
  const [value, setValue] = useState(0)
  const start = useRef<number | null>(null)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    function step(ts: number) {
      if (!start.current) start.current = ts
      const elapsed = ts - (start.current || 0)
      const progress = Math.min(1, elapsed / duration)
      const cur = Math.round(progress * to)
      setValue(cur)
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [to, duration])

  return <span className={className}>{value.toLocaleString()}</span>
}
