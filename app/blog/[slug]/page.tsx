import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import styles from '@/components/blog/blog-page.module.css'
import { buttonClassName } from '@/components/ui/Button'

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.meta.title,
    description: post.meta.excerpt,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const { meta, content } = post

  // Match the tone → category colour class used in the list view
  const categoryClass = {
    life:     styles.categoryLife,
    personal: styles.categoryPersonal,
    real:     styles.categoryReal,
    thoughts: styles.categoryThoughts,
  }[meta.tone] ?? ''

  return (
    <div className={styles.page}>
      <div className={styles.noise} aria-hidden />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} aria-hidden />
        <div className={styles.heroLine} aria-hidden />
        <div className={styles.heroLine} aria-hidden />

        <p className={styles.heroIssue}>Studio Notes / Portfolio System</p>
        <h1 className={styles.heroTitle}>{meta.title}</h1>

        <div className={styles.heroSub}>
          <p className={styles.heroDescription}>{meta.excerpt}</p>

          <a
            href="/blog"
            className={`${styles.heroCta} ${buttonClassName('secondary', 'lg')}`}
          >
            ← All Notes
          </a>
        </div>
      </section>

      {/* ── Post meta bar ────────────────────────────────────────────────── */}
      <section className={styles.posts}>
        <div className={styles.sectionWrap}>

          {/* category + date row */}
          <div className={styles.postsHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className={`${styles.postCategory} ${categoryClass}`}>
                {meta.category}
              </span>
              <span className={styles.postMeta}>
                {meta.date}
                <span className={styles.postMetaDot} aria-hidden>&middot;</span>
                {meta.readTime}
              </span>
            </div>

            {meta.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {meta.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      opacity: 0.5,
                      border: '1px solid currentColor',
                      borderRadius: '2px',
                      padding: '2px 6px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── MDX body ─────────────────────────────────────────────────── */}
          <article className={styles.postCard} style={{ padding: '2.5rem 2rem' }}>
            <div className="prose">{content}</div>
          </article>

        </div>
      </section>
    </div>
  )
}
