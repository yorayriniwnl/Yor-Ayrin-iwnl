import React from 'react'

type TextProps = React.ComponentPropsWithoutRef<'p'> & {
  mono?: boolean
  size?: 'base' | 'sm'
  /**
   * `gradient` — applies the animated gold-to-champagne gradient from `.hero-name`.
   * Renders the text with a slow-drifting warm gradient (200% bg-size, 7s loop).
   * Maps to `.ds-text--gradient` in design-system.css.
   */
  gradient?: boolean
}

export default function Text({
  children,
  className = '',
  mono = false,
  size = 'base',
  gradient = false,
  ...props
}: TextProps): JSX.Element {
  return (
    <p
      className={[
        'ds-text',
        size === 'sm'  ? 'ds-text--small'    : '',
        mono           ? 'ds-text--mono'     : '',
        gradient       ? 'ds-text--gradient' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </p>
  )
}

/*
  CSS required in design-system.css (add after .ds-text--mono):

  .ds-text--gradient {
    background: linear-gradient(
      90deg,
      #f0e8d8 0%,
      #e8c96e 40%,
      #c9a84c 70%,
      #f0e8d8 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-size: 200% 200%;
    animation: gradientShift 7s linear infinite;
  }

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ds-text--gradient {
      animation: none;
      background: none;
      color: var(--ds-primary);
      -webkit-text-fill-color: unset;
    }
  }
*/
