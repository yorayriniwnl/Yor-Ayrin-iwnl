'use client'

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  ComponentType,
} from 'react'
import { PLUGINS } from '../plugins'
import { isPluginEnabled } from '../lib/pluginState'

// ─── Props ────────────────────────────────────────────────────────────────────

export type PanelsOverlayProps = {
  openPanelId: string | null
  onClose: () => void
}

// ─── Skeleton placeholder ─────────────────────────────────────────────────────

function PanelSkeleton(): React.JSX.Element {
  return (
    <div className="po-skeleton" aria-hidden="true">
      <div className="po-skeleton__header" />
      <div className="po-skeleton__body">
        <div className="po-skeleton__line po-skeleton__line--full"  />
        <div className="po-skeleton__line po-skeleton__line--wide"  />
        <div className="po-skeleton__line po-skeleton__line--short" />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PanelsOverlay({
  openPanelId,
  onClose,
}: PanelsOverlayProps): React.JSX.Element | null {
  const [PluginComponent, setPluginComponent] = useState<ComponentType<{}> | null>(null)
  const [loadError, setLoadError]             = useState<boolean>(false)
  const [loadingPlugin, setLoadingPlugin]     = useState<boolean>(false)
  const [disabledBySettings, setDisabledBySettings] = useState<boolean>(false)
  const [unsupportedMount, setUnsupportedMount] = useState<boolean>(false)
  const [visible, setVisible]                 = useState<boolean>(false)
  const panelRef                              = useRef<HTMLDivElement>(null)
  const prevIdRef                             = useRef<string | null>(null)

  // Drive CSS transition: set visible one tick after mount so translate animates
  useEffect(() => {
    if (openPanelId) {
      // tiny delay to let the element mount before applying the open class
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
    }
  }, [openPanelId])

  // Load plugin when id changes
  useEffect(() => {
    if (!openPanelId || openPanelId === prevIdRef.current) return
    prevIdRef.current = openPanelId

    const plugin = PLUGINS.find((p) => p.id === openPanelId)
    if (!plugin) return

    if (plugin.mount !== 'panel') {
      setUnsupportedMount(true)
      setDisabledBySettings(false)
      setLoadingPlugin(false)
      setPluginComponent(null)
      return
    }

    if (!isPluginEnabled(plugin.id)) {
      setDisabledBySettings(true)
      setUnsupportedMount(false)
      setLoadingPlugin(false)
      setPluginComponent(null)
      return
    }

    setLoadingPlugin(true)
    setLoadError(false)
    setDisabledBySettings(false)
    setUnsupportedMount(false)
    setPluginComponent(null)

    plugin
      .loader()
      .then((mod: { default?: unknown; [key: string]: unknown }) => {
        const Component = mod?.default ?? null
        if (Component) {
          setPluginComponent(() => Component as ComponentType<{}>)
        } else {
          setLoadError(true)
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoadingPlugin(false))
  }, [openPanelId])

  // Reset when closed
  useEffect(() => {
    if (!openPanelId) {
      prevIdRef.current = null
      setPluginComponent(null)
      setLoadError(false)
      setDisabledBySettings(false)
      setUnsupportedMount(false)
    }
  }, [openPanelId])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!openPanelId) return
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openPanelId, handleKeyDown])

  // Retry loader
  function retry(): void {
    prevIdRef.current = null
    if (openPanelId) {
      const fakeIdChange = openPanelId
      setLoadError(false)
      setLoadingPlugin(true)
      const plugin = PLUGINS.find((p) => p.id === fakeIdChange)
      if (!plugin) return
      if (plugin.mount !== 'panel') {
        setUnsupportedMount(true)
        setLoadingPlugin(false)
        return
      }
      if (!isPluginEnabled(plugin.id)) {
        setDisabledBySettings(true)
        setLoadingPlugin(false)
        return
      }
      plugin
        .loader()
        .then((mod: { default?: unknown; [key: string]: unknown }) => {
          const Component = mod?.default ?? null
          if (Component) {
            setPluginComponent(() => Component as ComponentType<{}>)
          } else {
            setLoadError(true)
          }
        })
        .catch(() => setLoadError(true))
        .finally(() => setLoadingPlugin(false))
    }
  }

  if (!openPanelId) return null

  const plugin        = PLUGINS.find((p) => p.id === openPanelId)
  const pluginName    = plugin?.name ?? 'Plugin'
  const isOpen        = visible && !!openPanelId

  return (
    <>
      <style>{`
        /* ── Backdrop (mobile only) ── */
        .po-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
        }
        @media (max-width: 767px) {
          .po-backdrop {
            display: block;
          }
        }

        /* ── Panel ── */
        .po-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          height: 100vh;
          z-index: 1200;
          background: var(--ds-bg, #060a14);
          border-left: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
          transform: translateX(100%);
          transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
          overflow: hidden;
        }
        .po-panel--open {
          transform: translateX(0);
        }
        @media (max-width: 440px) {
          .po-panel {
            width: 100%;
          }
        }

        /* ── Panel header ── */
        .po-header {
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 52px;
          border-bottom: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          flex-shrink: 0;
          gap: 8px;
        }
        .po-header__name {
          flex: 1;
          font-size: 14px;
          font-weight: 700;
          color: var(--ds-text, #e8effe);
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .po-close {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: transparent;
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ds-text-muted, #8892aa);
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .po-close:hover {
          background: var(--ds-surface, rgba(255,255,255,0.05));
          color: var(--ds-text, #e8effe);
        }

        /* ── Content area ── */
        .po-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* ── Error state ── */
        .po-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 100%;
          padding: 24px;
          text-align: center;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }
        .po-error__msg {
          font-size: 14px;
          color: var(--ds-text-muted, #8892aa);
        }
        .po-retry {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 7px;
          background: var(--ds-primary, #6366f1);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .po-retry:hover { opacity: 0.85; }

        /* ── Skeleton ── */
        .po-skeleton {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .po-skeleton__header {
          height: 36px;
          border-radius: 8px;
        }
        .po-skeleton__body {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .po-skeleton__line {
          height: 12px;
          border-radius: 6px;
        }
        .po-skeleton__line--full  { width: 100%; }
        .po-skeleton__line--wide  { width: 72%; }
        .po-skeleton__line--short { width: 44%; }

        .po-skeleton__header,
        .po-skeleton__line {
          background: linear-gradient(
            90deg,
            var(--ds-surface, rgba(255,255,255,0.05)) 0%,
            rgba(255,255,255,0.1) 50%,
            var(--ds-surface, rgba(255,255,255,0.05)) 100%
          );
          background-size: 200% 100%;
          animation: po-shimmer 1.4s infinite linear;
        }
        @keyframes po-shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .po-panel { transition: none; }
          .po-skeleton__header, .po-skeleton__line { animation: none; }
        }
      `}</style>

      {/* Backdrop — mobile only, click to close */}
      <div
        className="po-backdrop"
        role="presentation"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding panel */}
      <div
        ref={panelRef}
        className={`po-panel${isOpen ? ' po-panel--open' : ''}`}
        role="complementary"
        aria-label={pluginName}
      >
        {/* Header */}
        <div className="po-header">
          <span className="po-header__name">{pluginName}</span>
          <button
            className="po-close"
            onClick={onClose}
            aria-label="Close panel"
            type="button"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Dynamic content */}
        <div className="po-content">
          {loadingPlugin && <PanelSkeleton />}

          {!loadingPlugin && loadError && (
            <div className="po-error" role="alert">
              <span className="po-error__msg">Plugin failed to load.</span>
              <button className="po-retry" type="button" onClick={retry}>
                Retry
              </button>
            </div>
          )}

          {!loadingPlugin && !loadError && unsupportedMount && (
            <div className="po-error" role="status">
              <span className="po-error__msg">This plugin is registered for a different mount point and is not rendered in the side panel.</span>
            </div>
          )}

          {!loadingPlugin && !loadError && !unsupportedMount && disabledBySettings && (
            <div className="po-error" role="status">
              <span className="po-error__msg">This plugin is disabled in Settings.</span>
            </div>
          )}

          {!loadingPlugin && !loadError && !unsupportedMount && !disabledBySettings && PluginComponent && (
            <PluginComponent />
          )}
        </div>
      </div>
    </>
  )
}
