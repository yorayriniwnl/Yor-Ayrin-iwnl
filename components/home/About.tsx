'use client'

import Link from 'next/link'
import { SITE_PROFILE } from '../../lib/data'
import { HOME_PROJECTS, GITHUB_OWNER } from '../../data/home'
import { useReveal } from './hooks/useReveal'
import { useGitHubRepoCount } from './hooks/useGitHubRepoCount'

/**
 * About
 *
 * Two-column about section with animated stat counters and bio copy.
 * Needs 'use client' for:
 *   - useGitHubRepoCount (live repo count fetch)
 *   - useReveal (IntersectionObserver scroll-reveal on stat cells)
 */
export default function About() {
  const publicRepoCount = useGitHubRepoCount(GITHUB_OWNER, HOME_PROJECTS.length)
  const { setRef, revealStyle } = useReveal()

  const stats: [string, string][] = [
    [String(HOME_PROJECTS.length).padStart(2, '0'), 'Portfolio Projects'],
    [String(publicRepoCount).padStart(2, '0'), 'Public Repos'],
    ['16', 'Skill Signals'],
    ['2027', 'Graduation'],
  ]

  return (
    <section className="about" id="about">
      <div className="section-wrap">
        <div className="about-inner">
          <div className="about-left">
            <div className="section-label">About Me</div>
            <h2 className="about-heading">
              I build things that <em>think.</em>
            </h2>

            <div className="about-stats">
              {stats.map(([num, label], index) => (
                <div
                  className="stat"
                  key={label}
                  ref={setRef(index)}
                  data-reveal-key={`stat-${index}`}
                  style={revealStyle(`stat-${index}`)}
                >
                  <div className="stat-num">{num}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-body">
            <p>
              Real name: Ayush Roy. Virtual name: Yor Ayrin. I&apos;m a
              full-stack developer intern candidate at KIIT focused on Next.js
              product surfaces, Python backend systems, realtime dashboards, and
              computer-vision tools.
            </p>
            <p>{SITE_PROFILE.seekingStatement}</p>
            <p>
              My strongest verified work is Yor AI vs Real Image, Yor Zenith,
              and this site itself.
            </p>
            <p>
              My portfolio uses my resume and GitHub data as the source of
              truth, so the project claims stay clear, current, and easy to
              verify.
            </p>
            <div className="about-links">
              <Link href="/about" className="link-pill">
                About Page
              </Link>
              <a
                href="https://github.com/yorayriniwnl"
                className="link-pill"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yorayriniwnl"
                className="link-pill"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="mailto:yorayriniwnl@gmail.com"
                className="link-pill"
              >
                Email
              </a>
              <a
                href="https://yorayriniwnl.vercel.app"
                className="link-pill"
                target="_blank"
                rel="noreferrer"
              >
                Live Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
