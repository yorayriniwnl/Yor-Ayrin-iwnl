"use client"

import React, { useMemo, useState } from 'react'
import Card from './ui/Card'
import Grid from './ui/Grid'
import { buttonClassName } from './ui/Button'
import { BodyText, Subheading } from './ui/Typography'

const ART_PIECES = [
  {
    id: 1,
    title: 'Midnight Cascade',
    medium: 'Acrylic on Canvas',
    year: '2024',
    emoji: 'W',
    color1: '#1e3a5f',
    color2: '#3b82f6',
    tags: ['abstract', 'blue'],
  },
  {
    id: 2,
    title: 'Ember Fields',
    medium: 'Oil Pastel',
    year: '2024',
    emoji: 'E',
    color1: '#7c1d1d',
    color2: '#f97316',
    tags: ['landscape', 'warm'],
  },
  {
    id: 3,
    title: 'Neon Whispers',
    medium: 'Digital + Watercolor',
    year: '2023',
    emoji: 'N',
    color1: '#2d1b69',
    color2: '#a855f7',
    tags: ['digital', 'neon'],
  },
  {
    id: 4,
    title: 'Forest Mind',
    medium: 'Pencil Sketch',
    year: '2023',
    emoji: 'F',
    color1: '#14532d',
    color2: '#22c55e',
    tags: ['nature', 'sketch'],
  },
  {
    id: 5,
    title: 'Broken Signal',
    medium: 'Mixed Media',
    year: '2024',
    emoji: 'B',
    color1: '#1f2937',
    color2: '#6b7280',
    tags: ['abstract', 'dark'],
  },
  {
    id: 6,
    title: 'Pink Noise',
    medium: 'Spray Paint',
    year: '2023',
    emoji: 'P',
    color1: '#831843',
    color2: '#f472b6',
    tags: ['graffiti', 'pink'],
  },
]

type Piece = (typeof ART_PIECES)[number]

export default function ArtGallery(): JSX.Element {
  const [selected, setSelected] = useState<Piece | null>(null)
  const [filter, setFilter] = useState('all')

  const allTags = useMemo(
    () => ['all', ...Array.from(new Set(ART_PIECES.flatMap((piece) => piece.tags)))],
    [],
  )

  const filtered =
    filter === 'all' ? ART_PIECES : ART_PIECES.filter((piece) => piece.tags.includes(filter))

  return (
    <section id="gallery" className="ds-section">
      <div className="ds-container">
        <div className="ds-section-intro ds-section-intro--center">
          <Subheading>Original work, framed by the same shared system</Subheading>
          <BodyText className="max-w-2xl">
            A gallery surface pulled into the new editorial language without changing
            the playful character of the collection.
          </BodyText>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilter(tag)}
              className={buttonClassName(filter === tag ? 'primary' : 'ghost', 'sm')}
            >
              {tag}
            </button>
          ))}
        </div>

        <Grid cols={3} gap="md">
          {filtered.map((piece) => (
            <button
              key={piece.id}
              type="button"
              onClick={() => setSelected(piece)}
              className="text-left"
            >
              <Card interactive className="h-full">
                <div className="ds-stack ds-stack--tight">
                  <div
                    className="flex h-56 items-center justify-center rounded-[1rem] border border-[var(--ds-border)] text-5xl font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${piece.color1}, ${piece.color2})`,
                      color: 'rgba(255,255,255,0.92)',
                    }}
                  >
                    {piece.emoji}
                  </div>
                  <Subheading>{piece.title}</Subheading>
                  <BodyText className="ds-text--small">
                    {piece.medium} / {piece.year}
                  </BodyText>
                  <div className="ds-chip-row">
                    {piece.tags.map((tag) => (
                      <span key={tag} className="ds-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </Grid>
      </div>

      {selected ? (
        <div className="ds-modal">
          <button
            type="button"
            className="ds-modal__backdrop"
            aria-label="Close artwork preview"
            onClick={() => setSelected(null)}
          />

          <div className="ds-modal__panel">
            <div className="ds-stack">
              <div
                className="flex h-72 items-center justify-center rounded-[1.25rem] border border-[var(--ds-border)] text-7xl font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${selected.color1}, ${selected.color2})`,
                  color: 'rgba(255,255,255,0.92)',
                }}
              >
                {selected.emoji}
              </div>

              <div className="ds-stack ds-stack--tight">
                <span className="ds-badge ds-tag--accent">{selected.year}</span>
                <h3 className="ds-subheading">{selected.title}</h3>
                <p className="ds-text">{selected.medium}</p>
                <div className="ds-chip-row">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="ds-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="ds-button ds-button--secondary ds-button--md"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
