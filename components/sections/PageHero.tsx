import React from 'react'
import Badge from '../ui/Badge'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Stat from '../ui/Stat'
import Text from '../ui/Text'
import { DisplayTitle, Eyebrow } from '../ui/Typography'

type HeroMetric = {
  label: string
  value: string
}

type PageHeroProps = {
  actions?: React.ReactNode
  aside?: React.ReactNode
  description: string
  eyebrow: string
  kicker?: string
  metrics?: HeroMetric[]
  title: React.ReactNode
}

export default function PageHero({
  actions,
  aside,
  description,
  eyebrow,
  kicker,
  metrics = [],
  title,
}: PageHeroProps): JSX.Element {
  return (
    <section className="ds-section ds-page-hero">
      <Container wide>
        <div className="ds-page-hero__grid">
          <div className="ds-stack ds-stack--loose">
            <div className="ds-section-intro" style={{ marginBottom: 0 }}>
              <Eyebrow>{eyebrow}</Eyebrow>
              <DisplayTitle>{title}</DisplayTitle>
              <Text className="max-w-3xl">{description}</Text>
            </div>

            {kicker ? <Badge accent>{kicker}</Badge> : null}

            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}

            {metrics.length ? (
              <>
                <Divider align="left" />
                <div className="ds-metric-grid">
                  {metrics.map((metric) => (
                    <Stat key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {aside ? <div className="ds-page-hero__aside">{aside}</div> : null}
        </div>
      </Container>
    </section>
  )
}
