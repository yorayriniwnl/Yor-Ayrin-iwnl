// ─── Types ───────────────────────────────────────────────────────────────────

export type AchievementItem = {
  id: string
  title: string
  detail: string
  label: string
  kind: 'verified' | 'placeholder'
  href?: string
  date?: string
  dateDisplay?: string
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const ACHIEVEMENT_ITEMS: AchievementItem[] = [
  {
    id: 'achievement-zenith',
    title: 'Flagship solar planning project',
    detail:
      'Yor Zenith combines rooftop feasibility analysis, React/Three.js visualization dashboards, and energy generation simulation into one decision-support project.',
    label: 'Verified project',
    kind: 'verified',
    href: '/projects/zenith',
    date: '2026-04-12',
    dateDisplay: 'Apr 2026',
  },
  {
    id: 'achievement-cs2',
    title: 'Top 3% global rank - Counter-Strike 2 Premier',
    detail:
      'Reached the top 3% of the global competitive ladder in Counter-Strike 2 Premier mode.',
    label: 'Competitive Gaming',
    kind: 'verified',
    date: '2024-12-01',
    dateDisplay: 'Dec 2024',
  },
  {
    id: 'achievement-scouts',
    title: 'Bharat Scouts & Guides - Tritiya Sopan',
    detail:
      'Completed Pratham, Dwitiya, and Tritiya Sopan levels in Bharat Scouts & Guides.',
    label: 'Scouts & Leadership',
    kind: 'verified',
    date: '2022-01-01',
    dateDisplay: '2022',
  },
  {
    id: 'achievement-ai-detector',
    title: 'ML image classifier - Yor AI vs Real Image',
    detail:
      'Built a working computer vision pipeline using OpenCV, Scikit-Learn SVM, and texture features (LBP/GLCM) to distinguish synthetic from real photographs.',
    label: 'Verified project',
    kind: 'verified',
    href: '/projects/ai-detector',
    date: '2026-04-12',
    dateDisplay: 'Apr 2026',
  },
]
