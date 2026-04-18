import React from 'react'
import { CS2_VIDEOS, SITE_PROFILE, YOUTUBE_CHANNEL } from '../../data/site'
import { ButtonLink } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import Text from '../../components/ui/Text'
import PageHero from '../../components/sections/PageHero'
import { Heading, Subheading } from '../../components/ui/Typography'

type GalleryItem = {
  title: string
  src: string
  caption: string
}

const YOR_GALLERY: GalleryItem[] = [
  {
    title: 'Identity Frame',
    src: '/images/profile.svg',
    caption: 'Personal identity mark used across portfolio and profile surfaces.',
  },
  {
    title: 'Studio Poster',
    src: '/og-image.svg',
    caption: 'Visual tone board for the Yor Ayrin world-building style.',
  },
  {
    title: 'Project Lens',
    src: '/screenshots/projects-screenshot.svg',
    caption: 'How product work is curated and presented publicly.',
  },
]

const PHILOSOPHY = [
  'Build things that feel alive, but keep every claim verifiable.',
  'Keep design expressive and engineering concrete.',
  'Ship often, then refine with evidence instead of hype.',
]

const STARTUP_VISION = [
  'Product direction: useful systems with clear utility and emotional clarity.',
  'Execution model: small, focused launches over oversized roadmaps.',
  'Long-term goal: build a studio that blends software, visuals, and decision-support products.',
]

const PAINT_WORK = [
  {
    title: 'Paint Journal (in progress)',
    detail: 'Sketchbook and paint pieces are curated offline and will be added when a verified public gallery is ready.',
  },
]

const AI_PICTURES = [
  {
    title: 'AI image set',
    detail: 'No public AI-generated art collection is linked yet. This slot stays explicit until a verified set is published.',
  },
]

const SONG_PLAYLIST = [
  { title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20' },
  { title: 'Levitating', artist: 'Dua Lipa', duration: '3:23' },
  { title: 'Sunflower', artist: 'Post Malone, Swae Lee', duration: '2:38' },
  { title: 'Circles', artist: 'Post Malone', duration: '3:35' },
]

export const metadata = {
  title: 'Hobbies — Yor Ayrin',
  description: 'Personal and curated space for gallery, philosophy, startup vision, playlists, and creative interests.',
}

export default function HobbiesPage(): JSX.Element {
  const featuredVideo = CS2_VIDEOS[0]
  const favoriteVideos = CS2_VIDEOS.slice(1, 4)

  return (
    <>
      <PageHero
        eyebrow="Hobbies"
        title={
          <>
            The personal side of
            <br />
            <em>Yor Ayrin.</em>
          </>
        }
        description="A curated space for visual identity, philosophy, startup direction, playlists, and creative experiments."
        actions={
          <>
            <ButtonLink href="/games" variant="secondary" size="lg">
              Games
            </ButtonLink>
            <a href={YOUTUBE_CHANNEL.videosHref} target="_blank" rel="noreferrer" className="ds-button ds-button--primary ds-button--lg">
              YouTube Playlist
            </a>
          </>
        }
      />

      <section className="ds-section ds-section--soft">
        <Container>
          <div className="ds-stack ds-stack--loose">
            <div className="ds-stack">
              <Heading>Yor Ayrin gallery</Heading>
              <Divider align="left" />
              <div className="ds-collection-grid">
                {YOR_GALLERY.map((item) => (
                  <Card key={item.title} as="article">
                    <div className="ds-stack ds-stack--tight">
                      <img src={item.src} alt={item.title} className="h-44 w-full rounded-[1rem] border border-[var(--ds-border)] object-cover" />
                      <Subheading>{item.title}</Subheading>
                      <Text size="sm">{item.caption}</Text>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="ds-stack">
              <Heading>Philosophy</Heading>
              <Divider align="left" />
              <Card as="article">
                <ul className="ds-list">
                  {PHILOSOPHY.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="ds-stack">
              <Heading>Startup and vision</Heading>
              <Divider align="left" />
              <Card as="article">
                <ul className="ds-list">
                  {STARTUP_VISION.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="ds-stack">
              <Heading>Paint work</Heading>
              <Divider align="left" />
              <div className="ds-collection-grid">
                {PAINT_WORK.map((item) => (
                  <Card key={item.title} as="article">
                    <div className="ds-stack ds-stack--tight">
                      <Subheading>{item.title}</Subheading>
                      <Text size="sm">{item.detail}</Text>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="ds-stack">
              <Heading>AI generated pictures</Heading>
              <Divider align="left" />
              <div className="ds-collection-grid">
                {AI_PICTURES.map((item) => (
                  <Card key={item.title} as="article">
                    <div className="ds-stack ds-stack--tight">
                      <Subheading>{item.title}</Subheading>
                      <Text size="sm">{item.detail}</Text>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="ds-stack">
              <Heading>YouTube playlist</Heading>
              <Divider align="left" />
              {featuredVideo ? (
                <Card as="article">
                  <div className="ds-stack ds-stack--tight">
                    <div className="overflow-hidden rounded-[1rem] border border-[var(--ds-border)]">
                      <iframe
                        width="100%"
                        height="340"
                        src={`https://www.youtube.com/embed/${featuredVideo.id}?rel=0`}
                        title={featuredVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ border: 'none', display: 'block' }}
                      />
                    </div>
                    <Subheading>{featuredVideo.title}</Subheading>
                    <Text size="sm">{featuredVideo.duration}</Text>
                    {featuredVideo.note ? <Text size="sm">{featuredVideo.note}</Text> : null}
                  </div>
                </Card>
              ) : (
                <Card as="article">
                  <Text size="sm">No verified playlist entries are available right now.</Text>
                </Card>
              )}
            </div>

            <div className="ds-stack">
              <Heading>Favourite YouTube videos</Heading>
              <Divider align="left" />
              <div className="ds-collection-grid">
                {favoriteVideos.length > 0 ? (
                  favoriteVideos.map((video) => (
                    <Card key={video.id} as="article" interactive>
                      <div className="ds-stack ds-stack--tight">
                        <img src={video.thumbnail} alt={video.title} className="h-40 w-full rounded-[1rem] border border-[var(--ds-border)] object-cover" />
                        <Subheading>{video.title}</Subheading>
                        <Text size="sm">{video.duration}</Text>
                        {video.note ? <Text size="sm">{video.note}</Text> : null}
                        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" className="ds-button ds-button--secondary ds-button--sm">
                          Watch
                        </a>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card as="article">
                    <Text size="sm">Favorite video slots will appear here when playlist entries are available.</Text>
                  </Card>
                )}
              </div>
            </div>

            <div className="ds-stack">
              <Heading>Song playlist</Heading>
              <Divider align="left" />
              <Card as="article">
                <div className="ds-stack ds-stack--tight">
                  {SONG_PLAYLIST.map((song) => (
                    <div key={song.title} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--ds-space-3)', borderBottom: '1px solid var(--ds-border)', paddingBottom: '0.65rem' }}>
                      <div>
                        <Subheading className="text-base">{song.title}</Subheading>
                        <Text size="sm">{song.artist}</Text>
                      </div>
                      <Text size="sm" style={{ fontFamily: 'var(--ds-font-mono)' }}>{song.duration}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card as="article" style={{ borderColor: 'rgba(122, 154, 122, 0.35)' }}>
              <Text>
                Personal curation status: this page only shows verified media currently available in the project. Missing sets stay explicitly labeled until published.
              </Text>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
