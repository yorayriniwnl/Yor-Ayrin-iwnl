"use client"
import React, { useEffect } from 'react'

type Props = {
  selector?: string
  amplitude?: number
  period?: number
}

export default function MicroMotion({ selector = '[data-float], .float-slow', amplitude = 2.4, period = 20 }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    // respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!nodes.length) return

    // adapt amplitude for smaller viewports for a subtler premium feel
    const viewportMultiplier = window.innerWidth < 768 ? 0.55 : 1
    const amp = amplitude * viewportMultiplier

    const items = nodes.map((el, i) => {
      const initial = el.style.transform || ''
      el.style.willChange = 'transform'
      // smaller randomized phase offsets to keep motion cohesive and premium
      const phase = (i / nodes.length) * Math.PI * 2 + Math.random() * 0.18
      return { el, initial, phase }
    })

    let raf = 0
    const w = (2 * Math.PI) / period
    const start = performance.now()

    const tick = () => {
      const t = (performance.now() - start) / 1000
      for (const it of items) {
        const y = Math.sin(t * w + it.phase) * amp
        it.el.style.transform = `${it.initial} translate3d(0, ${y}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      for (const it of items) {
        it.el.style.transform = it.initial
        it.el.style.willChange = ''
      }
    }
  }, [selector, amplitude, period])

  return null
}
