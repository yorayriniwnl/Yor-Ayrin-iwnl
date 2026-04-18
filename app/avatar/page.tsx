import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import AvatarScene from '../../components/AvatarScene'

export const metadata: Metadata = {
  title:       'Avatar | Yor Ayrin',
  description: 'Interactive 3D avatar — drag to rotate, pinch to zoom.',
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function FallbackAvatar(): React.ReactElement {
  return (
    <div
      style={{
        width:          '100%',
        minHeight:      520,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/avatar-fallback.svg"
        alt="Avatar placeholder"
        style={{ maxWidth: 280, maxHeight: 400, objectFit: 'contain', opacity: 0.8 }}
      />
    </div>
  )
}

// ─── Back button ──────────────────────────────────────────────────────────────

function BackLink(): React.ReactElement {
  return (
    <Link
      href="/"
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '0.375rem',
        fontSize:       '0.875rem',
        fontWeight:     500,
        color:          'rgba(255,255,255,0.55)',
        textDecoration: 'none',
        padding:        '6px 10px 6px 6px',
        borderRadius:   6,
        border:         '1px solid transparent',
        transition:     'color 150ms ease, border-color 150ms ease',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_CSS = `
  @keyframes _avatarPageIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
`

export default function AvatarPage(): React.ReactElement {
  return (
    <main
      style={{
        minHeight:     '100vh',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        padding:       'clamp(1.5rem,4vw,3rem) 1rem',
        background:    'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
      }}
    >
      <style>{PAGE_CSS}</style>

      {/* Header row */}
      <div
        style={{
          width:          '100%',
          maxWidth:        600,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginBottom:   '1.5rem',
        }}
      >
        <BackLink />

        <div
          style={{
            fontFamily:    'monospace',
            fontSize:      11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         'rgba(99,102,241,0.6)',
          }}
        >
          Interactive 3D
        </div>
      </div>

      {/* Canvas card */}
      <div
        style={{
          width:        '100%',
          maxWidth:      600,
          minHeight:     600,
          borderRadius: '16px',
          overflow:     'hidden',
          position:     'relative',
          border:       '1px solid rgba(99,102,241,0.15)',
          background:   '#0a0f1e',
          boxShadow:    '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.06)',
          animation:    '_avatarPageIn 500ms cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        <Suspense fallback={<FallbackAvatar />}>
          <AvatarScene height={600} />
        </Suspense>
      </div>

      {/* Hint + features row */}
      <div
        style={{
          marginTop:   '1rem',
          display:     'flex',
          flexDirection: 'column',
          alignItems:  'center',
          gap:         '0.5rem',
        }}
      >
        <p
          style={{
            fontSize:   '0.75rem',
            color:      'rgba(255,255,255,0.28)',
            letterSpacing: '0.04em',
            margin:     0,
            userSelect: 'none',
            fontFamily: 'monospace',
          }}
        >
          Drag to rotate&nbsp;·&nbsp;Pinch to zoom&nbsp;·&nbsp;Mouse moves head
        </p>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {['Breathing', 'Blinking', 'Head tracking'].map((feat) => (
            <span
              key={feat}
              style={{
                fontSize:      10,
                color:         'rgba(99,102,241,0.5)',
                fontFamily:    'monospace',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {feat}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
