import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { GET } from '../app/sitemap.xml/route'
import { getLiveGames } from '../data/games'
import { getAllPosts } from '../lib/blog'
import { getAllProjects } from '../lib/projects'

const BASE_URL = 'https://yorayriniwnl.vercel.app'

function walkFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath]
  })
}

function appPageToRoute(filePath: string): string | null {
  const appDir = path.join(process.cwd(), 'app')
  const parts = path.relative(appDir, filePath).split(path.sep)
  const routeSegments = parts.slice(0, -1)

  if (routeSegments.some((segment) => segment.startsWith('[') || segment.startsWith('@'))) {
    return null
  }

  const visibleSegments = routeSegments.filter(
    (segment) => !(segment.startsWith('(') && segment.endsWith(')')),
  )

  return visibleSegments.length > 0 ? `/${visibleSegments.join('/')}` : '/'
}

function getStaticAppRoutes(): string[] {
  const appDir = path.join(process.cwd(), 'app')

  return walkFiles(appDir)
    .filter((filePath) => path.basename(filePath) === 'page.tsx')
    .map(appPageToRoute)
    .filter((route): route is string => Boolean(route))
    .sort()
}

async function getSitemapUrls(): Promise<string[]> {
  const response = GET({} as Parameters<typeof GET>[0])
  const xml = await response.text()

  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
}

function toUrl(route: string): string {
  return `${BASE_URL}${route}`
}

describe('sitemap coverage', () => {
  it('lists every static app page route', async () => {
    const urls = new Set(await getSitemapUrls())
    const missing = getStaticAppRoutes().filter((route) => !urls.has(toUrl(route)))

    expect(missing).toEqual([])
  })

  it('lists all dynamic blog, game, and project routes', async () => {
    const urls = new Set(await getSitemapUrls())
    const dynamicRoutes = [
      ...getAllPosts().map((post) => `/blog/${encodeURIComponent(post.slug)}`),
      ...getLiveGames().map((game) => `/games/${encodeURIComponent(game.slug)}`),
      ...getAllProjects().map((project) => `/projects/${encodeURIComponent(project.id)}`),
    ]

    const missing = dynamicRoutes.filter((route) => !urls.has(toUrl(route)))

    expect(missing).toEqual([])
  })

  it('does not emit duplicate URLs', async () => {
    const urls = await getSitemapUrls()

    expect(new Set(urls).size).toBe(urls.length)
  })
})
