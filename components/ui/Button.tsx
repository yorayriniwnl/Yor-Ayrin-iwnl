import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glow'
type ButtonSize    = 'sm' | 'md' | 'lg' | 'xl'

type BaseProps = {
  children: React.ReactNode
  className?: string
  variant?: ButtonVariant
  size?: ButtonSize
}

type ButtonProps     = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>
type ButtonLinkProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>

function classesForButton(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
): string {
  return ['ds-button', `ds-button--${variant}`, `ds-button--${size}`, className]
    .filter(Boolean)
    .join(' ')
}

export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className = ''
): string {
  return classesForButton(variant, size, className)
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button type={type} className={classesForButton(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonLinkProps): JSX.Element {
  return (
    <a className={classesForButton(variant, size, className)} {...props}>
      {children}
    </a>
  )
}

/*
  CSS required in design-system.css (add alongside existing .ds-button rules):

  .ds-button--xl {
    min-height: 3.6rem;
    padding: 1.05rem 2.2rem;
    font-size: 0.76rem;
  }

  .ds-button--glow {
    background: var(--ds-primary);
    color: #111009;
    border-color: rgba(201, 168, 76, 0.95);
    box-shadow: 0 14px 30px rgba(201, 168, 76, 0.16);
    position: relative;
    overflow: hidden;
  }

  .ds-button--glow::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at 50% 130%, rgba(232, 201, 110, 0.55), transparent 65%);
    opacity: 0;
    transition: opacity 320ms ease;
    pointer-events: none;
  }

  .ds-button--glow:hover,
  .ds-button--glow:focus-visible {
    background: var(--ds-primary-strong);
    transform: translateY(-2px);
    box-shadow:
      0 0 0 4px rgba(201, 168, 76, 0.16),
      0 20px 48px rgba(201, 168, 76, 0.36);
  }

  .ds-button--glow:hover::before,
  .ds-button--glow:focus-visible::before {
    opacity: 1;
  }

  .ds-button--glow:active {
    transform: translateY(0);
    box-shadow: 0 0 0 4px rgba(201, 168, 76, 0.12), 0 8px 24px rgba(201, 168, 76, 0.22);
  }
*/
