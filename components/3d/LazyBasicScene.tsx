"use client"

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const BasicScene = dynamic(() => import('./BasicScene'), { ssr: false, loading: () => <div className="w-full h-48 bg-white/4 rounded" /> })

export default function LazyBasicScene({ height = 400 }: { height?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      if (typeof window === 'undefined') return
      const small = window.innerWidth <= 767
      const touch = navigator.maxTouchPoints && navigator.maxTouchPoints > 0
      setIsMobile(small || !!touch)
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If mobile, don't bother waiting for intersection; show fallback immediately
    if (isMobile) {
      setShow(false)
      return
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShow(true)
            obs.disconnect()
          }
        })
      }, { rootMargin: '200px' })
      obs.observe(el)
      return () => obs.disconnect()
    }

    // Fallback: show after small delay
    const t = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(t)
  }, [isMobile])

  // Mobile fallback UI: clean 2D placeholder and primary CTAs
  const MobileFallback = (
    <div style={{ height }} className="w-full rounded bg-gradient-to-b from-[#071025] to-[#02030a] flex items-center justify-center">
      <div className="max-w-md text-center p-4">
        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg mb-4 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 2v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-white text-lg font-semibold">Interactive hero (3D disabled)</h3>
        <p className="text-sm text-slate-300 mt-2">Reduced UI for mobile devices. Visit Projects or Contact to learn more.</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <a href="/#projects" className="px-3 py-1 rounded-md bg-white/6 text-white">Projects</a>
          <a href="/#contact" className="px-3 py-1 rounded-md border border-white/6 text-white">Contact</a>
        </div>
      </div>
    </div>
  )

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isMobile ? MobileFallback : show ? <BasicScene height={height} /> : <div style={{ height }} className="w-full bg-white/4 rounded" />}
    </div>
  )
}
