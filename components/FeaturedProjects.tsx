import React from 'react'
import Link from 'next/link'
import { PROJECTS as ALL_PROJECTS } from '../lib/projects'
import Card from './ui/Card'
import Grid from './ui/Grid'
import { ButtonLink } from './ui/Button'
import { BodyText, Eyebrow, Heading, Subheading } from './ui/Typography'

function featuredProjects() {
  return ALL_PROJECTS.slice()
    .sort((a, b) => {
      const aFlag = a.featured || String(a.id).toLowerCase() === 'zenith' ? 1 : 0
      const bFlag = b.featured || String(b.id).toLowerCase() === 'zenith' ? 1 : 0
      return bFlag - aFlag
    })
    .slice(0, 3)
}

export default function FeaturedProjects(): JSX.Element {
  const projects = featuredProjects()

  return (
    <section id="featured-projects" className="ds-section ds-section--soft">
      <div className="ds-container">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Eyebrow>Featured Work</Eyebrow>
            <Heading>
              Selected systems and products,
              <br />
              presented in one <em>shared language.</em>
            </Heading>
          </div>

          <ButtonLink href="/#projects" variant="ghost" size="sm">
            See all projects
          </ButtonLink>
        </div>

        <div className="mt-12">
          <Grid cols={3} gap="md">
            {projects.map((project) => (
              <Card key={project.id} as="article" interactive className="h-full">
                <div className="ds-stack ds-stack--tight h-full">
                  {project.badge ? (
                    <span className="ds-badge ds-tag--accent">{project.badge}</span>
                  ) : null}

                  <Subheading>{project.title}</Subheading>
                  <BodyText>{project.shortDescription}</BodyText>

                  <div className="ds-chip-row">
                    {project.tech.slice(0, 3).map((item) => (
                      <span key={item} className="ds-tag">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="ds-button ds-button--secondary ds-button--sm"
                    >
                      Case study
                    </Link>

                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ds-shell-link"
                      >
                        GitHub
                      </a>
                    ) : (
                      <span className="ds-text ds-text--small">Private build</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}
