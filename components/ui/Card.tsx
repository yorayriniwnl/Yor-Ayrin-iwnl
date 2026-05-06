import React from 'react'

type CardTone    = 'default' | 'life' | 'personal' | 'real' | 'thoughts'
type CardVariant = 'default' | 'obsidian'

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'div' | 'section' | 'figure'
  children: React.ReactNode
  interactive?: boolean
  tone?: CardTone
  /**
   * `obsidian` — deepest background (rgba(8,7,5,0.96)), razor-thin shimmer
   * top-border, and heavy lift shadow.
   * Maps to `.ds-card--obsidian` in design-system.css.
   */
  variant?: CardVariant
}

export default function Card({
  as = 'article',
  children,
  className = '',
  interactive = false,
  tone = 'default',
  variant = 'default',
  ...props
}: CardProps): JSX.Element {
  const Component = as
  const classes = [
    'ds-card',
    interactive             ? 'ds-card--interactive'      : '',
    tone !== 'default'      ? `ds-card--${tone}`          : '',
    variant !== 'default'   ? `ds-card--${variant}`       : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <Component className={classes} {...props}>{children}</Component>
}

/*
  CSS required in design-system.css (add after existing .ds-card rules):

  .ds-card--obsidian {
    background: rgba(8, 7, 5, 0.96);
    border-color: rgba(42, 37, 32, 0.95);
    box-shadow:
      0 40px 80px rgba(0, 0, 0, 0.60),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ds-card--obsidian::before {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(201, 168, 76, 0.22) 25%,
      rgba(232, 201, 110, 0.55) 50%,
      rgba(201, 168, 76, 0.22) 75%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: ds-card-shimmer 5.4s ease-in-out infinite;
  }

  .ds-card--obsidian.ds-card--interactive:hover,
  .ds-card--obsidian.ds-card--interactive:focus-within {
    border-color: rgba(201, 168, 76, 0.38);
    box-shadow:
      0 56px 96px rgba(0, 0, 0, 0.70),
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 0 0 1px rgba(201, 168, 76, 0.10);
  }
*/
