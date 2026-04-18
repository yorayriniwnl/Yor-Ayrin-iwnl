import { type NextRequest } from 'next/server'

const BASE_URL = 'https://yorayriniwnl.vercel.app'

const STATIC_ROUTES: string[] = [
  '/',
  '/about',
  '/projects',
  '/skills',
  '/resume',
  '/cv',
  '/contact',
  '/timeline',
  '/achievements',
  '/experience',
  '/value-education',
  '/hobbies',
  '/devlog',
  '/stats',
  '/gallery',
  '/media',
  '/games',
  '/steam',
  '/fun',
  '/dashboard',
  '/settings',
]

const PROJECT_SLUGS: string[] = [
  'zenith',
  'ai-detector',
  'yor-smriti',
  'mentor-mentee',
  'yor-ayrin-iwnl',
  'yor-feelings',
  'yor-helios',
  'yor-solar-nexus',
]

function getPriority(path: string): string {
  if (path === '/') return '1.0'
  if (path === '/projects' || path === '/resume') return '0.9'
  if (path === '/about' || path === '/cv' || path === '/dashboard') return '0.8'
  if (
    path === '/skills' ||
    path === '/contact' ||
    path === '/timeline' ||
    path === '/experience' ||
    path === '/achievements'
  )
    return '0.7'
  if (path === '/hobbies' || path === '/devlog' || path === '/stats' || path === '/value-education') return '0.6'
  return '0.5'
}

function getChangeFreq(path: string): string {
  if (path === '/') return 'weekly'
  if (path === '/projects' || path === '/hobbies' || path === '/devlog' || path === '/value-education') return 'weekly'
  if (path === '/resume' || path === '/cv') return 'monthly'
  return 'monthly'
}

function buildUrlEntry(loc: string, changefreq: string, priority: string, lastmod: string): string {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

export function GET(_req: NextRequest): Response {
  const lastmod = new Date().toISOString().split('T')[0]

  const staticEntries = STATIC_ROUTES.map(path =>
    buildUrlEntry(
      `${BASE_URL}${path}`,
      getChangeFreq(path),
      getPriority(path),
      lastmod
    )
  )

  const projectEntries = PROJECT_SLUGS.map(slug =>
    buildUrlEntry(
      `${BASE_URL}/projects/${slug}`,
      'monthly',
      '0.8',
      lastmod
    )
  )

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...projectEntries,
    '</urlset>',
  ].join('\n')

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
