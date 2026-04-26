import React from 'react'
import type { Metadata } from 'next'
import { SITE_PROFILE } from '../../lib/data'
import RecruiterDashboard from '../../components/RecruiterDashboard'
import QuickApply from '../../components/QuickApply'

// â”€â”€â”€ SEO metadata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const metadata: Metadata = {
  title: 'Recruiter Dashboard | Ayush Roy',
  description: `A one-glance hiring summary for ${SITE_PROFILE.name} - featured projects, core skills, availability status, and direct contact. Built for recruiters who move fast.`,
  openGraph: {
    title: `${SITE_PROFILE.name} - Recruiter Dashboard`,
    description: `${SITE_PROFILE.role} - Open to verified opportunities - ${SITE_PROFILE.websiteLabel}`,
    url: `${SITE_PROFILE.websiteHref}/dashboard`,
    type: 'profile',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function DashboardPage(): JSX.Element {
  return (
    <main
      style={{
        minHeight: '100vh',
        paddingTop: 'calc(var(--ds-header-height, 5rem) + var(--ds-space-8))',
        paddingBottom: 'var(--ds-space-20)',
      }}
    >
      {/* Page header â€” visible above the dashboard */}
      <div
        style={{
          maxWidth: 'var(--ds-container)',
          margin: '0 auto',
          padding: '0 var(--ds-gutter)',
          marginBottom: 'var(--ds-space-4)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ds-space-3)',
            marginBottom: 'var(--ds-space-2)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ds-primary)',
              fontFamily: 'var(--ds-font-mono)',
            }}
          >
            Recruiter View
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: 'var(--ds-radius-pill)',
              background: 'rgba(122,154,122,0.1)',
              border: '1px solid rgba(122,154,122,0.25)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ds-success)',
              fontFamily: 'var(--ds-font-mono)',
            }}
          >
            <span
              aria-hidden
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--ds-success)',
              }}
            />
            Available
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: 'var(--ds-text-dim)',
            fontFamily: 'var(--ds-font-mono)',
            letterSpacing: '0.04em',
          }}
        >
          Everything you need to evaluate, contact, and move fast - no navigation required.
        </p>
      </div>

      {/* Primary dashboard content */}
      <div
        style={{
          maxWidth: 'var(--ds-container)',
          margin: '0 auto',
        }}
      >
        <RecruiterDashboard />
      </div>

      {/* Quick apply panel */}
      <div
        style={{
          maxWidth: '600px',
          margin: 'var(--ds-space-4) auto 0',
          padding: '0 var(--ds-gutter)',
        }}
      >
        <QuickApply />
      </div>

      {/* Bottom spacer for RecruiterStrip clearance */}
      <div style={{ height: '72px' }} aria-hidden="true" />
    </main>
  )
}
