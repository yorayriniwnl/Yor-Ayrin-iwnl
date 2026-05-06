"use client"

import React, { useState } from 'react'
import type { PortfolioDocument, UserProfile } from '../lib/portfolio'
import PortfolioPreview from './PortfolioPreview'

export default function OnboardingForm(): JSX.Element {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [summary, setSummary] = useState('')
  const [website, setWebsite] = useState('')
  const [github, setGithub] = useState('')
  const [repoInput, setRepoInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioDocument | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const profile: UserProfile = {
        name: name || undefined,
        role: role || undefined,
        email: email || undefined,
        summary: summary || undefined,
        website: website || undefined,
        github: github || undefined,
      }

      const repos = repoInput
        .split(/\r?\n|,|;/)
        .map((value) => value.trim())
        .filter(Boolean)

      const response = await fetch('/api/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, repos }),
      })

      const data = await response.json()
      if (!data?.ok) throw new Error(data?.error || 'Failed to generate portfolio')

      setPortfolio(data.portfolio)
      try {
        localStorage.setItem('portfolioDraft', JSON.stringify(data.portfolio))
      } catch {}
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setName('')
    setRole('')
    setEmail('')
    setSummary('')
    setWebsite('')
    setGithub('')
    setRepoInput('')
    setPortfolio(null)
    setError(null)
  }

  return (
    <div className="ds-stack ds-stack--loose">
      <div className="ds-card">
        <form onSubmit={handleSubmit} className="ds-stack">
          <div className="ds-section-intro" style={{ marginBottom: 0 }}>
            <span className="ds-eyebrow">Profile Generator</span>
            <h2 className="ds-subheading">Create a portfolio draft from your inputs</h2>
            <p className="ds-text">
              Add your core profile details and a list of repositories. The logic stays
              the same, but the form now uses the shared editorial system.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="ds-field">
              <span className="ds-field__label">Full name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ayush Roy"
                className="ds-input"
              />
            </label>

            <label className="ds-field">
              <span className="ds-field__label">Role</span>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Frontend engineer"
                className="ds-input"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="ds-field">
              <span className="ds-field__label">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="ds-input"
              />
            </label>

            <label className="ds-field">
              <span className="ds-field__label">Website</span>
              <input
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://your-site.com"
                className="ds-input"
              />
            </label>
          </div>

          <label className="ds-field">
            <span className="ds-field__label">GitHub profile</span>
            <input
              value={github}
              onChange={(event) => setGithub(event.target.value)}
              placeholder="https://github.com/your-handle"
              className="ds-input"
            />
          </label>

          <label className="ds-field">
            <span className="ds-field__label">Short summary</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Short summary or elevator pitch"
              className="ds-textarea"
            />
          </label>

          <label className="ds-field">
            <span className="ds-field__label">Repositories</span>
            <textarea
              value={repoInput}
              onChange={(event) => setRepoInput(event.target.value)}
              placeholder="owner/repo or https://github.com/owner/repo"
              className="ds-textarea"
            />
          </label>

          {error ? (
            <div className="text-sm" style={{ color: 'var(--ds-danger)' }}>
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="ds-button ds-button--primary ds-button--md"
              disabled={loading}
            >
              {loading ? 'Generating' : 'Generate portfolio'}
            </button>

            <button
              type="button"
              className="ds-button ds-button--ghost ds-button--md"
              onClick={reset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {portfolio ? (
        <div className="ds-card">
          <PortfolioPreview portfolio={portfolio} />
        </div>
      ) : null}
    </div>
  )
}
