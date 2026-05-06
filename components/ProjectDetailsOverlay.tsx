"use client"
import React, { useEffect, useState } from 'react'
import { PROJECTS, type Project } from '../lib/data'

export default function ProjectDetailsOverlay(): JSX.Element | null {
  const [project, setProject] = useState<Project | null>(null)
  const [expanded, setExpanded] = useState<{ [k: string]: boolean }>({ problem: true, approach: false, challenges: false, outcome: false })

  const toggle = (k: string) => setExpanded((s) => ({ ...s, [k]: !s[k] }))
  const expandAll = () => setExpanded({ problem: true, approach: true, challenges: true, outcome: true })
  const collapseAll = () => setExpanded({ problem: false, approach: false, challenges: false, outcome: false })

  useEffect(() => {
    const onFocus = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      if (!id) return
      const p = PROJECTS.find((x) => x.id === id) || null
      setProject(p)
    }

    window.addEventListener('focus-project', onFocus as EventListener)
    return () => window.removeEventListener('focus-project', onFocus as EventListener)
  }, [])

  if (!project) return null

  return (
    <aside className="fixed right-6 bottom-6 w-96 max-w-sm p-4 bg-gradient-to-br from-black/60 to-[#071130]/60 backdrop-blur rounded-lg text-white shadow-lg z-50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm text-slate-300 mt-1">{project.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tech?.map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-white/6 rounded">{t}</span>
            ))}
          </div>
        </div>

        <div className="ml-3 flex-shrink-0">
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => collapseAll()}>Collapse</button>
              <button className="btn btn-ghost btn-sm" onClick={() => expandAll()}>Expand</button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setProject(null)}>Close</button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            Open on GitHub
          </a>
        )}
      </div>

      <div className="mt-4 max-h-[60vh] overflow-auto pr-2">
        {project.fullDescription && (
          <div className="mb-3 text-sm text-slate-300">{project.fullDescription}</div>
        )}

        <div className="story-sections space-y-3">
          {/* Problem */}
          <div className="story-section">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Problem</h4>
              <button aria-expanded={!!expanded.problem} className="text-sm text-slate-300" onClick={() => toggle('problem')}>
                {expanded.problem ? '−' : '+'}
              </button>
            </div>
            <div className={`story-section-content ${expanded.problem ? 'open' : 'collapsed'}`}>
              <p className="text-sm text-slate-300">{project.problem ?? <span className="text-slate-400 italic">No problem statement provided.</span>}</p>
            </div>
          </div>

          {/* Approach / Solution */}
          <div className="story-section">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Approach</h4>
              <button aria-expanded={!!expanded.approach} className="text-sm text-slate-300" onClick={() => toggle('approach')}>
                {expanded.approach ? '−' : '+'}
              </button>
            </div>
            <div className={`story-section-content ${expanded.approach ? 'open' : 'collapsed'}`}>
              <p className="text-sm text-slate-300">{project.solution ?? <span className="text-slate-400 italic">No approach details yet.</span>}</p>
            </div>
          </div>

          {/* Challenges */}
          <div className="story-section">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Challenges</h4>
              <button aria-expanded={!!expanded.challenges} className="text-sm text-slate-300" onClick={() => toggle('challenges')}>
                {expanded.challenges ? '−' : '+'}
              </button>
            </div>
            <div className={`story-section-content ${expanded.challenges ? 'open' : 'collapsed'}`}>
              <p className="text-sm text-slate-300">{project.challenges ?? <span className="text-slate-400 italic">No challenges recorded.</span>}</p>
            </div>
          </div>

          {/* Outcome */}
          <div className="story-section">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Outcome</h4>
              <button aria-expanded={!!expanded.outcome} className="text-sm text-slate-300" onClick={() => toggle('outcome')}>
                {expanded.outcome ? '−' : '+'}
              </button>
            </div>
            <div className={`story-section-content ${expanded.outcome ? 'open' : 'collapsed'}`}>
              <p className="text-sm text-slate-300">{project.outcome ?? <span className="text-slate-400 italic">Outcome not available.</span>}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
