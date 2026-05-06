'use client'

import { HOME_FEATURE_LINKS } from '../../data/home'
import { useReveal } from './hooks/useReveal'

export default function FeatureLayer() {
  const { setRef, revealStyle } = useReveal()

  return (
    <section className="feature-layer" id="feature-layer">
      <div className="section-wrap">
        <div className="feature-header">
          <div>
            <div className="section-label">Site System</div>
            <h2 className="feature-title">
              Connected <em>Features</em>
            </h2>
          </div>
          <a href="/dashboard" className="view-all">
            Open Dashboard
          </a>
        </div>

        <div className="feature-grid">
          {HOME_FEATURE_LINKS.map((feature, index) => (
            <a
              key={feature.href}
              ref={setRef(index)}
              data-reveal-key={`feature-${index}`}
              style={revealStyle(`feature-${index}`)}
              className="feature-card"
              href={feature.href}
            >
              <div className="feature-card-top">
                <span className="feature-eyebrow">{feature.eyebrow}</span>
                <span className="feature-status">{feature.status}</span>
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-summary">{feature.summary}</p>
              <span className="feature-card-link">Open layer</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
