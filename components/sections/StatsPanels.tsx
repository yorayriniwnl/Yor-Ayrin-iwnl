import React from 'react'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Stat from '../ui/Stat'
import Text from '../ui/Text'
import { Heading, Subheading } from '../ui/Typography'

type StatRow = {
  label: string
  value: string
  meta?: string
}

type ProgressRow = {
  label: string
  percent: number
  value: string
}

type StatsPanelsProps = {
  description?: string
  headlineStats: StatRow[]
  progressGroups: { title: string; rows: ProgressRow[] }[]
  title: string
}

export default function StatsPanels({
  description,
  headlineStats,
  progressGroups,
  title,
}: StatsPanelsProps): JSX.Element {
  return (
    <section className="ds-section">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>{title}</Heading>
            {description ? <Text className="max-w-3xl">{description}</Text> : null}
          </div>

          <Divider align="left" />

          <div className="ds-metric-grid">
            {headlineStats.map((item) => (
              <Stat key={item.label} label={item.label} value={item.value} meta={item.meta} />
            ))}
          </div>

          <div className="ds-collection-grid">
            {progressGroups.map((group) => (
              <Card key={group.title} as="section">
                <div className="ds-stack">
                  <Subheading>{group.title}</Subheading>
                  {group.rows.map((row) => (
                    <div key={row.label} className="ds-stack ds-stack--tight">
                      <div className="flex items-center justify-between gap-4">
                        <span>{row.label}</span>
                        <span className="ds-text ds-text--small ds-text--mono">{row.value}</span>
                      </div>
                      <div className="ds-progress">
                        <div className="ds-progress__bar" style={{ width: `${row.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
