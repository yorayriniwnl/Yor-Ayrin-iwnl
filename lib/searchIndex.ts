/**
 * lib/searchIndex.ts
 *
 * Client-side search index for Ayush Roy's portfolio.
 * Hardcoded content - no network requests, no external search library.
 * Scoring is hand-rolled to match the spec precisely.
 */

export type SearchItem = {
  type:  'page' | 'project' | 'skill' | 'action'
  id:    string
  title: string
  body:  string
  url:   string
  tags:  string[]
  icon?: string
}

export type SearchResult = SearchItem & {
  score:        number
  matchedTerms: string[]
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Index data
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SEARCH_ITEMS: SearchItem[] = [
  // â”€â”€ Pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    type:  'page',
    id:    'home',
    title: 'Home',
    body:  'Portfolio homepage',
    url:   '/',
    tags:  ['home'],
    icon:  'ðŸ ',
  },
  {
    type:  'page',
    id:    'about',
    title: 'About',
    body:  'My story, philosophy, and background',
    url:   '/about',
    tags:  ['about', 'bio'],
    icon:  'ðŸ‘¤',
  },
  {
    type:  'page',
    id:    'projects',
    title: 'Projects',
    body:  'All the projects I have built',
    url:   '/projects',
    tags:  ['projects', 'work'],
    icon:  'ðŸ”§',
  },
  {
    type:  'page',
    id:    'skills',
    title: 'Skills',
    body:  'Tech stack and skills visualization',
    url:   '/skills',
    tags:  ['skills', 'tech'],
    icon:  'âš¡',
  },
  {
    type:  'page',
    id:    'resume',
    title: 'Resume',
    body:  'My full resume and work history',
    url:   '/resume',
    tags:  ['resume', 'cv'],
    icon:  'ðŸ“„',
  },
  {
    type:  'page',
    id:    'contact',
    title: 'Contact',
    body:  'Get in touch with me',
    url:   '/contact',
    tags:  ['contact', 'email'],
    icon:  'âœ‰ï¸',
  },
  {
    type:  'page',
    id:    'timeline',
    title: 'Timeline',
    body:  'Career journey and milestones',
    url:   '/timeline',
    tags:  ['timeline', 'career'],
    icon:  'ðŸ“…',
  },
  {
    type:  'page',
    id:    'achievements',
    title: 'Achievements',
    body:  'Verified milestones, accomplishments, and profile highlights',
    url:   '/achievements',
    tags:  ['achievements', 'milestones'],
    icon:  'A',
  },
  {
    type:  'page',
    id:    'stats',
    title: 'Stats',
    body:  'Portfolio metrics, coding activity, and gaming profile stats',
    url:   '/stats',
    tags:  ['stats', 'metrics', 'activity'],
    icon:  'S',
  },
  {
    type:  'page',
    id:    'dashboard',
    title: 'Dashboard',
    body:  'Overview dashboard with profile modules and system views',
    url:   '/dashboard',
    tags:  ['dashboard', 'overview'],
    icon:  'D',
  },
  {
    type:  'page',
    id:    'profile',
    title: 'Profile',
    body:  'Expanded profile framing with highlights, progress, and shelves',
    url:   '/profile',
    tags:  ['profile', 'identity'],
    icon:  'P',
  },
  {
    type:  'page',
    id:    'blog',
    title: 'Blog',
    body:  'Writing, essays, and portfolio notes',
    url:   '/blog',
    tags:  ['blog', 'writing'],
    icon:  'B',
  },
  {
    type:  'page',
    id:    'hobbies',
    title: 'Hobbies',
    body:  'Personal curation across gallery, philosophy, videos, music, and creative experiments.',
    url:   '/hobbies',
    tags:  ['hobbies', 'curation'],
    icon:  'ðŸ“',
  },
  {
    type:  'page',
    id:    'devlog',
    title: 'DevLog',
    body:  'Build diary and dev notes',
    url:   '/devlog',
    tags:  ['devlog', 'diary'],
    icon:  'ðŸ”¨',
  },
  {
    type:  'page',
    id:    'gallery',
    title: 'Gallery',
    body:  'Visual work, illustrations, snapshots, and portfolio assets',
    url:   '/gallery',
    tags:  ['gallery', 'visuals'],
    icon:  'G',
  },
  {
    type:  'page',
    id:    'media',
    title: 'Media',
    body:  'Media shelf for clips, visuals, and embedded portfolio material',
    url:   '/media',
    tags:  ['media', 'videos'],
    icon:  'M',
  },
  {
    type:  'page',
    id:    'cv',
    title: 'CV',
    body:  'Extended curriculum vitae and supporting academic profile',
    url:   '/cv',
    tags:  ['cv', 'resume'],
    icon:  'C',
  },
  {
    type:  'page',
    id:    'steam',
    title: 'Steam',
    body:  'Steam profile, game library context, and gaming identity',
    url:   '/steam',
    tags:  ['steam', 'gaming'],
    icon:  'T',
  },
  {
    type:  'page',
    id:    'settings',
    title: 'Settings',
    body:  'Theme, plugins, and font-size preferences for the portfolio',
    url:   '/settings',
    tags:  ['settings', 'preferences', 'theme'],
    icon:  'O',
  },
  {
    type:  'page',
    id:    'value-education',
    title: 'Value Education',
    body:  'Course notes and prompt-based reflections, including Who are the happiest people?',
    url:   '/value-education',
    tags:  ['value education', 'course', 'reflection'],
    icon:  'ðŸ“š',
  },
  {
    type:  'page',
    id:    'fun',
    title: 'Fun',
    body:  'Games, hobbies, easter eggs',
    url:   '/fun',
    tags:  ['fun', 'games'],
    icon:  'ðŸŽ®',
  },
  // â”€â”€ Projects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    type:  'project',
    id:    'zenith',
    title: 'Yor Zenith',
    body:  'Solar planning platform with React, Three.js, Python, and TypeScript.',
    url:   '/projects/zenith',
    tags:  ['react', 'threejs', 'python', 'solar'],
    icon:  'âš¡',
  },
  {
    type:  'project',
    id:    'ai-detector',
    title: 'AI Detector',
    body:  'AI vs real image classifier with OpenCV, Scikit-Learn, Streamlit, and Python.',
    url:   '/projects/ai-detector',
    tags:  ['python', 'opencv', 'scikit-learn', 'ml', 'ai'],
    icon:  'ðŸ¤–',
  },  {
    type:  'project',
    id:    'mentor-mentee',
    title: 'Mentor-Mentee System',
    body:  'Python mentorship coordination system with Flask, Tkinter, and SQLite.',
    url:   '/projects/mentor-mentee',
    tags:  ['python', 'flask', 'sqlite', 'mentorship'],
    icon:  'M',
  },
  // â”€â”€ Skills â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    type:  'skill',
    id:    'react',
    title: 'React',
    body:  'Used in Yor Zenith dashboards and portfolio UI surfaces',
    url:   '/skills#react',
    tags:  ['frontend', 'javascript'],
    icon:  'âš›ï¸',
  },
  {
    type:  'skill',
    id:    'typescript',
    title: 'TypeScript',
    body:  'Basic resume skill used across public TypeScript repositories',
    url:   '/skills#typescript',
    tags:  ['frontend', 'javascript'],
    icon:  'ðŸ”·',
  },
  {
    type:  'skill',
    id:    'threejs',
    title: 'Three.js',
    body:  '3D visualization used in Yor Zenith and portfolio work',
    url:   '/skills#threejs',
    tags:  ['3d', 'graphics', 'webgl'],
    icon:  'ðŸŒ',
  },
  // â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    type:  'action',
    id:    'download-resume',
    title: 'Download Resume',
    body:  'Download PDF resume',
    url:   '/resume.pdf',
    tags:  ['download', 'pdf'],
    icon:  'â¬‡ï¸',
  },
  {
    type:  'action',
    id:    'copy-email',
    title: 'Copy Email',
    body:  'Copy yorayriniwnl@gmail.com to clipboard',
    url:   '#copy-email',
    tags:  ['email', 'contact'],
    icon:  'ðŸ“‹',
  },
  {
    type:  'action',
    id:    'toggle-theme',
    title: 'Toggle Theme',
    body:  'Switch between dark and light mode',
    url:   '#toggle-theme',
    tags:  ['theme', 'dark', 'light'],
    icon:  'ðŸŒ“',
  },
  {
    type:  'action',
    id:    'github',
    title: 'Open GitHub',
    body:  'View @yorayriniwnl on GitHub',
    url:   'https://github.com/yorayriniwnl',
    tags:  ['github', 'code'],
    icon:  'â­',
  },
]

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Tokenisation helpers
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STOPWORDS = new Set([
  'a', 'an', 'the', 'is', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or',
])

