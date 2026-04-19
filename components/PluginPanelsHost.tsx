'use client'

import { useEffect, useState } from 'react'
import PanelsOverlay from './PanelsOverlay'
import {
  CLOSE_PLUGIN_PANEL_EVENT,
  OPEN_PLUGIN_PANEL_EVENT,
  type OpenPluginPanelDetail,
} from '../lib/pluginPanels'

export default function PluginPanelsHost(): JSX.Element {
  const [openPanelId, setOpenPanelId] = useState<string | null>(null)

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenPluginPanelDetail>).detail
      if (!detail?.panelId) return

      setOpenPanelId(detail.panelId)
    }

    const handleClose = () => setOpenPanelId(null)

    window.addEventListener(OPEN_PLUGIN_PANEL_EVENT, handleOpen as EventListener)
    window.addEventListener(CLOSE_PLUGIN_PANEL_EVENT, handleClose)
    window.addEventListener('close-overlays', handleClose)

    return () => {
      window.removeEventListener(OPEN_PLUGIN_PANEL_EVENT, handleOpen as EventListener)
      window.removeEventListener(CLOSE_PLUGIN_PANEL_EVENT, handleClose)
      window.removeEventListener('close-overlays', handleClose)
    }
  }, [])

  return <PanelsOverlay openPanelId={openPanelId} onClose={() => setOpenPanelId(null)} />
}
