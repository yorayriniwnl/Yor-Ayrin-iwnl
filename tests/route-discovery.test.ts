import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { FOOTER_LINK_GROUPS, NAV_LINKS, NAV_MENU_GROUPS } from '../data/site'
import { SEARCH_ITEMS } from '../lib/searchIndex'

const DISCOVERABILITY_EXEMPTIONS = new Set([
  '/api',
  '/games',
  '/projects',
  '/robots.txt',
  '/sitemap.xml',
])

function getTopLevelRoutes(): string[] {
  return fs
    .readdirSync(path.join(process.cwd(), 'app'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `/${entry.name}`)
    .filter((route) => !DISCOVERABILITY_EXEMPTIONS.has(route))
    .sort()
}

function getDiscoveredRoutes(): Set<string> {
  const navRoutes = NAV_LINKS.map((link) => link.href)
  const menuRoutes = NAV_MENU_GROUPS.flatMap((group) => group.links.map((link) => link.href))
  const footerRoutes = Object.values(FOOTER_LINK_GROUPS).flatMap((group) =>
    group.map((link) => link.href),
  )
  const searchRoutes = SEARCH_ITEMS.map((item) => item.url)

  return new Set(
    [...navRoutes, ...menuRoutes, ...footerRoutes, ...searchRoutes].filter((route) =>
      route.startsWith('/'),
    ),
  )
}

describe('route discoverability', () => {
  it('surfaces every top-level public route somewhere in navigation, footer, or search', () => {
    const publicRoutes = getTopLevelRoutes()
    const discoveredRoutes = getDiscoveredRoutes()

    const missing = publicRoutes.filter((route) => !discoveredRoutes.has(route))

    expect(missing).toEqual([])
  })
})
