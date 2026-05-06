"use client"

import { useEffect } from 'react'

export default function ResumePrintHelper() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('print') === '1') {
        // small delay to allow fonts/assets to load
        setTimeout(() => {
          window.print()
        }, 400)
      }
    } catch (err) {
      // ignore
    }
  }, [])

  return null
}
