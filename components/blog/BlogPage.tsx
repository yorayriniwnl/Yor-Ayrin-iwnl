'use client'

import { useState } from 'react'
import styles from './blog-page.module.css'
import Card from '../ui/Card'
import { Button, ButtonLink, buttonClassName } from '../ui/Button'
import { BLOG_POSTS, BLOG_TICKER_ITEMS } from '../../lib/data'

type BlogPost = (typeof BLOG_POSTS)[number]
const POSTS = BLOG_POSTS

const LIFE_TILES = [
  { eyebrow: '01', label: 'Case Studies', sublabel: 'Product thinking in public' },
  { eyebrow: '02', label: 'Systems', sublabel: 'Architecture and clarity' },
  { eyebrow: '03', label: 'Play Layer', sublabel: 'Games, motion, and interaction' },
  { eyebrow: '04', label: 'Recruiter Lens', sublabel: 'Hireable presentation choices' },
]

const BLOG_DATE_LABEL = 'April 09, 2026'

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

function categoryClassName(tone: BlogPost['tone']): string {
  switch (tone) {
    case 'life':
      return styles.categoryLife
    case 'personal':
      return styles.categoryPersonal
    case 'real':
      return styles.categoryReal
    case 'thoughts':
      return styles.categoryThoughts
    default:
      return ''
  }
}

function cardTone(tone: BlogPost['tone']): 'life' | 'personal' | 'real' | 'thoughts' {
  return tone
}

type BlogPageProps = {
  posts?: BlogPost[]
}

