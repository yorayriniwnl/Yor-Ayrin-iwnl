"use client"

import React, { useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type MotionButtonProps = {
  variant: 'primary' | 'ghost' | 'icon'
  children: React.ReactNode
  href?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  magnetic?: boolean
  className?: string
  'aria-label'?: string
  target?: '_blank' | '_self'
}

type RippleEntry = { id: number; x: number; y: number }

// ─── Style maps ───────────────────────────────────────────────────────────────

const SIZE_STYLES: Record<NonNullable<MotionButtonProps['size']>, React.CSSProperties> = {
  sm: { padding: '8px 16px',  fontSize: '13px', minHeight: '32px' },
  md: { padding: '12px 24px', fontSize: '15px', minHeight: '40px' },
  lg: { padding: '16px 32px', fontSize: '17px', minHeight: '48px' },
}

const ICON_DIMENSION: Record<NonNullable<MotionButtonProps['size']>, number> = {
  sm: 32,
  md: 40,
  lg: 48,
}

function getBaseStyle(
  variant: MotionButtonProps['variant'],
  size: NonNullable<MotionButtonProps['size']>,
  disabled: boolean,
  loading: boolean,
): React.CSSProperties {
  const isIcon = variant === 'icon'
  const dim    = ICON_DIMENSION[size]

  const shared: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--ds-font-body)',
    fontWeight: 600,
    letterSpacing: '0.02em',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.48 : 1,
    textDecoration: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: 'background 0.18s ease, border-color 0.18s ease, color 0.18s ease',
  }

  if (isIcon) {
    return {
      ...shared,
      width:        `${dim}px`,
      height:       `${dim}px`,
      padding:      0,
      fontSize:     `${dim * 0.4}px`,
      borderRadius: '50%',
      background:   'transparent',
      border:       '1px solid #1e293b',
      color:        'var(--ds-text)',
    }
  }

  if (variant === 'primary') {
    return {
      ...shared,
      ...SIZE_STYLES[size],
      borderRadius: 'var(--ds-radius-sm, 0.65rem)',
      background:   '#6366f1',
      color:        '#ffffff',
      border:       'none',
      boxShadow:    '0 4px 16px rgba(99,102,241,0.28)',
    }
  }

  return {
    ...shared,
    ...SIZE_STYLES[size],
    borderRadius:    'var(--ds-radius-sm, 0.65rem)',
    background:      'transparent',
    color:           'var(--ds-text)',
    border:          '1px solid rgba(255,255,255,0.2)',
  }
}

// ─── Loading spinner ──────────────────────────────────────────────────────────

function Spinner({ size }: { size: number }) {
  return (
    <div
      aria-hidden="true"
      className="animate-spin"
      style={{
        position: 'absolute',
        width:  `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.25)',
        borderTopColor: '#ffffff',
      }}
    />
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

let _rippleId = 0

export default function MotionButton({
  variant,
  children,
  href,
  onClick,
  loading = false,
  disabled = false,
  size = 'md',
  magnetic = false,
  className = '',
  'aria-label': ariaLabel,
  target,
}: MotionButtonProps): JSX.Element {
  const ref = useRef<HTMLElement>(null)

  const [ripples, setRipples] = useState<RippleEntry[]>([])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 300, damping: 20 })
  const sy = useSpring(my, { stiffness: 300, damping: 20 })

  const addRipple = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const id   = ++_rippleId
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 650)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!magnetic || disabled || loading) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width  / 2) * 0.3)
    my.set((e.clientY - rect.top  - rect.height / 2) * 0.3)
  }, [magnetic, disabled, loading, mx, my])

  const handleMouseLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  const interactive = !disabled && !loading

  const motionProps: HTMLMotionProps<'button'> = {
    whileHover: interactive
      ? { scale: variant === 'icon' ? 1.1 : 1.03 }
      : undefined,
    whileTap: interactive ? { scale: 0.97 } : undefined,
    style: {
      x:      magnetic ? sx : 0,
      y:      magnetic ? sy : 0,
      ...getBaseStyle(variant, size, disabled, loading),
    } as any,
    onMouseMove:  handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseDown:  addRipple,
    className,
    'aria-label':    ariaLabel,
    'aria-disabled': disabled || loading,
    'aria-busy':     loading,
  }

  const spinnerSize = variant === 'icon' ? ICON_DIMENSION[size] * 0.45 : 16

  const inner = (
    <>
      {/* Ripples */}
      {ripples.map(r => (
        <span
          key={r.id}
          aria-hidden="true"
          style={{
            position:     'absolute',
            left:         r.x,
            top:          r.y,
            width:        0,
            height:       0,
            borderRadius: '50%',
            background:   'rgba(255,255,255,0.25)',
            animation:    'ripple-expand 0.6s ease-out forwards',
            pointerEvents:'none',
          }}
        />
      ))}

      {/* Spinner */}
      {loading && <Spinner size={spinnerSize} />}

      {/* Content */}
      <span
        style={{
          opacity:    loading ? 0 : 1,
          transition: 'opacity 0.15s',
          display:    'inline-flex',
          alignItems: 'center',
          gap:        '6px',
        }}
      >
        {children}
      </span>
    </>
  )

  if (href) {
    if (href.startsWith('http') || href.startsWith('mailto') || target === '_blank') {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target ?? '_blank'}
          rel="noopener noreferrer"
          {...(motionProps as any)}
        >
          {inner}
        </motion.a>
      )
    }

    return (
      <Link href={href} passHref legacyBehavior>
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(motionProps as any)}
        >
          {inner}
        </motion.a>
      </Link>
    )
  }

  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={interactive ? onClick : undefined}
      disabled={disabled || loading}
      {...motionProps}
    >
      {inner}
    </motion.button>
  )
}
