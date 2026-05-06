import React from 'react'
import Link from 'next/link'
import type { AchievementItem } from '../../data/site'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Text from '../ui/Text'
import { Heading, Subheading } from '../ui/Typography'

type AchievementShelfProps = {
  description?: string
  items: AchievementItem[]
  title: string
}

export default function AchievementShelf({
  description,
  items,
  title,
}: AchievementShelfProps): JSX.Element {
  return (
    <section className="ds-section">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>{title}</Heading>
            {description ? <Text className="max-w-3xl">{description}</Text> : null}
          </div>

          <Divider align="left" />

          <div className="ds-collection-grid">
            {items.map((item) => (
              <Card key={item.id} as="article" interactive={Boolean(item.href)}>
                <div className="ds-stack ds-stack--tight h-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge accent={item.kind === 'verified'}>{item.label}</Badge>
                    {item.kind === 'placeholder' ? <Badge>Placeholder</Badge> : null}
                  </div>
                  <Subheading>{item.title}</Subheading>
                  <Text>{item.detail}</Text>
                  {item.href ? (
                    <div className="mt-auto pt-2">
                      <Link href={item.href} className="ds-button ds-button--secondary ds-button--sm">
                        Open detail
                      </Link>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
