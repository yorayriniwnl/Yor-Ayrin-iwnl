import React from 'react'
import MemoryMatch from '../../../components/games/MemoryMatch'

export const metadata = {
  title: 'Memory Match — Games',
  description:
    'Match tech-stack cards from the portfolio. Easy 4×4 or Hard 6×6. Beat the clock for a speed bonus.',
}

export default function MemoryPage(): JSX.Element {
  return (
    // Give GameShell a defined height so its flex layout works correctly.
    // calc(100dvh - 3.5rem) subtracts the site navbar height.
    <div
      style={{
        height: 'calc(100dvh - 3.5rem)',
        minHeight: '36rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MemoryMatch />
    </div>
  )
}
