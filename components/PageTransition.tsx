"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { useAdaptive } from './ui/AdaptiveProvider'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  let shouldReduce = false
  try {
    const ad = useAdaptive()
    shouldReduce = !!ad.reducedMotion
  } catch {
    shouldReduce = false
  }

  const transition = shouldReduce
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div
      key={pathname}
      style={
        shouldReduce
          ? undefined
          : {
              opacity: 1,
              transform: 'translateY(0)',
              transition: `opacity ${transition.duration}s ease, transform ${transition.duration}s ease`,
              willChange: 'opacity, transform',
            }
      }
    >
      {children}
    </div>
  )
}
