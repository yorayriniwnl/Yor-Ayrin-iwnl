import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import KnowledgeGraph3D from '../../components/KnowledgeGraph3D'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Skills | Ayush Roy',
  description:
    'Internship-ready full-stack skill map across frontend, backend, ML/CV, and developer tooling.',
}

function KnowledgeGraphFallback(): JSX.Element {
  return (
    <div
      style={{
        width: '100%',
        height: '520px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--ds-radius-lg)',
        background: 'rgba(10,9,6,0.6)',
        border: '1px solid rgba(42,37,32,0.95)',
        color: 'var(--ds-text-dim)',
        fontFamily: 'var(--ds-font-mono)',
        fontSize: '12px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}
      aria-busy="true"
    >
      Loading knowledge graph…
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface SkillPill {
  name: string
  id: string
}

interface SkillCategory {
  label: string
  accent: string
  skills: SkillPill[]
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    label: 'Frontend',
    accent: '#6366f1',
    skills: [
      { id: 'react',      name: 'React'      },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'html-css',   name: 'HTML / CSS' },
      { id: 'tailwind',   name: 'TailwindCSS' },
    ],
  },
  {
    label: 'ML / CV',
    accent: '#06b6d4',
    skills: [
      { id: 'python',       name: 'Python' },
      { id: 'opencv',       name: 'OpenCV' },
      { id: 'scikit-learn', name: 'Scikit-Learn' },
      { id: 'streamlit',    name: 'Streamlit' },
    ],
  },
  {
    label: '3D / Visualization',
    accent: '#f59e0b',
    skills: [
      { id: 'threejs', name: 'Three.js' },
      { id: 'react-3d', name: 'React dashboards' },
      { id: 'solar-ui', name: 'Solar planning UI' },
    ],
  },
  {
    label: 'Tools / Basics',
    accent: '#34d399',
    skills: [
      { id: 'git',  name: 'Git / GitHub' },
      { id: 'vscode', name: 'VS Code' },
      { id: 'sql',  name: 'SQL (basic)' },
      { id: 'java-c', name: 'Java / C (basic)' },
    ],
  },
]

const LEGEND_NODES = [
  { type: 'skill',   color: '#6366f1', label: 'Skill',   desc: 'Technical tool or language' },
  { type: 'project', color: '#06b6d4', label: 'Project', desc: 'Shipped or showcased work'  },
  { type: 'concept', color: '#f59e0b', label: 'Concept', desc: 'Domain or paradigm'          },
] as const

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <header style={{ marginBottom: 'var(--ds-space-12)' }}>
      {/* Eyebrow */}
      <p
        style={{
          margin: '0 0 var(--ds-space-4)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--ds-primary)',
          fontFamily: 'var(--ds-font-mono)',
        }}
      >
        Skills
      </p>

      {/* Title */}
      <h1
        style={{
          margin: '0 0 var(--ds-space-5)',
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 700,
          fontFamily: 'var(--ds-font-display)',
          color: 'var(--ds-text-soft)',
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
        }}
      >
        Skills &amp;{' '}
        <em style={{ fontStyle: 'italic', color: 'var(--ds-primary-strong)' }}>
          Knowledge
        </em>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          margin: 0,
          maxWidth: '520px',
          fontSize: '16px',
          lineHeight: 1.65,
          color: 'var(--ds-text-muted)',
          fontFamily: 'var(--ds-font-body)',
        }}
      >
        An interactive map of tools, projects, and concepts — drag to rotate,
        click any node to see what it connects to.
      </p>
    </header>
  )
}

