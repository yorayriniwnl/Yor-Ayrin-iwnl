import React from 'react'
import type { ExperienceItem } from '../../data/site'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Text from '../ui/Text'
import { Heading, Subheading } from '../ui/Typography'

type ExperienceLedgerProps = {
  description?: string
  items: ExperienceItem[]
  title: string
}

export default function ExperienceLedger({
  description,
  items,
  title,
}: ExperienceLedgerProps): JSX.Element {
  return (
    <section className="ds-section">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>{title}</Heading>
            {description ? <Text className="max-w-3xl">{description}</Text> : null}
          </div>

          <Divider align="left" />

          <div className="ds-timeline-rail">
            {items.map((item) => (
              <Card key={item.id} as="article" className="ds-timeline-rail__item">
                <div className="ds-stack ds-stack--tight">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge accent={item.kind !== 'placeholder'}>{item.meta}</Badge>
                    {item.kind === 'placeholder' ? <Badge>Placeholder</Badge> : null}
                  </div>

                  <Subheading>{item.title}</Subheading>
                  <Text>{item.summary}</Text>

                  <ul className="ds-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