export default function BlogPage({ posts = POSTS }: BlogPageProps): JSX.Element {
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [publishMessage, setPublishMessage] = useState('')

  const wordCount = countWords(postContent)
  const activePosts = posts.length ? posts : POSTS

  const handlePublish = () => {
    const cleanTitle = postTitle.trim()
    const cleanBody = postContent.trim()

    if (!cleanTitle && !cleanBody) {
      setPublishMessage('Write a note first before staging a preview.')
      return
    }

    setPublishMessage(
      `Preview ready: "${cleanTitle || 'Untitled'}" is staged as your next note.`,
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.noise} aria-hidden />

      <section id="hero" className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden />
        <div className={styles.heroLine} aria-hidden />
        <div className={styles.heroLine} aria-hidden />

        <p className={styles.heroIssue}>Studio Notes / Portfolio System</p>
        <h1 className={styles.heroTitle}>
          Real <em>Notes,</em>
          <br />
          Better <em>Systems.</em>
        </h1>

        <div className={styles.heroSub}>
          <p className={styles.heroDescription}>
            A working notebook for design-system choices, project thinking, and
            portfolio decisions. Honest about what is real, explicit about what is
            still placeholder work.
          </p>

          <a href="#posts" className={`${styles.heroCta} ${buttonClassName('secondary', 'lg')}`}>
            Read The Notes
            <span className={styles.heroCtaArrow} aria-hidden>
              &rarr;
            </span>
          </a>
        </div>

        <div className={styles.scrollHint} aria-hidden>
          <div className={styles.scrollLine} />
          Scroll
        </div>
      </section>

      <section className={styles.ticker} aria-label="Blog themes">
        <div className={styles.tickerTrack}>
          {[...BLOG_TICKER_ITEMS, ...BLOG_TICKER_ITEMS].map((item, index) => (
            <div key={`${item}-${index}`} className={styles.tickerItem}>
              <span className={styles.tickerDot} aria-hidden />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="about" className={styles.about}>
        <div className={styles.sectionWrap}>
          <div className={styles.aboutInner}>
            <div>
              <div className={styles.sectionLabel}>About This Blog</div>
              <h2 className={styles.aboutHeading}>
                A real product notebook
                <br />
                for a <em>real portfolio.</em>
              </h2>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>05</div>
                  <div className={styles.statLabel}>Verified studio notes</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>01</div>
                  <div className={styles.statLabel}>Shared design system</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>18</div>
                  <div className={styles.statLabel}>Routes unified</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>100%</div>
                  <div className={styles.statLabel}>Placeholder honesty</div>
                </div>
              </div>
            </div>

            <div className={styles.aboutBody}>
              <p>
                This route started as the strongest visual page in the project, so it
                became the foundation for the rest of the refactor. The layout, spacing,
                typography, and motion language here now inform the entire app.
              </p>
              <p>
                The copy has been reworked to stay honest. Instead of fictional private
                stories, the page now documents actual project decisions, design-system
                thinking, and the tradeoffs involved in making the portfolio feel
                premium and trustworthy.
              </p>
              <p>
                The goal is simple: if a route can look this intentional, every other
                route should inherit the same discipline rather than wandering off into
                separate visual worlds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="posts" className={styles.posts}>
        <div className={styles.sectionWrap}>
          <div className={styles.postsHeader}>
            <div>
              <div className={styles.sectionLabel}>Latest</div>
              <h2 className={styles.postsTitle}>
                Recent <em>Notes</em>
              </h2>
            </div>

            <ButtonLink href="#write" variant="ghost" size="sm" className={styles.viewAllLink}>
              Open Editor
            </ButtonLink>
          </div>

          <div className={styles.postsGrid}>
            {activePosts.map((post, index) => (
              <Card
                key={post.title}
                as="article"
                interactive
                tone={cardTone(post.tone)}
                className={`${styles.postCard} ${post.featured ? styles.postCardFeatured : ''}`}
              >
                <span className={`${styles.postCategory} ${categoryClassName(post.tone)}`}>
                  {post.category}
                </span>

                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>

                <div className={styles.postMeta}>
                  <span>{post.date}</span>
                  <span className={styles.postMetaDot} aria-hidden>
                    &middot;
                  </span>
                  <span>{post.readTime}</span>
                </div>

                <span className={styles.postNumber}>{String(index + 1).padStart(2, '0')}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="life" className={styles.life}>
        <div className={styles.sectionWrap}>
          <div className={styles.lifeInner}>
            <div className={styles.lifeText}>
              <div className={styles.sectionLabel}>The Full Picture</div>
              <h2 className={styles.lifeHeading}>
                Building is <em>messy</em>
                <br />
                and worth documenting.
              </h2>

              <div className={styles.lifeBody}>
                <p>
                  The blog now covers the full spectrum of this portfolio system:
                  flagship case studies, design tokens, recruiter-mode decisions, and
                  the playful edges that keep the site alive.
                </p>
                <p>
                  It is less a diary than a working ledger: why certain choices were
                  made, what got removed, and how to present ambitious work without
                  fabricating evidence.
                </p>
              </div>
            </div>

            <div className={styles.lifeTiles}>
              {LIFE_TILES.map((tile) => (
                <div key={tile.label} className={styles.lifeTile}>
                  <span className={styles.lifeTileEyebrow}>{tile.eyebrow}</span>
                  <div className={styles.lifeTileLabel}>{tile.label}</div>
                  <div className={styles.lifeTileSub}>{tile.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="write" className={styles.write}>
        <div className={styles.sectionWrap}>
          <div className={styles.writeInner}>
            <div className={styles.writeIntro}>
              <div className={styles.sectionLabel}>Draft A Note</div>
              <h2 className={styles.writeHeading}>
                Write your
                <br />
                <em>next note.</em>
              </h2>

              <p className={styles.writeDescription}>
                Use the editor as a staging area for future studio notes. It is a visual
                preview only, not a connected CMS or publishing workflow.
              </p>

              <a href="#write-editor" className={`${styles.heroCta} ${buttonClassName('secondary', 'lg')}`}>
                Open Full Editor
                <span className={styles.heroCtaArrow} aria-hidden>
                  &rarr;
                </span>
              </a>
            </div>

            <div id="write-editor" className={styles.editor}>
              <div className={styles.editorBar}>
                <div className={styles.editorDots} aria-hidden>
                  <span className={styles.editorDot} />
                  <span className={styles.editorDot} />
                  <span className={styles.editorDot} />
                </div>

                <span className={styles.editorTitle}>studio-note.md</span>

                <div className={styles.editorToolbar} aria-hidden>
                  <span className={styles.editorButton}>B</span>
                  <span className={styles.editorButton}>I</span>
                  <span className={styles.editorButton}>H1</span>
                  <span className={styles.editorButton}>&quot;</span>
                </div>
              </div>

              <div className={styles.editorMeta}>
                <label className={styles.editorField}>
                  <span>Category</span>
                  <select defaultValue="Case Study">
                    <option>Case Study</option>
                    <option>Project Notes</option>
                    <option>Build Log</option>
                    <option>Systems</option>
                  </select>
                </label>

                <label className={styles.editorField}>
                  <span>Date</span>
                  <input type="text" defaultValue={BLOG_DATE_LABEL} />
                </label>
              </div>

              <div className={styles.editorBodyTitle}>
                <input
                  type="text"
                  placeholder="Give your note a title..."
                  value={postTitle}
                  onChange={(event) => {
                    setPostTitle(event.target.value)
                    setPublishMessage('')
                  }}
                />
              </div>

              <div className={styles.editorSeparator} />

              <div className={styles.editorContent}>
                <textarea
                  placeholder="Start writing your note... What changed, what mattered, and what should be documented for later?"
                  value={postContent}
                  onChange={(event) => {
                    setPostContent(event.target.value)
                    setPublishMessage('')
                  }}
                />
              </div>

              <div className={styles.editorFooter}>
                <div>
                  <span className={styles.editorWordCount}>
                    {wordCount} word{wordCount === 1 ? '' : 's'}
                  </span>
                  <p className={styles.editorStatus} aria-live="polite">
                    {publishMessage || 'Preview mode only. Publishing is not connected yet.'}
                  </p>
                </div>

                <Button type="button" className={styles.publishButton} onClick={handlePublish}>
                  Stage Note
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
