"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SITE_PROFILE, SKILL_CATEGORIES } from '../lib/data'
import QuickContactModal from './QuickContactModal'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface FeaturedProject {
  id: string
  title: string
  description: string
  tech: string[]
  category: string
  href: string
  github: string
}

type DashboardSkill = (typeof SKILL_CATEGORIES)[keyof typeof SKILL_CATEGORIES][number]

const FEATURED: FeaturedProject[] = [
  {
    id: 'zenith',
    title: 'Yor Zenith',
    description: 'Solar planning platform for rooftop feasibility analysis, energy generation estimation, and React/Three.js visualization dashboards.',
    tech: ['Python', 'React', 'Three.js', 'TypeScript'],
    category: 'Systems',
    href: '/projects/zenith',
    github: 'https://github.com/yorayriniwnl/Yor-Zenith',
  },
  {
    id: 'ai-detector',
    title: 'Yor AI vs Real Image',
    description: 'Image classifier using OpenCV texture features, LBP/GLCM analysis, Scikit-Learn SVM training, and Streamlit review.',
    tech: ['Python', 'OpenCV', 'Scikit-Learn', 'Streamlit'],
    category: 'AI / ML',
    href: '/projects/ai-detector',
    github: 'https://github.com/yorayriniwnl/Yor-Ai-vs-real-image',
  },
  {
    id: 'mentor-mentee',
    title: 'Mentor-Mentee',
    description: 'Python mentorship coordination system with Flask API support, matching logic, SQLite persistence, and a Tkinter desktop UI.',
    tech: ['Python', 'Flask', 'Tkinter', 'SQLite'],
    category: 'Python',
    href: '/projects/mentor-mentee',
    github: 'https://github.com/yorayriniwnl/mentor-mentee-system',
  },
]

const TOP_SKILLS = Array.from(
  Object.values(SKILL_CATEGORIES)
    .flat()
    .sort((a, b) => b.value - a.value)
    .reduce((map, skill) => {
      if (!map.has(skill.name)) {
        map.set(skill.name, skill)
      }
      return map
    }, new Map<string, DashboardSkill>()),
  ([, skill]) => skill,
).slice(0, 8)

// ─── Micro components ─────────────────────────────────────────────────────────

