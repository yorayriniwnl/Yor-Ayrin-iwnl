"use client"

import React, { useEffect, useState } from 'react'

export default function Explore3DToggle(): JSX.Element {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onToggle = (e: Event) => {
      const ev = e as CustomEvent
      setActive(!!ev?.detail?.active)
    }
    window.addEventListener('explore-3d-toggle', onToggle as EventListener)
    return () => window.removeEventListener('explore-3d-toggle', onToggle as EventListener)
  }, [])

  const toggle = () => {
    const next = !active
    // dispatch event — CameraController listens and will request pointer lock
    window.dispatchEvent(new CustomEvent('explore-3d-toggle', { detail: { active: next } }))
    setActive(next)
  }

  return (
    <div className="fixed right-6 bottom-20 z-60 pointer-events-auto">
      <button
        aria-pressed={active}
        onClick={toggle}
        className={`explore-btn ${active ? 'active' : ''}`}
        title={active ? 'Exit 3D explore' : 'Enter 3D explore (WASD + mouse)'}
      >
        {active ? 'Exit Explore (3D)' : 'Explore Mode (3D)'}
      </button>
    </div>
  )
}
