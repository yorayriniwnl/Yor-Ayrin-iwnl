"use client"

import React from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useAdaptive } from './ui/AdaptiveProvider'
import UI from '../lib/uiConfig'
import BackButton from './BackButton'
import Card from './ui/Card'
import { ButtonLink } from './ui/Button'
import { BodyText, Eyebrow, Heading, Subheading } from './ui/Typography'
import type { Project } from '../lib/projects'

type Props = { project: Project }

export default function ProjectCase({ project }: Props): JSX.Element {
  const { reducedMotion } = useAdaptive()

  return (
    <AnimatePresence>
      <motion.main
        key={project.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={
          reducedMotion ? { duration: 0 } : { duration: UI.ANIM_MED, ease: 'easeInOut' }
        }
        className="ds-section"
      >
        <div className="ds-container">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="ds-section-intro">
            <Eyebrow>{project.badge || 'Case Study'}</Eyebrow>
            <Heading>{project.title}</Heading>
            <BodyText className="max-w-3xl">{project.shortDescription}</BodyText>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.75fr]">
            <div className="ds-stack ds-stack--loose">
              <Card as="section">
                <div className="ds-stack">
                  <Subheading>Overview</Subheading>
                  <BodyText>{project.fullDescription || project.shortDescription}</BodyText>
                </div>
              </Card>

              <GridSection title="Problem" content={project.problem} />
              <GridSection title="Solution" content={project.solution} />
              <GridSection title="Outcome" content={project.outcome} />

              {project.screenshots?.length ? (
                <div className="ds-stack">
                  <Subheading>Screenshots</Subheading>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.screenshots.map((src, index) => (
                      <figure key={`${project.id}-${index}`} className="ds-figure">
                        <Image
                          src={src}
                          alt={`${project.title} screenshot ${index + 1}`}
                          width={1200}
                          height={720}
                          className="h-56 w-full object-cover"
                        />
                      </figure>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="ds-stack ds-stack--tight lg:sticky lg:top-24 lg:self-start">
              <Card as="section">
                <div className="ds-stack ds-stack--tight">
                  <Subheading>Tech Stack</Subheading>
                  <div className="ds-chip-row">
                    {project.tech.map((item) => (
                      <span key={item} className="ds-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {project.github ? (
                <ButtonLink href={project.github} variant="primary" size="md">
                  View on GitHub
                </ButtonLink>
              ) : null}
            </aside>
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  )
}

function GridSection({
  title,
  content,
}: {
  title: string
  content?: string
}): JSX.Element | null {
  if (!content) return null

  return (
    <Card as="section">
      <div className="ds-stack">
        <Subheading>{title}</Subheading>
        <BodyText>{content}</BodyText>
      </div>
    </Card>
  )
}
