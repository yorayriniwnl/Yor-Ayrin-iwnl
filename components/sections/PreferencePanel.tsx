'use client'

import React from 'react'
import ThemeToggle from '../ThemeToggle'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Text from '../ui/Text'
import { Button } from '../ui/Button'
import { useAdaptive } from '../ui/AdaptiveProvider'
import { Heading, Subheading } from '../ui/Typography'

export default function PreferencePanel(): JSX.Element {
  const { recruiterMode, reducedMotion, setRecruiterMode, setReducedMotion } = useAdaptive()

  return (
    <section className="ds-section">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>Preferences</Heading>
            <Text className="max-w-3xl">
              These controls already existed in the app. They are now grouped into a
              clearer settings surface so viewers can tune the experience without
              leaving the design system.
            </Text>
          </div>

          <Divider align="left" />

          <div className="ds-collection-grid">
            <Card as="section">
              <div className="ds-stack">
                <Subheading>Theme</Subheading>
                <Text size="sm">
                  Switch between the editorial dark presentation and the lighter paper mode.
                </Text>
                <div className="flex flex-wrap gap-3">
                  <ThemeToggle />
                </div>
              </div>
            </Card>

            <Card as="section">
              <div className="ds-stack">
                <Subheading>Recruiter mode</Subheading>
                <Text size="sm">
                  Emphasizes clarity and calm presentation for fast portfolio review.
                </Text>
                <Button
                  variant={recruiterMode ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setRecruiterMode(!recruiterMode)}
                >
                  {recruiterMode ? 'Recruiter mode on' : 'Turn on recruiter mode'}
                </Button>
              </div>
            </Card>

            <Card as="section">
              <div className="ds-stack">
                <Subheading>Motion</Subheading>
                <Text size="sm">
                  Reduce animation if you prefer a calmer interface or need improved accessibility.
                </Text>
                <Button
                  variant={reducedMotion ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setReducedMotion(!reducedMotion)}
                >
                  {reducedMotion ? 'Reduced motion on' : 'Turn on reduced motion'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}
