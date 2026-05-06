"use client"

import React, { useEffect, useState } from 'react'

type PanelType = React.ComponentType<{ projectId: string; onClose?: () => void }> | null

export default function ProjectModal(): JSX.Element | null {
  const [projectId, setProjectId] = useState<string | null>(null)
  const [Panel, setPanel] = useState<PanelType>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onFocus = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      if (!id) return
      setProjectId(String(id))
    }
    window.addEventListener('focus-project', onFocus as EventListener)
    return () => window.removeEventListener('focus-project', onFocus as EventListener)
  }, [])

  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    // lazy-load the heavy panel only when needed
    import('./ProjectDetailsPanel')
      .then((mod) => {
        setPanel(() => mod.default)
      })
      .catch(() => setPanel(null))
      .finally(() => setLoading(false))
  }, [projectId])

  useEffect(() => {
    if (projectId) {
      // lock scroll
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [projectId])

  if (!projectId) return null

  const close = () => setProjectId(null)

  return (
    <div className="project-modal fixed inset-0 z-60 flex items-center justify-center p-6">
      <div className="project-modal-backdrop absolute inset-0 bg-black/60" onClick={close} />

      <div className="relative z-10 w-full max-w-5xl">
        {loading && (
          <div className="p-6 bg-[#071130]/80 rounded-lg text-white shadow-lg">Loading…</div>
        )}

        {!loading && Panel && <Panel projectId={projectId} onClose={close} />}
      </div>
    </div>
  )
}
