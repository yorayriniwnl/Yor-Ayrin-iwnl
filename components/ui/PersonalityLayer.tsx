"use client"

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import UI from '../../lib/uiConfig'

const MESSAGES: string[] = [
  'Currently building...',
  'Optimizing systems...',
  'Tuning performance...',
  'Polishing UI details...',
  'Thinking about solar arrays...',
  'Exploring new ideas...',
  'Refactoring for speed...',
  'Deploying updates...',
  'Listening to feedback...',
  'Writing clean code...'
]

export default function PersonalityLayer(): JSX.Element {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length)
    }, UI.MESSAGE_ROTATION_INTERVAL)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed left-6 bottom-6 z-50 pointer-events-none">
      <div className="max-w-xs">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: UI.ANIM_MED }}
            className="bg-white/6 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg shadow-lg ring-1 ring-white/10"
            aria-live="polite"
          >
            <span className="opacity-95">{MESSAGES[index]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
