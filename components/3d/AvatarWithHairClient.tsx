"use client"

import dynamic from 'next/dynamic'
import React from 'react'

const AvatarWithHair = dynamic(() => import('./AvatarWithHair'), {
  ssr: false,
  loading: () => <div className="skeleton h-64 w-full bg-white/4 rounded" />,
})

export default function AvatarWithHairClient(props: Record<string, unknown>) {
  return <AvatarWithHair {...props} />
}
