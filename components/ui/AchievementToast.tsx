"use client"

import React, { useEffect, useState } from 'react'

type Achievement = {
  id: string
  title: string
  description?: string
}

export default function AchievementToast({ item, onClose }: { item: Achievement | null; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!item) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 260)
    }, 3200)
    return () => clearTimeout(t)
  }, [item, onClose])

  if (!item) return null

  return (
    <div className={`achievement-toast ${visible ? 'enter' : 'exit'}`} aria-live="polite">
      <div className="achievement-content">
        <div className="achievement-icon">🏆</div>
        <div className="achievement-text">
          <div className="achievement-title">Unlocked: {item.title}</div>
          {item.description && <div className="achievement-desc">{item.description}</div>}
        </div>
      </div>
    </div>
  )
}
