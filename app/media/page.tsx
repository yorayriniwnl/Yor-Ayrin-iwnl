import React from 'react'
import { MEDIA_ITEMS } from '../../data/media'
import type { MediaItem } from '../../data/media'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import Text from '../../components/ui/Text'
import { ButtonLink } from '../../components/ui/Button'
import PageHero from '../../components/sections/PageHero'
import { Heading, Subheading } from '../../components/ui/Typography'

export const metadata = {
  title: 'Media — Yor Ayrin',
  description: 'Media kit featuring documents, demos, and reusable portfolio assets.',
}

function getMediaIcon(kind: MediaItem['kind']): { emoji: string; color: string; label: string } {
  switch (kind) {
    case 'document':
      return { emoji: '📄', color: 'rgba(201, 168, 76, 0.35)', label: 'Document' }
    case 'demo':
      return { emoji: '🎬', color: 'rgba(122, 154, 122, 0.35)', label: 'Demo' }
    case 'image':
      return { emoji: '🖼️', color: 'rgba(122, 122, 170, 0.35)', label: 'Image' }
    default:
      return { emoji: '📦', color: 'var(--ds-border)', label: 'Asset' }
  }
}

function MediaCard({ item }: { item: MediaItem }) {
  const icon = getMediaIcon(item.kind)
  const isExternal = item.href.startsWith('http')
  const opensStandaloneAsset = item.kind === 'demo'
  const openInNewTab = isExternal || opensStandaloneAsset

  return (
    <Card
      key={item.id}
      as="article"
      interactive
      style={{ borderColor: icon.color }}
    >
      <div className="ds-stack ds-stack--tight h-full">
        <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: 'var(--ds-radius-sm)',
              background: `${icon.color.replace('0.35', '0.12')}`,
              border: `1px solid ${icon.color}`,
              fontSize: '1.5rem',
            }}
          >
            {icon.emoji}
          </div>
          <Badge
            accent
            style={{
              borderColor: icon.color,
              color: icon.color.includes('201, 168, 76')
                ? 'var(--ds-primary)'
                : icon.color.includes('122, 154, 122')
                ? 'var(--ds-success)'
                : 'var(--ds-info)',
            }}
          >
            {icon.label}
          </Badge>
        </div>

        <Subheading>{item.title}</Subheading>

        <Text>{item.summary}</Text>

        <div className="mt-auto pt-2">
          <a
            href={item.href}
            className="ds-button ds-button--secondary ds-button--sm"
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)' }}
          >
            {item.kind === 'document'
              ? 'Download'
              : item.kind === 'demo'
              ? 'Open demo'
              : 'View image'}
            {openInNewTab ? <span style={{ fontSize: '0.7rem' }}>↗</span> : null}
          </a>
        </div>
      </div>
    </Card>
  )
}

function MediaSection({ kind, items }: { kind: MediaItem['kind']; items: MediaItem[] }) {
  const icon = getMediaIcon(kind)

  if (items.length === 0) {
    return null
  }

  return (
    <div className="ds-stack">
      <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
        <span style={{ fontSize: '2rem' }}>{icon.emoji}</span>
        <Heading style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}>
          {icon.label}s
        </Heading>
        <Badge
          style={{
            marginLeft: 'auto',
            borderColor: icon.color,
          }}
        >
          {items.length}
        </Badge>
      </div>
      <Divider align="left" />
      <div className="ds-collection-grid">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function MediaPage(): JSX.Element {
  const documents = MEDIA_ITEMS.filter((item) => item.kind === 'document')
  const demos = MEDIA_ITEMS.filter((item) => item.kind === 'demo')
  const images = MEDIA_ITEMS.filter((item) => item.kind === 'image')

  return (
    <>
      <PageHero
        eyebrow="Media"
        title={
          <>
            Documents, demos,
            <br />
            and reusable <em>assets.</em>
          </>
        }
        description="The media route functions as a lightweight media kit, showcasing real documents, demos, and image assets already present in the repository — no fictional content, just production-ready materials."
        actions={
          <>
            <ButtonLink href="/gallery" variant="primary" size="lg">
              Open gallery
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary" size="lg">
              Download resume
            </ButtonLink>
            <ButtonLink href="/projects" variant="ghost" size="lg">
              View projects
            </ButtonLink>
          </>
        }
      />

      <section className="ds-section">
        <Container>
          <div className="ds-stack ds-stack--loose">
            <div className="ds-section-intro" style={{ marginBottom: 0 }}>
              <Heading>Media kit</Heading>
              <Text className="max-w-3xl">
                Everything here already exists inside the repository, making this route a practical
                asset shelf rather than a decorative extra page. Each item is production-ready and
                available for immediate use.
              </Text>
            </div>

            <Divider align="left" />

            <MediaSection kind="document" items={documents} />
            <MediaSection kind="demo" items={demos} />
            <MediaSection kind="image" items={images} />

            {/* Summary card */}
            <Card
              as="article"
              style={{
                borderColor: 'rgba(201, 168, 76, 0.35)',
                background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.08), rgba(26, 23, 16, 0.96))',
              }}
            >
              <div className="ds-stack ds-stack--tight">
                <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Subheading>All assets verified and local</Subheading>
                  <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginLeft: 'auto' }}>
                    <Badge accent>📄 {documents.length}</Badge>
                    <Badge accent>🎬 {demos.length}</Badge>
                    <Badge accent>🖼️ {images.length}</Badge>
                  </div>
                </div>
                <Text>
                  Every asset in this media kit is stored locally in the repository and ready for
                  production use. Static demos open from their real archived asset URLs, so the
                  cards stay honest about what is part of the app shell and what is a standalone
                  presentation artifact.
                </Text>
                <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap', paddingTop: 'var(--ds-space-2)' }}>
                  <ButtonLink href="/gallery" variant="ghost" size="sm">
                    Browse gallery →
                  </ButtonLink>
                  <ButtonLink href="/projects" variant="ghost" size="sm">
                    View projects →
                  </ButtonLink>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