function SkillBar({ name, value }: { name: string; value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
      <span
        style={{
          width: '120px',
          flexShrink: 0,
          fontSize: '12px',
          fontFamily: 'var(--ds-font-mono)',
          color: 'var(--ds-text-muted)',
          letterSpacing: '0.03em',
        }}
      >
        {name}
      </span>
      <div
        style={{
          flex: 1,
          height: '4px',
          borderRadius: 'var(--ds-radius-pill)',
          background: 'var(--ds-border)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{
            height: '100%',
            borderRadius: 'var(--ds-radius-pill)',
            background: 'linear-gradient(90deg, var(--ds-primary) 0%, var(--ds-primary-strong) 100%)',
          }}
        />
      </div>
      <span
        style={{
          width: '30px',
          textAlign: 'right',
          fontSize: '11px',
          fontFamily: 'var(--ds-font-mono)',
          color: 'var(--ds-text-dim)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function TechChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 9px',
        borderRadius: 'var(--ds-radius-pill)',
        background: 'var(--ds-primary-soft)',
        border: '1px solid var(--ds-border-strong)',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        color: 'var(--ds-primary-strong)',
        fontFamily: 'var(--ds-font-mono)',
      }}
    >
      {label}
    </span>
  )
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -3 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        padding: 'var(--ds-space-5)',
        background: hovered ? 'var(--ds-surface-strong)' : 'var(--ds-surface)',
        border: `1px solid ${hovered ? 'var(--ds-border-strong)' : 'var(--ds-border)'}`,
        borderRadius: 'var(--ds-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-space-3)',
        transition: 'background 0.2s, border-color 0.2s',
        boxShadow: hovered ? 'var(--ds-shadow-md)' : 'var(--ds-shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--ds-space-3)' }}>
        <div>
          <span
            style={{
              display: 'block',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ds-primary)',
              fontFamily: 'var(--ds-font-mono)',
              marginBottom: 'var(--ds-space-1)',
            }}
          >
            {project.category}
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'var(--ds-font-display)',
              color: 'var(--ds-text-soft)',
              letterSpacing: '-0.01em',
            }}
          >
            {project.title}
          </h3>
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} on GitHub`}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: 'var(--ds-radius-sm)',
            border: '1px solid var(--ds-border)',
            background: 'var(--ds-bg-raised)',
            color: 'var(--ds-text-dim)',
            transition: 'color 0.18s, border-color 0.18s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: '13px',
          lineHeight: 1.65,
          color: 'var(--ds-text-muted)',
          fontFamily: 'var(--ds-font-body)',
          flexGrow: 1,
        }}
      >
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {project.tech.map(t => <TechChip key={t} label={t} />)}
      </div>

      <Link
        href={project.href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.07em',
          color: 'var(--ds-primary)',
          fontFamily: 'var(--ds-font-mono)',
          textDecoration: 'none',
          paddingTop: 'var(--ds-space-1)',
          transition: 'color 0.18s',
        }}
      >
        Case study →
      </Link>
    </motion.article>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'var(--ds-border)',
        margin: 'var(--ds-space-8) 0',
      }}
    />
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function RecruiterDashboard(): JSX.Element {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: 'var(--ds-space-12) var(--ds-space-8)',
          fontFamily: 'var(--ds-font-body)',
        }}
      >
        {/* ── Identity block ───────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--ds-space-6)',
            flexWrap: 'wrap',
            marginBottom: 'var(--ds-space-8)',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--ds-border-strong)',
              boxShadow: '0 0 0 4px var(--ds-primary-soft), var(--ds-shadow-sm)',
              flexShrink: 0,
              background: 'var(--ds-bg-raised)',
            }}
          >
            <Image
              src={SITE_PROFILE.avatarSrc}
              alt={SITE_PROFILE.name}
              fill
              sizes="80px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Name + role + status */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)', flexWrap: 'wrap', marginBottom: 'var(--ds-space-2)' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(22px, 3.5vw, 30px)',
                  fontWeight: 700,
                  fontFamily: 'var(--ds-font-display)',
                  color: 'var(--ds-text-soft)',
                  letterSpacing: '-0.02em',
                }}
              >
                {SITE_PROFILE.name}
              </h1>
              {/* Open to work badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: 'var(--ds-radius-pill)',
                  background: 'rgba(122, 154, 122, 0.12)',
                  border: '1px solid rgba(122, 154, 122, 0.3)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ds-success)',
                  fontFamily: 'var(--ds-font-mono)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--ds-success)',
                    boxShadow: '0 0 6px var(--ds-success)',
                    animation: 'rd-pulse 2s ease-in-out infinite',
                  }}
                  aria-hidden
                />
                Open to work
              </span>
            </div>

            <p
              style={{
                margin: '0 0 var(--ds-space-3)',
                fontSize: '14px',
                color: 'var(--ds-text-muted)',
                fontFamily: 'var(--ds-font-mono)',
                letterSpacing: '0.04em',
              }}
            >
              {SITE_PROFILE.role}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: 'var(--ds-text-dim)',
                fontFamily: 'var(--ds-font-body)',
                maxWidth: '520px',
                lineHeight: 1.6,
              }}
            >
              {SITE_PROFILE.recruiterSummary}
            </p>
          </div>

          {/* CTA cluster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-2)', flexShrink: 0 }}>
            <button
              onClick={() => setContactOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '9px 20px',
                borderRadius: 'var(--ds-radius-sm)',
                background: 'var(--ds-primary)',
                border: 'none',
                color: 'var(--ds-bg)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--ds-font-mono)',
                cursor: 'pointer',
                boxShadow: '0 4px 18px var(--ds-primary-soft)',
                transition: 'background 0.18s, transform 0.12s',
                whiteSpace: 'nowrap',
              }}
            >
              Get in Touch
            </button>
            <a
              href="/resume.pdf"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 20px',
                borderRadius: 'var(--ds-radius-sm)',
                background: 'transparent',
                border: '1px solid var(--ds-border-strong)',
                color: 'var(--ds-text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                fontFamily: 'var(--ds-font-mono)',
                textDecoration: 'none',
                transition: 'border-color 0.18s, color 0.18s',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download CV
            </a>
          </div>
        </motion.header>

        <Divider />

        {/* ── Featured projects ─────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          aria-labelledby="rd-projects-heading"
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--ds-space-5)' }}>
            <div>
              <h2
                id="rd-projects-heading"
                style={{
                  margin: '0 0 4px',
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: 'var(--ds-font-display)',
                  color: 'var(--ds-text-soft)',
                  letterSpacing: '-0.01em',
                }}
              >
                Featured Projects
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--ds-text-dim)',
                  fontFamily: 'var(--ds-font-mono)',
                }}
              >
                Flagship work — click any card for the full case study
              </p>
            </div>
            <Link
              href="/projects"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'var(--ds-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--ds-font-mono)',
                whiteSpace: 'nowrap',
              }}
            >
              All projects →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 'var(--ds-space-4)',
            }}
          >
            {FEATURED.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Divider />

        {/* ── Skills summary ────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          aria-labelledby="rd-skills-heading"
          style={{ marginBottom: 'var(--ds-space-8)' }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--ds-space-5)' }}>
            <div>
              <h2
                id="rd-skills-heading"
                style={{
                  margin: '0 0 4px',
                  fontSize: '18px',
                  fontWeight: 700,
                  fontFamily: 'var(--ds-font-display)',
                  color: 'var(--ds-text-soft)',
                  letterSpacing: '-0.01em',
                }}
              >
                Core Skills
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--ds-text-dim)',
                  fontFamily: 'var(--ds-font-mono)',
                }}
              >
                Top 8 by proficiency — full map at{' '}
                <Link href="/skills" style={{ color: 'var(--ds-primary)', textDecoration: 'none' }}>/skills</Link>
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--ds-space-3)',
              padding: 'var(--ds-space-5)',
              background: 'var(--ds-surface)',
              border: '1px solid var(--ds-border)',
              borderRadius: 'var(--ds-radius-md)',
            }}
          >
            {TOP_SKILLS.map(skill => (
              <SkillBar key={skill.name} name={skill.name} value={skill.value} />
            ))}
          </div>
        </motion.section>

        {/* ── Contact CTA bar ───────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: 'var(--ds-space-6)',
            background: 'var(--ds-surface)',
            border: '1px solid var(--ds-border-strong)',
            borderRadius: 'var(--ds-radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--ds-space-4)',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 3px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--ds-text-soft)',
                fontFamily: 'var(--ds-font-body)',
              }}
            >
              {SITE_PROFILE.availability}
            </p>
            <a
              href={`mailto:${SITE_PROFILE.email}`}
              style={{
                fontSize: '13px',
                color: 'var(--ds-primary)',
                fontFamily: 'var(--ds-font-mono)',
                textDecoration: 'none',
                letterSpacing: '0.03em',
              }}
            >
              {SITE_PROFILE.email}
            </a>
          </div>

          <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap' }}>
            <a
              href={SITE_PROFILE.githubHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: 'var(--ds-radius-sm)',
                border: '1px solid var(--ds-border)',
                background: 'var(--ds-bg-raised)',
                color: 'var(--ds-text-muted)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                fontFamily: 'var(--ds-font-mono)',
                textDecoration: 'none',
                transition: 'border-color 0.18s, color 0.18s',
              }}
            >
              GitHub
            </a>
            <a
              href={SITE_PROFILE.linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                borderRadius: 'var(--ds-radius-sm)',
                border: '1px solid var(--ds-border)',
                background: 'var(--ds-bg-raised)',
                color: 'var(--ds-text-muted)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                fontFamily: 'var(--ds-font-mono)',
                textDecoration: 'none',
                transition: 'border-color 0.18s, color 0.18s',
              }}
            >
              LinkedIn
            </a>
            <button
              onClick={() => setContactOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 16px',
                borderRadius: 'var(--ds-radius-sm)',
                background: 'var(--ds-primary)',
                border: 'none',
                color: 'var(--ds-bg)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--ds-font-mono)',
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
            >
              Contact
            </button>
          </div>
        </motion.footer>
      </div>

      {/* Pulse keyframe */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes rd-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }`,
        }}
      />

      <QuickContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  )
}
