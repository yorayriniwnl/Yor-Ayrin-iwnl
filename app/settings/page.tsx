'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTheme, type Theme } from '../../components/ui/ThemeProvider'
import { PLUGINS } from '../../plugins'
import { LS_PLUGINS, readPluginStates, writePluginStates } from '../../lib/pluginState'

// ─── Storage keys ─────────────────────────────────────────────────────────────

const LS_FONT_SIZE = 'settings:fontSize'

type FontSize = 'small' | 'default' | 'large'

const FONT_SIZE_VALUES: Record<FontSize, string> = {
  small:   '14px',
  default: '16px',
  large:   '18px',
}

function readStoredFontSize(): FontSize {
  if (typeof window === 'undefined') return 'default'
  const savedFont = localStorage.getItem(LS_FONT_SIZE)
  return savedFont === 'small' || savedFont === 'large' || savedFont === 'default'
    ? savedFont
    : 'default'
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Toggle component ─────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}): React.JSX.Element {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      type="button"
      className={`sett-toggle${checked ? ' sett-toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="sett-toggle__thumb" />
    </button>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <section className="sett-section">
      <h2 className="sett-section__title">{title}</h2>
      {children}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage(): React.JSX.Element {
  const [pluginStates, setPluginStates] = useState<Record<string, boolean>>(() => readPluginStates())
  const [fontSize,     setFontSize]     = useState<FontSize>(() => readStoredFontSize())
  const { theme, setTheme } = useTheme()

  // Apply font size to :root on change
  useEffect(() => {
    document.documentElement.style.setProperty('--ds-font-base', FONT_SIZE_VALUES[fontSize])
    try { localStorage.setItem(LS_FONT_SIZE, fontSize) } catch {}
  }, [fontSize])

  // Apply theme on change
  const applyTheme = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme)
  }, [setTheme])

  function togglePlugin(id: string, value: boolean): void {
    setPluginStates((prev) => {
      const next = { ...prev, [id]: value }
      writePluginStates(next)
      return next
    })
  }

  function resetAll(): void {
    try {
      localStorage.removeItem(LS_PLUGINS)
      localStorage.removeItem('theme')
      localStorage.removeItem(LS_FONT_SIZE)
    } catch {}
    window.location.reload()
  }

  const THEMES: { id: Theme; label: string; icon: string }[] = [
    { id: 'dark',   label: 'Dark',   icon: '🌑' },
    { id: 'light',  label: 'Light',  icon: '☀️' },
    { id: 'system', label: 'System', icon: '💻' },
  ]

  const FONT_SIZES: { id: FontSize; label: string }[] = [
    { id: 'small',   label: 'Small'   },
    { id: 'default', label: 'Default' },
    { id: 'large',   label: 'Large'   },
  ]

  return (
    <>
      <style>{`
        .sett-page {
          min-height: 100vh;
          background: var(--ds-bg, #060a14);
          padding: clamp(3.5rem, 7vw, 6rem) clamp(1.25rem, 5vw, 3rem) 4rem;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          color: var(--ds-text, #e8effe);
        }
        .sett-inner {
          max-width: 620px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .sett-page-title {
          font-family: var(--font-ds-display, 'Playfair Display', ui-serif, serif);
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-weight: 900;
          color: var(--ds-text, #e8effe);
          margin: 0 0 0.25rem;
        }
        .sett-page-sub {
          font-size: 14px;
          color: var(--ds-text-muted, #8892aa);
          margin: 0;
        }

        /* section */
        .sett-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sett-section__title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ds-text-muted, #8892aa);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          margin: 0;
        }

        /* plugin row */
        .sett-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid var(--ds-border, rgba(255,255,255,0.05));
        }
        .sett-row:last-child { border-bottom: none; }
        .sett-row__left { flex: 1; min-width: 0; }
        .sett-row__name {
          font-size: 15px;
          font-weight: 700;
          color: var(--ds-text, #e8effe);
          margin: 0 0 2px;
        }
        .sett-row__desc {
          font-size: 12.5px;
          color: var(--ds-text-muted, #8892aa);
          margin: 0;
          line-height: 1.5;
        }

        /* CSS toggle */
        .sett-toggle {
          position: relative;
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: var(--ds-surface, rgba(255,255,255,0.08));
          border: 1px solid var(--ds-border, rgba(255,255,255,0.1));
          cursor: pointer;
          flex-shrink: 0;
          transition: background 200ms ease, border-color 200ms ease;
          padding: 0;
        }
        .sett-toggle--on {
          background: var(--ds-primary, #6366f1);
          border-color: var(--ds-primary, #6366f1);
        }
        .sett-toggle__thumb {
          position: absolute;
          top: 50%;
          left: 3px;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          transition: left 200ms ease;
          pointer-events: none;
        }
        .sett-toggle--on .sett-toggle__thumb {
          left: calc(100% - 19px);
        }

        /* theme cards */
        .sett-themes {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sett-theme-card {
          flex: 1;
          min-width: 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 18px 12px;
          border-radius: 12px;
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          background: var(--ds-surface, rgba(255,255,255,0.03));
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: var(--ds-text, #e8effe);
          font-family: inherit;
          transition: border-color 0.18s, background 0.18s;
        }
        .sett-theme-card__icon { font-size: 22px; line-height: 1; }
        .sett-theme-card--active {
          border-color: var(--ds-primary, #6366f1);
          background: rgba(99,102,241,0.1);
        }

        /* font size buttons */
        .sett-font-btns {
          display: flex;
          gap: 8px;
        }
        .sett-font-btn {
          flex: 1;
          padding: 9px 0;
          border-radius: 8px;
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          background: transparent;
          color: var(--ds-text, #e8effe);
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .sett-font-btn--active {
          background: var(--ds-primary, #6366f1);
          border-color: var(--ds-primary, #6366f1);
          color: #fff;
        }

        /* reset */
        .sett-reset {
          padding: 10px 22px;
          border-radius: 8px;
          border: 1px solid rgba(239,68,68,0.35);
          background: transparent;
          color: #f87171;
          font-size: 13.5px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          align-self: flex-start;
        }
        .sett-reset:hover {
          background: rgba(239,68,68,0.08);
          border-color: rgba(239,68,68,0.6);
        }

        @media (max-width: 760px) {
          .sett-page {
            padding: calc(var(--ds-header-height, 5rem) + 1.25rem) 1rem 3rem;
          }
          .sett-inner {
            gap: 2rem;
          }
          .sett-row {
            align-items: flex-start;
          }
          .sett-themes {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .sett-theme-card {
            min-width: 0;
          }
          .sett-font-btns {
            flex-direction: column;
          }
        }

        @media (max-width: 560px) {
          .sett-row {
            flex-direction: column;
          }
          .sett-toggle {
            align-self: flex-start;
          }
          .sett-themes {
            grid-template-columns: 1fr;
          }
          .sett-reset {
            width: 100%;
          }
        }
      `}</style>

      <main className="sett-page">
        <div className="sett-inner">
          <div>
            <h1 className="sett-page-title">Settings</h1>
            <p className="sett-page-sub">Manage your preferences and features.</p>
          </div>

          {/* ── Section 1: Plugins ── */}
          <Section title="Plugins">
            <p style={{ fontSize: 13, color: 'var(--ds-text-muted, #8892aa)', margin: '0 0 4px' }}>
              Enable or disable optional features.
            </p>
            {PLUGINS.map((plugin) => {
              const enabled =
                pluginStates[plugin.id] !== undefined
                  ? pluginStates[plugin.id]
                  : (plugin.defaultEnabled ?? false)
              return (
                <div key={plugin.id} className="sett-row">
                  <div className="sett-row__left">
                    <p className="sett-row__name">{plugin.name}</p>
                    <p className="sett-row__desc">{plugin.description}</p>
                  </div>
                  <Toggle
                    checked={enabled}
                    onChange={(v) => togglePlugin(plugin.id, v)}
                    label={`Toggle ${plugin.name}`}
                  />
                </div>
              )
            })}
          </Section>

          {/* ── Section 2: Appearance ── */}
          <Section title="Appearance">
            <div className="sett-themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`sett-theme-card${theme === t.id ? ' sett-theme-card--active' : ''}`}
                  onClick={() => applyTheme(t.id)}
                  aria-pressed={theme === t.id}
                >
                  <span className="sett-theme-card__icon">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </Section>

          {/* ── Section 3: Font Size ── */}
          <Section title="Font Size">
            <div className="sett-font-btns">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`sett-font-btn${fontSize === f.id ? ' sett-font-btn--active' : ''}`}
                  onClick={() => setFontSize(f.id)}
                  aria-pressed={fontSize === f.id}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Section 4: Reset ── */}
          <Section title="Reset">
            <button className="sett-reset" type="button" onClick={resetAll}>
              Reset all settings to default
            </button>
          </Section>
        </div>
      </main>
    </>
  )
}
