import React from 'react'

type BadgeVariant = 'default' | 'accent' | 'gold' | 'rust'

type BadgeProps = React.ComponentPropsWithoutRef<'span'> & {
  /**
   * @deprecated Use `variant="accent"` instead. Kept for backwards compatibility.
   */
  accent?: boolean
  /**
   * `gold`    — rgba(201,168,76,0.12) bg, gold border, gold text
   * `rust`    — rgba(192,74,58,0.14) bg, rust border, rust text
   * `accent`  — alias for gold (matches legacy `accent` boolean prop)
   * `default` — neutral muted styling
   */
  variant?: BadgeVariant
}

export default function Badge({
  children,
  className = '',
  accent = false,
  variant,
  ...props
}: BadgeProps): JSX.Element {
  // Resolve effective variant — legacy `accent` bool maps to 'accent'
  const resolved: BadgeVariant = variant ?? (accent ? 'accent' : 'default')

  const variantClass =
    resolved === 'accent' ? 'ds-tag--accent'
    : resolved === 'gold' ? 'ds-tag--gold'
    : resolved === 'rust' ? 'ds-tag--rust'
    : ''

  return (
    <span
      className={['ds-badge', variantClass, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

/*
  CSS required in design-system.css (add after .ds-tag--accent):

  .ds-tag--gold {
    border-color: rgba(201, 168, 76, 0.48);
    color: var(--ds-primary-strong);
    background: rgba(201, 168, 76, 0.10);
  }

  .ds-tag--rust {
    border-color: rgba(192, 74, 58, 0.42);
    color: #d96b58;
    background: rgba(192, 74, 58, 0.14);
  }

  html.theme-minimal .ds-tag--rust {
    color: #a63d2f;
  }
*/
