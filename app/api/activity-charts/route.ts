import { NextResponse } from 'next/server'

type DayPoint = {
  date: string
  count: number
}

const WINDOW_DAYS = 30

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function buildWindow(days: number): string[] {
  const today = new Date()
  const list: string[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    list.push(toIsoDate(d))
  }
  return list
}

async function fetchGitHubDaily(username: string): Promise<{ points: DayPoint[]; available: boolean }> {
  const token = process.env.GITHUB_TOKEN ?? process.env.NEXT_PUBLIC_GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'yor-ayrin-iwnl-activity-fetcher',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const pages = [1, 2]
    const allEvents: Array<{ created_at?: string }> = []

    for (const page of pages) {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`,
        { headers, next: { revalidate: 900 } },
      )
      if (!res.ok) break
      const chunk = (await res.json()) as Array<{ created_at?: string }>
      allEvents.push(...chunk)
      if (chunk.length < 100) break
    }

    const windowDays = buildWindow(WINDOW_DAYS)
    const dayMap = new Map<string, number>(windowDays.map((d) => [d, 0]))
    for (const evt of allEvents) {
      if (!evt.created_at) continue
      const day = evt.created_at.slice(0, 10)
      if (!dayMap.has(day)) continue
      dayMap.set(day, (dayMap.get(day) ?? 0) + 1)
    }

    const points = windowDays.map((date) => ({ date, count: dayMap.get(date) ?? 0 }))
    return { points, available: true }
  } catch {
    return { points: buildWindow(WINDOW_DAYS).map((date) => ({ date, count: 0 })), available: false }
  }
}

async function fetchLeetCodeDaily(username: string): Promise<{ points: DayPoint[]; available: boolean }> {
  const query = `
    query userCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          calendar
        }
      }
    }
  `

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      return { points: buildWindow(WINDOW_DAYS).map((date) => ({ date, count: 0 })), available: false }
    }

    const data = (await res.json()) as {
      data?: {
        matchedUser?: {
          userCalendar?: {
            calendar?: string
          }
        }
      }
    }

    const rawCalendar = data.data?.matchedUser?.userCalendar?.calendar
    if (!rawCalendar) {
      return { points: buildWindow(WINDOW_DAYS).map((date) => ({ date, count: 0 })), available: false }
    }

    const parsed = JSON.parse(rawCalendar) as Record<string, number>
    const windowDays = buildWindow(WINDOW_DAYS)

    const points = windowDays.map((date) => {
      const ts = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000)
      return { date, count: parsed[String(ts)] ?? 0 }
    })

    return { points, available: true }
  } catch {
    return { points: buildWindow(WINDOW_DAYS).map((date) => ({ date, count: 0 })), available: false }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const github = searchParams.get('github') ?? process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'yorayriniwnl'
  const leetcode = searchParams.get('leetcode') ?? process.env.NEXT_PUBLIC_LEETCODE_USERNAME ?? 'yorayriniwnl'

  const [githubData, leetcodeData] = await Promise.all([
    fetchGitHubDaily(github),
    fetchLeetCodeDaily(leetcode),
  ])

  return NextResponse.json({
    windowDays: WINDOW_DAYS,
    github: {
      username: github,
      profileUrl: `https://github.com/${github}`,
      available: githubData.available,
      points: githubData.points,
    },
    leetcode: {
      username: leetcode,
      profileUrl: `https://leetcode.com/${leetcode}`,
      available: leetcodeData.available,
      points: leetcodeData.points,
    },
  })
}
