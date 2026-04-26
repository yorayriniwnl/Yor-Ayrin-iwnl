/**
 * app/not-found.tsx
 *
 * Next.js App Router 404 page.
 * Rendered whenever notFound() is called or a route is unmatched.
 * Must be a Server Component (no 'use client').
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Ayush Roy',
  description: 'The page you were looking for could not be found.',
}

const CSS = `
  .nf-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    background: #0a0906;
    color: #ddd5c0;
    font-family: var(--ds-font-body, 'DM Sans', ui-sans-serif, sans-serif);
  }

  .nf-code {
    font-family: var(--ds-font-mono, 'DM Mono', ui-monospace, monospace);
    font-size: clamp(5rem, 20vw, 9rem);
    font-weight: 700;
    line-height: 1;
    color: #c9a84c;
    opacity: 0.18;
    letter-spacing: -0.04em;
    user-select: none;
    margin-bottom: -1.5rem;
  }

  .nf-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nf-label::before,
  .nf-label::after {
    content: '';
    display: inline-block;
    width: 2rem;
    height: 1px;
    background: #c9a84c;
    opacity: 0.5;
  }

  .nf-heading {
    font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
    font-size: clamp(1.75rem, 5vw, 2.75rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1rem;
    color: #f0e8d8;
  }

  .nf-heading em {
    font-style: italic;
    color: #c9a84c;
  }

  .nf-desc {
    max-width: 34rem;
    color: #a89878;
    line-height: 1.7;
    margin-bottom: 2.5rem;
    font-size: 1rem;
  }

  .nf-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nf-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .nf-btn:hover { opacity: 0.8; }

  .nf-btn--primary {
    background: #c9a84c;
    color: #0a0906;
  }

  .nf-btn--ghost {
    border: 1px solid rgba(201, 168, 76, 0.3);
    color: #a89878;
  }
`

export default function NotFound() {
  return (
    <div className="nf-root">
      <style>{CSS}</style>

      <div className="nf-code" aria-hidden>404</div>

      <p className="nf-label">Page not found</p>

      <h1 className="nf-heading">
        Nothing lives <em>here.</em>
      </h1>

      <p className="nf-desc">
        This route doesn&apos;t exist. The page may have moved, been renamed, or
        never existed. Try navigating back to the homepage or viewing my projects.
      </p>

      <div className="nf-actions">
        <Link href="/" className="nf-btn nf-btn--primary">
          ← Home
        </Link>
        <Link href="/projects" className="nf-btn nf-btn--ghost">
          View Projects
        </Link>
      </div>
    </div>
  )
}
