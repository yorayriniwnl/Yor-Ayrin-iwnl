'use client'

import { useEffect, useRef, useState } from 'react'

export default function BlogCursor(): JSX.Element | null {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setEnabled(hoverQuery.matches && !motionQuery.matches)
    }

    sync()
    hoverQuery.addEventListener('change', sync)
    motionQuery.addEventListener('change', sync)

    return () => {
      hoverQuery.removeEventListener('change', sync)
      motionQuery.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled || !cursorRef.current || !ringRef.current) return

    const cursor = cursorRef.current
    const ring = ringRef.current
    let mouseX = window.innerWidth * 0.5
    let mouseY = window.innerHeight * 0.5
    let ringX = mouseX
    let ringY = mouseY
    let interactive = false

    const syncInteractiveState = (nextValue: boolean) => {
      if (interactive === nextValue) return
      interactive = nextValue
      cursor.classList.toggle('blog-cursor-active', nextValue)
      ring.classList.toggle('blog-cursor-active', nextValue)
    }

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY
      cursor.style.opacity = '1'
      ring.style.opacity = '0.6'
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`

      const target = event.target instanceof Element
        ? event.target.closest('a, button, input, textarea, select')
        : null

      syncInteractiveState(Boolean(target))
    }

    const onLeave = () => {
      cursor.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onEnter = () => {
      cursor.style.opacity = '1'
      ring.style.opacity = '0.6'
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.14
      ringY += (mouseY - ringY) * 0.14
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frameRef.current = requestAnimationFrame(loop)
    }

    cursor.style.opacity = '1'
    ring.style.opacity = '0.6'
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)

      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      cursor.classList.remove('blog-cursor-active')
      ring.classList.remove('blog-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={cursorRef} className="blog-cursor-dot" aria-hidden />
      <div ref={ringRef} className="blog-cursor-ring" aria-hidden />
    </>
  )
}
