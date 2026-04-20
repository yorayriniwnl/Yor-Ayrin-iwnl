"use client"
import { useEffect, useState } from 'react'

export function useCanvasActive(): boolean {
  const [active, setActive] = useState(true)

  useEffect(() => {
    let mounted = true
    const wrapper = document.querySelector('.space-canvas')

    const evaluate = () => {
      if (!mounted) return
      const vis = !document.hidden
      if (!wrapper) return setActive(vis)
      const rect = wrapper.getBoundingClientRect()
      const inViewport = rect.width > 0 && rect.height > 0 && rect.bottom >= 0 && rect.top <= window.innerHeight
      setActive(vis && inViewport)
    }

    evaluate()

    const onVisibility = () => evaluate()
    document.addEventListener('visibilitychange', onVisibility)

    let obs: IntersectionObserver | null = null
    if (wrapper) {
      obs = new IntersectionObserver((entries) => {
        if (!mounted) return
        setActive(!document.hidden && entries[0]?.isIntersecting === true)
      }, { threshold: 0.01 })
      obs.observe(wrapper)
    }

    window.addEventListener('resize', evaluate)

    return () => {
      mounted = false
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', evaluate)
      if (obs && wrapper) obs.unobserve(wrapper)
    }
  }, [])

  return active
}
