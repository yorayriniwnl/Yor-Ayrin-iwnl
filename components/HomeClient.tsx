'use client'

/**
 * HomeClient.tsx — thin orchestrator
 *
 * This file's only job is to compose the homepage from its section components.
 * All data, logic, and styles live in components/home/* and data/home.ts.
 *
 * Rules:
 *  - No hardcoded data arrays here
 *  - No useState / useEffect here
 *  - No inline styles or className strings here
 *  - Keep this file under 100 lines
 */

import {
  GlobalStyles,
  Hero,
  Ticker,
  About,
  Projects,
  FeatureLayer,
  Skills,
  Experience,
  Hobbies,
  Contact,
  HomeFooter,
} from './home'

export default function HomeClient() {
  return (
    <>
      <GlobalStyles />
      <Hero />
      <Ticker />
      <About />
      <Projects />
      <FeatureLayer />
      <Skills />
      <Experience />
      <Hobbies />
      <Contact />
      <HomeFooter />
    </>
  )
}
