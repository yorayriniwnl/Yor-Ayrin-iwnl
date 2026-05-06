'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * useGitHubRepoCount
 *
 * Fetches the public repository count for a GitHub user.
 * Falls back to `fallback` if the request fails or the user is offline.
 */
export function useGitHubRepoCount(owner: string, fallback: number) {
  const [count, setCount] = useState(fallback)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    const load = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${owner}`)
        if (!res.ok) return
        const data = await res.json()
        if (mountedRef.current && typeof data?.public_repos === 'number') {
          setCount(data.public_repos)
        }
      } catch {
        // Network unavailable — keep the fallback count.
      }
    }

    load()
    return () => {
      mountedRef.current = false
    }
  }, [owner])

  return count
}
