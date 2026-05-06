import React from 'react'
import { ORDERED_PROJECTS } from '../../lib/data'
import { ButtonLink } from '../../components/ui/Button'
import PageHero from '../../components/sections/PageHero'
import ProjectCollection from '../../components/sections/ProjectCollection'

export default function ProjectsPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={
          <>
            Case studies,
            <br />
            imports, and <em>evidence.</em>
          </>
        }
        description="This page separates curated portfolio work from public GitHub imports while keeping both in the same visual language."
        actions={
          <>
            <ButtonLink href="/stats" variant="secondary" size="lg">
              View project stats
            </ButtonLink>
            <ButtonLink href="/resume" variant="ghost" size="lg">
              Open resume
            </ButtonLink>
          </>
        }
      />
      <ProjectCollection
        title="Full project collection"
        description="Curated work sits first, while public GitHub imports stay visible as supplemental proof rather than replacing written case studies."
        projects={ORDERED_PROJECTS}
      />
    </>
  )
}
