import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { GAME_LIBRARY } from '../data/site'
import { getComingSoonGames, getLiveGames } from '../data/games'
import {
  clampChessEngineDepth,
  DEFAULT_CHESS_ENGINE_DEPTH,
  extractBestMove,
  isValidFen,
} from '../lib/chessEngine'

describe('games registry', () => {
  it('keeps the playable game list in sync with live routes', () => {
    const liveRoutes = getLiveGames()
      .map((game) => `/games/${game.slug}`)
      .sort()

    const playableRoutes = GAME_LIBRARY
      .filter((game) => game.mode === 'playable')
      .map((game) => game.href)
      .filter((href): href is string => typeof href === 'string')
      .sort()

    expect(playableRoutes).toEqual(liveRoutes)
  })

  it('ships a page route for every live game', () => {
    const missingRoutes = getLiveGames()
      .map((game) => path.join(process.cwd(), 'app', 'games', game.slug, 'page.tsx'))
      .filter((routePath) => !fs.existsSync(routePath))

    expect(missingRoutes).toEqual([])
  })

  it('does not label routed games as coming soon', () => {
    const mismatchedRoutes = getComingSoonGames()
      .map((game) => path.join(process.cwd(), 'app', 'games', game.slug, 'page.tsx'))
      .filter((routePath) => fs.existsSync(routePath))

    expect(mismatchedRoutes).toEqual([])
  })
})

describe('chess engine helpers', () => {
  it('clamps depth to a safe server range', () => {
    expect(clampChessEngineDepth(Number.NaN)).toBe(DEFAULT_CHESS_ENGINE_DEPTH)
    expect(clampChessEngineDepth(2)).toBe(6)
    expect(clampChessEngineDepth(30)).toBe(18)
    expect(clampChessEngineDepth(14.8)).toBe(14)
  })

  it('extracts a legal bestmove token from upstream payloads', () => {
    expect(extractBestMove({ bestmove: 'bestmove e2e4 ponder e7e5' })).toBe('e2e4')
    expect(extractBestMove({ bestmove: 'g7g8q' })).toBe('g7g8q')
    expect(extractBestMove({ bestmove: 'not-a-move' })).toBeNull()
    expect(extractBestMove({})).toBeNull()
  })

  it('validates FEN strings before hitting the upstream engine', () => {
    expect(isValidFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(true)
    expect(isValidFen('invalid fen')).toBe(false)
  })
})
