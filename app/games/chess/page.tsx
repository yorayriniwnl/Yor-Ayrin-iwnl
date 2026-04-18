import React from 'react'
import Chess from '../../../components/games/Chess'

export const metadata = {
  title:       'Yor Chess — Games',
  description: 'Play chess against a Stockfish-powered engine at three difficulty levels.',
}

export default function ChessPage() {
  return (
    <main
      style={{
        minHeight: 'calc(100dvh - var(--ds-header-height, 5rem))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Chess />
    </main>
  )
}
