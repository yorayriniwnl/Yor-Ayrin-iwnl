"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import Reveal from './Reveal'
import {
  EDUCATION_ENTRIES,
  EXPERIENCE_ENTRIES,
  PROJECT_ENTRIES,
  RESUME_ACHIEVEMENTS,
  RESUME_PROFILE,
  type ResumeEntry,
} from '../lib/resume'

const SkillsViz = dynamic(() => import('./SkillsViz'), {
  ssr: false,
  loading: () => (
    <div className="skills-skeleton" aria-hidden>
      {[1,2,3].map(i => <div key={i} className="skeleton skeleton-rect" style={{ height: '0.75rem' }} />)}
    </div>
  ),
})

function IconWork() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 7h18v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconEducation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10v6a2 2 0 0 0 2 2h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconProject() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TimelineItem({ entry, iconBg, icon, delay = 0 }: {
  entry: ResumeEntry
  iconBg: string
  icon: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay}>
      <article className="timeline-item">
        <div className={`timeline-icon ${iconBg} text-white`}>{icon}</div>
        <div className="timeline-body">
          <h4 className="font-semibold text-sm">{entry.title}</h4>
          <p className="text-sm mt-1">{entry.summary}</p>
          <div className="text-xs text-white/30 mt-2">{entry.meta}</div>
        </div>
      </article>
    </Reveal>
  )
}

function Resume(): JSX.Element {
  return (
    <section id="resume" className="py-24 lg:py-32">
      <div className="container">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-label">Background</span>
              <h2 className="font-display text-white mt-1">Resume</h2>
              <p className="text-white/50 max-w-md mt-2 text-sm leading-relaxed">
                {RESUME_PROFILE.summary}
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a href="/resume" className="btn btn-outline text-sm py-2 px-4">Open</a>
              <a href="/resume.pdf" download className="btn btn-primary text-sm py-2 px-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 16l-5-5h3V4h4v7h3l-5 5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 20h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3">
          {/* Timeline */}
          <div className="md:col-span-2 space-y-10">
            {/* Experience */}
            <div>
              <h3 className="timeline-title text-white/70 text-xs font-semibold tracking-widest uppercase mb-5">Experience</h3>
              <div className="timeline-list">
                {EXPERIENCE_ENTRIES.map((e, i) => (
                  <TimelineItem
                    key={e.title}
                    entry={e}
                    iconBg={i === 0 ? 'bg-indigo-600' : 'bg-slate-700'}
                    icon={<IconWork />}
                    delay={i * 0.06}
                  />
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="timeline-title text-white/70 text-xs font-semibold tracking-widest uppercase mb-5">Education</h3>
              <div className="timeline-list">
                {EDUCATION_ENTRIES.map((e, i) => (
                  <TimelineItem
                    key={e.title}
                    entry={e}
                    iconBg={i === 0 ? 'bg-violet-600' : 'bg-slate-600'}
                    icon={<IconEducation />}
                    delay={i * 0.06}
                  />
                ))}
              </div>
            </div>

            {/* Projects */}
            {PROJECT_ENTRIES && PROJECT_ENTRIES.length > 0 && (
              <div>
                <h3 className="timeline-title text-white/70 text-xs font-semibold tracking-widest uppercase mb-5">Key Projects</h3>
                <div className="timeline-list">
                  {PROJECT_ENTRIES.map((e, i) => (
                    <TimelineItem
                      key={e.title}
                      entry={e}
                      iconBg={i === 0 ? 'bg-emerald-600' : 'bg-sky-600'}
                      icon={<IconProject />}
                      delay={i * 0.06}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Reveal>
              <div className="card-surface p-6">
                <h3 className="font-display font-bold text-white text-base mb-4">Skills</h3>
                <SkillsViz />

                {RESUME_ACHIEVEMENTS && RESUME_ACHIEVEMENTS.length > 0 && (
                  <>
                    <h3 className="font-display font-bold text-white text-base mt-6 mb-3">Highlights</h3>
                    <ul className="space-y-2">
                      {RESUME_ACHIEVEMENTS.map(a => (
                        <li key={a} className="flex items-start gap-2 text-sm text-white/60">
                          <svg className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Reveal>

            {/* Contact card */}
            <Reveal delay={0.1}>
              <div className="card-surface p-6">
                <h3 className="font-display font-bold text-white text-base mb-4">Get in touch</h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:${RESUME_PROFILE.email}`}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                  >
                    <svg className="w-4 h-4 text-white/30 group-hover:text-indigo-400 transition-colors" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {RESUME_PROFILE.email}
                  </a>
                  <a
                    href={RESUME_PROFILE.githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                  >
                    <svg className="w-4 h-4 text-white/30 group-hover:text-indigo-400 transition-colors" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.67 7.67 0 018 3.2c.68.003 1.36.092 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                    {RESUME_PROFILE.githubLabel}
                  </a>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default React.memo(Resume)
