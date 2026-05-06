import React from 'react'
import { SITE_PROFILE } from '../../lib/data'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import Text from '../../components/ui/Text'
import { ButtonLink } from '../../components/ui/Button'
import PageHero from '../../components/sections/PageHero'
import { Heading, Subheading } from '../../components/ui/Typography'

export default function CvPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="CV"
        title={
          <>
            Recruiter-friendly summary,
            <br />
            backed by the <em>full resume.</em>
          </>
        }
        description="The CV route acts as a concise gateway into the full resume and downloadable PDF while preserving the same editorial framing as the rest of the site."
        actions={
          <>
            <ButtonLink href="/resume" variant="primary" size="lg">
              Open full resume
            </ButtonLink>
            <a href="/resume.pdf" download className="ds-button ds-button--secondary ds-button--lg">
              Download PDF
            </a>
          </>
        }
      />

      <section className="ds-section">
        <Container>
          <div className="ds-stack ds-stack--loose">
            <div className="ds-section-intro" style={{ marginBottom: 0 }}>
              <Heading>CV snapshot</Heading>
              <Text className="max-w-3xl">
                Use this page for quick review, then move into the full resume for the
                detailed project-backed version.
              </Text>
            </div>

            <Divider align="left" />

            <div className="ds-collection-grid">
              <Card as="article">
                <div className="ds-stack ds-stack--tight">
                  <Badge accent>{SITE_PROFILE.role}</Badge>
                  <Subheading>{SITE_PROFILE.name}</Subheading>
                  <Text>{SITE_PROFILE.recruiterSummary}</Text>
                </div>
              </Card>

              <Card as="article">
                <div className="ds-stack ds-stack--tight">
                  <Subheading>Key links</Subheading>
                  <Text size="sm">{SITE_PROFILE.githubLabel}</Text>
                  <Text size="sm">{SITE_PROFILE.linkedinLabel}</Text>
                  <Text size="sm">{SITE_PROFILE.email}</Text>
                  <Text size="sm">{SITE_PROFILE.phone}</Text>
                </div>
              </Card>

              <Card as="article">
                <div className="ds-stack ds-stack--tight">
                  <Subheading>Why this route exists</Subheading>
                  <Text>
                    A shorter CV summary helps recruiters orient quickly before opening the
                    full resume or project pages.
                  </Text>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