function GraphLegend() {
  return (
    <div
      role="list"
      aria-label="Node type legend"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--ds-space-6)',
        marginTop: 'var(--ds-space-6)',
        padding: 'var(--ds-space-5) var(--ds-space-6)',
        background: 'rgba(16,13,8,0.7)',
        border: '1px solid var(--ds-border)',
        borderRadius: 'var(--ds-radius-md)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {LEGEND_NODES.map(item => (
        <div
          key={item.type}
          role="listitem"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Dot */}
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: item.color,
              boxShadow: `0 0 8px ${item.color}88`,
            }}
          />
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--ds-text)',
                fontFamily: 'var(--ds-font-body)',
                marginRight: '6px',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--ds-text-dim)',
                fontFamily: 'var(--ds-font-mono)',
              }}
            >
              {item.desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

interface SkillPillBadgeProps {
  name: string
  accent: string
}

function SkillPillBadge({ name, accent }: SkillPillBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: 'var(--ds-radius-pill)',
        background: `${accent}12`,
        border: `1px solid ${accent}30`,
        color: accent,
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        fontFamily: 'var(--ds-font-mono)',
        transition: 'background 0.18s, border-color 0.18s',
        cursor: 'default',
      }}
    >
      {name}
    </span>
  )
}

function FlatSkillsGrid() {
  return (
    <section
      aria-label="Skills by category"
      style={{ marginTop: 'var(--ds-space-14)' }}
    >
      {/* Section label */}
      <p
        style={{
          margin: '0 0 var(--ds-space-8)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--ds-text-dim)',
          fontFamily: 'var(--ds-font-mono)',
        }}
      >
        All skills
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--ds-space-6)',
        }}
      >
        {SKILL_CATEGORIES.map(cat => (
          <article
            key={cat.label}
            style={{
              padding: 'var(--ds-space-6)',
              background: 'rgba(16,13,8,0.7)',
              border: `1px solid ${cat.accent}22`,
              borderRadius: 'var(--ds-radius-md)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {/* Category header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: 'var(--ds-space-4)',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: cat.accent,
                  boxShadow: `0 0 6px ${cat.accent}`,
                  flexShrink: 0,
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: cat.accent,
                  fontFamily: 'var(--ds-font-mono)',
                }}
              >
                {cat.label}
              </h2>
            </div>

            {/* Pill badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {cat.skills.map(skill => (
                <SkillPillBadge key={skill.id} name={skill.name} accent={cat.accent} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SkillsPage(): JSX.Element {
  return (
    <main
      style={{
        maxWidth: 'var(--ds-container)',
        margin: '0 auto',
        padding:
          'calc(var(--ds-header-height) + var(--ds-section-y)) var(--ds-gutter) var(--ds-section-y)',
      }}
    >
      <PageHeader />

      {/*
        3D graph — hidden on mobile via a CSS media query applied through a
        wrapper element. We keep the import dynamic + ssr:false, so on mobile
        the chunk never executes (intersection with the display:none means
        the Canvas doesn't mount).
      */}
      <div className="graph-3d-wrapper">
        <Suspense fallback={<KnowledgeGraphFallback />}>
          <KnowledgeGraph3D />
        </Suspense>
        <GraphLegend />
      </div>

      {/* Mobile notice — visible only on small viewports */}
      <div
        className="graph-mobile-notice"
        role="note"
        aria-label="3D graph not shown on mobile"
        style={{
          display: 'none',
          padding: 'var(--ds-space-5) var(--ds-space-6)',
          borderRadius: 'var(--ds-radius-md)',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          color: 'var(--ds-text-muted)',
          fontSize: '13px',
          fontFamily: 'var(--ds-font-mono)',
          lineHeight: 1.5,
          letterSpacing: '0.02em',
          marginBottom: 'var(--ds-space-8)',
        }}
      >
        The interactive 3D knowledge graph is available on larger screens.
      </div>

      <FlatSkillsGrid />

      {/* Responsive styles injected into the document head via a style tag */}
      <style>{`
        .graph-3d-wrapper { display: block; }
        .graph-mobile-notice { display: none; }
        @media (max-width: 767px) {
          .graph-3d-wrapper { display: none; }
          .graph-mobile-notice { display: block; }
        }
      `}</style>
    </main>
  )
}
