export type Activity = {
  id: string
  message: string
  ts?: string
  source?: 'static' | 'github' | 'manual' | 'system' | 'presence'
  badge?: string
  repo?: string
}

export const STATIC_ACTIVITY: Activity[] = [
  {
    id: 'activity-portfolio-refactor',
    message: 'Unified the portfolio around the editorial design system extracted from /hobbies.',
    ts: '2026-04-09T09:00:00Z',
    source: 'system',
    badge: 'Verified site work',
  },
  {
    id: 'activity-zenith',
    message: 'Refined Yor Zenith project framing for recruiter-ready case-study presentation.',
    ts: '2026-04-08T12:30:00Z',
    source: 'manual',
  },
  {
    id: 'activity-games',
    message: 'Kept the local Yor Road Runner minigame as the real playable anchor for the games hub.',
    ts: '2026-04-07T16:45:00Z',
    source: 'manual',
  },
  {
    id: 'activity-resume',
    message: 'Replaced invented resume claims with project-backed evidence and explicit placeholders.',
    ts: '2026-04-07T10:00:00Z',
    source: 'system',
  },
  {
    id: 'activity-github-import',
    message: 'Imported additional public repositories from the connected GitHub profile for the project shelf.',
    ts: '2026-04-06T08:15:00Z',
    source: 'github',
  },
]
