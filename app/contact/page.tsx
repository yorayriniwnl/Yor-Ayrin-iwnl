import React from 'react'
import { SITE_PROFILE } from '../../lib/data'
import PageHero from '../../components/sections/PageHero'
import ContactSurface from '../../components/sections/ContactSurface'
import { ButtonLink } from '../../components/ui/Button'

const CONTACT_CHANNELS = [
  { label: 'Email', meta: SITE_PROFILE.email, href: `mailto:${SITE_PROFILE.email}` },
  { label: 'Phone', meta: SITE_PROFILE.phone, href: `tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}` },
  { label: 'LinkedIn', meta: SITE_PROFILE.linkedinLabel, href: SITE_PROFILE.linkedinHref },
  { label: 'GitHub', meta: SITE_PROFILE.githubLabel, href: SITE_PROFILE.githubHref },
]

export default function ContactPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Collaboration-ready,
            <br />
            without the <em>noise.</em>
          </>
        }
        description="The contact experience stays practical: quick channels, a working form, and language meant for real outreach instead of filler."
        actions={
          <>
            <ButtonLink href={`mailto:${SITE_PROFILE.email}`} variant="primary" size="lg">
              Email directly
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary" size="lg">
              Open resume
            </ButtonLink>
          </>
        }
      />
      <ContactSurface
        title="Reach out"
        description="Use whichever path fits the conversation: email, phone, LinkedIn, GitHub, or the integrated contact form."
        channels={CONTACT_CHANNELS}
      />
    </>
  )
}
