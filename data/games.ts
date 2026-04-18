export type { GameEntry } from './site'
export { GAME_LIBRARY, STEAM_PROFILE_PLACEHOLDERS } from './site'

export type GameCategory = 'arcade' | 'puzzle' | 'strategy' | 'word' | 'typing'
export type GameStatus = 'live' | 'coming-soon'

export type GameControl = {
  key: string
  action: string
}

export type GameMeta = {
  id: string
  slug: string
  title: string
  description: string
  category: GameCategory
  status: GameStatus
  controls: GameControl[]
  featured?: boolean
}

export const GAMES: GameMeta[] = [
  {
    id: 'road-racing',
    slug: 'road-racing',
    title: 'Yor Road Runner',
    description:
      'Browser arcade racer. Switch lanes, dodge traffic, and collect powerups on desktop or mobile.',
    category: 'arcade',
    status: 'live',
    featured: true,
    controls: [
      { key: 'Left / Right', action: 'Switch lane' },
      { key: 'Swipe', action: 'Switch lane on mobile' },
      { key: 'Esc', action: 'Pause or resume' },
    ],
  },
  {
    id: 'chess',
    slug: 'chess',
    title: 'Yor Chess',
    description: 'Play chess against a Stockfish-powered engine at three difficulty levels.',
    category: 'strategy',
    status: 'live',
    featured: true,
    controls: [
      { key: 'Click / Tap', action: 'Move a piece' },
      { key: 'Drag', action: 'Reposition pieces on supported devices' },
      { key: 'Menu', action: 'Change side or difficulty' },
    ],
  },
  {
    id: 'memory',
    slug: 'memory',
    title: 'Memory Match',
    description:
      'Match portfolio tech-stack cards on timed easy and hard boards with score-based rounds.',
    category: 'puzzle',
    status: 'live',
    controls: [
      { key: 'Click', action: 'Flip a card' },
      { key: 'Enter', action: 'Flip the focused card' },
      { key: 'Esc', action: 'Pause or resume' },
    ],
  },
  {
    id: 'snake',
    slug: 'snake',
    title: 'Snake',
    description:
      'Classic snake with wall wrap, multiple food types, and selectable grid sizes.',
    category: 'arcade',
    status: 'live',
    controls: [
      { key: 'Arrow keys / WASD', action: 'Steer the snake' },
      { key: 'Swipe', action: 'Steer on mobile' },
      { key: 'Esc', action: 'Pause or resume' },
    ],
  },
  {
    id: 'tic-tac-toe',
    slug: 'tic-tac-toe',
    title: 'Tic-Tac-Toe',
    description:
      'Classic Tic-Tac-Toe with minimax AI, unlockable board size upgrades, and session tracking.',
    category: 'strategy',
    status: 'live',
    controls: [
      { key: 'Click / Tap', action: 'Place your mark' },
      { key: 'Esc', action: 'Pause or resume' },
    ],
  },
  {
    id: 'wordle',
    slug: 'wordle',
    title: 'DevWordle',
    description:
      'Guess programming terms in daily or free-play modes with five- and six-letter variants.',
    category: 'word',
    status: 'live',
    controls: [
      { key: 'A-Z', action: 'Type a letter' },
      { key: 'Enter', action: 'Submit a guess' },
      { key: 'Backspace', action: 'Delete the previous letter' },
    ],
  },
  {
    id: 'typing',
    slug: 'typing',
    title: 'Typing Challenge',
    description:
      'Test typing speed against real TypeScript snippets pulled from the portfolio codebase.',
    category: 'typing',
    status: 'live',
    controls: [
      { key: 'Any key', action: 'Start and type the snippet' },
      { key: 'Backspace', action: 'Correct the previous character' },
      { key: 'Esc', action: 'Pause or resume' },
    ],
  },
]

export function getLiveGames(): GameMeta[] {
  return GAMES.filter((game) => game.status === 'live')
}

export function getComingSoonGames(): GameMeta[] {
  return GAMES.filter((game) => game.status === 'coming-soon')
}
