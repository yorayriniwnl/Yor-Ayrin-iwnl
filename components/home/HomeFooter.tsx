// Server Component — no 'use client' needed (purely presentational)

/**
 * HomeFooter
 *
 * Full-width footer with brand, nav groups, social links, and copyright.
 * Purely static — renders on the server.
 */

const YEAR = new Date().getFullYear()

const NAV_COLS = [
  {
    title: 'Work',
    links: [
      { label: 'Projects',     href: '/projects' },
      { label: 'Case Studies', href: '/projects/zenith' },
      { label: 'Skills',       href: '/skills' },
      { label: 'Experience',   href: '/experience' },
    ],
  },
  {
    title: 'System',
    links: [
      { label: 'Dashboard',    href: '/dashboard' },
      { label: 'Search',       href: '/search' },
      { label: 'Timeline',     href: '/timeline' },
      { label: 'Achievements', href: '/achievements' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'About',        href: '/about' },
      { label: 'Blog Notes',   href: '/blog' },
      { label: 'Gallery',      href: '/gallery' },
      { label: 'Games',        href: '/games' },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/yorayriniwnl',         external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/yorayriniwnl',    external: true },
  { label: 'Email',    href: 'mailto:yorayriniwnl@gmail.com',           external: false },
  { label: 'Resume',   href: '/resume',                                  external: false },
]

const CSS = `
  .hf-footer {
    border-top: 1px solid rgba(42, 37, 32, 0.9);
    padding: clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 3rem) 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(10,9,6,0.7) 100%);
  }

  .hf-inner {
    max-width: 80rem;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr repeat(3, auto);
    gap: 3rem;
  }

  @media (max-width: 768px) {
    .hf-inner {
      grid-template-columns: 1fr 1fr;
    }
    .hf-brand-col { grid-column: 1 / -1; }
  }

  @media (max-width: 480px) {
    .hf-inner { grid-template-columns: 1fr; }
  }

  .hf-brand {
    font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--ds-text-soft, #f0e8d8);
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .hf-tagline {
    font-size: 0.82rem;
    color: var(--ds-text-muted, #a89878);
    line-height: 1.65;
    max-width: 22rem;
    margin-bottom: 1.5rem;
  }

  .hf-social {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .hf-social-link {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    border: 1px solid rgba(201, 168, 76, 0.22);
    color: var(--ds-text-muted, #a89878);
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s;
  }

  .hf-social-link:hover {
    color: var(--ds-primary, #c9a84c);
    border-color: rgba(201, 168, 76, 0.5);
  }

  .hf-nav-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ds-primary, #c9a84c);
    margin-bottom: 1rem;
  }

  .hf-nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .hf-nav-link {
    font-size: 0.875rem;
    color: var(--ds-text-muted, #a89878);
    text-decoration: none;
    transition: color 0.2s;
  }

  .hf-nav-link:hover { color: var(--ds-text-soft, #f0e8d8); }

  .hf-bottom {
    max-width: 80rem;
    margin: 3rem auto 0;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(42, 37, 32, 0.7);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .hf-copy {
    font-size: 0.78rem;
    color: var(--ds-text-dim, #7a7060);
  }

  .hf-copy em {
    font-style: normal;
    color: var(--ds-primary, #c9a84c);
  }

  .hf-status {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--ds-text-dim, #7a7060);
  }

  .hf-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7a9a7a;
    box-shadow: 0 0 6px rgba(122, 154, 122, 0.6);
    flex-shrink: 0;
    animation: hf-pulse 2.4s ease-in-out infinite;
  }

  @keyframes hf-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
`

export default function HomeFooter() {
  return (
    <footer>
      <style>{CSS}</style>

      <div className="hf-footer">
        <div className="hf-inner">
          {/* Brand column */}
          <div className="hf-brand-col">
            <div className="hf-brand">Ayush Roy</div>
            <p className="hf-tagline">
              Building production-minded systems and interactive product
              surfaces. Open to frontend and full-stack roles.
            </p>
            <div className="hf-social">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hf-social-link"
                  {...(link.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <div className="hf-nav-title">{col.title}</div>
              <ul className="hf-nav-list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hf-nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="hf-bottom">
          <p className="hf-copy">
            © {YEAR} <em>Ayush Roy</em> — All rights reserved. Built with
            Next.js, TypeScript &amp; Framer Motion.
          </p>
          <div className="hf-status">
            <span className="hf-status-dot" aria-hidden />
            Open to opportunities
          </div>
        </div>
      </div>
    </footer>
  )
}
