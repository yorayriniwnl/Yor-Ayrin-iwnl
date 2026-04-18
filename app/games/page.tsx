'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { CS2_VIDEOS, YOUTUBE_CHANNEL } from '../../data/media'
import type { YouTubeVideo } from '../../data/media'
import { getLiveGames, getComingSoonGames } from '../../data/games'
import type { GameMeta, GameCategory } from '../../data/games'
import styles from './page.module.css'
import CS2HUD from '../../components/CS2HUD'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import Text from '../../components/ui/Text'
import { ButtonLink } from '../../components/ui/Button'
import PageHero from '../../components/sections/PageHero'
import { Heading, Subheading } from '../../components/ui/Typography'

// ─── Category filter bar ─────────────────────────────────────────────────────

type FilterOption = 'all' | GameCategory

const FILTER_OPTIONS: { id: FilterOption; label: string }[] = [
  { id: 'all',      label: 'All'      },
  { id: 'arcade',   label: 'Arcade'   },
  { id: 'puzzle',   label: 'Puzzle'   },
  { id: 'strategy', label: 'Strategy' },
  { id: 'word',     label: 'Word'     },
  { id: 'typing',   label: 'Typing'   },
]

// ─── Live game card ───────────────────────────────────────────────────────────

function LiveGameCard({ game }: { game: GameMeta }) {
  const isChess = game.id === 'chess'

  return (
    <Card
      as="article"
      interactive
      style={{
        borderColor: isChess
          ? 'rgba(122, 154, 122, 0.45)'
          : 'rgba(201, 168, 76, 0.45)',
        background: isChess
          ? 'linear-gradient(135deg, rgba(122, 154, 122, 0.1), rgba(26, 23, 16, 0.96))'
          : 'linear-gradient(135deg, rgba(201, 168, 76, 0.12), rgba(26, 23, 16, 0.96))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="ds-stack ds-stack--tight" style={{ flex: 1 }}>
        {/* Status row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          <Badge
            accent
            style={{
              borderColor: isChess ? 'rgba(122, 154, 122, 0.45)' : 'rgba(201, 168, 76, 0.45)',
              color:       isChess ? 'var(--ds-success)' : 'var(--ds-primary)',
            }}
          >
            ● Live
          </Badge>
          <Badge>{game.category}</Badge>
          {game.featured && (
            <Badge accent style={{ marginLeft: 'auto', opacity: 0.85 }}>
              Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <Subheading style={{ color: 'var(--ds-text-soft)' }}>
          {game.title}
        </Subheading>

        {/* Description */}
        <Text>{game.description}</Text>

        {/* Controls */}
        {game.controls.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              marginTop: 'var(--ds-space-2)',
            }}
          >
            {game.controls.map((c) => (
              <span
                key={c.key}
                style={{
                  fontFamily: 'var(--ds-font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--ds-text-dim)',
                  border: '1px solid var(--ds-border)',
                  borderRadius: '0.25rem',
                  padding: '0.15rem 0.4rem',
                }}
                title={c.action}
              >
                {c.key}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto" style={{ paddingTop: 'var(--ds-space-3)' }}>
          <ButtonLink href={`/games/${game.slug}`} variant="primary" size="sm">
            Play now
          </ButtonLink>
        </div>
      </div>
    </Card>
  )
}

// ─── Coming-soon card ─────────────────────────────────────────────────────────

function ComingSoonCard({ game }: { game: GameMeta }) {
  return (
    <Card
      as="article"
      style={{
        borderColor: 'var(--ds-border)',
        background: 'linear-gradient(180deg, rgba(26, 23, 16, 0.82), rgba(17, 16, 9, 0.90))',
        opacity: 0.68,
        filter: 'saturate(0.5)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Blurred overlay tint */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(1px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="ds-stack ds-stack--tight" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
          <Badge style={{ borderColor: 'var(--ds-border)', color: 'var(--ds-text-dim)' }}>
            Soon
          </Badge>
          <Badge>{game.category}</Badge>
        </div>

        <Subheading style={{ color: 'var(--ds-text-muted)' }}>
          {game.title}
        </Subheading>

        <Text size="sm" style={{ color: 'var(--ds-text-muted)' }}>
          {game.description}
        </Text>

        <Text
          size="sm"
          style={{
            fontFamily: 'var(--ds-font-mono)',
            fontSize: '0.7rem',
            color: 'var(--ds-text-dim)',
            opacity: 0.6,
            marginTop: 'var(--ds-space-2)',
          }}
        >
          ⏳ In development
        </Text>
      </div>
    </Card>
  )
}

// ─── Video card (unchanged) ───────────────────────────────────────────────────

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <Card as="article" interactive>
      <div className="ds-stack ds-stack--tight">
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={640}
          height={360}
          className="h-40 w-full rounded-[1rem] object-cover border border-[var(--ds-border)]"
        />
        <span className="ds-badge ds-tag--accent">CS2</span>
        <Subheading className="text-base">{video.title}</Subheading>
        <Text className="ds-text--small">{video.duration}</Text>
        {video.note ? <Text className="ds-text--small">{video.note}</Text> : null}
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ds-button ds-button--secondary ds-button--sm"
        >
          Watch on YouTube
        </a>
      </div>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GamesPage(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')

  const liveGames    = getLiveGames()
  const comingSoon   = getComingSoonGames()

  const filteredLive = activeFilter === 'all'
    ? liveGames
    : liveGames.filter((g) => g.category === activeFilter)

  const filteredSoon = activeFilter === 'all'
    ? comingSoon
    : comingSoon.filter((g) => g.category === activeFilter)

  return (
    <>
      <PageHero
        eyebrow="Games"
        title={
          <>
            A game shelf that feels
            <br />
            <em>alive</em>, but stays truthful.
          </>
        }
        description="The playable layer of the portfolio lives beside Steam-inspired showcases and clearly-labeled upcoming titles — no fictional content, just what's real and what's ready."
        actions={
          <>
            <ButtonLink href="/steam"        variant="primary"   size="lg">Steam profile</ButtonLink>
            <ButtonLink href="/achievements" variant="secondary" size="lg">Achievements</ButtonLink>
            <ButtonLink href="/fun"          variant="ghost"     size="lg">Fun zone</ButtonLink>
          </>
        }
      />

      <section className="ds-section">
        <Container>
          <div className="ds-stack ds-stack--loose">

            {/* Identity card — unchanged from original */}
            <Card as="section" style={{ borderColor: 'rgba(99, 102, 241, 0.38)' }}>
              <div className="ds-stack ds-stack--tight" style={{ gap: 'var(--ds-space-5)' }}>
                <Badge accent>Identity transformation</Badge>
                <div className="ds-section-intro" style={{ marginBottom: 0 }}>
                  <Heading>Ayush Roy to Yor, intentionally split</Heading>
                  <Text className="max-w-3xl">
                    This page carries the same shift as the brand: the left side is the human operator,
                    the right side is the product persona. Together they define how games are designed,
                    tested, and shipped.
                  </Text>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 'var(--ds-space-4)',
                    alignItems: 'stretch',
                  }}
                >
                  <Card
                    as="article"
                    style={{
                      borderColor: 'rgba(148, 163, 184, 0.35)',
                      background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.32), rgba(15, 23, 42, 0.18))',
                    }}
                  >
                    <div className="ds-stack ds-stack--tight">
                      <Badge>Left: Ayush Roy</Badge>
                      <Subheading>Human judgment and player empathy</Subheading>
                      <Text>
                        Real-world decisions: what feels fair, what confuses players, what deserves polish,
                        and what should be cut. This side keeps the work accountable to users.
                      </Text>
                    </div>
                  </Card>

                  <Card
                    as="article"
                    style={{
                      borderColor: 'rgba(201, 168, 76, 0.42)',
                      background: 'linear-gradient(180deg, rgba(201, 168, 76, 0.16), rgba(26, 23, 16, 0.92))',
                    }}
                  >
                    <div className="ds-stack ds-stack--tight">
                      <Badge accent>Right: Yor</Badge>
                      <Subheading>Execution mode under pressure</Subheading>
                      <Text>
                        Interface discipline, systems thinking, and consistent output. Yor is the production
                        lens that turns ideas into repeatable releases.
                      </Text>
                    </div>
                  </Card>
                </div>

                <Card
                  as="article"
                  style={{
                    borderColor: 'rgba(99, 102, 241, 0.35)',
                    background:
                      'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.18), transparent 45%), radial-gradient(circle at 85% 15%, rgba(201, 168, 76, 0.22), transparent 45%), linear-gradient(160deg, rgba(9, 12, 20, 0.95), rgba(17, 12, 6, 0.88))',
                  }}
                >
                  <div className="ds-stack ds-stack--tight">
                    <Badge accent>Animated transition</Badge>
                    <div className={styles.identityMorph} aria-label="Ayush Roy transforms into YorAyrin">
                      <div className={styles.identitySource}>AYUSH ROY</div>
                      <div className={styles.identityShards} aria-hidden="true">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <span
                            key={i}
                            className={styles.identityShard}
                            style={{ ['--i' as string]: i } as React.CSSProperties}
                          />
                        ))}
                      </div>
                      <div className={styles.identityTarget}>
                        <span className={`${styles.targetLayer} ${styles.targetLayerYor}`}>YOR</span>
                        <span className={`${styles.targetLayer} ${styles.targetLayerAyrin}`}>AYRIN</span>
                        <span className={`${styles.targetLayer} ${styles.targetLayerIwnl}`}>IWNL</span>
                      </div>
                    </div>
                    <Text size="sm" style={{ color: 'var(--ds-text-dim)' }}>
                      The sequence repeats as a symbol: identity does not disappear, it gets reorganized into a clearer operating state.
                    </Text>
                  </div>
                </Card>

                <Card
                  as="article"
                  style={{
                    borderColor: 'rgba(56, 189, 248, 0.33)',
                    background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.22), rgba(15, 23, 42, 0.08), rgba(201, 168, 76, 0.14))',
                  }}
                >
                  <div className="ds-stack ds-stack--tight">
                    <Badge>Meaning system</Badge>
                    <div className={styles.identityLexicon}>
                      <div className={styles.identityLexiconItem}>
                        <p className={styles.identityLexiconKey}>YOR</p>
                        <p className={styles.identityLexiconValue}>Yielded Operational Rigor</p>
                        <p className={styles.identityLexiconDetail}>
                          The execution state: disciplined decisions, clean systems, and measurable output.
                        </p>
                      </div>
                      <div className={styles.identityLexiconItem}>
                        <p className={styles.identityLexiconKey}>AYRIN</p>
                        <p className={styles.identityLexiconValue}>Adaptive Reflection Interface</p>
                        <p className={styles.identityLexiconDetail}>
                          The design state: translating intent into interfaces that stay clear under complexity.
                        </p>
                      </div>
                      <div className={styles.identityLexiconItem}>
                        <p className={styles.identityLexiconKey}>IWNL</p>
                        <p className={styles.identityLexiconValue}>Intent Wins, Noise Loses</p>
                        <p className={styles.identityLexiconDetail}>
                          The rule set: reduce distraction, preserve focus, and ship what matters.
                        </p>
                      </div>
                    </div>
                    <Text>
                      YorAyrin is the composite identity formed when all three layers align: rigor in execution,
                      adaptability in design thinking, and a strict filter against noise.
                    </Text>
                  </div>
                </Card>
              </div>
            </Card>

            {/* CS2 HUD */}
            <Card as="section" style={{ borderColor: 'rgba(201, 168, 76, 0.38)' }}>
              <div
                className="ds-stack ds-stack--tight"
                style={{ alignItems: 'center', textAlign: 'center', gap: 'var(--ds-space-4)' }}
              >
                <Badge accent>Fun zone HUD</Badge>
                <Subheading>Live CS2-style control panel</Subheading>
                <Text className="max-w-2xl">
                  A quick status surface between the hero CTA layer and the game library.
                </Text>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <CS2HUD inline />
                </div>
              </div>
            </Card>

            {/* ── Game library header + filter ── */}
            <div className="ds-section-intro" style={{ marginBottom: 0 }}>
              <Heading>Game library</Heading>
              <Text className="max-w-3xl">
                {liveGames.length} live game{liveGames.length === 1 ? '' : 's'} anchor the shelf today.
                {comingSoon.length > 0
                  ? ' Upcoming titles are shown below so you can see what\'s in development — no placeholders, just honest progress.'
                  : ' Everything listed here is playable right now.'}
              </Text>
            </div>

            {/* Category filter bar */}
            <div
              role="group"
              aria-label="Filter by category"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {FILTER_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  aria-pressed={activeFilter === id}
                  style={{
                    fontFamily: 'var(--ds-font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '999px',
                    border: activeFilter === id
                      ? '1px solid var(--ds-primary)'
                      : '1px solid var(--ds-border)',
                    background: activeFilter === id
                      ? 'rgba(201, 168, 76, 0.12)'
                      : 'transparent',
                    color: activeFilter === id
                      ? 'var(--ds-primary)'
                      : 'var(--ds-text-dim)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <Divider align="left" />

            {/* ── Live games grid ── */}
            {filteredLive.length > 0 ? (
              <div className="ds-collection-grid">
                {filteredLive.map((game) => (
                  <LiveGameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <Card as="article">
                <Text style={{ textAlign: 'center', color: 'var(--ds-text-dim)' }}>
                  No live games in this category yet.
                </Text>
              </Card>
            )}

            {/* ── Coming-soon row ── */}
            {filteredSoon.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)', marginTop: 'var(--ds-space-2)' }}>
                  <Subheading style={{ margin: 0, color: 'var(--ds-text-muted)' }}>
                    Coming Soon
                  </Subheading>
                  <Badge style={{ color: 'var(--ds-text-dim)', borderColor: 'var(--ds-border)' }}>
                    {filteredSoon.length}
                  </Badge>
                </div>
                <div className="ds-collection-grid">
                  {filteredSoon.map((game) => (
                    <ComingSoonCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}

            {filteredLive.length === 0 && filteredSoon.length === 0 && (
              <Card as="article">
                <Text style={{ textAlign: 'center', color: 'var(--ds-text-dim)' }}>
                  No games in this category yet — check back soon.
                </Text>
              </Card>
            )}

            <Divider />

            {/* ── CS2 video shelf — unchanged ── */}
            <Card as="section" style={{ borderColor: 'rgba(59, 130, 246, 0.28)' }}>
              <div className="ds-stack ds-stack--loose">
                <div className="ds-section-intro" style={{ marginBottom: 0 }}>
                  <Badge accent style={{ marginBottom: 'var(--ds-space-3)' }}>YouTube</Badge>
                  <Subheading>CS2 highlight shelf</Subheading>
                  <Text className="max-w-3xl">
                    Curated from {YOUTUBE_CHANNEL.name}. The lead clip stays featured, while the rest
                    are grouped as quick-watch highlights.
                  </Text>
                </div>

                {CS2_VIDEOS.length > 0 ? (
                  <div className="ds-stack ds-stack--loose">
                    <Card as="article" interactive>
                      <div className="ds-stack ds-stack--tight">
                        <div className="overflow-hidden rounded-[1rem] border border-[var(--ds-border)]">
                          <iframe
                            width="100%"
                            height="340"
                            src={`https://www.youtube.com/embed/${CS2_VIDEOS[0].id}?rel=0`}
                            title={CS2_VIDEOS[0].title}
                            allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ border: 'none', display: 'block' }}
                          />
                        </div>
                        <span className="ds-badge ds-tag--accent">Featured CS2 clip</span>
                        <Subheading>{CS2_VIDEOS[0].title}</Subheading>
                        <Text className="ds-text--small">{CS2_VIDEOS[0].duration}</Text>
                        {CS2_VIDEOS[0].note && <Text className="ds-text--small">{CS2_VIDEOS[0].note}</Text>}
                      </div>
                    </Card>

                    <div className="ds-collection-grid">
                      {CS2_VIDEOS.slice(1, 6).map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card as="article">
                    <Text style={{ color: 'var(--ds-text-dim)' }}>
                      CS2 highlights are temporarily unavailable. Watch directly on{' '}
                      <a href={YOUTUBE_CHANNEL.videosHref} target="_blank" rel="noreferrer">
                        {YOUTUBE_CHANNEL.videosHref}
                      </a>.
                    </Text>
                  </Card>
                )}
              </div>
            </Card>

          </div>
        </Container>
      </section>
    </>
  )
}
