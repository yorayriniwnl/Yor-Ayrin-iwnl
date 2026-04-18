'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * useReveal
 *
 * Tracks which elements have scrolled into view and provides the inline
 * translateY / opacity styles that produce the fade-up reveal used across
 * all homepage sections.
 *
 * Usage:
 *   const { setRef, revealStyle } = useReveal()
 *   <div ref={setRef(0)} data-reveal-key="item-0" style={revealStyle('item-0')} />
 */
export function useReveal(threshold = 0.1) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const [visible, setVisible] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const targets = refs.current.filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.getAttribute('data-reveal-key')
            if (key) setVisible((prev) => ({ ...prev, [key]: true }))
          }
        })
      },
      { threshold }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el
  }

  const revealStyle = (key: string): React.CSSProperties => ({
    opacity: visible[key] ? 1 : 0,
    transform: visible[key] ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  })

  return { setRef, revealStyle }
}

/**
 * useSkillsReveal
 *
 * A simpler variant that flips a single boolean when any of the tracked
 * skill-group elements enter the viewport.  Used to trigger the CSS
 * width animation on skill bars.
 */
export function useSkillsReveal(threshold = 0.2) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const [skillsVisible, setSkillsVisible] = useState(false)

  useEffect(() => {
    const targets = refs.current.filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSkillsVisible(true)
        })
      },
      { threshold }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold])

  const setSkillRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el
  }

  return { skillsVisible, setSkillRef }
}
