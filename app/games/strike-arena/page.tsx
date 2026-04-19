import React from 'react'
import ClassicShooter3D from '../../../components/games/ClassicShooter3D'

export const metadata = {
  title: 'Yor Strike Arena - Games',
  description:
    'Counter-Strike 1.6 inspired browser shooter with first-person aim, strafing bots, manual reloads, and a low-poly arena built directly into the portfolio.',
}

export default function StrikeArenaPage(): JSX.Element {
  return (
    <div
      style={{
        height: 'calc(100dvh - 3.5rem)',
        minHeight: '38rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ClassicShooter3D />
    </div>
  )
}
