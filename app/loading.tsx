/**
 * app/loading.tsx
 *
 * Next.js built-in route loading UI.
 * Renders a full-page skeleton that mirrors the real page structure
 * while the route segment loads. Must be extremely fast — zero JS
 * dependencies, no Framer Motion, no Three.js, no Tailwind classes.
 * All styles are injected via a single <style> tag.
 *
 * Skeleton sections:
 *   1. Navigation bar  (logo left + 3 nav items right)
 *   2. Hero            (text lines left + avatar circle right)
 */

import React from 'react'

// ─────────────────────────────────────────────────────────────
// Shimmer keyframes + layout CSS
// ─────────────────────────────────────────────────────────────

const CSS = `
  @keyframes __sk_shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  .sk-root {
    background:  #0a0906;
    min-height:  100vh;
    overflow:    hidden;
  }

  /* Every skeleton element gets this shimmer */
  .sk {
    background:         linear-gradient(
                          90deg,
                          #1a1710 0px,
                          #2a2218 80px,
                          #1a1710 160px
                        );
    background-size:    400px 100%;
    animation:          __sk_shimmer 1.4s ease-in-out infinite;
    border-radius:      6px;
    flex-shrink:        0;
  }

  /* ── Nav ─────────────────────────────────────────────────── */
  .sk-nav {
    height:        64px;
    border-bottom: 1px solid #2a2520;
    display:       flex;
    align-items:   center;
    justify-content: space-between;
    padding:       0 clamp(1.25rem, 4vw, 3rem);
    box-sizing:    border-box;
  }
  .sk-nav-logo {
    width:  120px;
    height: 24px;
  }
  .sk-nav-items {
    display: flex;
    gap:     16px;
  }
  .sk-nav-item {
    width:  60px;
    height: 16px;
  }

  /* ── Hero ────────────────────────────────────────────────── */
  .sk-hero {
    padding:        8rem clamp(1.25rem, 4vw, 3rem);
    display:        flex;
    align-items:    center;
    justify-content: space-between;
    gap:            3rem;
    box-sizing:     border-box;
    max-width:      80rem;
    margin:         0 auto;
  }
  .sk-hero-left {
    flex:           1;
    display:        flex;
    flex-direction: column;
    gap:            18px;
  }
  .sk-hero-title {
    width:  280px;
    height: 52px;
    border-radius: 8px;
  }
  .sk-hero-sub {
    width:  200px;
    height: 24px;
  }
  .sk-hero-body {
    width:  160px;
    height: 16px;
  }
  .sk-hero-buttons {
    display: flex;
    gap:     12px;
    margin-top: 8px;
  }
  .sk-hero-btn {
    width:        120px;
    height:       44px;
    border-radius: 8px;
  }
  .sk-hero-right {
    flex-shrink: 0;
  }
  .sk-hero-avatar {
    width:        200px;
    height:       200px;
    border-radius: 50%;
  }

  /* ── Responsive: stack on narrow screens ─────────────────── */
  @media (max-width: 767px) {
    .sk-hero {
      flex-direction: column;
      padding-top:    4rem;
      padding-bottom: 4rem;
      align-items:    flex-start;
    }
    .sk-hero-right {
      align-self: center;
    }
    .sk-hero-title { width: min(280px, 90vw); }
    .sk-nav-items  { display: none; }
  }
`

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function Loading(): React.ReactElement {
  return (
    <div className="sk-root" aria-hidden aria-label="Loading page">
      <style>{CSS}</style>

      {/* ── Navigation skeleton ──────────────────────────── */}
      <nav className="sk-nav" aria-hidden>
        {/* Logo placeholder */}
        <div className="sk sk-nav-logo" />

        {/* Nav item placeholders */}
        <div className="sk-nav-items">
          <div className="sk sk-nav-item" />
          <div className="sk sk-nav-item" />
          <div className="sk sk-nav-item" />
        </div>
      </nav>

      {/* ── Hero skeleton ────────────────────────────────── */}
      <section className="sk-hero" aria-hidden>
        {/* Left column: text lines + buttons */}
        <div className="sk-hero-left">
          {/* Large display title bar */}
          <div className="sk sk-hero-title" />
          {/* Sub-heading bar */}
          <div className="sk sk-hero-sub" />
          {/* Body text bar */}
          <div className="sk sk-hero-body" />

          {/* CTA buttons */}
          <div className="sk-hero-buttons">
            <div className="sk sk-hero-btn" />
            <div className="sk sk-hero-btn" />
          </div>
        </div>

        {/* Right column: avatar circle */}
        <div className="sk-hero-right">
          <div className="sk sk-hero-avatar" />
        </div>
      </section>
    </div>
  )
}