function tokenize(raw: string): string[] {
  return raw
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t))
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Search
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Full-text search over SEARCH_ITEMS.
 *
 * Scoring per token:
 *   +20  title exact match
 *   +15  title starts with token
 *   +10  title contains token
 *   + 5  body contains token
 *   + 8  any tag exact match
 *   + 4  any tag contains token
 *
 * Bonuses:
 *   + 2  type === 'action'
 *   +10  all tokens consecutively match title
 *
 * Returns up to 10 results sorted by descending score.
 */
export function search(query: string): SearchResult[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const results: SearchResult[] = []

  for (const item of SEARCH_ITEMS) {
    const titleLC = item.title.toLowerCase()
    const bodyLC  = item.body.toLowerCase()

    let score         = 0
    const matchedSet  = new Set<string>()

    for (const token of tokens) {
      let tokenScore = 0

      // Title scoring
      if (titleLC === token) {
        tokenScore += 20
      } else if (titleLC.startsWith(token)) {
        tokenScore += 15
      } else if (titleLC.includes(token)) {
        tokenScore += 10
      }

      // Body scoring
      if (bodyLC.includes(token)) {
        tokenScore += 5
      }

      // Tags scoring
      for (const tag of item.tags) {
        const tagLC = tag.toLowerCase()
        if (tagLC === token) {
          tokenScore += 8
          break
        } else if (tagLC.includes(token)) {
          tokenScore += 4
          // don't break â€” keep looking for exact match in subsequent tags
        }
      }

      if (tokenScore > 0) {
        score += tokenScore
        matchedSet.add(token)
      }
    }

    // Bonus: action items surface slightly higher
    if (item.type === 'action' && score > 0) {
      score += 2
    }

    // Bonus: all tokens consecutively appear in title
    if (tokens.length > 1 && tokens.every((t) => titleLC.includes(t))) {
      const joined = tokens.join(' ')
      if (titleLC.includes(joined)) {
        score += 10
      }
    }

    if (score > 0) {
      results.push({
        ...item,
        score,
        matchedTerms: Array.from(matchedSet),
      })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 10)
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Additional exports
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Returns the last N 'page' items in the index.
 * Simulates recency with a fixed reverse order since there is no session data.
 */
export function getRecentItems(limit = 5): SearchItem[] {
  return SEARCH_ITEMS
    .filter((item) => item.type === 'page')
    .slice(-limit)
    .reverse()
}

/** Returns all action items. */
export function getActionItems(): SearchItem[] {
  return SEARCH_ITEMS.filter((item) => item.type === 'action')
}

/** Exposes the full index for the dedicated search page. */
export function getAllItems(): SearchItem[] {
  return [...SEARCH_ITEMS]
}
