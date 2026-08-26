import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './portfolio.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://yorayriniwnl.vercel.app'),
  title: { default: 'Ayush Roy — Product engineer', template: '%s — Ayush Roy' },
  description: 'Selected product engineering work by Ayush Roy across decision systems, computer vision, workflow design, and narrative interfaces.',
  keywords: ['Ayush Roy', 'Yor Ayrin', 'portfolio', 'Next.js', 'TypeScript', 'Python', 'computer vision'],
  openGraph: { title: 'Ayush Roy — Product engineer', description: 'Difficult systems, turned into clear and useful products.', url: 'https://yorayriniwnl.vercel.app', siteName: 'Ayush Roy', images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Ayush Roy product engineering portfolio' }], type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Ayush Roy — Product engineer', description: 'Difficult systems, turned into clear and useful products.', images: ['/og-image.svg'] },
  icons: { icon: '/images/profile.svg' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#efede6',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>
}
