"use client"

import React, {
  useRef,
  useEffect,
  useCallback,
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type RevealVariant = 'fade-up' | 'fade-in' | 'slide-right' | 'slide-left' | 'scale-up'

export type RevealProps = {
  children: React.ReactNode
  variant?: RevealVariant
  delay?: number
  threshold?: number
  once?: boolean
  className?: string
}

export type RevealGroupProps = {
  children: React.ReactNode
  stagger?: number
  variant?: RevealVariant
  threshold?: number
}

// ─── Reveal ───────────────────────────────────────────────────────────────────

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  threshold = 0.15,
  once = true,
  className = '',
}: RevealProps): JSX.Element {
  const ref    = useRef<HTMLDivElement>(null)
  const doneSR = useRef(false)

  const applyVisible = useCallback((el: HTMLDivElement) => {
    el.style.transitionDelay = delay > 0 ? `${delay}ms` : ''
    el.classList.add('reveal-visible')
  }, [delay])

  const applyHidden = useCallback((el: HTMLDivElement) => {
    el.style.transitionDelay = ''
    el.classList.remove('reveal-visible')
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion: reveal immediately and bail
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      el.classList.remove('reveal-hidden', variant)
      el.classList.add('reveal-visible')
      return
    }

    // Set initial hidden state
    el.classList.add('reveal-hidden', variant)

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            applyVisible(el)
            if (once) {
              observer.disconnect()
              doneSR.current = true
            }
          } else if (!once && doneSR.current === false) {
            applyHidden(el)
          }
        })
      },
      { threshold }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [variant, threshold, once, applyVisible, applyHidden])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// ─── RevealGroup ──────────────────────────────────────────────────────────────

export function RevealGroup({
  children,
  stagger = 80,
  variant = 'fade-up',
  threshold = 0.15,
}: RevealGroupProps): JSX.Element {
  const items = Children.toArray(children)

  return (
    <>
      {items.map((child, i) => {
        if (!isValidElement(child)) {
          return (
            <Reveal key={i} variant={variant} delay={i * stagger} threshold={threshold}>
              {child}
            </Reveal>
          )
        }

        const existingDelay = (child.props as { delay?: number }).delay ?? 0

        return (
          <Reveal
            key={(child as ReactElement).key ?? i}
            variant={variant}
            delay={existingDelay + i * stagger}
            threshold={threshold}
          >
            {cloneElement(child as ReactElement)}
          </Reveal>
        )
      })}
    </>
  )
}
