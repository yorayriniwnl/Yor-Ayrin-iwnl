import React from 'react'
import Snake from '../../../components/games/Snake'

export const metadata = {
  title:       'Snake — Games',
  description: 'Classic grid-based Snake with six food types, wall wrap-around mode, and three grid sizes.',
}

export default function SnakePage(): JSX.Element {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Snake />
    </div>
  )
}
