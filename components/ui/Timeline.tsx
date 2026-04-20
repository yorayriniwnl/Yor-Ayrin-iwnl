"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TIMELINE_EVENTS, type TimelineEvent } from '../../lib/timeline'

function tagTone(type: TimelineEvent['type']): string {
  switch (type) {
    case 'education':
      return 'var(--ds-info)'
    case 'project':
      return 'var(--ds-primary)'
    case 'milestone':
      return 'var(--ds-success)'
    default:
      return 'var(--ds-text-dim)'
  }
}

export default function Timeline(): JSX.Element {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <div className="ds-container">
      <div className="ds-grid ds-grid--cols-1 ds-grid--gap-md">
        {TIMELINE_EVENTS.map((event) => {
          const isExpanded = Boolean(expanded[event.id])

          return (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.42 }}
              className="ds-card"
            >
              <div className="ds-stack ds-stack--tight">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="ds-stack ds-stack--tight">
                    <span className="ds-tag" style={{ color: tagTone(event.type) }}>
                      {event.type}
                    </span>
                    <div className="ds-text ds-text--small ds-text--mono">{event.date}</div>
                    <h3 className="ds-subheading">{event.title}</h3>
                    {event.subtitle ? <p className="ds-text">{event.subtitle}</p> : null}
                    {event.tags?.length ? (
                      <div className="ds-chip-row">
                        {event.tags.map((tag) => (
                          <span key={tag} className="ds-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className="ds-button ds-button--ghost ds-button--sm"
                    onClick={() =>
                      setExpanded((previous) => ({
                        ...previous,
                        [event.id]: !previous[event.id],
                      }))
                    }
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="ds-stack ds-stack--tight"
                  >
                    <div className="ds-divider" />
                    <p className="ds-text">{event.description}</p>
                    {event.link ? (
                      <a href={event.link} className="ds-button ds-button--secondary ds-button--sm">
                        Open project
                      </a>
                    ) : null}
                  </motion.div>
                ) : null}
              </div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
