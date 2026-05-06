import React from 'react'

type ContainerProps = {
  children: React.ReactNode
  className?: string
  wide?: boolean
}

export default function Container({
  children,
  className = '',
  wide = false,
}: ContainerProps): JSX.Element {
  const classes = [wide ? 'ds-container ds-container--wide' : 'ds-container', className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
