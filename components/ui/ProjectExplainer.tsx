"use client"

import React, { useState } from 'react'

type Props = {
  projectId?: string
  title?: string
  description?: string
  techStack?: string[]
  fullDescription?: string
  problem?: string
  solution?: string
  outcome?: string
}

export default function ProjectExplainer({ projectId, title, description, techStack = [], fullDescription, problem, solution, outcome }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [explanation, setExplanation] = useState<{ what?: string; how?: string; why?: string } | null>(null)

  const generateLocal = () => {
    const what = description || fullDescription || `A project called ${title || 'this project'}.`
    const howParts: string[] = []
    if (solution) howParts.push(solution)
    if (techStack && techStack.length) howParts.push(`Built with ${techStack.join(', ')}.`)
    if (!solution && fullDescription) howParts.push(fullDescription.slice(0, 300))
    const how = howParts.join(' ')

    const whyParts: string[] = []
    if (problem) whyParts.push(problem)
    if (outcome) whyParts.push(`Outcome: ${outcome}`)
    const why = whyParts.join(' ')

    return { what: what.trim(), how: how.trim(), why: why.trim() }
  }

  async function fetchExplanation() {
    setLoading(true)
    setExplanation(null)
    try {
      const res = await fetch(`/api/explain-project?id=${encodeURIComponent(projectId || '')}`)
      if (res.ok) {
        const data = await res.json()
        if (data?.ok && data.explanation) {
          setExplanation(data.explanation)
          setOpen(true)
          return
        }
      }
      // fallback to local
      setExplanation(generateLocal())
      setOpen(true)
    } catch (err) {
      setExplanation(generateLocal())
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="project-explainer">
      <button
        type="button"
        className="text-sm px-3 py-1 bg-white/6 hover:bg-white/8 rounded-md"
        onClick={fetchExplanation}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Details'}
      </button>

      {open && explanation && (
        <div className="mt-3 p-3 bg-[var(--color-surface)] border border-white/6 rounded-md prose prose-invert text-sm">
          <h4 className="text-sm font-semibold">What</h4>
          <p>{explanation.what}</p>

          <h4 className="text-sm font-semibold mt-2">How</h4>
          <p>{explanation.how}</p>

          <h4 className="text-sm font-semibold mt-2">Why</h4>
          <p>{explanation.why}</p>
        </div>
      )}
    </div>
  )
}
