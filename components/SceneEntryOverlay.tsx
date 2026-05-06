"use client"
import React, { useEffect, useState } from 'react'

export default function SceneEntryOverlay(): JSX.Element | null {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const onProgress = (e: Event) => {
      const ev = e as CustomEvent
      const p = Math.round(ev?.detail?.progress || 0)
      setProgress(p)
    }

    const onLoaded = () => {
      // small delay so the final bar can be seen
      setTimeout(() => {
        setFading(true)
        // start camera intro
        window.dispatchEvent(new CustomEvent('intro-start'))
        // hide overlay after fade
        setTimeout(() => setVisible(false), 700)
      }, 140)
    }

    window.addEventListener('assets-progress', onProgress as EventListener)
    window.addEventListener('assets-loaded', onLoaded as EventListener)

    return () => {
      window.removeEventListener('assets-progress', onProgress as EventListener)
      window.removeEventListener('assets-loaded', onLoaded as EventListener)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-auto transition-opacity duration-700 ${
        fading ? 'opacity-0' : 'opacity-100 bg-black'
      }`}
    >
      <div className="text-center text-white">
        <h2 className="text-2xl font-semibold">Entering the world</h2>
        <div className="mt-4 w-80 h-2 bg-white/6 rounded overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-sm text-slate-300">{progress}%</div>
      </div>
    </div>
  )
}
