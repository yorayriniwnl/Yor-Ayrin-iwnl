import React from 'react'
import WordGuess from '../../../components/games/WordGuess'

export const metadata = {
  title:       'DevWordle — Games',
  description: 'Guess the programming term in six attempts. Daily and free-play modes, 5-letter and 6-letter words.',
}

export default function WordlePage(): JSX.Element {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <WordGuess />
    </div>
  )
}
