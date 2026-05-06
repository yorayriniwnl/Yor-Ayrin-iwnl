import Link from 'next/link'
import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import PrintResumeButton from '../../components/PrintResumeButton'
import ResumePrintStyles from '../../components/ResumePrintStyles'
import ResumeTools from '../../components/ResumeTools'
import {
  EDUCATION_ENTRIES,
  EXPERIENCE_ENTRIES,
  PROJECT_ENTRIES,
  RESUME_ACHIEVEMENTS,
  RESUME_CERTIFICATIONS,
  RESUME_PROFILE,
  RESUME_SKILL_GROUPS,
  type ResumeEntry,
} from '../../lib/resume'

export const metadata: Metadata = {
  title: 'Ayush Roy | Resume',
  description: 'Internship-ready full-stack resume with project evidence and recruiter-focused structure.',
}

type ResumeSectionProps = {
  title: string
  items: ResumeEntry[]
}

type ResumePageThemeStyle = CSSProperties & {
  '--resume-card-bg': string
  '--resume-card-border': string
  '--resume-divider': string
  '--resume-heading': string
  '--resume-subheading': string
  '--resume-body': string
  '--resume-muted': string
  '--resume-panel': string
  '--resume-shadow': string
  '--ds-text': string
  '--ds-text-soft': string
  '--ds-text-muted': string
  '--ds-border': string
  '--ds-primary': string
  '--ds-primary-strong': string
}

