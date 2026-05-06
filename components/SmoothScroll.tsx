"use client"

import { useEffect } from 'react'
import { animate } from 'framer-motion'

export default function SmoothScroll(): null {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const id = href.slice(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const top = el.getBoundingClientRect().top + window.scrollY
      const v = { y: window.scrollY }
      animate(v, { y: Math.max(0, top - 8) }, { type: 'spring', stiffness: 140, damping: 26, mass: 0.7, onUpdate: (latest) => window.scrollTo(0, latest.y) })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
