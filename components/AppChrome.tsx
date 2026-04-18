'use client'

import { type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import CommandPalette from './CommandPalette'
import Layout from './layout/Layout'
import PageTransition from './PageTransition'
import QuickActions from './QuickActions'
import RecruiterStrip from './RecruiterStrip'

type AppChromeProps = {
  children: ReactNode
  footer: ReactNode
  nav: ReactNode
  shell: ReactNode
}

export default function AppChrome({ children, footer, nav, shell }: AppChromeProps): JSX.Element {
  void AnimatePresence

  return (
    <>
      <div className="relative z-20 flex-1 flex flex-col layer-foreground">
        <main id="main-content" role="main" tabIndex={-1} className="flex-1">
          <Layout container="none" nav={nav} footer={footer}>
            <PageTransition>{children}</PageTransition>
          </Layout>
        </main>
      </div>

      {shell}
      <CommandPalette />
      <QuickActions />
      <RecruiterStrip />
    </>
  )
}
