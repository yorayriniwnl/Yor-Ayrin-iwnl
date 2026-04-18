import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PostFrontmatter = {
  title: string
  date: string
  tags: string[]
  excerpt: string
  readTime: string
  category: string
  tone: 'life' | 'personal' | 'real' | 'thoughts'
  featured?: boolean
}

export type PostMeta = PostFrontmatter & {
  slug: string
}

export type PostWithContent = {
  meta: PostMeta
  content: React.ReactElement
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, '')
}

function parseFrontmatter(raw: Record<string, unknown>, slug: string): PostMeta {
  return {
    slug,
    title:    (raw.title    as string) ?? 'Untitled',
    date:     (raw.date     as string) ?? '',
    tags:     (raw.tags     as string[]) ?? [],
    excerpt:  (raw.excerpt  as string) ?? '',
    readTime: (raw.readTime as string) ?? '',
    category: (raw.category as string) ?? '',
    tone:     (raw.tone     as PostFrontmatter['tone']) ?? 'real',
    featured: (raw.featured as boolean) ?? false,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * getAllPosts
 * Reads every .md / .mdx file in content/blog/, parses frontmatter,
 * and returns the list sorted newest-first by date.
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /\.mdx?$/.test(f))

  const posts = files.map((filename) => {
    const slug = slugFromFilename(filename)
    const raw  = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf8')
    const { data } = matter(raw)
    return parseFrontmatter(data, slug)
  })

  // Sort newest-first; fall back to file order when dates are equal
  return posts.sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return db - da
  })
}

/**
 * getPostBySlug
 * Reads a single .md / .mdx file, compiles the MDX body with
 * next-mdx-remote, and returns frontmatter + compiled JSX.
 */
export async function getPostBySlug(slug: string): Promise<PostWithContent | null> {
  const candidates = [`${slug}.md`, `${slug}.mdx`]

  let filepath: string | null = null
  for (const candidate of candidates) {
    const full = path.join(CONTENT_DIR, candidate)
    if (fs.existsSync(full)) {
      filepath = full
      break
    }
  }

  if (!filepath) return null

  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content: mdxSource } = matter(raw)

  const meta = parseFrontmatter(data, slug)

  const { content } = await compileMDX<PostFrontmatter>({
    source: mdxSource,
    options: {
      parseFrontmatter: false, // already parsed above with gray-matter
      mdxOptions: {
        // Add remark/rehype plugins here as needed, e.g.:
        // remarkPlugins: [remarkGfm],
        // rehypePlugins: [rehypePrism],
      },
    },
  })

  return { meta, content }
}
