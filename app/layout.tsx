import '../styles/globals.css'
import '../styles/design-system.css'
import type { Metadata } from 'next'
import React from 'react'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Mono, DM_Sans, Playfair_Display } from 'next/font/google'
import AppChrome from '../components/AppChrome'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ThemeProvider from '../components/ui/ThemeProvider'
import AdaptiveProvider from '../components/ui/AdaptiveProvider'
import ClientShell from '../components/ClientShell'

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ds-body',
})

const displayFont = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-ds-display',
})

const monoFont = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ds-mono',
})

/* Editorial serif â€” Cormorant Garamond for hero display text */
const serifFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-ds-serif',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yorayriniwnl.vercel.app'
const THEME_BOOTSTRAP_SCRIPT = `
(() => {
  try {
    const stored = localStorage.getItem('theme')
    const preference =
      stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'dark'
    const resolved =
      preference === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : preference
    const root = document.documentElement
    root.setAttribute('data-theme', resolved)
    root.classList.remove('theme-dark', 'theme-minimal')
    root.classList.add(resolved === 'light' ? 'theme-minimal' : 'theme-dark')
    root.style.colorScheme = resolved
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', resolved === 'light' ? '#f5efe5' : '#0a0906')
  } catch {}
})()
`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Ayush Roy - Developer Portfolio',
    template: '%s | Ayush Roy',
  },
  description:
    "Full-stack developer intern candidate at KIIT building Next.js product surfaces, Python backend systems, realtime dashboards, and computer-vision tools.",
  keywords: [
    'Ayush Roy', 'Yor Ayrin', 'portfolio', 'frontend developer', 'computer vision',
    'solar planning', 'react', 'typescript', 'web developer', 'india',
  ],
  authors: [{ name: 'Ayush Roy', url: 'https://github.com/yorayriniwnl' }],
  creator: 'Ayush Roy',
  openGraph: {
    title: 'Ayush Roy - Developer Portfolio',
    description:
      'Internship-ready portfolio with full-stack projects, realtime systems, and GitHub-verified execution.',
    url: SITE_URL,
    siteName: 'Ayush Roy',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Ayush Roy - Portfolio' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Roy - Developer Portfolio',
    description:
      'Internship-ready portfolio with full-stack projects, realtime systems, and GitHub-verified execution.',
    images: ['/og-image.svg'],
    creator: '@yorayriniwnl',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/images/profile.svg',
    shortcut: '/images/profile.svg',
    apple: '/images/profile.svg',
  },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full theme-dark ${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} ${serifFont.variable}`}
      data-theme="dark"
      data-scroll-behavior="smooth"
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0906" />
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {THEME_BOOTSTRAP_SCRIPT}
        </Script>
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Ayush Roy',
              url: SITE_URL,
              sameAs: ['https://github.com/yorayriniwnl', 'https://linkedin.com/in/yorayriniwnl'],
              jobTitle: 'Full Stack Developer Intern Candidate',
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col ds-root">
        <ThemeProvider>
          <AdaptiveProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--ds-primary)] focus:text-[var(--ds-bg)] focus:rounded-full"
            >
              Skip to content
            </a>
            <AppChrome nav={<Navbar />} footer={<Footer />} shell={<ClientShell />}>
              {children}
            </AppChrome>
          </AdaptiveProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
