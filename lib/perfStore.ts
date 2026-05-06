/**
 * lib/perfStore.ts
 *
 * Lightweight pub/sub performance-state store for Ayush Roy's portfolio.
 * No external libraries. No React. Pure TypeScript module.
 *
 * Tracks three progressive loading milestones:
 *   firstPaintDone        – initial render complete
 *   interactiveDone       – page is interactive (hydrated, key handlers attached)
 *   heavyComponentsLoaded – Three.js / heavy async imports finished
 *
 * Usage:
 *   import { setPerfFlag, onPerfChange, waitForFlag } from '../lib/perfStore'
 *   setPerfFlag('interactiveDone', true)
 *   const unsub = onPerfChange(state => { ... })
 *   await waitForFlag('heavyComponentsLoaded')
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type PerfState = {
  firstPaintDone:        boolean
  interactiveDone:       boolean
  heavyComponentsLoaded: boolean
}

export type PerfListener = (state: PerfState) => void

let loadTimeMs = 0

// ─────────────────────────────────────────────────────────────
// Module-level singletons
// ─────────────────────────────────────────────────────────────

/**
 * The single source of truth.
 * Mutable only via setPerfFlag — never mutated directly.
 */
const state: PerfState = {
  firstPaintDone:        false,
  interactiveDone:       false,
  heavyComponentsLoaded: false,
}

/**
 * Registered listeners. Using a Set gives O(1) add/delete
 * and prevents the same function from being registered twice.
 */
const listeners: Set<PerfListener> = new Set()

// ─────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────

/**
 * Notify every registered listener with a snapshot of current state.
 * Errors in individual listeners are swallowed so one bad listener
 * cannot prevent others from receiving the update.
 */
function notifyListeners(): void {
  const snapshot = getPerfState()
  listeners.forEach((listener) => {
    try {
      listener(snapshot)
    } catch (err) {
      // Intentionally silenced — a bad listener should not crash the store.
      if (typeof console !== 'undefined') {
        console.warn('[perfStore] listener threw:', err)
      }
    }
  })
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Returns a shallow snapshot of the current perf state.
 * Safe to call on the server (SSR) — returns the initial falsy state.
 */
export function getPerfState(): PerfState {
  return { ...state }
}

/**
 * Sets a single flag and immediately notifies all listeners.
 * Synchronous — no async races possible.
 * No-op if the value is identical to current (avoids redundant notifications).
 */
export function setPerfFlag(key: keyof PerfState, value: boolean): void {
  if (state[key] === value) return
  state[key] = value
  notifyListeners()
}

/**
 * Subscribe to every perf state change.
 * Returns an unsubscribe function — call it to stop receiving updates.
 *
 * @example
 *   const unsub = onPerfChange(s => { if (s.interactiveDone) doSomething() })
 *   // later:
 *   unsub()
 */
export function onPerfChange(listener: PerfListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Returns a Promise that:
 *   - resolves immediately  if the flag is already true, OR
 *   - resolves on the first setPerfFlag call that sets it to true.
 *
 * Safe to call in SSR contexts — the Promise will never resolve there
 * (no listeners fire server-side), but it also won't throw.
 *
 * @example
 *   await waitForFlag('interactiveDone')
 *   mountHeavyComponent()
 */
export function waitForFlag(key: keyof PerfState): Promise<void> {
  // Already satisfied — short-circuit with a resolved promise.
  if (state[key]) return Promise.resolve()

  return new Promise<void>((resolve) => {
    const unsub = onPerfChange((snapshot) => {
      if (snapshot[key]) {
        unsub()
        resolve()
      }
    })
  })
}

export function setLoadTime(ms: number): void {
  loadTimeMs = ms
}
