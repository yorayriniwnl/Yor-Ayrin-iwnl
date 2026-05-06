import React from 'react'
import type { Skill } from '../../data/site'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Text from '../ui/Text'
import { Heading, Subheading } from '../ui/Typography'

type SkillsBoardProps = {
  categories: Record<string, Skill[]>
  description?: string
  title: string
}

export default function SkillsBoard({
  categories,
  description,
  title,
}: SkillsBoardProps): JSX.Element {
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
            {Object.entries(categories).map(([category, skills]) => (
              <Card key={category} as="section">
                <div className="ds-stack">
                  <Subheading>{category}</Subheading>
                  {skills.map((skill) => (
                    <div key={skill.name} className="ds-stack ds-stack--tight">
                      <div className="flex items-center justify-between gap-4">
                        <span>{skill.name}</span>
                        <span className="ds-text ds-text--small ds-text--mono">{skill.value}%</span>
                      </div>
                      <div className="ds-progress">
                        <div className="ds-progress__bar" style={{ width: `${skill.value}%` }} />
                      </div>
                      {skill.desc ? <Text size="sm">{skill.desc}</Text> : null}
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
