"use client"

import React from 'react'
import { useSound } from './SoundProvider'

export default function SoundToggle() {
  const { enabled, toggle } = useSound()
  return (
    <button
      aria-pressed={enabled}
      onClick={(e) => { e.preventDefault(); toggle() }}
      className="btn btn-outline"
      title={enabled ? 'Disable sound' : 'Enable sound'}
    >
      {enabled ? '🔊' : '🔈'}
    </button>
  )
}
