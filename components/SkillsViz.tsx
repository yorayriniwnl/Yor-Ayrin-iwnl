"use client"

import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import UI from '../lib/uiConfig'
import { SKILL_CATEGORIES } from '../lib/data'
import { useAdaptive } from './ui/AdaptiveProvider'

function Radial({ name, value, animate, size = 120 }: { name: string; value: number; animate: boolean; size?: number }) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (1 - value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <defs>
            <linearGradient id={`g-${name}`} x1="0%" x2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} stroke="#0f172a" fill="none" />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            stroke={`url(#g-${name})`}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animate ? dash : circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animate ? dash : circumference }}
            transition={{ duration: UI.ANIM_SLOW, ease: 'easeOut' }}
            fill="none"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-base font-semibold">{value}%</div>
          <div className="text-xs text-gray-400 mt-1">{name}</div>
        </div>
      </div>
    </div>
  )
}

export default function SkillsViz() {
  const [active, setActive] = useState<string>('Frontend')
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  let recruiterMode = false
  let reducedMotion = false
  try {
    const ad = useAdaptive()
    recruiterMode = !!ad.recruiterMode
    reducedMotion = !!ad.reducedMotion
  } catch (err) {
    recruiterMode = false
    reducedMotion = false
  }

  if (recruiterMode) {
    const flat = Object.values(SKILL_CATEGORIES).flat()
    flat.sort((a, b) => b.value - a.value)
    const top = flat.slice(0, 12)

    return (
      <div ref={ref} className="w-full">
        <div className="grid grid-cols-2 gap-2">
          {top.map((s) => (
            <div key={s.name} className="flex flex-col p-2 rounded-md bg-zinc-50 border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">{s.name}</div>
                <div className="text-sm font-semibold text-gray-700">{s.value}%</div>
              </div>
              {s.desc && <div className="text-xs text-gray-500 mt-1">{s.desc}</div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {Object.keys(SKILL_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-3 py-1 rounded-md text-sm ${active === cat ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {SKILL_CATEGORIES[active]?.map((s) => (
          <div key={s.name} className="p-4 rounded-lg bg-zinc-50 border border-gray-100 shadow-sm flex items-start gap-4">
            <Radial name={s.name} value={s.value} animate={inView && !reducedMotion} size={84} />

            <div className="text-sm text-gray-700">
              <div className="font-medium">
                {s.name} <span className="text-xs text-gray-500 font-normal">— {s.value}%</span>
              </div>
              {s.desc && <div className="text-xs text-gray-500 mt-2">{s.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