function ResumeSection({ title, items }: ResumeSectionProps): JSX.Element {
  return (
    <section>
      <h2
        style={{
          color: 'var(--resume-muted)',
          fontFamily: 'var(--ds-font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h2>

      <div className="mt-5 space-y-6">
        {items.map((item) => (
          <article key={item.title}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3
                style={{
                  color: 'var(--resume-subheading)',
                  fontFamily: 'var(--ds-font-display)',
                  fontSize: '1.3rem',
                  fontWeight: 700,
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: 'var(--resume-muted)', fontSize: '0.88rem' }}>{item.meta}</p>
            </div>
            <p className="mt-3 text-sm leading-7" style={{ color: 'var(--resume-body)' }}>
              {item.summary}
            </p>
            {item.bullets?.length ? (
              <ul className="mt-3 space-y-2 text-sm leading-7" style={{ color: 'var(--resume-body)' }}>
                {item.bullets.map((bullet) => (
                  <li key={bullet}>- {bullet}</li>
                ))}
              </ul>
            ) : null}
            {item.linkHref && item.linkLabel ? (
              <a
                className="mt-3 inline-flex text-sm font-semibold"
                href={item.linkHref}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--ds-primary-strong)' }}
              >
                {item.linkLabel}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

const INTERNSHIP_HIGHLIGHTS = [
  '5 independent projects shipped end-to-end across frontend, backend, API, database, and DevOps layers.',
  '24 Vitest tests across 5 test suites covering core portfolio functionality.',
  '3 hackathon prototypes delivered end-to-end under tight deadlines.',
]

const resumePageTheme: ResumePageThemeStyle = {
  '--resume-card-bg': 'linear-gradient(180deg, rgba(18, 16, 11, 0.98), rgba(10, 9, 6, 0.98))',
  '--resume-card-border': 'rgba(201, 168, 76, 0.18)',
  '--resume-divider': 'rgba(201, 168, 76, 0.16)',
  '--resume-heading': '#f4ead7',
  '--resume-subheading': '#e7d9c3',
  '--resume-body': '#d8ccb7',
  '--resume-muted': '#a39171',
  '--resume-panel': 'linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02))',
  '--resume-shadow': '0 34px 84px rgba(0, 0, 0, 0.46)',
  '--ds-text': '#ddd3c1',
  '--ds-text-soft': '#f4ead7',
  '--ds-text-muted': '#a39171',
  '--ds-border': 'rgba(201, 168, 76, 0.18)',
  '--ds-primary': '#c9a84c',
  '--ds-primary-strong': '#f0c96d',
  background:
    'radial-gradient(circle at top right, rgba(201, 168, 76, 0.16), transparent 28%), radial-gradient(circle at bottom left, rgba(192, 74, 58, 0.12), transparent 30%)',
  color: 'var(--ds-text)',
  paddingTop: 'calc(var(--ds-header-height) + 1rem)',
}

export default function ResumePage(): JSX.Element {
  return (
    <>
      <ResumePrintStyles />

      <section className="ds-section" data-resume-shell style={resumePageTheme}>
        <div className="ds-container">
          <div
            data-resume-actions
            className="mb-6 flex flex-col gap-3 print:hidden"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Link href="/projects" className="ds-button ds-button--ghost ds-button--sm">
                Back to projects
              </Link>

              <div className="flex w-full flex-wrap gap-3 md:w-auto">
                <a href="/resume.pdf" download className="ds-button ds-button--secondary ds-button--sm">
                  Download PDF
                </a>
                <a href="/Ayush_Roy_CV.docx" download className="ds-button ds-button--ghost ds-button--sm">
                  Download DOCX
                </a>
                <PrintResumeButton />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs" style={{ color: 'var(--resume-muted)' }}>
                Recruiter mode: concise scan, evidence-forward projects, and export-ready resume tools.
              </p>
              <ResumeTools showPrint={false} />
            </div>
          </div>

          <article
            data-resume-page
            className="print:rounded-none print:border-0 print:p-0 print:shadow-none"
            style={{
              border: '1px solid var(--resume-card-border)',
              borderRadius: '2rem',
              background: 'var(--resume-card-bg)',
              color: 'var(--ds-text)',
              padding: '2rem',
              boxShadow: 'var(--resume-shadow)',
              backdropFilter: 'blur(18px)',
            }}
          >
            <header style={{ borderBottom: '1px solid var(--resume-divider)', paddingBottom: '2rem' }}>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p
                    style={{
                      color: 'var(--resume-muted)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {RESUME_PROFILE.role}
                  </p>

                  <h1
                    style={{
                      marginTop: '0.9rem',
                      color: 'var(--resume-heading)',
                      fontFamily: 'var(--ds-font-display)',
                      fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {RESUME_PROFILE.name}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7" style={{ color: 'var(--resume-body)' }}>
                    {RESUME_PROFILE.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="ds-badge ds-tag--accent">Open to Remote</span>
                    <span className="ds-badge">Full-Stack</span>
                    <span className="ds-badge">Software Engineering Intern</span>
                    <span className="ds-badge">Realtime Systems</span>
                  </div>
                </div>

                <div className="grid gap-2 text-sm" style={{ color: 'var(--resume-body)', wordBreak: 'break-word' }}>
                  <a href={`mailto:${RESUME_PROFILE.email}`}>{RESUME_PROFILE.email}</a>
                  <a href={`tel:${RESUME_PROFILE.phone.replace(/\s+/g, '')}`}>
                    {RESUME_PROFILE.phone}
                  </a>
                  <span>{RESUME_PROFILE.location}</span>
                  <a href={RESUME_PROFILE.websiteHref} target="_blank" rel="noreferrer">
                    {RESUME_PROFILE.websiteLabel}
                  </a>
                  <a href={RESUME_PROFILE.githubHref} target="_blank" rel="noreferrer">
                    {RESUME_PROFILE.githubLabel}
                  </a>
                  <a href={RESUME_PROFILE.linkedinHref} target="_blank" rel="noreferrer">
                    {RESUME_PROFILE.linkedinLabel}
                  </a>
                  <a href={RESUME_PROFILE.devpostHref} target="_blank" rel="noreferrer">
                    {RESUME_PROFILE.devpostLabel}
                  </a>
                </div>
              </div>
            </header>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
              <div className="space-y-10">
                <section>
                  <h2
                    style={{
                      color: 'var(--resume-muted)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Internship Snapshot
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <article style={{ border: '1px solid var(--resume-divider)', borderRadius: '0.9rem', padding: '0.9rem', background: 'var(--resume-panel)' }}>
                      <p style={{ color: 'var(--resume-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Public projects
                      </p>
                      <p style={{ color: 'var(--resume-heading)', fontSize: '1.4rem', fontWeight: 700 }}>5</p>
                    </article>
                    <article style={{ border: '1px solid var(--resume-divider)', borderRadius: '0.9rem', padding: '0.9rem', background: 'var(--resume-panel)' }}>
                      <p style={{ color: 'var(--resume-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Test coverage
                      </p>
                      <p style={{ color: 'var(--resume-heading)', fontSize: '1.4rem', fontWeight: 700 }}>
                        24 tests
                      </p>
                    </article>
                    <article style={{ border: '1px solid var(--resume-divider)', borderRadius: '0.9rem', padding: '0.9rem', background: 'var(--resume-panel)' }}>
                      <p style={{ color: 'var(--resume-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Hackathons
                      </p>
                      <p style={{ color: 'var(--resume-heading)', fontSize: '1.4rem', fontWeight: 700 }}>3 shipped</p>
                    </article>
                  </div>

                  <ul className="mt-5 space-y-2 text-sm leading-7" style={{ color: 'var(--resume-body)' }}>
                    {INTERNSHIP_HIGHLIGHTS.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </section>

                <ResumeSection title="Experience" items={EXPERIENCE_ENTRIES} />

                <section>
                  <h2
                    style={{
                      color: 'var(--resume-muted)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Selected Projects
                  </h2>

                  <div className="mt-5 space-y-6">
                    {PROJECT_ENTRIES.map((project) => (
                      <article key={project.title}>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                          <h3
                            style={{
                              color: 'var(--resume-subheading)',
                              fontFamily: 'var(--ds-font-display)',
                              fontSize: '1.2rem',
                              fontWeight: 700,
                            }}
                          >
                            {project.title}
                          </h3>
                          <p style={{ color: 'var(--resume-muted)', fontSize: '0.85rem' }}>
                            {project.meta}
                          </p>
                        </div>
                        <p className="mt-2 text-sm leading-7" style={{ color: 'var(--resume-body)' }}>
                          {project.summary}
                        </p>
                        {project.bullets?.length ? (
                          <ul className="mt-3 space-y-2 text-sm leading-7" style={{ color: 'var(--resume-body)' }}>
                            {project.bullets.map((bullet) => (
                              <li key={bullet}>- {bullet}</li>
                            ))}
                          </ul>
                        ) : null}
                        {project.linkHref && project.linkLabel ? (
                          <a
                            className="mt-3 inline-flex text-sm font-semibold"
                            href={project.linkHref}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--ds-primary-strong)' }}
                          >
                            {project.linkLabel}
                          </a>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>

                <ResumeSection title="Education" items={EDUCATION_ENTRIES} />
              </div>

              <aside className="space-y-8">
                <section>
                  <h2
                    style={{
                      color: 'var(--resume-muted)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Skills
                  </h2>

                  <div className="mt-5 space-y-4">
                    {RESUME_SKILL_GROUPS.map((group) => (
                      <div key={group.title}>
                        <h3
                          style={{
                            color: 'var(--resume-subheading)',
                            fontFamily: 'var(--ds-font-display)',
                            fontSize: '1rem',
                            fontWeight: 700,
                          }}
                        >
                          {group.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--resume-body)' }}>
                          {group.skills.join(', ')}
                        </p>
                      </div>
                    ))}

                  </div>
                </section>

                <section>
                  <h2
                    style={{
                      color: 'var(--resume-muted)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                    }}
                  >
                    GitHub Context
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-6" style={{ color: 'var(--resume-body)' }}>
                    <p>
                      Active public GitHub profile with portfolio, realtime systems, ML/CV, and product-focused full-stack builds.
                    </p>
                    <a href={RESUME_PROFILE.githubHref} target="_blank" rel="noreferrer" style={{ color: 'var(--ds-primary-strong)', fontWeight: 700 }}>
                      {RESUME_PROFILE.githubLabel}
                    </a>
                    <a
                      href={RESUME_PROFILE.devpostHref}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--ds-primary-strong)', fontWeight: 700, display: 'block' }}
                    >
                      {RESUME_PROFILE.devpostLabel}
                    </a>
                  </div>
                </section>

                <section>
                  <h2
                    style={{
                      color: 'var(--resume-muted)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Achievements
                  </h2>

                  <ul className="mt-5 space-y-3 text-sm leading-6" style={{ color: 'var(--resume-body)' }}>
                    {RESUME_ACHIEVEMENTS.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </section>

                <ResumeSection title="Certifications" items={RESUME_CERTIFICATIONS} />
              </aside>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
