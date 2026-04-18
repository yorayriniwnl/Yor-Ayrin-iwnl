"use client"

import dynamic from 'next/dynamic'
import { usePrefer2D } from './usePrefer2D'

const DynamicSpaceCanvas = dynamic(() => import('./SpaceCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function SpaceBackground(): JSX.Element | null {
  const prefer2D = usePrefer2D()

  if (prefer2D) {
    return <div className="space-fallback" aria-hidden />
  }

  return <DynamicSpaceCanvas />
}
