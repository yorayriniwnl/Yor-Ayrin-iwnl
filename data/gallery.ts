import type { Project } from './projects'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type GalleryItemType =
  | 'screenshot'
  | 'diagram'
  | 'demo'
  | 'concept'
  | 'placeholder'

export type GalleryItem = {
  id: string
  projectSlug: string
  title: string
  description: string
  /** Absolute path inside /public — empty string for placeholders */
  image: string
  tags: string[]
  type: GalleryItemType
  featured: boolean
  /** First tech tag — used as subtitle on placeholder SVG cards */
  primaryTech: string
  /** Two-letter initials derived from the project title */
  initials: string
}

export type GalleryFilter = 'all' | 'screenshots' | 'diagrams' | 'featured'

export const GALLERY_FILTERS: { value: GalleryFilter; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'screenshots', label: 'Screenshots' },
  { value: 'diagrams',    label: 'Diagrams'    },
  { value: 'featured',    label: 'Featured'    },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toInitials(title: string): string {
  return title
    .split(/[\s\-_]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

// ─────────────────────────────────────────────────────────────────────────────
// Manual seed items — brand/concept assets that live outside a project's
// screenshots[] array. Add entries here for diagrams, demo videos, etc.
// ─────────────────────────────────────────────────────────────────────────────

export const MANUAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'brand-og-image',
    projectSlug: 'yor-ayrin-iwnl',
    title: 'Open Graph Poster',
    description:
      'Reusable social brand image present across the portfolio — used for link previews and identity framing.',
    image: '/og-image.svg',
    tags: ['Brand', 'Portfolio'],
    type: 'concept',
    featured: true,
    primaryTech: 'SVG',
    initials: 'OG',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Auto-builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merges manually defined gallery items with items auto-derived from each
 * project's `screenshots[]` array. Projects without screenshots get a single
 * 'placeholder' card instead.
 *
 * Screenshots that already appear in MANUAL_GALLERY_ITEMS, or that appear in
 * more than one project, are deduplicated — only the first occurrence is kept.
 */
export function buildGalleryItems(projects: Project[]): GalleryItem[] {
  const seenImages = new Set<string>(
    MANUAL_GALLERY_ITEMS.map(m => m.image).filter(Boolean),
  )

  const generated: GalleryItem[] = []

  for (const project of projects) {
    const initials    = toInitials(project.title)
    const primaryTech = project.tech?.[0] ?? project.category

    const dedupedTags = (arr: string[]) =>
      arr.filter((v, i, a) => a.indexOf(v) === i)

    if (project.screenshots && project.screenshots.length > 0) {
      project.screenshots.forEach((src, i) => {
        if (seenImages.has(src)) return
        seenImages.add(src)

        generated.push({
          id:          `${project.id}-screenshot-${i}`,
          projectSlug: project.id,
          title:       i === 0 ? project.title : `${project.title} — view ${i + 1}`,
          description: project.shortDescription,
          image:       src,
          tags:        dedupedTags([...(project.tags ?? []), project.category]),
          type:        'screenshot',
          featured:    project.featured ?? false,
          primaryTech,
          initials,
        })
      })
    } else {
      // No screenshots yet → styled placeholder
      generated.push({
        id:          `${project.id}-placeholder`,
        projectSlug: project.id,
        title:       project.title,
        description: project.shortDescription,
        image:       '',
        tags:        dedupedTags([...(project.tags ?? []), project.category]),
        type:        'placeholder',
        featured:    project.featured ?? false,
        primaryTech,
        initials,
      })
    }
  }

  // Featured items rise to the top; placeholders sink to the bottom
  const all = [...MANUAL_GALLERY_ITEMS, ...generated]
  return all.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return  1
    if (a.type === 'placeholder' && b.type !== 'placeholder') return  1
    if (a.type !== 'placeholder' && b.type === 'placeholder') return -1
    return 0
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter helper
// ─────────────────────────────────────────────────────────────────────────────

export function filterGalleryItems(
  items: GalleryItem[],
  filter: GalleryFilter,
): GalleryItem[] {
  switch (filter) {
    case 'screenshots': return items.filter(i => i.type === 'screenshot')
    case 'diagrams':    return items.filter(i => i.type === 'diagram')
    case 'featured':    return items.filter(i => i.featured)
    default:            return items
  }
}
