import React from 'react'
import Link from 'next/link'
import type { Project } from '../../data/site'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Stat from '../ui/Stat'
import Text from '../ui/Text'
import { Heading, Subheading } from '../ui/Typography'

type SteamProfilePanelProps = {
  activity: { id: string; message: string; ts?: string }[]
  projects: Project[]
  status: {
    headline: string
    status: string
    summaryCards: { label: string; note: string; value: string }[]
  }
  user: {
    avatarSrc: string
    name: string
    role: string
    summary: string
  }
}

export default function SteamProfilePanel({
  activity,
  projects,
  status,
  user,
}: SteamProfilePanelProps): JSX.Element {
  return (
    <section className="ds-section">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>{status.headline}</Heading>
            <Text className="max-w-3xl">{status.status}</Text>
          </div>

          <div className="ds-steam-grid">
            <Card as="section" className="ds-steam-grid__profile">
              <div className="ds-stack">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <Avatar src={user.avatarSrc} alt={user.name} size="lg" />
                  <div className="ds-stack ds-stack--tight">
                    <Badge accent>Portfolio profile</Badge>
                    <Subheading>{user.name}</Subheading>
                    <Text>{user.role}</Text>
                    <Text size="sm">{user.summary}</Text>
                  </div>
                </div>

                <Divider align="left" />

                <div className="ds-metric-grid">
                  {status.summaryCards.map((card) => (
                    <Stat key={card.label} label={card.label} value={card.value} meta={card.note} />
                  ))}
                </div>
              </div>
            </Card>

            <Card as="section" className="ds-steam-grid__showcase">
              <div className="ds-stack">
                <Subheading>Showcase shelf</Subheading>
                <Text size="sm">
                  Showcase cards surface current portfolio projects until external Steam data is connected.
                </Text>

                <div className="ds-stack ds-stack--tight">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="ds-showcase-row">
                      <div className="ds-stack ds-stack--tight">
                        <Badge accent>{project.badge || project.category}</Badge>
                        <strong>{project.title}</strong>
                        <Text size="sm">{project.shortDescription}</Text>
                      </div>
                      <Link href={`/projects/${project.id}`} className="ds-button ds-button--ghost ds-button--sm">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="ds-steam-grid">
            <Card as="section">
              <div className="ds-stack">
                <Subheading>Recent activity</Subheading>
                <div className="ds-stack ds-stack--tight">
                  {activity.slice(0, 5).map((item) => (
                    <div key={item.id} className="ds-activity-row">
                      <div className="ds-stack ds-stack--tight">
                        <strong>{item.message}</strong>
                        {item.ts ? <Text size="sm">{new Date(item.ts).toLocaleDateString()}</Text> : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card as="section">
              <div className="ds-stack">
                <Subheading>Truthful placeholders</Subheading>
                <Text>
                  Hours played, favorite titles, badge counts, and platform achievements stay explicitly marked as unavailable until real Steam data is connected.
                </Text>
                <ul className="ds-list">
                  <li>No private playtime is fabricated.</li>
                  <li>No favorite games are invented.</li>
                  <li>The UI is ready for future public data integration.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}
