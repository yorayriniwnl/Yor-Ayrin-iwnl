// Example usage of the portfolio pipeline.
import buildPortfolio, { GitHubRepo } from '../lib/portfolio'

// Minimal deterministic example data — replace with real GitHub API responses.
const repos: GitHubRepo[] = [
  {
    name: 'yor-website',
    full_name: 'yorayriniwnl/yor-website',
    html_url: 'https://github.com/yorayriniwnl/YorWebsite',
    description: 'Personal portfolio and site',
    language: 'TypeScript',
    topics: ['portfolio', 'nextjs'],
    stargazers_count: 42,
    forks_count: 4,
    watchers_count: 42,
    size: 1200,
  },
]

const readmes: Record<string, string> = {
  'yorayriniwnl/yor-website': `# Yor Website

Personal portfolio and collection of projects.

## Built with
- Next.js
- TypeScript
- Tailwind CSS

## Highlights
- Responsive portfolio with 3D demos
- Rich interactive cursor and motion
`,
}

const portfolio = buildPortfolio(repos as GitHubRepo[], readmes)
console.log(JSON.stringify(portfolio, null, 2))
