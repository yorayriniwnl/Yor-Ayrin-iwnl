import React from 'react'

type DividerProps = {
  className?: string
  align?: 'center' | 'left' | 'right'
}

export default function Divider({
  className = '',
  align = 'center',
}: DividerProps): JSX.Element {
  const variant =
    align === 'left' ? 'ds-divider--left' : align === 'right' ? 'ds-divider--right' : ''

  return <div className={['ds-divider', variant, className].filter(Boolean).join(' ')} aria-hidden />
}
