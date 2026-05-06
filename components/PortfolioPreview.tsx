import React from 'react'
import type { PortfolioDocument } from '../lib/portfolio'

export default function PortfolioPreview({
  portfolio,
}: {
  portfolio: PortfolioDocument
}): JSX.Element {
  const profile = portfolio.profile

  return (
    <div className="ds-stack">
      <div className="ds-section-intro" style={{ marginBottom: 0 }}>
        <span className="ds-eyebrow">Generated Preview</span>
        <h2 className="ds-subheading">{profile?.name || 'Your name'}</h2>
        <p className="ds-text">
          {profile?.role || 'Role not provided'}
          {profile?.email ? ` / ${profile.email}` : ''}
        </p>
        {profile?.summary ? <p className="ds-text">{profile.summary}</p> : null}
      </div>

      <div className="ds-grid ds-grid--cols-1 ds-grid--gap-md">
        {portfolio.projects.map((project) => (
          <article key={project.id || project.url} className="ds-card">
            <div className="ds-stack ds-stack--tight">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="ds-subheading">{project.title}</h3>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-button ds-button--secondary ds-button--sm"
                >
                  Visit
                </a>
              </div>

              <p className="ds-text">{project.description}</p>

              {project.tech?.length ? (
                <div className="ds-chip-row">
                  {project.tech.map((item) => (
                    <span key={item} className="ds-tag">
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              {project.highlights?.length ? (
                <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--ds-text-muted)' }}>
                  {project.highlights.map((highlight, index) => (
                    <li key={`${project.id || project.url}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
