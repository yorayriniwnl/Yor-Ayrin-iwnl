'use client'

import React, { useState } from 'react'

type TooltipProps = {
  children: React.ReactNode
  content: string
}

export default function Tooltip({ children, content }: TooltipProps): JSX.Element {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="ds-tooltip"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible ? <span className="ds-tooltip__bubble">{content}</span> : null}
    </span>
  )
}
