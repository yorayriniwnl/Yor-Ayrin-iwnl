"use client"

import React, { useEffect, useState } from 'react'

type Suggestion = { message: string; projectId?: string; title?: string }

const DISMISS_KEY = 'interaction_suggestion_dismiss_until'

export default function SuggestionBanner(): JSX.Element {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent
      const s = ev?.detail?.suggestion
      if (!s) return
      // respect dismiss
      try {
        const until = Number(sessionStorage.getItem(DISMISS_KEY) || '0')
        if (until && Date.now() < until) return
      } catch {}
      setSuggestion(s)
      setVisible(true)
    }

    const clearHandler = () => { setSuggestion(null); setVisible(false) }

    window.addEventListener('interaction-suggestion', handler as EventListener)
    window.addEventListener('interaction-metrics-updated', clearHandler as EventListener)
    return () => {
      window.removeEventListener('interaction-suggestion', handler as EventListener)
      window.removeEventListener('interaction-metrics-updated', clearHandler as EventListener)
    }
  }, [])

  if (!suggestion || !visible) return <></>

  function openProject() {
    const projectId = suggestion?.projectId
    if (!projectId) return
    try {
      window.dispatchEvent(new CustomEvent('focus-panel', { detail: { id: projectId } }))
      window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: projectId } }))
    } catch {}
    setVisible(false)
  }

  function dismiss() {
    try { sessionStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 5)) } catch {}
    setVisible(false)
  }

  return (
    <div className="fixed right-6 bottom-20 z-50">
      <div className="max-w-sm pointer-events-auto">
        <div className="bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="flex-1 text-sm">{suggestion.message}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md bg-white/10 text-white text-sm" onClick={openProject}>Open</button>
            <button className="px-2 py-1 text-sm text-white/80" onClick={dismiss}>✕</button>
          </div>
        </div>
      </div>
    </div>
  )
}
