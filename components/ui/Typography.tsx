import React from 'react'

type WithClass<T> = {
  children: React.ReactNode
  className?: string
} & T

// ─── Eyebrow ──────────────────────────────────────────────────────────────────

export function Eyebrow({
  children,
  className = '',
  ...props
}: WithClass<React.HTMLAttributes<HTMLSpanElement>>): JSX.Element {
  return (
    <span
      className={['ds-eyebrow', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── DisplayTitle ─────────────────────────────────────────────────────────────

type DisplayTitleProps = WithClass<React.HTMLAttributes<HTMLHeadingElement>> & {
  /**
   * When `true`, switches the display heading from Playfair Display
   * (`--ds-font-display`) to Cormorant Garamond (`--ds-font-serif`).
   *
   * Maps to `.ds-display--serif` in design-system.css:
   *   font-family: var(--ds-font-serif)
   *   font-weight: 400 (or 600 via italic variant)
   *   font-style:  italic
   *   letter-spacing: -0.02em
   *
   * Ideal for editorial hero text that needs a lighter, more literary
   * feel than the heavy Playfair Display default.
   */
  serif?: boolean
}

export function DisplayTitle({
  children,
  className = '',
  serif = false,
  ...props
}: DisplayTitleProps): JSX.Element {
  return (
    <h1
      className={[
        'ds-display',
        serif ? 'ds-display--serif' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </h1>
  )
}

// ─── Heading ──────────────────────────────────────────────────────────────────

export function Heading({
  children,
  className = '',
  ...props
}: WithClass<React.HTMLAttributes<HTMLHeadingElement>>): JSX.Element {
  return (
    <h2
      className={['ds-heading', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </h2>
  )
}

// ─── Subheading ───────────────────────────────────────────────────────────────

export function Subheading({
  children,
  className = '',
  ...props
}: WithClass<React.HTMLAttributes<HTMLHeadingElement>>): JSX.Element {
  return (
    <h3
      className={['ds-subheading', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </h3>
  )
}

// ─── BodyText ─────────────────────────────────────────────────────────────────

export function BodyText({
  children,
  className = '',
  ...props
}: WithClass<React.HTMLAttributes<HTMLParagraphElement>>): JSX.Element {
  return (
    <p
      className={['ds-text', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </p>
  )
}
