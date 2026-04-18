import React from 'react'
import ContactForm from '../ContactForm'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Container from '../ui/Container'
import Divider from '../ui/Divider'
import Text from '../ui/Text'
import { Heading, Subheading } from '../ui/Typography'

type ContactChannel = {
  href: string
  label: string
  meta: string
}

type ContactSurfaceProps = {
  channels: ContactChannel[]
  description: string
  title: string
}

export default function ContactSurface({
  channels,
  description,
  title,
}: ContactSurfaceProps): JSX.Element {
  return (
    <section className="ds-section ds-section--soft">
      <Container>
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <Heading>{title}</Heading>
            <Text className="max-w-3xl">{description}</Text>
          </div>

          <div className="ds-page-hero__grid">
            <Card as="section">
              <div className="ds-stack">
                <Subheading>Direct channels</Subheading>
                <div className="ds-stack ds-stack--tight">
                  {channels.map((channel) => (
                    <a key={channel.label} href={channel.href} className="ds-showcase-row">
                      <div className="ds-stack ds-stack--tight">
                        <Badge accent>{channel.label}</Badge>
                        <Text size="sm">{channel.meta}</Text>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Card>

            <Card as="section">
              <div className="ds-stack">
                <Subheading>Send a message</Subheading>
                <Text size="sm">
                  The contact API remains intact. This is the same form behavior wrapped in the shared editorial surface.
                </Text>
                <Divider align="left" />
                <ContactForm />
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}
