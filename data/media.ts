// ─── Types ───────────────────────────────────────────────────────────────────

export type MediaItem = {
  id: string
  title: string
  href: string
  summary: string
  kind: 'document' | 'demo' | 'image'
}

export type YouTubeVideo = {
  id: string
  title: string
  duration: string
  thumbnail: string
  note?: string
}

// ─── Media Items ──────────────────────────────────────────────────────────────

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'resume-pdf',
    title: 'Resume PDF',
    href: '/resume.pdf',
    summary: 'A downloadable resume generated from my current resume data.',
    kind: 'document',
  },
  {
    id: 'portfolio-demo',
    title: 'Portfolio Demo Archive',
    href: '/demo/index.html',
    summary: 'Standalone HTML demo artifact included in the repository for presentation use.',
    kind: 'demo',
  },
  {
    id: 'delivery-demo',
    title: 'Delivery Practice Demo Archive',
    href: '/delivery/index.html',
    summary: 'Standalone delivery practice demo preserved alongside the main product site.',
    kind: 'demo',
  },
  {
    id: 'brand-poster',
    title: 'Brand Poster',
    href: '/og-image.svg',
    summary: 'Reusable social/brand image already present in the codebase.',
    kind: 'image',
  },
]

// ─── YouTube ──────────────────────────────────────────────────────────────────

export const YOUTUBE_CHANNEL = {
  name: '@YorAyriniwnl',
  href: 'https://www.youtube.com/@YorAyriniwnl',
  videosHref: 'https://www.youtube.com/@YorAyriniwnl/videos',
} as const

export const CS2_VIDEOS: YouTubeVideo[] = [
  {
    id: 'OvQpQW67-PE',
    title: 'Featured CS2 Clip (User requested)',
    duration: '0:46',
    thumbnail: 'https://img.youtube.com/vi/OvQpQW67-PE/mqdefault.jpg',
    note: 'Promoted to lead clip per request',
  },
  {
    id: 'VeN7CFtNtfc',
    title: 'Multiple Plot Twists',
    duration: '2:24',
    thumbnail: 'https://img.youtube.com/vi/VeN7CFtNtfc/mqdefault.jpg',
    note: 'Momentum swings and clutch timing in a single short highlight.',
  },
  {
    id: 'RojL3Y_nnfY',
    title: '5k vs 17k Premier Rating',
    duration: '0:26',
    thumbnail: 'https://img.youtube.com/vi/RojL3Y_nnfY/mqdefault.jpg',
    note: 'High-pressure round against stronger rating opposition.',
  },
  {
    id: 'I_QfzFZkROM',
    title: '4k Anubis',
    duration: '0:42',
    thumbnail: 'https://img.youtube.com/vi/I_QfzFZkROM/mqdefault.jpg',
    note: 'Clean four-kill sequence with confident map control.',
  },
  {
    id: 'fq2vhSnPXiU',
    title: 'Give Me A Flash',
    duration: '0:23',
    thumbnail: 'https://img.youtube.com/vi/fq2vhSnPXiU/mqdefault.jpg',
    note: 'Fast utility timing and conversion under short-round pressure.',
  },
  {
    id: 'KTRUJ6VGdok',
    title: 'No Scope To Suicide',
    duration: '0:13',
    thumbnail: 'https://img.youtube.com/vi/KTRUJ6VGdok/mqdefault.jpg',
    note: 'Quick reaction clip that captures pure CS2 chaos.',
  },
  {
    id: 'PemNc_ugQKw',
    title: 'My Major Ready Team',
    duration: '0:56',
    thumbnail: 'https://img.youtube.com/vi/PemNc_ugQKw/mqdefault.jpg',
    note: 'Team chemistry and comms-focused round sequence.',
  },
]
