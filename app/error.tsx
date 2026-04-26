'use client'

/**
 * app/error.tsx
 *
 * Next.js App Router error boundary.
 * Must be a Client Component (uses reset() callback from Next.js).
 * Rendered when an unhandled error occurs in any route segment.
 */

import { useEffect } from 'react'

const CSS = `
  .err-root {
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

  .err-icon {
    font-size: clamp(3rem, 12vw, 6rem);
    line-height: 1;
    margin-bottom: 1.5rem;
    opacity: 0.6;
    user-select: none;
  }

  .err-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #c04a3a;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .err-label::before,
  .err-label::after {
    content: '';
    display: inline-block;
    width: 2rem;
    height: 1px;
    background: #c04a3a;
    opacity: 0.5;
  }

  .err-heading {
    font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
    font-size: clamp(1.75rem, 5vw, 2.75rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1rem;
    color: #f0e8d8;
  }

  .err-heading em {
    font-style: italic;
    color: #c04a3a;
  }

  .err-desc {
    max-width: 34rem;
    color: #a89878;
    line-height: 1.7;
    margin-bottom: 2.5rem;
    font-size: 1rem;
  }

  .err-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .err-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    text-decoration: none;
    font-family: inherit;
    transition: opacity 0.2s;
  }

  .err-btn:hover { opacity: 0.8; }

  .err-btn--primary {
    background: #c9a84c;
    color: #0a0906;
  }

  .err-btn--ghost {
    background: transparent;
    border: 1px solid rgba(192, 74, 58, 0.3);
    color: #a89878;
  }

  .err-detail {
    margin-top: 2rem;
    padding: 1rem 1.5rem;
    background: rgba(192, 74, 58, 0.06);
    border: 1px solid rgba(192, 74, 58, 0.18);
    border-radius: 0.75rem;
    max-width: 34rem;
    text-align: left;
  }

  .err-detail-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c04a3a;
    margin-bottom: 0.5rem;
  }

  .err-detail-msg {
    font-family: var(--ds-font-mono, 'DM Mono', ui-monospace, monospace);
    font-size: 0.8rem;
    color: #a89878;
    word-break: break-word;
  }
`

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error tracking (Sentry / etc.) in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[ErrorBoundary]', error)
    }
  }, [error])

  const isDev = process.env.NODE_ENV !== 'production'

  return (
    <div className="err-root">
      <style>{CSS}</style>

      <div className="err-icon" aria-hidden>⚠</div>

      <p className="err-label">Something went wrong</p>

      <h2 className="err-heading">
        An unexpected <em>error</em> occurred.
      </h2>

      <p className="err-desc">
        Something broke on this page. You can try reloading, or go back to the
        homepage. If this keeps happening, please reach out.
      </p>

      <div className="err-actions">
        <button className="err-btn err-btn--primary" onClick={reset}>
          Try again
        </button>
        <a href="/" className="err-btn err-btn--ghost">
          ← Home
        </a>
      </div>

      {isDev && error?.message && (
        <div className="err-detail">
          <div className="err-detail-label">Dev error detail</div>
          <div className="err-detail-msg">
            {error.message}
            {error.digest ? ` (digest: ${error.digest})` : ''}
          </div>
        </div>
      )}
    </div>
  )
}
