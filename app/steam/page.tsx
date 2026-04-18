import React from 'react'
import { GAME_LIBRARY, SITE_PROFILE } from '../../data/site'
import type { GameEntry } from '../../data/site'
import { ButtonLink } from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Divider from '../../components/ui/Divider'
import Text from '../../components/ui/Text'
import PageHero from '../../components/sections/PageHero'
import { Heading, Subheading } from '../../components/ui/Typography'
import Avatar from '../../components/ui/Avatar'

export const metadata = {
  title: 'Steam Profile - Yor Ayrin',
  description: 'Steam-inspired gaming profile that only shows real public Steam values when available.',
}

type SteamMostPlayedGame = {
  gameName: string
  gameLink?: string
  gameIcon?: string
  hoursPlayed: number
}

type SteamProfileData = {
  profileUrl: string
  steamId: string
  stateMessage: string
  avatarFull?: string
  mostPlayedGames: SteamMostPlayedGame[]
  badges: SteamBadge[]
}

type SteamBadge = {
  name: string
  icon?: string
  level?: string
}

function getTagValue(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match?.[1]?.trim() ?? null
}

function firstTagValue(xml: string, tags: string[]): string | null {
  for (const tag of tags) {
    const value = getTagValue(xml, tag)
    if (value) return value
  }
  return null
}

function parseMostPlayedGames(xml: string): SteamMostPlayedGame[] {
  const blocks = [...xml.matchAll(/<mostPlayedGame>([\s\S]*?)<\/mostPlayedGame>/gi)]

  return blocks
    .map((block) => block[1])
    .map((gameXml) => {
      const gameName = getTagValue(gameXml, 'gameName') ?? ''
      const hoursRaw = getTagValue(gameXml, 'hoursPlayed') ?? '0'
      const hoursPlayed = Number.parseFloat(hoursRaw.replace(/[^\d.]/g, '')) || 0
      return {
        gameName,
        gameLink: getTagValue(gameXml, 'gameLink') ?? undefined,
        gameIcon: getTagValue(gameXml, 'gameIcon') ?? undefined,
        hoursPlayed,
      }
    })
    .filter((game) => Boolean(game.gameName))
    .sort((a, b) => b.hoursPlayed - a.hoursPlayed)
}

function parseBadges(xml: string): SteamBadge[] {
  const blocks = [...xml.matchAll(/<badge>([\s\S]*?)<\/badge>/gi)]

  return blocks
    .map((block) => block[1])
    .map((badgeXml) => {
      const name = firstTagValue(badgeXml, ['title', 'badgeName', 'name']) ?? ''
      const icon = firstTagValue(badgeXml, ['icon', 'badgeIcon']) ?? undefined
      const level = firstTagValue(badgeXml, ['level', 'xp']) ?? undefined
      return { name, icon, level }
    })
    .filter((badge) => Boolean(badge.name))
}

async function fetchSteamBadges(profileUrl: string): Promise<SteamBadge[]> {
  const badgesXmlUrl = `${profileUrl.replace(/\/+$/, '')}/badges/?xml=1`

  try {
    const res = await fetch(badgesXmlUrl, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YorAyrinSteamFetcher/1.0)' },
    })

    if (!res.ok) return []
    const xml = await res.text()
    return parseBadges(xml)
  } catch {
    return []
  }
}

async function fetchSteamProfileData(): Promise<SteamProfileData | null> {
  const profileUrl =
    process.env.NEXT_PUBLIC_STEAM_PROFILE_URL ??
    process.env.STEAM_PROFILE_URL ??
    SITE_PROFILE.steamHref ??
    ''

  if (!profileUrl) return null

  const xmlUrl = profileUrl.includes('?xml=1')
    ? profileUrl
    : `${profileUrl.replace(/\/+$/, '')}/?xml=1`

  try {
    const res = await fetch(xmlUrl, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YorAyrinSteamFetcher/1.0)' },
    })

    if (!res.ok) return null

    const xml = await res.text()
    const steamId = getTagValue(xml, 'steamID')
    if (!steamId) return null

    const stateMessage = getTagValue(xml, 'stateMessage') ?? 'Status unavailable'
    const avatarFull = getTagValue(xml, 'avatarFull') ?? undefined
    const mostPlayedGames = parseMostPlayedGames(xml)

    const badges = await fetchSteamBadges(profileUrl)

    return {
      profileUrl,
      steamId,
      stateMessage,
      avatarFull,
      mostPlayedGames,
      badges,
    }
  } catch {
    return null
  }
}

