import TicTacToe from '../../../components/games/TicTacToe'

export const metadata = {
  title:       'Tic-Tac-Toe — Yor Ayrin',
  description: 'Classic 3×3 (and unlockable 4×4) Tic-Tac-Toe with Easy / Medium / Hard minimax AI.',
}

export default function TicTacToePage() {
  return (
    <main
      style={{
        // Use a stable viewport height so mobile browser chrome does not resize the game mid-play.
        minHeight: 'calc(100vh - var(--ds-header-height, 5rem))',
        height: 'calc(100svh - var(--ds-header-height, 5rem))',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      <TicTacToe />
    </main>
  )
}
