import { type NextRequest } from 'next/server'

const ROBOTS_CONTENT = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard?admin
Disallow: /pitch

Sitemap: https://yorayriniwnl.vercel.app/sitemap.xml
`

export function GET(_req: NextRequest): Response {
  return new Response(ROBOTS_CONTENT, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
