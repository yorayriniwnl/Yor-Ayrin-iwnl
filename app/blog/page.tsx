import { getAllPosts } from '@/lib/blog'
import BlogPage from '@/components/blog/BlogPage'

/**
 * /blog — Async Server Component
 *
 * Fetches all post metadata at request time (or build time in static export)
 * and passes it down to the BlogPage client component.
 * The BlogPage component owns layout, styling, and the draft-note editor.
 */
export default async function BlogRoute() {
  const posts = getAllPosts()
  return <BlogPage posts={posts} />
}
