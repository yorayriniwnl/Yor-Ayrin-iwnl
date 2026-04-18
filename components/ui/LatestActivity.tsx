"use client"

import React, { useEffect, useState } from 'react'

type Activity = { id: string; repo: string; message: string; timestamp: string; url?: string }

export default function LatestActivity(): JSX.Element {
  const [activity, setActivity] = useState<Activity[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchActivity() {
      try {
        const res = await fetch('/api/github-activity')
        if (!res.ok) return
        const json = await res.json()
        if (mounted) setActivity(json.activity || [])
      } catch (e) {}
    }
    fetchActivity()
    const t = setInterval(fetchActivity, 10000)
    return () => { mounted = false; clearInterval(t) }
  }, [])

  return (
    <aside className="latest-activity fixed right-6 top-24 z-70 w-80 card-surface p-4">
      <h3 className="font-bold">Latest Activity</h3>
      <ul className="mt-3 space-y-3">
        {activity.length === 0 && <li className="text-muted">No recent activity</li>}
        {activity.map(a => (
          <li key={a.id} className="flex items-start gap-3">
            <div className="w-28 text-xs text-muted">{new Date(a.timestamp).toLocaleString()}</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{a.message}</div>
              <div className="text-xs text-muted">{a.repo}</div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
