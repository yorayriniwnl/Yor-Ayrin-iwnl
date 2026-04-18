import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PROJECTS } from '@/data/projects'
import Container from '../../components/ui/Container'
import PageHero from '../../components/sections/PageHero'
import { ButtonLink } from '../../components/ui/Button'
import { Heading } from '../../components/ui/Typography'
import Text from '../../components/ui/Text'
import Badge from '../../components/ui/Badge'
import Divider from '../../components/ui/Divider'
import {
  buildGalleryItems,
  filterGalleryItems,
  GALLERY_FILTERS,
  type GalleryFilter,
  type GalleryItem,
} from '../../data/gallery'

export const metadata = {
  title: 'Gallery — Portfolio Visuals',
  description:
    'Visual assets auto-generated from project data — screenshots, diagrams, and styled placeholders for every project.',
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder SVG card
// Each project gets a deterministic colour tint from its initials so the
// gallery stays visually varied without any real assets.
// ─────────────────────────────────────────────────────────────────────────────

function PlaceholderCard({ item }: { item: GalleryItem }) {
  // Deterministic hue: stable across renders, unique per project
  const code0 = item.initials.charCodeAt(0) || 65
  const code1 = item.initials.charCodeAt(1) || 65
  const hue   = (code0 * 37 + code1 * 13) % 360
  const sat   = 45 + (code0 % 20)        // 45–65 %
  const ring  = `hsl(${hue} ${sat}% 58%)`
  const glow  = `hsl(${hue} ${sat}% 38%)`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 360"
      role="img"
      aria-label={`Visual placeholder for ${item.title}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        {/* Ambient radial glow */}
        <radialGradient id={`rg-${item.id}`} cx="50%" cy="42%" r="65%">
          <stop offset="0%"   stopColor={ring} stopOpacity="0.14" />
          <stop offset="100%" stopColor="#08070a" stopOpacity="1" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id={`vg-${item.id}`} cx="50%" cy="50%" r="70%">
          <stop offset="55%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        {/* Glow filter on initials */}
        <filter id={`gf-${item.id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="640" height="360" rx="0" fill={`url(#rg-${item.id})`} />
      <rect width="640" height="360" rx="0" fill={`url(#vg-${item.id})`} />

      {/* Subtle dot-grid texture */}
      {Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 16 }, (_, col) => (
          <circle
            key={`d-${row}-${col}`}
            cx={col * 42 + 22}
            cy={row * 42 + 22}
            r="1"
            fill={ring}
            fillOpacity="0.07"
          />
        ))
      )}

      {/* Thin ring */}
      <circle
        cx="320" cy="158" r="68"
        fill="none"
        stroke={ring}
        strokeWidth="1"
        strokeOpacity="0.28"
        strokeDasharray="4 6"
      />

      {/* Outer soft ring */}
      <circle
        cx="320" cy="158" r="82"
        fill="none"
        stroke={ring}
        strokeWidth="1"
        strokeOpacity="0.10"
      />

      {/* Initials — with glow */}
      <text
        x="320" y="178"
        textAnchor="middle"
        fontFamily="ui-monospace, 'Cascadia Code', 'Fira Code', monospace"
        fontSize="54"
        fontWeight="700"
        fill={ring}
        fillOpacity="0.92"
        letterSpacing="-3"
        filter={`url(#gf-${item.id})`}
      >
        {item.initials}
      </text>

      {/* Primary tech pill */}
      <rect
        x={320 - item.primaryTech.length * 4.6 - 14}
        y="232"
        width={item.primaryTech.length * 9.2 + 28}
        height="28"
        rx="14"
        fill={ring}
        fillOpacity="0.10"
        stroke={ring}
        strokeOpacity="0.28"
        strokeWidth="1"
      />
      <text
        x="320" y="251"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="12.5"
        fontWeight="500"
        fill={ring}
        fillOpacity="0.82"
        letterSpacing="0.6"
      >
        {item.primaryTech}
      </text>

      {/* "Screenshot coming soon" footer */}
      <text
        x="320" y="320"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="10"
        fill={glow}
        fillOpacity="0.55"
        letterSpacing="2.5"
      >
        SCREENSHOT COMING SOON
      </text>

      {/* Thin gold horizontal rule above footer */}
      <line
        x1="200" y1="304" x2="440" y2="304"
        stroke={ring}
        strokeWidth="0.5"
        strokeOpacity="0.18"
      />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual gallery card
// ─────────────────────────────────────────────────────────────────────────────

function GalleryCard({ item }: { item: GalleryItem }) {
  const isPlaceholder = item.type === 'placeholder'

  const badgeVariant =
    item.type === 'screenshot' ? 'gold'    :
    item.type === 'diagram'    ? 'accent'  :
    item.type === 'concept'    ? 'rust'    :
    item.type === 'demo'       ? 'rust'    :
    'default'

  return (
    <Link
      href={`/projects/${item.projectSlug}`}
      className="gallery-card ds-card ds-card--interactive"
      aria-label={`Open project: ${item.title}`}
    >
      {/* ── Visual area ── */}
      <div className="gallery-card__visual">
        {isPlaceholder ? (
          <PlaceholderCard item={item} />
        ) : (
          <Image
            src={item.image}
            alt={item.title}
            width={640}
            height={360}
            className="gallery-card__img"
          />
        )}

        {/* Featured star badge — floats top-right over image */}
        {item.featured && (
          <span className="gallery-card__featured-pin" aria-label="Featured project">
            ★
          </span>
        )}
      </div>

      {/* ── Meta ── */}
      <div className="gallery-card__meta">
        <div className="gallery-card__tags">
          <Badge variant={badgeVariant}>{item.type}</Badge>
          {item.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="default">{tag}</Badge>
          ))}
        </div>

        <p className="gallery-card__title">{item.title}</p>

        <p className="gallery-card__desc">{item.description}</p>

        <span className="gallery-card__cta" aria-hidden="true">
          View project →
        </span>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter bar — pure <Link> elements, no JS needed
// ─────────────────────────────────────────────────────────────────────────────

function FilterBar({
  active,
  counts,
}: {
  active: GalleryFilter
  counts: Record<GalleryFilter, number>
}) {
  return (
    <nav className="gallery-filters" aria-label="Filter gallery items">
      {GALLERY_FILTERS.map(({ value, label }) => {
        const isActive = active === value
        const href     = value === 'all' ? '/gallery' : `/gallery?filter=${value}`
        return (
          <Link
            key={value}
            href={href}
            className={`gallery-filter-btn${isActive ? ' gallery-filter-btn--active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {label}
            <span className="gallery-filter-btn__count">
              {counts[value]}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Masonry grid — CSS columns, no external library
// ─────────────────────────────────────────────────────────────────────────────

function MasonryGrid({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="gallery-empty">
        <span className="gallery-empty__icon" aria-hidden="true">◈</span>
        <p>No items match this filter.</p>
      </div>
    )
  }

  return (
    <div className="gallery-masonry">
      {items.map(item => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page — Server Component
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  searchParams: Promise<{ filter?: string }>
}

export default async function GalleryPage({ searchParams }: Props) {
  const params      = await searchParams
  const rawFilter   = params.filter ?? 'all'
  const activeFilter: GalleryFilter =
    (['all', 'screenshots', 'diagrams', 'featured'] as const).includes(rawFilter as GalleryFilter)
      ? (rawFilter as GalleryFilter)
      : 'all'

  const allItems     = buildGalleryItems(PROJECTS)
  const visibleItems = filterGalleryItems(allItems, activeFilter)

  const counts: Record<GalleryFilter, number> = {
    all:         allItems.length,
    screenshots: allItems.filter(i => i.type === 'screenshot').length,
    diagrams:    allItems.filter(i => i.type === 'diagram').length,
    featured:    allItems.filter(i => i.featured).length,
  }

  const headingLabel =
    activeFilter === 'all'
      ? 'All assets'
      : `${activeFilter.charAt(0).toUpperCase()}${activeFilter.slice(1)}`

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        /* ─── Masonry ────────────────────────────────── */
        .gallery-masonry {
          columns: 1;
          column-gap: var(--ds-space-6);
        }
        @media (min-width: 600px)  { .gallery-masonry { columns: 2; } }
        @media (min-width: 1024px) { .gallery-masonry { columns: 3; } }

        /* ─── Card ───────────────────────────────────── */
        .gallery-card {
          display: block;
          break-inside: avoid;
          margin-bottom: var(--ds-space-6);
          text-decoration: none;
          color: inherit;
          /* override ds-card padding for tight image layout */
          padding: 0 !important;
          overflow: hidden;
        }

        .gallery-card__visual {
          position: relative;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid var(--ds-border);
          overflow: hidden;
          border-radius:
            var(--ds-radius-lg) var(--ds-radius-lg) 0 0;
        }

        .gallery-card__img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gallery-card:hover .gallery-card__img {
          transform: scale(1.03);
        }

        .gallery-card__featured-pin {
          position: absolute;
          top: 0.65rem;
          right: 0.65rem;
          width: 1.8rem;
          height: 1.8rem;
          border-radius: 50%;
          background: rgba(201,168,76,0.18);
          border: 1px solid rgba(201,168,76,0.45);
          color: var(--ds-primary);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          backdrop-filter: blur(4px);
        }

        .gallery-card__meta {
          padding: var(--ds-space-4) var(--ds-space-5) var(--ds-space-5);
          display: flex;
          flex-direction: column;
          gap: var(--ds-space-2);
        }

        .gallery-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ds-space-2);
        }

        .gallery-card__title {
          font-size: 0.93rem;
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
          margin: 0;
        }

        .gallery-card__desc {
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.6;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gallery-card__cta {
          font-size: 0.75rem;
          color: var(--ds-primary);
          letter-spacing: 0.02em;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 200ms ease, transform 200ms ease;
          display: block;
          margin-top: var(--ds-space-1);
        }
        .gallery-card:hover .gallery-card__cta {
          opacity: 1;
          transform: translateX(0);
        }

        /* Gold border glow on hover — extends ds-card--interactive */
        .gallery-card.ds-card--interactive:hover {
          box-shadow:
            0 18px 42px rgba(0,0,0,0.38),
            0 0 0 1px rgba(201,168,76,0.28),
            0 0 32px rgba(201,168,76,0.07);
        }

        /* ─── Filter bar ─────────────────────────────── */
        .gallery-filters {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ds-space-2);
          padding-bottom: var(--ds-space-6);
        }

        .gallery-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--ds-space-2);
          padding: 0.4rem 1rem;
          border-radius: var(--ds-radius-pill);
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: all 200ms ease;
          border: 1px solid var(--ds-border);
          background: transparent;
          color: var(--muted);
          cursor: pointer;
          white-space: nowrap;
        }
        .gallery-filter-btn:hover {
          border-color: rgba(201,168,76,0.35);
          color: var(--ds-primary);
          background: rgba(201,168,76,0.05);
        }
        .gallery-filter-btn--active {
          font-weight: 700;
          border-color: rgba(201,168,76,0.55) !important;
          background: rgba(201,168,76,0.12) !important;
          color: var(--ds-primary) !important;
          box-shadow: 0 0 0 1px rgba(201,168,76,0.18);
        }

        .gallery-filter-btn__count {
          font-size: 0.72rem;
          font-weight: 400;
          opacity: 0.6;
          font-variant-numeric: tabular-nums;
        }

        /* ─── Empty state ────────────────────────────── */
        .gallery-empty {
          text-align: center;
          padding: var(--ds-space-20) 0;
          color: var(--muted);
          font-size: 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ds-space-4);
        }
        .gallery-empty__icon {
          font-size: 2rem;
          color: var(--ds-primary);
          opacity: 0.35;
        }

        /* ─── Heading count badge ────────────────────── */
        .gallery-count-badge {
          margin-left: 0.55rem;
          font-size: 0.68em;
          font-weight: 400;
          color: var(--ds-primary);
          vertical-align: middle;
          opacity: 0.8;
        }
      `}</style>

      {/* ── Hero ── */}
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Visual assets from
            <br />
            every <em>project.</em>
          </>
        }
        description={`${counts.all} items auto-generated from project data — screenshots, diagrams, and styled placeholder cards for work in progress.`}
        actions={
          <>
            <ButtonLink href="/projects" variant="primary" size="lg">
              View all projects
            </ButtonLink>
            <ButtonLink href="/media" variant="secondary" size="lg">
              Media kit
            </ButtonLink>
          </>
        }
      />

      {/* ── Grid section ── */}
      <section className="ds-section">
        <Container>
          <div className="ds-stack ds-stack--loose">

            {/* Section heading */}
            <div className="ds-section-intro" style={{ marginBottom: 0 }}>
              <Heading>
                {headingLabel}
                <span className="gallery-count-badge">
                  {visibleItems.length}
                </span>
              </Heading>
              <Text className="max-w-3xl">
                Screenshots are pulled from each project&apos;s{' '}
                <code style={{ fontSize: '0.85em', color: 'var(--ds-primary)' }}>
                  screenshots[]
                </code>{' '}
                array. Projects without screenshots show an auto-generated
                placeholder until real assets are added. Duplicate paths across
                projects are deduplicated.
              </Text>
            </div>

            <Divider align="left" />

            {/* Filter bar */}
            <FilterBar active={activeFilter} counts={counts} />

            {/* Masonry grid */}
            <MasonryGrid items={visibleItems} />

          </div>
        </Container>
      </section>
    </>
  )
}
