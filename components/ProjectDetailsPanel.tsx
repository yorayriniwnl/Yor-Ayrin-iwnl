"use client"

import React from 'react'
import Image from 'next/image'
import { PROJECTS, type Project } from '../lib/projects'

type Props = { projectId: string; onClose?: () => void }

export default function ProjectDetailsPanel({ projectId, onClose }: Props): JSX.Element | null {
  const project: Project | undefined = PROJECTS.find((p) => String(p.id) === String(projectId))
  if (!project) return null

  return (
    <div className="project-modal-panel bg-surface p-6 rounded-lg shadow-xl max-w-4xl w-full mx-auto text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <p className="text-sm text-slate-300 mt-2">{project.shortDescription}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech?.map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-white/6 rounded">{t}</span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="flex gap-2">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">Open on GitHub</a>
            )}
            <button className="btn btn-ghost btn-sm" onClick={() => onClose && onClose()}>Close</button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {project.screenshots && project.screenshots.length > 0 ? (
            <div className="rounded-md overflow-hidden bg-black/20">
              <Image src={project.screenshots[0]} alt={`${project.title} screenshot`} width={1200} height={640} className="object-cover w-full h-full" />
            </div>
          ) : (
            <div className="h-48 bg-white/3 rounded-md flex items-center justify-center text-slate-300">No preview</div>
          )}

          {project.fullDescription && <div className="text-sm text-slate-300">{project.fullDescription}</div>}
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-auto">
          <section>
            <h4 className="font-semibold">Problem</h4>
            <p className="text-sm text-slate-300">{project.problem ?? <em className="text-slate-400">No problem provided.</em>}</p>
          </section>

          <section>
            <h4 className="font-semibold">Approach</h4>
            <p className="text-sm text-slate-300">{project.solution ?? <em className="text-slate-400">No approach provided.</em>}</p>
          </section>

          <section>
            <h4 className="font-semibold">Challenges</h4>
            <p className="text-sm text-slate-300">{project.challenges ?? <em className="text-slate-400">No challenges provided.</em>}</p>
          </section>

          <section>
            <h4 className="font-semibold">Outcome</h4>
            <p className="text-sm text-slate-300">{project.outcome ?? <em className="text-slate-400">No outcome provided.</em>}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
