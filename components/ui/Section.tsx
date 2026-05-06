import React from 'react'

type SectionTone = 'default' | 'soft' | 'accent'

type SectionProps = {
  children: React.ReactNode
  className?: string
  container?: 'none' | 'content' | 'wide'
  id?: string
  tone?: SectionTone
}

function containerClass(container: SectionProps['container']): string {
  if (container === 'content') return 'ds-container'
  if (container === 'wide') return 'ds-container ds-container--wide'
  return ''
}

export default function Section({
  children,
  className = '',
  container = 'content',
  id,
  tone = 'default',
}: SectionProps): JSX.Element {
  const sectionClass = ['ds-section', tone !== 'default' ? `ds-section--${tone}` : '', className]
    .filter(Boolean)
    .join(' ')
  const shellClass = containerClass(container)

  return (
    <section id={id} className={sectionClass}>
      {shellClass ? <div className={shellClass}>{children}</div> : children}
    </section>
  )
}
