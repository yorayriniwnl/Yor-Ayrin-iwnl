// Server Component — no 'use client' needed (purely presentational)

/**
 * HomeFooter
 *
 * Bottom-of-page footer with brand name, nav links, and copyright.
 * Purely static — renders on the server.
 */
export default function HomeFooter() {
  return (
    <footer>
      <div className="footer-brand">Ayush Roy</div>
      <div className="footer-links">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="footer-copy">Copyright 2026 - Ayush Roy</div>
    </footer>
  )
}
