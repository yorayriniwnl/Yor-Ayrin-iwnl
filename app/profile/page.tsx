"use client"

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePageView } from '../../lib/analytics'
import { SITE_PROFILE } from '../../lib/data'

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const HEADLINE_STATS = [
  { value: '09',   label: 'Public Repos'      },
  { value: '09',   label: 'Portfolio Projects' },
  { value: '16',   label: 'Skill Signals'     },
  { value: '2027', label: 'Graduation'        },
]

interface SkillEntry { name: string; pct: number }

const SKILLS_LEFT: SkillEntry[] = [
  { name: 'React',        pct: 82 },
  { name: 'HTML / CSS',   pct: 82 },
  { name: 'Tailwind CSS', pct: 80 },
  { name: 'TypeScript',   pct: 65 },
  { name: 'Three.js',     pct: 72 },
]

const SKILLS_RIGHT: SkillEntry[] = [
  { name: 'Python',       pct: 84 },
  { name: 'OpenCV',       pct: 76 },
  { name: 'Scikit-Learn', pct: 74 },
  { name: 'Streamlit',    pct: 70 },
  { name: 'SQL',          pct: 58 },
]

const FEATURED_PROJECTS = [
  {
    id:    'zenith',
    title: 'Yor Zenith',
    desc:  'Full-stack solar decision platform for feasibility, subsidy-aware planning, and interactive 3D dashboards.',
    tech:  ['Next.js', 'React', 'Three.js'],
    github: 'https://github.com/yorayriniwnl/Yor-Zenith',
  },
  {
    id:    'ai-detector',
    title: 'Yor AI vs Real Image',
    desc:  'Image classifier using OpenCV, LBP/GLCM features, Scikit-Learn SVM, and Streamlit.',
    tech:  ['Python', 'OpenCV', 'Scikit-Learn'],
    github: 'https://github.com/yorayriniwnl/Yor-Ai-vs-real-image',
  },
  {
    id:    'mentor-mentee',
    title: 'Mentor-Mentee',
    desc:  'Mentorship coordination system with Flask API support, matching logic, SQLite, and Tkinter.',
    tech:  ['Python', 'Flask', 'SQLite'],
    github: 'https://github.com/yorayriniwnl/mentor-mentee-system',
  },
]
// â”€â”€â”€ Section 1: Quick stats header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProfileHeader() {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 'var(--ds-space-6)',
      }}
    >
      {/* Identity row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-5)', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          aria-label="Ayush Roy initials"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            border: '2px solid #6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 24px rgba(99,102,241,0.18)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--ds-font-display)',
              fontSize: '26px',
              fontWeight: 700,
              color: '#6366f1',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            AR
          </span>
        </motion.div>

        {/* Name + role + badges */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 700,
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-soft)',
              letterSpacing: '-0.02em',
            }}
          >
            Ayush Roy
          </h1>
          <p
            style={{
              margin: '0 0 var(--ds-space-3)',
              fontSize: '15px',
              color: 'var(--ds-text-muted)',
              fontFamily: 'var(--ds-font-mono)',
              letterSpacing: '0.03em',
            }}
          >
            Full Stack Developer Intern Candidate
          </p>

          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
            {/* Location badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: 'var(--ds-radius-pill)',
                background: 'var(--ds-bg-raised)',
                border: '1px solid var(--ds-border)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--ds-text-muted)',
                fontFamily: 'var(--ds-font-mono)',
              }}
            >
              ðŸŒ India
            </span>

            {/* Open to work badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: 'var(--ds-radius-pill)',
                background: 'rgba(122,154,122,0.1)',
                border: '1px solid rgba(122,154,122,0.28)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ds-success)',
                fontFamily: 'var(--ds-font-mono)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--ds-success)',
                  boxShadow: '0 0 5px var(--ds-success)',
                }}
              />
              Open to Work
            </span>
          </div>
        </motion.div>
      </div>

      {/* Stat grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--ds-space-4)',
          width: '100%',
        }}
        className="profile-stat-grid"
      >
        {HEADLINE_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'var(--ds-space-4)',
              background: 'var(--ds-surface)',
              border: '1px solid var(--ds-border)',
              borderRadius: 'var(--ds-radius-md)',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                display: 'block',
                fontSize: '32px',
                fontWeight: 700,
                fontFamily: 'var(--ds-font-display)',
                color: '#6366f1',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              {s.value}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--ds-text-dim)',
                fontFamily: 'var(--ds-font-mono)',
                letterSpacing: '0.06em',
                marginTop: '4px',
              }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@media(max-width:640px){.profile-stat-grid{grid-template-columns:repeat(2,1fr)!important;}}`,
        }}
      />
    </section>
  )
}

// â”€â”€â”€ Section 2: Skills summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SkillBar({ name, pct, index, triggered }: { name: string; pct: number; index: number; triggered: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ds-text)',
            fontFamily: 'var(--ds-font-body)',
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--ds-text-dim)',
            fontFamily: 'var(--ds-font-mono)',
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          background: 'var(--ds-border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #6366f1, #818cf8)',
            width: triggered ? `${pct}%` : '0%',
            transition: `width 600ms ease-out ${index * 60}ms`,
          }}
        />
      </div>
    </div>
  )
}

function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) { setTriggered(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} aria-labelledby="skills-heading">
      <h2
        id="skills-heading"
        style={{
          margin: '0 0 var(--ds-space-6)',
          fontSize: '20px',
          fontWeight: 700,
          fontFamily: 'var(--ds-font-display)',
          color: 'var(--ds-text-soft)',
          letterSpacing: '-0.01em',
        }}
      >
        Core Technologies
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--ds-space-4) var(--ds-space-10)',
        }}
        className="skills-grid"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          {SKILLS_LEFT.map((s, i) => (
            <SkillBar key={s.name} name={s.name} pct={s.pct} index={i} triggered={triggered} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          {SKILLS_RIGHT.map((s, i) => (
            <SkillBar key={s.name} name={s.name} pct={s.pct} index={SKILLS_LEFT.length + i} triggered={triggered} />
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@media(max-width:640px){.skills-grid{grid-template-columns:1fr!important;}}`,
        }}
      />
    </section>
  )
}

// â”€â”€â”€ Section 3: Featured projects (compact) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TechChip({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 'var(--ds-radius-pill)',
        background: 'rgba(99,102,241,0.1)',
        border: '1px solid rgba(99,102,241,0.2)',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: '#818cf8',
        fontFamily: 'var(--ds-font-mono)',
      }}
    >
      {label}
    </span>
  )
}

function ProjectsSection() {
  return (
    <section aria-labelledby="projects-heading">
      <h2
        id="projects-heading"
        style={{
          margin: '0 0 var(--ds-space-5)',
          fontSize: '20px',
          fontWeight: 700,
          fontFamily: 'var(--ds-font-display)',
          color: 'var(--ds-text-soft)',
          letterSpacing: '-0.01em',
        }}
      >
        Featured Projects
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FEATURED_PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.38, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--ds-space-4)',
              padding: 'var(--ds-space-4) 0',
              borderBottom: i < FEATURED_PROJECTS.length - 1 ? '1px solid var(--ds-border)' : 'none',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '200px' }}>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--ds-text-soft)',
                  fontFamily: 'var(--ds-font-body)',
                }}
              >
                {project.title}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--ds-text-muted)',
                  fontFamily: 'var(--ds-font-body)',
                  lineHeight: 1.5,
                }}
              >
                {project.desc}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
                {project.tech.map(t => <TechChip key={t} label={t} />)}
              </div>
            </div>

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                color: 'var(--ds-primary)',
                fontFamily: 'var(--ds-font-mono)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                alignSelf: 'flex-start',
                paddingTop: '2px',
              }}
            >
              View on GitHub
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// â”€â”€â”€ Section 4: CTA row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CTASection() {
  const btns = [
    { label: 'Download Resume', href: '/resume.pdf', download: true, primary: true },
    { label: 'View All Projects', href: '/projects', download: false, primary: false },
    { label: 'Call', href: `tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}`, download: false, primary: false },
    { label: 'Get in Touch', href: '/contact', download: false, primary: false },
  ]

  return (
    <section
      aria-label="Contact and resume links"
      style={{
        display: 'flex',
        gap: 'var(--ds-space-3)',
        flexWrap: 'wrap',
        paddingTop: 'var(--ds-space-2)',
      }}
    >
      {btns.map(btn => (
        btn.download || btn.href.startsWith('tel:') || btn.href.startsWith('mailto:') ? (
          <a
            key={btn.label}
            href={btn.href}
            download={btn.download ? true : undefined}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--ds-space-3) var(--ds-space-6)',
              borderRadius: 'var(--ds-radius-sm)',
              background: btn.primary ? '#6366f1' : 'transparent',
              border: btn.primary ? 'none' : '1px solid var(--ds-border-strong)',
              color: btn.primary ? '#fff' : 'var(--ds-text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              fontFamily: 'var(--ds-font-mono)',
              textDecoration: 'none',
              boxShadow: btn.primary ? '0 4px 18px rgba(99,102,241,0.22)' : 'none',
              transition: 'background 0.18s, transform 0.12s',
              whiteSpace: 'nowrap',
              flex: '1 1 auto',
              maxWidth: '220px',
            }}
          >
            {btn.label}
          </a>
        ) : (
          <Link
            key={btn.label}
            href={btn.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--ds-space-3) var(--ds-space-6)',
              borderRadius: 'var(--ds-radius-sm)',
              background: 'transparent',
              border: '1px solid var(--ds-border-strong)',
              color: 'var(--ds-text-muted)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              fontFamily: 'var(--ds-font-mono)',
              textDecoration: 'none',
              transition: 'background 0.18s, border-color 0.18s',
              whiteSpace: 'nowrap',
              flex: '1 1 auto',
              maxWidth: '220px',
            }}
          >
            {btn.label}
          </Link>
        )
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: `@media(max-width:600px){[aria-label="Contact and resume links"] a{max-width:100%!important;flex:1 1 100%!important;}}`,
        }}
      />
    </section>
  )
}

// â”€â”€â”€ Divider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Divider() {
  return <div style={{ height: '1px', background: 'var(--ds-border)', margin: 'var(--ds-space-10) 0' }} />
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ProfilePage(): JSX.Element {
  usePageView()

  return (
    <main
      style={{
        paddingTop: '80px',
        maxWidth: 'var(--ds-container)',
        margin: '0 auto',
        padding: '80px var(--ds-gutter) var(--ds-space-20)',
      }}
    >
      <ProfileHeader />
      <Divider />
      <SkillsSection />
      <Divider />
      <ProjectsSection />
      <Divider />
      <CTASection />
    </main>
  )
}
