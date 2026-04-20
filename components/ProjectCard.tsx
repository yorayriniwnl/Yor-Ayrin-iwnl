"use client"

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type ProjectCardProps = {
  title: string
  description: string
  techStack?: string[]
  link?: string
  featured?: boolean
  badge?: string
  image?: string
  projectId?: string
  tags?: string[]
}

function ProjectCard({
  title,
  description,
  techStack = [],
  link,
  featured = false,
  badge,
  image,
  projectId,
  tags = [],
}: ProjectCardProps): JSX.Element {
  const isExternal = !!link && (link.startsWith('http://') || link.startsWith('https://'))
  const isInternal = !!link && link.startsWith('/')
  const preview    = image || '/project-placeholder.svg'

  const cardRef = useRef<HTMLElement | null>(null)
  const [hovered, setHovered] = useState(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const s       = useMotionValue(1)
  const rX      = useSpring(rotateX, { stiffness: 140, damping: 20 })
  const rY      = useSpring(rotateY, { stiffness: 140, damping: 20 })
  const sScale  = useSpring(s,       { stiffness: 340, damping: 30 })

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = cardRef.current as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    rotateY.set(((e.clientX - rect.left) / rect.width  - 0.5) *  6)
    rotateX.set(((e.clientY - rect.top)  / rect.height - 0.5) * -5)
    s.set(1.02)
  }

  const handlePointerLeave = () => {
    rotateX.set(0); rotateY.set(0); s.set(1); setHovered(false)
  }

  const dispatchFocus = () => {
    if (!projectId || typeof window === 'undefined') return
    try { window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: projectId } })) } catch {}
  }

  const linkProps = isExternal
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {}

  return (
    <motion.article
      ref={cardRef}
      data-project-id={projectId}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => { setHovered(true); s.set(1.03) }}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX: rX, rotateY: rY, scale: sScale, transformPerspective: 1000 }}
      className={`project-card group relative layer-midground ${featured ? 'project-card--featured' : ''}`}
      aria-label={`Project: ${title}`}
    >
      {badge && <div className="project-badge">{badge}</div>}
      <div className="project-card-glow" aria-hidden />

      <div className="project-card-inner">
        {/* Image */}
        <div className="project-preview rounded-lg overflow-hidden relative">
          <Image
            src={preview}
            alt={`${title} preview`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden />

          {tags.length > 0 && (
            <div className="absolute right-2 top-2 flex gap-1.5 pointer-events-none z-10">
              {tags.slice(0, 2).map(t => (
                <span key={t} className="project-pill text-[10px]">{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-4 space-y-2">
          <h3 className="font-display font-bold text-white text-base leading-snug">{title}</h3>
          <p className="text-sm text-white/60 leading-relaxed line-clamp-2">{description}</p>
        </div>

        {/* Tech pills */}
        {techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techStack.map(t => (
              <span key={t} className="project-pill">{t}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        {link && (
          <div className="mt-5">
            {isInternal ? (
              <Link
                href={link}
                className="project-cta"
                onClick={dispatchFocus}
                aria-label={`View project: ${title}`}
              >
                {badge === 'Flagship Project' ? 'View Case Study' : 'View Project'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ) : (
              <a
                href={link}
                className="project-cta"
                onClick={dispatchFocus}
                aria-label={`View project: ${title}`}
                {...linkProps}
              >
                {badge === 'Flagship Project' ? 'View Case Study' : 'View Project'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default React.memo(ProjectCard)
