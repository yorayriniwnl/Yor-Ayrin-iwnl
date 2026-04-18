/**
 * components/home/index.ts
 *
 * Barrel file — re-exports every homepage section component and the two hooks.
 * Import from here to keep HomeClient.tsx import lines concise.
 */

export { default as GlobalStyles } from './GlobalStyles'
export { default as Hero } from './Hero'
export { default as Ticker } from './Ticker'
export { default as About } from './About'
export { default as Projects } from './Projects'
export { default as FeatureLayer } from './FeatureLayer'
export { default as Skills } from './Skills'
export { default as Experience } from './Experience'
export { default as Hobbies } from './Hobbies'
export { default as Contact } from './Contact'
export { default as HomeFooter } from './HomeFooter'

// Hooks (exposed for consumers that need them outside section components)
export { useReveal, useSkillsReveal } from './hooks/useReveal'
export { useGitHubRepoCount } from './hooks/useGitHubRepoCount'
