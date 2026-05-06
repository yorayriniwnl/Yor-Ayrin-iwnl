import { PLUGINS } from '../plugins'

export const LS_PLUGINS = 'settings:plugins'

export function readPluginStates(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(LS_PLUGINS) ?? '{}')
  } catch {
    return {}
  }
}

export function writePluginStates(states: Record<string, boolean>): void {
  try {
    localStorage.setItem(LS_PLUGINS, JSON.stringify(states))
  } catch {
    // ignore storage errors
  }
}

export function isPluginEnabled(pluginId: string): boolean {
  const plugin = PLUGINS.find((p) => p.id === pluginId)
  if (!plugin) return false

  const states = readPluginStates()
  const persisted = states[pluginId]
  if (persisted !== undefined) return persisted

  return plugin.defaultEnabled ?? false
}
