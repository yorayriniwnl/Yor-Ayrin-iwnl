'use client'

import { HOME_EXPERIENCE_ITEMS } from '../../data/home'
import { useReveal } from './hooks/useReveal'

/**
 * Experience
 *
 * Track-record section listing project work and education.
 * Needs 'use client' for useReveal (IntersectionObserver per item).
 */
export default function Experience() {
  const { setRef, revealStyle } = useReveal()

  return (
    <section className="experience" id="experience">
      <div className="section-wrap">
        <div className="exp-inner">
          <div className="exp-left">
            <div className="section-label">Track Record</div>
            <h2 className="exp-heading">
              Work that <em>speaks</em>
              <br />
              for itself.
            </h2>
          </div>

          <div className="exp-list">
            {HOME_EXPERIENCE_ITEMS.map((item, index) => (
              <div
                className="exp-item"
                key={item.title}
                ref={setRef(index)}
                data-reveal-key={`exp-${index}`}
                style={revealStyle(`exp-${index}`)}
              >
                <div className="exp-item-header">
                  <div className="exp-title">{item.title}</div>
                  {item.date ? (
                    <span className="exp-date">{item.date}</span>
                  ) : null}
                </div>
                <div className="exp-meta">{item.meta}</div>
                <p className="exp-summary">{item.summary}</p>
                <ul className="exp-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <span className={`exp-kind ${item.kindClass}`}>
                  {item.kind}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
