import type { Metadata } from 'next'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Text from '../../components/ui/Text'
import { Heading, Subheading } from '../../components/ui/Typography'

export const metadata: Metadata = {
  title: 'Value Education | Ayush Roy',
  description:
    'Course notes for Value Education with prompt-based reflection structure and expandable academic writing sections.',
}

const CORE_PROMPT = 'Who are the happiest people?'

const PROMPT_FRAMES: readonly string[] = [
  'Clarify what "happiness" means in context: pleasure, peace, purpose, or long-term fulfillment.',
  'Differentiate temporary satisfaction from stable well-being built through values and relationships.',
  'Examine how gratitude, responsibility, and contribution shape the quality of life.',
  'Test assumptions using lived examples from family, community, and student life.',
  'Conclude with a value-centered definition that can guide daily decisions.',
]

export default function ValueEducationPage(): JSX.Element {
  return (
    <section className="ds-section">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <header className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Badge accent>Course</Badge>
            <Heading>Value Education</Heading>
            <Text className="max-w-3xl">
              A working notebook for value education discussions, structured for clear thinking and
              future expansion. The page is intentionally simple so new prompts, case studies, and
              lecture notes can be added without changing the layout model.
            </Text>
          </header>

          <Card as="section" style={{ borderColor: 'rgba(201, 168, 76, 0.38)' }}>
            <div className="ds-stack ds-stack--tight">
              <Badge>Prompt</Badge>
              <Subheading>{CORE_PROMPT}</Subheading>
              <Text>
                Use this as a reflective and analytical question rather than a one-line answer. Frame
                the response with definitions, reasoning, and practical examples.
              </Text>
            </div>
          </Card>

          <Card as="section">
            <div className="ds-stack ds-stack--tight">
              <Badge>Prompt Structure</Badge>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  display: 'grid',
                  gap: '0.7rem',
                  color: 'var(--ds-text-muted)',
                  lineHeight: 1.7,
                }}
              >
                {PROMPT_FRAMES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
          </Card>

          <Card as="section" style={{ borderStyle: 'dashed' }}>
            <div className="ds-stack ds-stack--tight">
              <Badge>Your Writing Space</Badge>
              <Subheading>Draft Response</Subheading>
              <Text>
                Write your own argument here: define your thesis, add examples, and end with a concise
                conclusion.
              </Text>
              <Text style={{ fontFamily: 'var(--ds-font-mono)', color: 'var(--ds-text-dim)' }}>
                Placeholder: Add your reflection in 3 parts - definition, analysis, conclusion.
              </Text>
            </div>
          </Card>

          <Card as="section">
            <div className="ds-stack ds-stack--tight">
              <Badge>Expansion Slots</Badge>
              <Text>
                Suggested sections to add next: weekly lecture notes, case-study comparisons,
                citation-backed references, and revision history.
              </Text>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  )
}
