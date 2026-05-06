'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'

export type AnimationStep = {
  targetRef: React.RefObject<HTMLElement>
  animation: 'fade-up' | 'fade-in' | 'slide-right' | 'letter-by-letter' | 'count-up'
  delay: number
  duration: number
}

export type IntroAnimatorProps = {
  children: React.ReactNode
  sequence: AnimationStep[]
  autoPlay?: boolean
}

export function useIntroAnimator(sequence: AnimationStep[]) {
  const [isPlaying, setIsPlaying] = useState(false)
  const timersRef = useRef<number[]>([])

  const reset = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    setIsPlaying(false)
    
    sequence.forEach((step) => {
      const element = step.targetRef.current
      if (element) {
        element.classList.remove('animated')
        element.style.opacity = '0'
        element.style.transform = ''
      }
    })
  }, [sequence])

  const play = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      sequence.forEach((step) => {
        const element = step.targetRef.current
        if (element) {
          element.style.opacity = '1'
          element.style.transform = 'none'
        }
      })
      return
    }

    setIsPlaying(true)

    sequence.forEach((step) => {
      const timer = window.setTimeout(() => {
        const element = step.targetRef.current
        if (!element) return

        element.style.transition = `all ${step.duration}ms ease-out`

        switch (step.animation) {
          case 'fade-up':
            element.style.opacity = '0'
            element.style.transform = 'translateY(20px)'
            requestAnimationFrame(() => {
              element.style.opacity = '1'
              element.style.transform = 'translateY(0)'
            })
            break

          case 'fade-in':
            element.style.opacity = '0'
            requestAnimationFrame(() => {
              element.style.opacity = '1'
            })
            break

          case 'slide-right':
            element.style.opacity = '0'
            element.style.transform = 'translateX(-20px)'
            requestAnimationFrame(() => {
              element.style.opacity = '1'
              element.style.transform = 'translateX(0)'
            })
            break

          case 'letter-by-letter': {
            const text = element.textContent || ''
            element.textContent = ''
            const chars = text.split('')
            
            chars.forEach((char, index) => {
              const span = document.createElement('span')
              span.textContent = char
              span.style.opacity = '0'
              span.style.display = 'inline-block'
              element.appendChild(span)

              setTimeout(() => {
                span.style.transition = 'opacity 100ms ease-out'
                span.style.opacity = '1'
              }, index * 40)
            })
            break
          }

          case 'count-up': {
            const target = parseInt(element.textContent || '0')
            let current = 0
            const increment = Math.ceil(target / (step.duration / 16))
            
            const counter = setInterval(() => {
              current += increment
              if (current >= target) {
                current = target
                clearInterval(counter)
              }
              element.textContent = current.toString()
            }, 16)
            break
          }
        }

        element.classList.add('animated')
      }, step.delay)

      timersRef.current.push(timer)
    })
  }, [sequence])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  return { play, reset, isPlaying }
}

export default function IntroAnimator({ 
  children, 
  sequence, 
  autoPlay = true 
}: IntroAnimatorProps) {
  const { play } = useIntroAnimator(sequence)

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        play()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, play])

  return <>{children}</>
}
