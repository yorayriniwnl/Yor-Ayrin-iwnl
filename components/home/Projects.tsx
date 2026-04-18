'use client'

import { HOME_PROJECTS, PROJECT_BADGE_CLASS_MAP } from '../../data/home'
import { useReveal } from './hooks/useReveal'

/**
 * Projects
 *
 * Masonry-style project grid with scroll-reveal per card.
 * Needs 'use client' for useReveal (IntersectionObserver).
 */
export default function Projects() {
  const { setRef, revealStyle } = useReveal()

  return (
    <section className="projects" id="projects">
      <div className="section-wrap">
        <div className="projects-header">
          <div>
            <div className="section-label">Portfolio</div>
            <h2 className="projects-title">
              Verified <em>Projects</em>
            </h2>
          </div>
          <a
            href="https://github.com/yorayriniwnl"
            className="view-all"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>

        <div className="projects-grid">
          {HOME_PROJECTS.map((project, index) => (
            <a
              key={project.title}
              ref={setRef(index)}
              data-reveal-key={`project-${index}`}
              style={revealStyle(`project-${index}`)}
              className={`project-card ${project.featured ? 'featured' : ''}`}
              href={project.github ?? '#'}
              target="_blank"
              rel="noreferrer"
            >
              <span
                className={`proj-badge ${
                  PROJECT_BADGE_CLASS_MAP[project.category] ?? 'badge-web'
                }`}
              >
                {project.badge ?? project.category}
              </span>
              <h3 className="proj-title">{project.title}</h3>
              <p className="proj-excerpt">{project.shortDescription}</p>
              <div className="proj-tech">
                {project.tech.map((item) => (
                  <span className="tech-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="proj-meta">
                <span className="proj-date">{project.date ?? 'Apr 2026'}</span>
                <span className="proj-link">github.com</span>
              </div>
              <span className="proj-number">0{index + 1}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
