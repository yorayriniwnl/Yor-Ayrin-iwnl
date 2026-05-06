"use client"

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import UI from '../lib/uiConfig'
import { useAdaptive } from './ui/AdaptiveProvider'

type RepoCardProps = {
  name: string
  description: string
  language?: string
  stars?: number
  forks?: number
  languages?: Array<{ name: string; pct: number; color?: string }>
  link?: string
  highlight?: boolean
}

function RepoCard({ name, description, language, stars = 0, forks = 0, link, languages = [], highlight = false }: RepoCardProps): JSX.Element {
  const isExternal = !!link && (link.startsWith('http://') || link.startsWith('https://'))

  const cardRef = useRef<HTMLElement | null>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const s = useMotionValue(1)

  const rX = useSpring(rotateX, { stiffness: 220, damping: 26 })
  const rY = useSpring(rotateY, { stiffness: 220, damping: 26 })
  const sScale = useSpring(s, { stiffness: 300, damping: 30 })

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = cardRef.current as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * 6)
    rotateX.set(py * -6)
    s.set(1.01)
  }

  const handlePointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    s.set(1)
  }

  const { reducedMotion } = useAdaptive()

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={reducedMotion ? { duration: 0 } : { duration: UI.ANIM_FAST, ease: 'easeInOut' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: rX, rotateY: rY, scale: sScale, transformPerspective: 900 }}
      className="repo-card group rounded-xl p-5 relative"
    >
      {highlight && (
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-md z-20">Top</div>
      )}
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="mt-2 text-sm text-gray-200">{description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 text-sm text-gray-300 mb-3">
              {language && (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 block" />
                  <span>{language}</span>
                </span>
              )}

              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                  <path d="M12 .587l3.668 7.431L23.4 9.168l-5.7 5.562L18.835 24 12 20.201 5.165 24l1.135-9.27L.6 9.168l7.732-1.15L12 .587z" />
                </svg>
                <span>{stars}</span>
              </span>

              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M12 2a2 2 0 00-2 2v6H6l6 6 6-6h-4V4a2 2 0 00-2-2z" />
                </svg>
                <span>{forks}</span>
              </span>
            </div>

            {languages.length > 0 && (
              <div className="language-bar h-2 rounded overflow-hidden bg-white/6">
                {languages.map((ln) => (
                  <div key={ln.name} className="language-seg" title={`${ln.name} ${ln.pct}%`} style={{ width: `${ln.pct}%`, background: ln.color || 'linear-gradient(90deg,#06b6d4,#6366f1)' }} />
                ))}
              </div>
            )}
          </div>
          

          {link ? (
            <a href={link} className="text-sm font-medium text-indigo-300 hover:underline" {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              View
            </a>
          ) : (
            <span className="text-sm text-gray-400">Private</span>
          )}
        </div>
      </div>
    </motion.article>
  )

}

export default React.memo(RepoCard)
