import TicTacToe from '../../../components/games/TicTacToe'

export const metadata = {
  title:       'Tic-Tac-Toe — Yor Ayrin',
  description: 'Classic 3×3 (and unlockable 4×4) Tic-Tac-Toe with Easy / Medium / Hard minimax AI.',
}

export default function TicTacToePage() {
  return (
    <main
      style={{
        // Fill the viewport below the site Navbar.
        // Using dvh so the address bar on mobile doesn't cause overflow.
        height:   'calc(100dvh - var(--ds-header-height, 5rem))',
        overflow: 'hidden',
      }}
    >
      <TicTacToe />
    </main>
  )
}
