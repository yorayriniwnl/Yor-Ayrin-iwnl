"use client"

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { PROJECTS } from '../lib/projects'
import Reveal from './Reveal'

const ProjectCard = dynamic(() => import('./ProjectCard'), {
  ssr: false,
  loading: () => <div className="project-card-skeleton animate-pulse" />,
})

const CATEGORIES = ['AI', 'Web', 'Systems', '3D'] as const

const itemVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1,    transition: { type: 'spring', stiffness: 260, damping: 28 } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
} satisfies Variants

function ProjectsShowcase(): JSX.Element {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggleFilter = (c: string) =>
    setActiveFilters(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const clearFilters = () => setActiveFilters([])

  const filtered = useMemo(() => {
    const unique = PROJECTS.filter(
      (p, i, arr) => arr.findIndex(q => q.id === p.id) === i
    )
    if (!activeFilters.length) return unique
    return unique.filter(p => activeFilters.includes(p.category))
  }, [activeFilters])

  // Yor Zenith always first
  const ordered = useMemo(() => {
    const copy = [...filtered]
    const idx  = copy.findIndex(p => String(p.id).toLowerCase() === 'zenith' || p.badge === 'Flagship Project')
    if (idx > 0) { const [f] = copy.splice(idx, 1); return [f, ...copy] }
    return copy
  }, [filtered])

  return (
    <section id="projects" className="py-24 lg:py-32">
      <div className="container">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <span className="section-label">Work</span>
              <h2 className="font-display text-white mt-1">Projects</h2>
            </div>

            {/* Filters */}
            <div className="projects-tabs flex gap-2 items-center filter-chips flex-wrap" role="group" aria-label="Filter projects">
              <button
                onClick={clearFilters}
                aria-pressed={activeFilters.length === 0}
                className={`tab px-3 py-1.5 rounded-lg filter-chip ${activeFilters.length === 0 ? 'active' : ''}`}
              >
                All
              </button>
              {CATEGORIES.map(cat => {
                const selected = activeFilters.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleFilter(cat)}
                    aria-pressed={selected}
                    className={`tab px-3 py-1.5 rounded-lg filter-chip ${selected ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/40 mb-3">No projects match those filters.</p>
            <button onClick={clearFilters} className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div layout className="projects-grid">
            <AnimatePresence initial={false} mode="popLayout">
              {ordered.map(project => (
                <motion.div
                  key={project.id}
                  layout
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`project-tile ${project.featured ? 'featured' : ''}`}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.shortDescription ?? ''}
                    techStack={project.tech ?? []}
                    tags={project.tags ?? []}
                    link={`/projects/${project.id}`}
                    projectId={project.id}
                    featured={project.featured}
                    badge={project.badge}
                    image={project.screenshots?.[0]}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default React.memo(ProjectsShowcase)
