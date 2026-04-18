import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Section from '../../../components/ui/Section'
import Grid from '../../../components/ui/Grid'
import Card from '../../../components/ui/Card'
import { ButtonLink } from '../../../components/ui/Button'
import { BodyText, Eyebrow, Heading, Subheading } from '../../../components/ui/Typography'

export const metadata = {
  title: 'Yor Zenith - Solar Energy Planning & Decision System',
  description:
    'Yor Zenith is an integrated platform for rooftop solar planning, yield simulation, and financial decision support that shortens planning cycles and improves approvals.',
}

export default function Page(): JSX.Element {
  return (
    <Section>
      <div className="ds-container max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <Eyebrow>Flagship Project</Eyebrow>
          </div>

          <Heading className="mt-4">Yor Zenith - Solar Energy Planning and Decision System</Heading>

          <BodyText className="mt-4 text-lg">
            Integrated platform that evaluates rooftop feasibility and generates permit-ready financial
            reports.
          </BodyText>

          <BodyText className="mt-2">Shortens planning cycles from weeks to days for faster approvals.</BodyText>
        </header>

        <Grid cols={2} gap="lg" className="items-start">
          <Card as="div">
            <Subheading className="mb-3">Problem</Subheading>
            <ul className="list-disc list-inside text-[var(--ds-text-muted)] space-y-2">
              <li>Lack of accessible solar planning tools that combine modeling, simulation and finance.</li>
              <li>Decision-making is complex across technical, regulatory and financial axes.</li>
            </ul>
          </Card>

          <Card as="div">
            <Subheading className="mb-3">Solution</Subheading>
            <BodyText className="mb-3">Built a unified system that analyzes:</BodyText>
            <ul className="list-disc list-inside text-[var(--ds-text-muted)] space-y-2">
              <li>
                <strong>Rooftop feasibility</strong> - automated site modeling and obstruction detection.
              </li>
              <li>
                <strong>Energy output</strong> - yield simulations tuned to local irradiance and shading.
              </li>
              <li>
                <strong>Financial viability</strong> - permit-ready reports and ROI projections.
              </li>
            </ul>
          </Card>
        </Grid>

        <div className="mt-10">
          <Subheading className="mb-3">Tech</Subheading>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 rounded-full border border-[var(--ds-border)] text-sm text-[var(--ds-text-muted)]">React</span>
            <span className="px-3 py-1 rounded-full border border-[var(--ds-border)] text-sm text-[var(--ds-text-muted)]">Data modeling</span>
            <span className="px-3 py-1 rounded-full border border-[var(--ds-border)] text-sm text-[var(--ds-text-muted)]">Visualization</span>
          </div>
        </div>

        <div className="mt-10">
          <Subheading className="mb-3">Key Features</Subheading>
          <ul className="list-disc list-inside text-[var(--ds-text-muted)] space-y-2">
            <li>
              <strong>Parameter-based analysis</strong> - tune panel specs, tilt, azimuth and pricing to model
              outcomes.
            </li>
            <li>
              <strong>Visual dashboards</strong> - interactive site viewer, production heatmaps and time-series
              charts.
            </li>
            <li>
              <strong>Decision support logic</strong> - actionable recommendations and ranked scenarios.
            </li>
          </ul>
        </div>

        <Card as="div" className="mt-10">
          <Subheading className="mb-2">Outcome</Subheading>
          <BodyText>
            Enables users to make informed solar decisions - reducing planning time from weeks to days
            and standardizing deliverables for faster approvals.
          </BodyText>
        </Card>

        <div className="mt-10">
          <Subheading className="mb-4">Screenshots</Subheading>

          <div className="grid gap-4 sm:grid-cols-3">
            <figure className="rounded overflow-hidden border border-[var(--ds-border)] bg-[var(--ds-surface)]">
              <Image
                src="/project-placeholder.svg"
                alt="Site model view"
                width={1200}
                height={720}
                className="w-full h-40 object-cover"
              />
              <figcaption className="p-2 text-sm text-[var(--ds-text-dim)]">Site model: rooftop geometry and obstructions</figcaption>
            </figure>

            <figure className="rounded overflow-hidden border border-[var(--ds-border)] bg-[var(--ds-surface)]">
              <Image
                src="/project-placeholder.svg"
                alt="Yield simulation"
                width={1200}
                height={720}
                className="w-full h-40 object-cover"
              />
              <figcaption className="p-2 text-sm text-[var(--ds-text-dim)]">Yield simulation and production heatmap</figcaption>
            </figure>

            <figure className="rounded overflow-hidden border border-[var(--ds-border)] bg-[var(--ds-surface)]">
              <Image
                src="/project-placeholder.svg"
                alt="Financial report"
                width={1200}
                height={720}
                className="w-full h-40 object-cover"
              />
              <figcaption className="p-2 text-sm text-[var(--ds-text-dim)]">Automated financial and permitting report</figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <ButtonLink href="/contact">Request full case study</ButtonLink>
          <Link href="/projects" className="ds-button ds-button--secondary ds-button--md">Back to projects</Link>
        </div>
      </div>
    </Section>
  )
}
