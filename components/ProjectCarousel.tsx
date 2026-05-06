"use client"

import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useRef,
} from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: string
  title: string
  shortDescription: string
  tech: string[]
  category: string
  featured?: boolean
  badge?: string
  github?: string
}

type ProjectCarouselProps = {
  projects: Project[]
  /** Optional: override the route pushed on selection. Defaults to /projects/:id */
  basePath?: string
}

// ─── Dynamic import — always ssr:false ───────────────────────────────────────

const ProjectCarousel3D = dynamic(
  () => import('./ProjectCarousel3D'),
  {
    ssr: false,
    loading: () => <Carousel3DFallback />,
  }
)

// ─── Fallback shown while 3-D bundle loads ────────────────────────────────────

function Carousel3DFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '420px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #060b14 0%, #0d1424 60%, #0a0f1e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-busy="true"
      aria-label="Loading 3D carousel"
    >
      <span
        style={{
          color: 'rgba(148,163,184,0.4)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: "'DM Mono', monospace",
        }}
      >
        loading scene…
      </span>
    </div>
  )
}

// ─── Flat card grid (mobile / JS-disabled fallback) ──────────────────────────

const CATEGORY_ACCENT: Record<string, string> = {
  frontend: '#38bdf8',
  ai:       '#a78bfa',
  '3d':     '#34d399',
  backend:  '#f87171',
  mobile:   '#fbbf24',
  default:  '#94a3b8',
}

type FlatCardProps = {
  project: Project
  onSelect: (id: string) => void
  index: number
}

function FlatCard({ project, onSelect, index }: FlatCardProps) {
  const accent = CATEGORY_ACCENT[project.category] ?? CATEGORY_ACCENT.default

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 26,
        delay: index * 0.055,
      }}
      onClick={() => onSelect(project.id)}
      role="button"
      tabIndex={0}
      aria-label={`Open project: ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project.id)
        }
      }}
      style={{
        background: 'linear-gradient(145deg, #0d1424 0%, #111827 100%)',
        border: `1px solid ${accent}22`,
        borderRadius: '12px',
        padding: '18px 20px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      whileHover={{
        y: -4,
        boxShadow: `0 8px 32px ${accent}20, 0 0 0 1px ${accent}33`,
        borderColor: `${accent}44`,
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Glow dot */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: accent,
          boxShadow: `0 0 8px ${accent}`,
          opacity: project.featured ? 1 : 0.45,
        }}
      />

      {/* Category label */}
      <span
        style={{
          display: 'block',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: accent,
          marginBottom: '8px',
          fontFamily: "'DM Mono', 'Fira Code', monospace",
        }}
      >
        {project.category}
        {project.featured && (
          <span
            style={{
              marginLeft: '6px',
              background: accent,
              color: '#0f172a',
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '7px',
              fontWeight: 800,
              letterSpacing: '0.1em',
            }}
          >
            ★
          </span>
        )}
      </span>

      {/* Title */}
      <h3
        style={{
          margin: '0 0 6px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#f1f5f9',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          fontFamily: "'DM Sans', 'Inter', sans-serif",
        }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          margin: '0 0 12px',
          fontSize: '12px',
          color: 'rgba(148,163,184,0.7)',
          lineHeight: 1.5,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {project.shortDescription}
      </p>

      {/* Tech pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            style={{
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              padding: '2px 7px',
              borderRadius: '4px',
              background: `${accent}15`,
              color: accent,
              border: `1px solid ${accent}30`,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main exported wrapper ────────────────────────────────────────────────────

export default function ProjectCarousel({
  projects,
  basePath = '/projects',
}: ProjectCarouselProps): JSX.Element {
  const router = useRouter()

  // Detect viewport width on client only — avoids hydration mismatch
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleSelect = useCallback(
    (id: string) => {
      router.push(`${basePath}/${id}`)
    },
    [router, basePath]
  )

  // While JS hasn't run yet (SSR / first paint) — render nothing meaningful
  if (isDesktop === null) {
    return <Carousel3DFallback />
  }

  // ── Desktop: render the 3-D canvas (dynamically imported) ─────────────────
  if (isDesktop) {
    return (
      <Suspense fallback={<Carousel3DFallback />}>
        <ProjectCarousel3D
          projects={projects}
          onSelect={handleSelect}
          isMobile={false}
        />
      </Suspense>
    )
  }

  // ── Mobile: flat responsive grid ──────────────────────────────────────────
  return (
    <section
      aria-label="Project list"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '14px',
        width: '100%',
      }}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <FlatCard
            key={project.id}
            project={project}
            onSelect={handleSelect}
            index={index}
          />
        ))}
      </AnimatePresence>
    </section>
  )
}
