'use client'

import { HOME_BLOG_PREVIEWS } from '../../data/home'
import { useReveal } from './hooks/useReveal'

/**
 * Hobbies
 *
 * "Personal Curation" blog-preview grid (id="hobbies").
 * Needs 'use client' for useReveal (IntersectionObserver per card).
 */
export default function Hobbies() {
  const { setRef, revealStyle } = useReveal()

  return (
    <section className="blog" id="hobbies">
      <div className="section-wrap">
        <div className="blog-header">
          <div>
            <div className="section-label">Hobbies</div>
            <h2 className="blog-title">
              Personal <em>Curation</em>
            </h2>
          </div>
          <a href="/hobbies" className="view-all">
            View All
          </a>
        </div>

        <div className="blog-grid">
          {HOME_BLOG_PREVIEWS.map((post, index) => (
            <a
              key={post.title}
              ref={setRef(index)}
              data-reveal-key={`blog-${index}`}
              style={revealStyle(`blog-${index}`)}
              className={`blog-card ${post.featured ? 'featured' : ''}`}
              href="/hobbies"
            >
              <span className={`blog-cat ${post.catClass}`}>{post.cat}</span>
              <h3 className="blog-post-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-sep">-</span>
                <span className="blog-read">{post.read}</span>
              </div>
              <span className="blog-number">0{index + 1}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
