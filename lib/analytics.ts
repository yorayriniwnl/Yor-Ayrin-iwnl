import { useEffect } from 'react'

export type AnalyticsEvent = {
  event: string
  page: string
  ts: number
  meta?: Record<string, unknown>
}

export function trackEvent(
  event: string,
  pageOrMeta?: string | Record<string, unknown>,
  meta?: Record<string, unknown>,
): void {
  try {
    const page = typeof pageOrMeta === 'string'
      ? pageOrMeta
      : (typeof window !== 'undefined' ? window.location.pathname : '')

    const payload: AnalyticsEvent = {
      event,
      page,
      ts: Date.now(),
      meta: typeof pageOrMeta === 'string' ? meta : pageOrMeta,
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[analytics]', event, payload.page, payload.meta)
      return
    }

    if (typeof window === 'undefined') return

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  } catch {
  }
}

export function usePageView(): void {
  useEffect(() => {
    trackEvent('page_view', typeof window !== 'undefined' ? window.location.pathname : '')
  }, [])
}
