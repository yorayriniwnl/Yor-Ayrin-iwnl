import React from 'react'

type LayoutContainer = 'none' | 'content' | 'wide'

type LayoutProps = {
  children: React.ReactNode
  className?: string
  container?: LayoutContainer
  footer?: React.ReactNode
  nav?: React.ReactNode
}

function containerClass(container: LayoutContainer): string {
  if (container === 'content') return 'ds-container'
  if (container === 'wide') return 'ds-container ds-container--wide'
  return ''
}

export default function Layout({
  children,
  className = '',
  container = 'none',
  footer,
  nav,
}: LayoutProps): JSX.Element {
  const rootClass = ['ds-layout', className].filter(Boolean).join(' ')
  const shellClass = containerClass(container)

  return (
    <div className={rootClass}>
      {nav ?? null}
      {shellClass ? <div className={shellClass}>{children}</div> : children}
      {footer ?? null}
    </div>
  )
}
