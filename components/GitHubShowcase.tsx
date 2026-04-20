"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useAdaptive } from './ui/AdaptiveProvider'

const RepoCard = dynamic(() => import('./RepoCard'), { ssr: false, loading: () => <div className="repo-card-skeleton rounded-xl p-5 bg-white/3 border border-white/6 animate-pulse" /> })
import Counter from './Counter'

type RepoAPI = {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  fork: boolean
  archived: boolean
}

function GitHubShowcase(): JSX.Element {
  let shouldReduce = false
  try {
    const ad = useAdaptive()
    shouldReduce = !!ad.reducedMotion
  } catch (err) {
    shouldReduce = false
  }
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'yorayriniwnl'
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN

  const [repos, setRepos] = useState<RepoAPI[] | null>(() => {
    try {
      if (typeof window === 'undefined') return null
      const raw = localStorage.getItem('github_cached_repos')
      return raw ? (JSON.parse(raw) as RepoAPI[]) : null
    } catch (err) {
      return null
    }
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    try {
      if (typeof window === 'undefined') return null
      const v = localStorage.getItem('github_last_updated')
      return v ? new Date(v) : null
    } catch (err) {
      return null
    }
  })
  const [autoSync, setAutoSync] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false
      return localStorage.getItem('github_auto_sync') === '1'
    } catch (err) {
      return false
    }
  })

  const fetchRepos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' }
      if (token) headers.Authorization = `token ${token}`

      const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers, cache: 'no-store' })
      if (!res.ok) {
        const body = await res.text()
        throw new Error(`GitHub API error: ${res.status} ${res.statusText} ${body}`)
      }

      const data = (await res.json()) as RepoAPI[]
      const filtered = data.filter((r) => !r.fork && !r.archived)
      filtered.sort((a, b) => b.stargazers_count - a.stargazers_count)
      setRepos(filtered)
      try {
        const ts = new Date()
        setLastUpdated(ts)
        localStorage.setItem('github_last_updated', ts.toISOString())
        // cache raw repo data for quicker hydration
        localStorage.setItem('github_cached_repos', JSON.stringify(filtered))
      } catch (err) {
        // ignore localStorage failures
      }

      // dispatch an event so other UI (assistant/chat/etc.) can merge these project entries
      try {
        const mapped = filtered.map((r) => ({
          id: r.name,
          title: r.name,
          shortDescription: r.description ?? '',
          fullDescription: '',
          tech: r.language ? [r.language] : [],
          github: r.html_url,
          category: 'GitHub',
        }))
        window.dispatchEvent(new CustomEvent('github-updated', { detail: { repos: mapped, timestamp: new Date().toISOString() } }))
      } catch (err) {
        // ignore dispatch errors
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch repositories')
      setRepos(null)
    } finally {
      setLoading(false)
    }
  }, [username, token])

  // optional autosync interval
  useEffect(() => {
    try {
      localStorage.setItem('github_auto_sync', autoSync ? '1' : '0')
    } catch (err) {
      // noop
    }

    if (!autoSync) return undefined
    const id = setInterval(() => {
      void fetchRepos()
    }, 1000 * 60 * 15) // every 15 minutes

    return () => clearInterval(id)
  }, [autoSync, fetchRepos])

  useEffect(() => {
    fetchRepos()
  }, [fetchRepos])

  // if we have cached repos on load, notify other UI (assistant) so they can hydrate quickly
  useEffect(() => {
    if (!repos) return
    try {
      const mapped = repos.map((r) => ({
        id: r.name,
        title: r.name,
        shortDescription: r.description ?? '',
        fullDescription: '',
        tech: r.language ? [r.language] : [],
        github: r.html_url,
        category: 'GitHub',
      }))
      const ts = localStorage.getItem('github_last_updated') || new Date().toISOString()
      window.dispatchEvent(new CustomEvent('github-updated', { detail: { repos: mapped, timestamp: ts } }))
    } catch (err) {
      // ignore
    }
  }, [repos])

  const totalRepos = repos?.length ?? 0
  const totalStars = useMemo(() => (repos ? repos.reduce((s, r) => s + r.stargazers_count, 0) : 0), [repos])
  const list = useMemo(() => (repos ? repos : []), [repos])

  const heatSquares = useMemo(() => Array.from({ length: 14 * 7 }).map((_, i) => (i * 13) % 5), [])
  // adaptive highlight count and compact mode (useAdaptive may throw if provider missing)
  let highlightCount = 3
  let compact = false
  try {
    const ad = useAdaptive()
    if (ad.highlightProjects) highlightCount = 6
    compact = !!ad.recruiterMode
  } catch (err) {
    highlightCount = 3
    compact = false
  }

  const displayList = compact ? list.slice(0, 4) : list

  if (loading) {
    return (
      <section id="github" className="py-20">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-3">GitHub Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mb-6">Selected repositories and a quick view of contribution activity.</p>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="repo-card rounded-xl p-5 bg-white/3 border border-white/6 animate-pulse" />
              ))}
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-xl p-6 bg-gradient-to-b from-gray-900 to-black text-white border border-white/6 animate-pulse">
                <div className="h-5 bg-white/8 rounded w-1/3 mb-4" />
                <div className="h-3 bg-white/6 rounded w-2/3 mb-2" />
                <div className="h-3 bg-white/6 rounded w-1/2" />
              </div>
            </aside>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="github" className="py-20">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-3">GitHub Dashboard</h2>
          <div className="rounded-xl p-6 bg-red-50 border border-red-100">
            <p className="text-red-700">Error fetching repositories: {error}</p>
            <div className="mt-4">
              <button className="btn btn-primary" onClick={fetchRepos}>Retry</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Empty-state: no repositories returned
  if (!loading && !error && list.length === 0) {
    return (
      <section id="github" className="py-20">
        <div className="container">
          <h2 className="text-2xl font-semibold mb-3">GitHub Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mb-6">Selected repositories and a quick view of contribution activity.</p>

          <div className="rounded-xl p-6 bg-white/4 border border-white/6">
            <p className="text-gray-400">No public repositories found for <strong>{username}</strong>. Your profile may be private or there are no repos to show.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href={`https://github.com/${username}`} className="btn btn-primary" target="_blank" rel="noreferrer">View Profile</a>
              <button className="btn" onClick={fetchRepos}>Retry</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="github" className="py-20">
      <div className="container">
        <h2 className="text-2xl font-semibold mb-3">GitHub Dashboard</h2>
        <p className="text-gray-600 max-w-2xl mb-6">Selected repositories and a quick view of contribution activity.</p>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6 sm:grid-cols-2">
            {displayList.map((r, idx) => (
              <RepoCard
                key={r.id}
                name={r.name}
                description={r.description ?? ''}
                language={r.language ?? undefined}
                stars={r.stargazers_count}
                forks={r.forks_count}
                link={r.html_url}
                highlight={idx < highlightCount}
              />
            ))}
          </div>

          <aside className="lg:col-span-1">
            {compact ? (
              <div className="rounded-xl p-6 bg-gradient-to-b from-gray-900 to-black text-white border border-white/6">
                <h3 className="text-lg font-semibold">Top Projects</h3>
                <p className="text-sm text-gray-300 mt-2">Concise view for recruiters</p>
                <div className="mt-3 space-y-2 text-sm text-gray-200">
                  {displayList.slice(0, 4).map((r) => (
                    <div key={r.id} className="flex items-center justify-between">
                      <div className="truncate pr-3">{r.name}</div>
                      <a href={r.html_url} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">View</a>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-6 bg-gradient-to-b from-gray-900 to-black text-white border border-white/6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Contributions</h3>
                    <p className="text-sm text-gray-300 mt-2">Live from GitHub — updates on refresh</p>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-300">Repos</div>
                    <div className="text-2xl font-bold"><Counter to={totalRepos} duration={800} /></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="contrib-grid mt-3">
                    {heatSquares.map((lvl, idx) => (
                      <motion.div
                        key={idx}
                        custom={idx}
                        initial={shouldReduce ? undefined : { opacity: 0, y: 8, scale: 0.95 }}
                        animate={shouldReduce ? undefined : { opacity: 1, y: 0, scale: 1, transition: { delay: idx * 0.005 } }}
                        className={`contrib-cell ${lvl === 0 ? 'c0' : lvl === 1 ? 'c1' : lvl === 2 ? 'c2' : lvl === 3 ? 'c3' : 'c4'}`}
                        title={`contrib ${lvl}`}
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>Less</span>
                    <span>More</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <a href={`https://github.com/${username}`} className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm" target="_blank" rel="noreferrer">View on GitHub</a>
                  <button className="px-3 py-2 rounded-md border border-white/10 text-white text-sm" onClick={fetchRepos}>Refresh</button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      className={`px-3 py-2 rounded-md text-sm ${autoSync ? 'bg-green-600 text-white' : 'border border-white/10 text-white'}`}
                      onClick={() => setAutoSync((s) => !s)}
                    >
                      {autoSync ? 'Auto-sync: On' : 'Auto-sync: Off'}
                    </button>
                    <button className="px-3 py-2 rounded-md border border-white/10 text-white text-sm" onClick={() => {
                      // manual cache clear
                      try { localStorage.removeItem('github_cached_repos') } catch {}
                      void fetchRepos()
                    }}>Refresh & Clear Cache</button>
                  </div>

                  <div className="text-right text-xs text-gray-300">
                    <div className="text-[11px]">Last updated</div>
                    <div className="text-sm font-semibold">{lastUpdated ? lastUpdated.toLocaleString() : 'Never'}</div>
                  </div>
                </div>

                <div className="mt-6 text-sm text-gray-300">
                  <div>Stars: <span className="font-semibold"><Counter to={totalStars} duration={1200} /></span></div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}

export default React.memo(GitHubShowcase)
