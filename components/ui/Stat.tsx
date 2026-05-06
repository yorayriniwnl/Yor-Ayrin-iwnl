import React from 'react'

type StatProps = {
  children?: React.ReactNode
  className?: string
  label: string
  meta?: string
  value: string
}

export default function Stat({
  children,
  className = '',
  label,
  meta,
  value,
}: StatProps): JSX.Element {
  return (
    <div className={['ds-stat', className].filter(Boolean).join(' ')}>
      <div className="ds-stat__value">{value}</div>
      <div className="ds-stat__label">{label}</div>
      {meta ? <p className="ds-text ds-text--small">{meta}</p> : null}
      {children}
    </div>
  )
}
