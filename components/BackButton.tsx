"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

export default function BackButton(): JSX.Element {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="ds-button ds-button--ghost ds-button--sm"
      aria-label="Go back"
    >
      Back
    </button>
  )
}
