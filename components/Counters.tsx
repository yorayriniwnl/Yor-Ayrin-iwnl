"use client"
import React, { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import UI from '../lib/uiConfig'
import { PROJECTS, SKILL_CATEGORIES } from '../lib/data'
import { useAdaptive } from './ui/AdaptiveProvider'

export default function Counters(): JSX.Element {
  const projects = PROJECTS.length
  const featured = PROJECTS.filter((p) => (p as any).featured).length
  const skills = Object.values(SKILL_CATEGORIES).reduce((acc, arr) => acc + arr.length, 0)

  const { reducedMotion } = useAdaptive()
  const [p, setP] = useState(0)
  const [f, setF] = useState(0)
  const [s, setS] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      setP(projects)
      setF(featured)
      setS(skills)
      return
    }
    const dur = UI.ANIM_SLOW * 1.6

    const a1 = animate(0, projects, {
      duration: dur,
      onUpdate(v) {
        setP(Math.round(v))
      },
    })

    const a2 = animate(0, featured, {
      duration: dur,
      onUpdate(v) {
        setF(Math.round(v))
      },
    })

    const a3 = animate(0, skills, {
      duration: dur,
      onUpdate(v) {
        setS(Math.round(v))
      },
    })

    return () => {
      a1.stop()
      a2.stop()
      a3.stop()
    }
  }, [projects, featured, skills, reducedMotion])

  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <div className="stat-box">
        <div className="stat-value">{p}</div>
        <div className="stat-label">Projects</div>
      </div>

      <div className="stat-box">
        <div className="stat-value">{f}</div>
        <div className="stat-label">Featured</div>
      </div>

      <div className="stat-box">
        <div className="stat-value">{s}</div>
        <div className="stat-label">Skills</div>
      </div>
    </div>
  )
}
