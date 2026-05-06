import React from 'react'

type GridProps = {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export default function Grid({
  children,
  className = '',
  cols = 3,
  gap = 'md',
}: GridProps): JSX.Element {
  const classes = [
    'ds-grid',
    `ds-grid--cols-${cols}`,
    `ds-grid--gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
