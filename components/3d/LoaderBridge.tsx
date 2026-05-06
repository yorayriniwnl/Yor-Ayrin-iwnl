"use client"
import { useEffect } from 'react'
import { useProgress } from '@react-three/drei'

export default function LoaderBridge(): null {
  const { progress, active } = useProgress()

  useEffect(() => {
    // broadcast progress (0-100)
    window.dispatchEvent(new CustomEvent('assets-progress', { detail: { progress } }))

    if (progress >= 100) {
      // slight debounce to allow visuals to settle
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('assets-loaded', { detail: { progress } }))
      }, 80)
    }
  }, [progress])

  // no DOM inside canvas
  return null
}
