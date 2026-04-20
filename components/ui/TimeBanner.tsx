"use client"

import React from 'react'

export default function TimeBanner({ greeting, message, period }: { greeting: string; message?: string | null; period?: string }) {
  if (!greeting) return null

  return (
    <div className="time-banner" aria-hidden={false}>
      <div className="time-pill">
        <div className="time-greeting">{greeting}</div>
        {message && <div className="time-message">{message}</div>}
      </div>
    </div>
  )
}