function ProfileHeader({ steam }: { steam: SteamProfileData | null }) {
  return (
    <Card as="section" style={{ borderColor: 'rgba(201, 168, 76, 0.35)' }}>
      <div style={{ display: 'flex', gap: 'var(--ds-space-6)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Avatar
          src={steam?.avatarFull ?? SITE_PROFILE.avatarSrc}
          alt={steam?.steamId ?? SITE_PROFILE.name}
          style={{ width: '120px', height: '120px', borderRadius: 'var(--ds-radius-md)' }}
        />
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div className="ds-stack ds-stack--tight">
            <div>
              <Heading style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)' }}>
                {steam?.steamId ?? SITE_PROFILE.name}
              </Heading>
              <Text
                size="sm"
                style={{
                  marginTop: 'var(--ds-space-2)',
                  color: 'var(--ds-text-muted)',
                  fontFamily: 'var(--ds-font-mono)',
                }}
              >
                {steam ? 'Live public Steam profile' : 'Steam data currently unavailable'}
              </Text>
            </div>
            <Text>
              {steam
                ? 'This profile panel is populated from the public Steam endpoint and only displays real values currently available.'
                : 'Steam profile data could not be fetched right now. The layout remains ready and will populate automatically when the public endpoint is reachable.'}
            </Text>
            <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap', marginTop: 'var(--ds-space-2)' }}>
              <Badge accent>{steam ? 'Public Steam data' : 'Data unavailable'}</Badge>
              <Badge>{steam?.stateMessage ?? 'Status unavailable'}</Badge>
              {steam ? (
                <a href={steam.profileUrl} target="_blank" rel="noreferrer" className="ds-button ds-button--ghost ds-button--sm">
                  Open Steam profile
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function StatsGrid({ steam }: { steam: SteamProfileData | null }) {
  const totalHours = steam
    ? steam.mostPlayedGames.reduce((sum, game) => sum + game.hoursPlayed, 0)
    : null
  const favorite = steam?.mostPlayedGames[0]

  const cards = [
    {
      label: 'Hours played',
      value: totalHours !== null ? `${Math.round(totalHours)}h` : 'Unavailable',
      note: totalHours !== null ? 'From public most-played titles' : 'Public endpoint unreachable',
    },
    {
      label: 'Favorite game',
      value: favorite?.gameName ?? 'Unavailable',
      note: favorite ? `${favorite.hoursPlayed.toFixed(1)}h on record` : 'No game data available',
    },
    {
      label: 'Showcase slots',
      value: steam ? String(Math.min(steam.mostPlayedGames.length, 3)) : '0',
      note: steam ? 'Filled using public most-played list' : 'Awaiting live profile data',
    },
    {
      label: 'Recent activity',
      value: steam?.stateMessage ?? 'Unavailable',
      note: steam ? 'Live state from public profile feed' : 'No live activity available',
    },
  ]

  return (
    <div className="ds-metric-grid">
      {cards.map((card, index) => (
        <Card key={`${card.label}-${index}`} as="article" style={{ textAlign: 'center' }}>
          <div className="ds-stack ds-stack--tight">
            <Text
              size="sm"
              style={{
                color: 'var(--ds-text-dim)',
                fontFamily: 'var(--ds-font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {card.label}
            </Text>
            <Subheading
              style={{
                color: card.value === 'Unavailable' ? 'var(--ds-text-muted)' : 'var(--ds-primary)',
                fontSize: 'clamp(1.05rem, 2vw, 1.45rem)',
              }}
            >
              {card.value}
            </Subheading>
            <Text
              size="sm"
              style={{
                color: 'var(--ds-text-dim)',
                fontSize: '0.75rem',
              }}
            >
              {card.note}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  )
}

function SteamShowcase({ steam }: { steam: SteamProfileData | null }) {
  if (!steam || steam.mostPlayedGames.length === 0) {
    return (
      <Card as="article">
        <Text style={{ color: 'var(--ds-text-dim)' }}>
          No public most-played game data is currently available from Steam.
        </Text>
      </Card>
    )
  }

  return (
    <div className="ds-collection-grid">
      {steam.mostPlayedGames.slice(0, 3).map((game) => (
        <Card key={game.gameName} as="article" interactive={Boolean(game.gameLink)}>
          <div className="ds-stack ds-stack--tight h-full">
            {game.gameIcon ? (
              <img
                src={game.gameIcon}
                alt={game.gameName}
                style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover' }}
              />
            ) : null}
            <Badge accent>Steam</Badge>
            <Subheading>{game.gameName}</Subheading>
            <Text size="sm">{game.hoursPlayed.toFixed(1)} hours (public profile)</Text>
            {game.gameLink ? (
              <div className="mt-auto pt-2">
                <a href={game.gameLink} target="_blank" rel="noreferrer" className="ds-button ds-button--secondary ds-button--sm">
                  Open game page
                </a>
              </div>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  )
}

function SteamLibrarySlots({ steam }: { steam: SteamProfileData | null }) {
  const slots = Array.from({ length: 6 }).map((_, index) => steam?.mostPlayedGames[index] ?? null)

  return (
    <div className="ds-collection-grid">
      {slots.map((game, index) => (
        <Card key={`library-slot-${index}`} as="article" interactive={Boolean(game?.gameLink)} style={{ opacity: game ? 1 : 0.72 }}>
          <div className="ds-stack ds-stack--tight h-full">
            <Badge accent={Boolean(game)}>Library slot {index + 1}</Badge>
            <Subheading style={{ color: game ? 'var(--ds-text-soft)' : 'var(--ds-text-muted)' }}>
              {game?.gameName ?? 'Unavailable'}
            </Subheading>
            <Text size="sm" style={{ color: 'var(--ds-text-dim)' }}>
              {game ? `${game.hoursPlayed.toFixed(1)}h (public profile)` : 'No verifiable public game data for this slot.'}
            </Text>
            {game?.gameLink ? (
              <div className="mt-auto pt-2">
                <a href={game.gameLink} target="_blank" rel="noreferrer" className="ds-button ds-button--ghost ds-button--sm">
                  Open on Steam
                </a>
              </div>
            ) : null}
          </div>
        </Card>
      ))}
    </div>
  )
}

function AchievementShowcaseSlots({ steam }: { steam: SteamProfileData | null }) {
  const slots = Array.from({ length: 4 }).map((_, index) => steam?.badges[index] ?? null)

  return (
    <div className="ds-collection-grid">
      {slots.map((badge, index) => (
        <Card key={`achievement-slot-${index}`} as="article" style={{ opacity: badge ? 1 : 0.72 }}>
          <div className="ds-stack ds-stack--tight h-full">
            <Badge accent={Boolean(badge)}>Achievement slot {index + 1}</Badge>
            {badge?.icon ? (
              <img
                src={badge.icon}
                alt={badge.name}
                style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover' }}
              />
            ) : null}
            <Subheading style={{ color: badge ? 'var(--ds-text-soft)' : 'var(--ds-text-muted)' }}>
              {badge?.name ?? 'Unavailable'}
            </Subheading>
            <Text size="sm" style={{ color: 'var(--ds-text-dim)' }}>
              {badge ? `Public badge${badge.level ? ` / ${badge.level}` : ''}` : 'No verifiable public badge data for this slot.'}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  )
}

function GameLibrarySection() {
  const recentGames = GAME_LIBRARY.filter((game) => game.mode === 'playable' || game.mode === 'showcase')

  return (
    <div className="ds-stack ds-stack--loose">
      {recentGames.length > 0 && (
        <div className="ds-stack">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--ds-space-3)' }}>
            <Heading style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}>
              Portfolio-linked activity
            </Heading>
            <ButtonLink href="/games" variant="ghost" size="sm">
              View full library
            </ButtonLink>
          </div>
          <Divider align="left" />
          <div className="ds-collection-grid">
            {recentGames.map((game: GameEntry) => (
              <Card
                key={game.id}
                as="article"
                interactive={Boolean(game.href)}
                style={{
                  borderColor: game.mode === 'playable' ? 'rgba(201, 168, 76, 0.35)' : 'var(--ds-border)',
                }}
              >
                <div className="ds-stack ds-stack--tight h-full">
                  <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.8rem' }}>{game.mode === 'playable' ? '🎮' : '🏆'}</span>
                    <Badge accent={game.mode === 'playable'}>{game.status}</Badge>
                  </div>

                  <Subheading>{game.title}</Subheading>

                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--ds-space-3)',
                      padding: 'var(--ds-space-3)',
                      borderRadius: 'var(--ds-radius-sm)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      fontFamily: 'var(--ds-font-mono)',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div>
                      <Text size="sm" style={{ color: 'var(--ds-text-dim)' }}>
                        Status
                      </Text>
                      <Text size="sm" style={{ color: 'var(--ds-primary)', fontWeight: 600 }}>
                        {game.metric}
                      </Text>
                    </div>
                  </div>

                  <Text size="sm">{game.detail}</Text>

                  {game.href && (
                    <div className="mt-auto pt-2">
                      <ButtonLink href={game.href} variant={game.mode === 'playable' ? 'primary' : 'secondary'} size="sm">
                        {game.mode === 'playable' ? 'Launch game' : 'View details'}
                      </ButtonLink>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function SteamPage(): Promise<JSX.Element> {
  const steam = await fetchSteamProfileData()

  return (
    <>
      <PageHero
        eyebrow="Steam profile"
        title={
          <>
            Steam-inspired profile,
            <br />
            public-data <em>backed.</em>
          </>
        }
        description="This page uses public Steam values whenever available and keeps unavailable slots explicit when live data cannot be verified."
        actions={
          <>
            <ButtonLink href="/games" variant="primary" size="lg">
              Open games hub
            </ButtonLink>
            <ButtonLink href="/achievements" variant="secondary" size="lg">
              View achievements
            </ButtonLink>
            <ButtonLink href="/fun" variant="ghost" size="lg">
              Fun zone
            </ButtonLink>
          </>
        }
      />

      <section className="ds-section ds-section--soft">
        <Container>
          <div className="ds-stack ds-stack--loose">
            <ProfileHeader steam={steam} />
            <StatsGrid steam={steam} />

            <div className="ds-stack">
              <Heading style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}>
                Steam showcase
              </Heading>
              <Divider align="left" />
              <SteamShowcase steam={steam} />
            </div>

            <div className="ds-stack">
              <Heading style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}>
                Steam library slots
              </Heading>
              <Divider align="left" />
              <SteamLibrarySlots steam={steam} />
            </div>

            <div className="ds-stack">
              <Heading style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)' }}>
                Achievement showcase
              </Heading>
              <Divider align="left" />
              <AchievementShowcaseSlots steam={steam} />
            </div>

            <GameLibrarySection />

            <Card
              as="article"
              style={{
                borderColor: 'rgba(122, 154, 122, 0.35)',
                background: 'linear-gradient(135deg, rgba(122, 154, 122, 0.08), rgba(26, 23, 16, 0.96))',
              }}
            >
              <div className="ds-stack ds-stack--tight">
                <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                  <Subheading>Data integrity status</Subheading>
                </div>
                <Text>
                  {steam
                    ? 'Public Steam profile data is connected and shown above where available.'
                    : 'Public Steam data is currently unavailable from this runtime. Slots remain truthful and will auto-populate once the public endpoint responds.'}
                </Text>
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
