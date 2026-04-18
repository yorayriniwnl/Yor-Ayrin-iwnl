import React from 'react'
import CarGame from '../../../components/games/CarGame'

export const metadata = {
  title: 'Yor Road Runner — Games',
  description:
    'Browser arcade racer. Switch lanes, dodge traffic, and collect powerups. Use arrow keys on desktop or swipe on mobile.',
}

export default function RoadRacingPage(): JSX.Element {
  return (
    <div
      style={{
        height: 'calc(100dvh - 3.5rem)',
        minHeight: '36rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CarGame />
    </div>
  )
}
