"use client"

import { useEffect } from 'react'

type GoogleAdSenseLoaderProps = {
  clientId: string
}

const ADSENSE_SCRIPT_ID = 'google-adsense-loader'

export default function GoogleAdSenseLoader({
  clientId,
}: GoogleAdSenseLoaderProps): null {
  useEffect(() => {
    if (!clientId) return

    const src =
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`
    const existing = document.getElementById(ADSENSE_SCRIPT_ID)

    if (existing instanceof HTMLScriptElement) {
      if (existing.src !== src) {
        existing.src = src
      }
      return
    }

    const script = document.createElement('script')
    script.id = ADSENSE_SCRIPT_ID
    script.async = true
    script.src = src
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)
  }, [clientId])

  return null
}
