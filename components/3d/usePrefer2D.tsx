"use client"
import { useEffect, useState } from 'react'

export function usePrefer2D(): boolean {
  const [prefer2D, setPrefer2D] = useState<boolean>(() => {
    // default false to avoid layout flash; will evaluate on client
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ua = navigator.userAgent || ''
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
    const deviceMemory = (navigator as any).deviceMemory || 8
    const hw = (navigator as any).hardwareConcurrency || 4
    const smallScreen = window.innerWidth < 1000 || window.innerHeight < 700

    const lowPerf = deviceMemory < 3 || hw < 3
    const shouldPrefer2D = isMobile || lowPerf || smallScreen
    setPrefer2D(shouldPrefer2D)

    const onResize = () => {
      const small = window.innerWidth < 1000 || window.innerHeight < 700
      setPrefer2D(isMobile || lowPerf || small)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return prefer2D
}
