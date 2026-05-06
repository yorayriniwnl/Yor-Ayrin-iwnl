"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import UI from '../lib/uiConfig'
import { useAdaptive } from './ui/AdaptiveProvider'

type ZenithPreviewProps = { className?: string }

export default function ZenithPreview({ className = '' }: ZenithPreviewProps) {
  const [values, setValues] = useState<number[]>([36, 52, 28, 64, 58, 46, 54])
  const { reducedMotion, recruiterMode } = useAdaptive()

  useEffect(() => {
    const id = setInterval(() => {
      setValues((v) => v.map((n) => Math.max(6, Math.min(92, Math.round(n + (Math.random() * 18 - 9))))))
    }, 900)

    return () => clearInterval(id)
  }, [])

  const animDur = reducedMotion || recruiterMode ? 0 : UI.ANIM_SLOW

  return (
    <div className={`zenith-preview text-xs ${className}`}>
      <div className="zp-header flex items-center gap-2 mb-2">
        <div className="zp-dot w-2 h-2 rounded-full bg-emerald-400" />
        <div className="font-medium text-sm text-white">Yor Zenith Dashboard</div>
        <div className="ml-auto text-xs text-gray-300">Live</div>
      </div>

      <div className="zp-body flex items-end gap-2">
        <div className="zp-chart flex-1 flex items-end gap-1 h-14">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: '6px' }}
              animate={{ height: `${v}%` }}
              transition={{ duration: animDur, ease: 'easeInOut' }}
              className="zp-bar flex-1 rounded-sm bg-gradient-to-t from-indigo-400 to-indigo-300"
              style={{ minWidth: 4 }}
            />
          ))}
        </div>

        <div className="zp-stats w-20 text-right">
          <div className="text-sm font-semibold">24k</div>
          <div className="text-xs text-gray-300">kWh</div>
        </div>
      </div>
    </div>
  )
}
