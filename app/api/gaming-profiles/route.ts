import { NextResponse } from 'next/server'

type ChessProfileResponse = {
  url?: string
  username?: string
  followers?: number
  league?: string
  joined?: number
  last_online?: number
}

type ChessModeStats = {
  last?: { rating?: number }
  best?: { rating?: number }
  record?: { win?: number; loss?: number; draw?: number }
}

type ChessStatsResponse = {
  chess_rapid?: ChessModeStats
  chess_blitz?: ChessModeStats
  chess_daily?: ChessModeStats
}

const CHESS_USERNAME = 'yorayriniwnl'
const CHESS_FALLBACK = {
  username: CHESS_USERNAME,
  profileUrl: 'https://www.chess.com/member/yorayriniwnl',
  live: false,
  followers: 4,
  league: 'Legend',
  joinedAt: '2025-11-25T14:27:25.000Z',
  lastOnlineAt: '2026-04-18T02:27:09.000Z',
  rapid: {
    rating: 572,
    best: 801,
    wins: 295,
    losses: 286,
    draws: 26,
  },
  blitz: {
    rating: 522,
    best: 771,
    wins: 12,
    losses: 21,
    draws: 1,
  },
  daily: {
    rating: 1054,
    wins: 0,
    losses: 1,
    draws: 0,
  },
} as const

function toIso(timestamp?: number): string | null {
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) return null
  return new Date(timestamp * 1000).toISOString()
}

function extractMode(mode?: ChessModeStats) {
  return {
    rating: mode?.last?.rating ?? 0,
    best: mode?.best?.rating ?? 0,
    wins: mode?.record?.win ?? 0,
    losses: mode?.record?.loss ?? 0,
    draws: mode?.record?.draw ?? 0,
  }
}

async function fetchChessProfile() {
  try {
    const [profileRes, statsRes] = await Promise.all([
      fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME}`, {
        next: { revalidate: 21600 },
      }),
      fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`, {
        next: { revalidate: 21600 },
      }),
    ])

    if (!profileRes.ok || !statsRes.ok) return CHESS_FALLBACK

    const profile = (await profileRes.json()) as ChessProfileResponse
    const stats = (await statsRes.json()) as ChessStatsResponse

    return {
      username: profile.username ?? CHESS_USERNAME,
      profileUrl: profile.url ?? CHESS_FALLBACK.profileUrl,
      live: true,
      followers: profile.followers ?? 0,
      league: profile.league ?? 'Unranked',
      joinedAt: toIso(profile.joined),
      lastOnlineAt: toIso(profile.last_online),
      rapid: extractMode(stats.chess_rapid),
      blitz: extractMode(stats.chess_blitz),
      daily: {
        rating: stats.chess_daily?.last?.rating ?? 0,
        best: 0,
        wins: stats.chess_daily?.record?.win ?? 0,
        losses: stats.chess_daily?.record?.loss ?? 0,
        draws: stats.chess_daily?.record?.draw ?? 0,
      },
    }
  } catch {
    return CHESS_FALLBACK
  }
}

export async function GET() {
  const chess = await fetchChessProfile()

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    chess,
    clashRoyale: {
      tag: '990VPUVR2',
      lookupUrl: 'https://royaleapi.com/player/990VPUVR2',
      note:
        'Official Clash Royale player stats require an authenticated API token, so this site stores the verified player tag and links out for live lookup.',
    },
    clashOfClans: {
      tag: 'YPLR2PQRL',
      lookupUrl: 'https://www.clashofstats.com/players/YPLR2PQRL/summary',
      note:
        'Official Clash of Clans player stats require an authenticated API token, so this site stores the verified player tag and links out for live lookup.',
    },
  })
}
