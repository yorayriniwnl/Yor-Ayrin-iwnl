// ─── Plugin Registry ──────────────────────────────────────────────────────────

export type PluginMount = 'layout' | 'panel' | 'scene' | 'overlay' | 'none'

export type PluginEntry = {
  id: string
  name: string
  description: string
  mount: PluginMount
  loader: () => Promise<any>
  defaultEnabled?: boolean
}

export const PLUGINS: PluginEntry[] = [
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    description: "Ask questions about Ayush's skills and projects.",
    mount: 'panel',
    defaultEnabled: true,
    loader: () => import('./ai-assistant'),
  },
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    description: 'Live GitHub events feed (falls back to a clearly labeled static sample).',
    mount: 'panel',
    defaultEnabled: false,
    loader: () => import('./activity-feed'),
  },
  {
    id: 'three-engine',
    name: '3D Engine',
    description: 'Example scene extension plugin (not mounted by default in this build).',
    mount: 'scene',
    defaultEnabled: false,
    loader: () => import('./three-engine').catch(() => null),
  },
  {
    id: 'recruiter-mode',
    name: 'Recruiter Mode',
    description: 'Simplified view optimized for recruiters.',
    mount: 'overlay',
    defaultEnabled: false,
    loader: () => Promise.resolve(null),
  },
]

export default PLUGINS

export function getPlugin(id: string): PluginEntry | undefined {
  return PLUGINS.find((p) => p.id === id)
}

export function getPluginsByMount(mount: PluginMount): PluginEntry[] {
  return PLUGINS.filter((p) => p.mount === mount)
}
