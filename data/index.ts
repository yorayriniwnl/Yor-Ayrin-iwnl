/**
 * data/index.ts
 *
 * Barrel re-exporting the focused data modules.
 *
 * Architecture note:
 *   data/site.ts   — legacy monolith; still the canonical source for shared
 *                    exports (SITE_PROFILE, NAV_LINKS, EXPERIENCE_ITEMS …).
 *   lib/data.ts    — consumer-facing re-export of data/site.ts; used by most
 *                    components via `import { X } from '../lib/data'`.
 *   data/index.ts  — this file; re-exports the new focused modules that are
 *                    NOT yet in data/site.ts, keeping the barrel free of
 *                    duplicate exports that would cause TypeScript ambiguity.
 *
 * Rule: only export symbols that do NOT already live in data/site.ts.
 * Anything shared stays in site.ts → lib/data.ts pipeline.
 */

// Focused modules that are self-contained and not duplicated in site.ts
export * from './games'
export * from './gallery'
export * from './blog'

// HOME_METRICS canonical source of truth
export { HOME_METRICS } from './site'
