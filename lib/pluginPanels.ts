export const OPEN_PLUGIN_PANEL_EVENT = 'open-plugin-panel'
export const CLOSE_PLUGIN_PANEL_EVENT = 'close-plugin-panel'

export type OpenPluginPanelDetail = {
  panelId: string
}

export function openPluginPanel(panelId: string): void {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<OpenPluginPanelDetail>(OPEN_PLUGIN_PANEL_EVENT, {
      detail: { panelId },
    }),
  )
}

export function closePluginPanel(): void {
  if (typeof window === 'undefined') return

  window.dispatchEvent(new CustomEvent(CLOSE_PLUGIN_PANEL_EVENT))
}
