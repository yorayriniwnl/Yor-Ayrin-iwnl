'use client'

import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
} from 'react'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion, Variants } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const ROLES: string[] = [
  'System Builder',
  'Frontend Engineer',
  'Creative Developer',
  '3D Enthusiast',
  'Open Source Contributor',
]

const TYPING_SPEED  = 60    // ms per character
const DELETE_SPEED  = 30    // ms per character
const PAUSE_TYPED   = 2000  // ms after full word typed
const PAUSE_DELETED = 500   // ms after full word deleted

const FONT_URL =
  'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/fonts/helvetiker_bold.typeface.json'

// ─────────────────────────────────────────────────────────────
// Typewriter hook  (pure useEffect state-machine, no library)
// ─────────────────────────────────────────────────────────────

type TypePhase = 'typing' | 'paused-typed' | 'deleting' | 'paused-deleted'

function useTypewriter(roles: string[]): string {
  const [displayText, setDisplayText] = useState<string>('')
  const [roleIndex,   setRoleIndex]   = useState<number>(0)
  const [phase,       setPhase]       = useState<TypePhase>('typing')
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(roles[0])
      return
    }

    const currentRole = roles[roleIndex]

    if (phase === 'typing') {
      if (displayText.length < currentRole.length) {
        const t = setTimeout(
          () => setDisplayText(currentRole.slice(0, displayText.length + 1)),
          TYPING_SPEED,
        )
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('paused-typed'), PAUSE_TYPED)
      return () => clearTimeout(t)
    }

    if (phase === 'paused-typed') {
      const t = setTimeout(() => setPhase('deleting'), 0)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayText.length > 0) {
        const t = setTimeout(
          () => setDisplayText(displayText.slice(0, -1)),
          DELETE_SPEED,
        )
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('paused-deleted'), PAUSE_DELETED)
      return () => clearTimeout(t)
    }

    if (phase === 'paused-deleted') {
      setRoleIndex((prev) => (prev + 1) % roles.length)
      setPhase('typing')
    }
  }, [displayText, phase, roleIndex, roles, prefersReduced])

  return displayText
}

// ─────────────────────────────────────────────────────────────
// 3D scene objects  (all live inside <Canvas>)
// ─────────────────────────────────────────────────────────────

function RotatingLight(): React.JSX.Element {
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t      = clock.getElapsedTime() * 0.4
    const radius = 6
    lightRef.current.position.set(
      Math.sin(t) * radius,
      5,
      Math.cos(t) * radius,
    )
    lightRef.current.lookAt(0, 0, 0)
  })

  return (
    <directionalLight
      ref={lightRef}
      intensity={2.4}
      color="#dde4ff"
      castShadow={false}
    />
  )
}

function ARMesh(): React.JSX.Element {
  const groupRef   = useRef<THREE.Group>(null)
  const startTimeRef = useRef<number | null>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // Record start time on first frame
    if (startTimeRef.current === null) {
      startTimeRef.current = clock.getElapsedTime()
    }

    // Ease-out scale 0 → 1 over 800 ms
    const elapsed = clock.getElapsedTime() - startTimeRef.current
    const eased   = 1 - Math.exp(-(elapsed / 0.8) * 5)
    const s       = Math.min(eased, 1)
    groupRef.current.scale.setScalar(s)

    // Auto-rotate Y axis
    groupRef.current.rotation.y += 0.005
  })

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={1.4}
          height={0.35}
          curveSegments={14}
          bevelEnabled
          bevelThickness={0.025}
          bevelSize={0.022}
          bevelSegments={6}
        >
          AR
          <meshStandardMaterial
            color="#6366f1"
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={1.6}
          />
        </Text3D>
      </Center>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────
// NameCanvas3D  — rendered client-only, transparent bg
// ─────────────────────────────────────────────────────────────

function NameCanvas3DImpl(): React.JSX.Element {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5.5], fov: 48 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} color="#a5b4fc" />
      <RotatingLight />
      <pointLight position={[-4, 3, 2]}  intensity={1.2} color="#a5b4fc" />
      <pointLight position={[4, -2, 3]}  intensity={0.6} color="#c7d2fe" />
      <Suspense fallback={null}>
        <ARMesh />
      </Suspense>
    </Canvas>
  )
}

// next/dynamic with ssr:false — prevents any server-side render of Canvas/WebGL
const NameCanvas3D = dynamic(
  () => Promise.resolve({ default: NameCanvas3DImpl }),
  { ssr: false },
)

// ─────────────────────────────────────────────────────────────
// Animated code-block fallback  (Suspense + pre-mount)
// ─────────────────────────────────────────────────────────────

const CODE_LINES: string[] = [
  "const me = {",
  "  name: 'Ayush Roy',",
  "  role: 'System Builder',",
  "  stack: ['React', 'Next.js', 'Three.js'],",
  "  available: true",
  "}",
]

function FallbackCodeBlock(): React.JSX.Element {
  const [visibleCount, setVisibleCount] = useState<number>(0)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) {
      setVisibleCount(CODE_LINES.length)
      return
    }

    let i = 0
    let timerId: ReturnType<typeof setTimeout>

    const tick = () => {
      i++
      setVisibleCount(i)
      if (i < CODE_LINES.length) {
        timerId = setTimeout(tick, 50)
      }
    }

    timerId = setTimeout(tick, 150)
    return () => clearTimeout(timerId)
  }, [prefersReduced])

  const atEnd = visibleCount >= CODE_LINES.length

  return (
    <div className="hero-code" role="img" aria-label="Code snippet representing Ayush Roy">
      <div className="hero-code__bar">
        <span className="hero-code__dot hero-code__dot--red"   />
        <span className="hero-code__dot hero-code__dot--amber" />
        <span className="hero-code__dot hero-code__dot--green" />
        <span className="hero-code__bar-label">me.ts</span>
      </div>
      <pre className="hero-code__pre">
        {CODE_LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="hero-code__line">
            <span className="hero-code__ln" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="hero-code__text">{syntaxColor(line)}</span>
          </div>
        ))}
        <span
          className={`hero-code__cursor${atEnd ? ' hero-code__cursor--end' : ''}`}
          aria-hidden="true"
        />
      </pre>
    </div>
  )
}

// Lightweight pseudo-syntax-highlight without external deps
function syntaxColor(line: string): React.ReactNode {
  // highlight strings in single quotes
  const parts = line.split(/(\'[^\']*\')/g)
  return parts.map((part, i) =>
    part.startsWith("'") && part.endsWith("'")
      ? <span key={i} style={{ color: '#86efac' }}>{part}</span>
      : <span key={i}>{part}</span>,
  )
}

// ─────────────────────────────────────────────────────────────
// Scroll chevron
// ─────────────────────────────────────────────────────────────

function ScrollIndicator(): React.JSX.Element {
  const prefersReduced = useReducedMotion()

  return (
    <motion.span
      className="hero-scroll"
      aria-label="Scroll down"
      animate={prefersReduced ? {} : { y: [0, 7, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <polyline
          points="3,6 10,14 17,6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  )
}

// ─────────────────────────────────────────────────────────────
// Hero  — default export
// ─────────────────────────────────────────────────────────────

export default function Hero(): React.JSX.Element {
  // Defer right-half mount by 100 ms so left half renders first (above fold)
  const [canvasReady, setCanvasReady] = useState<boolean>(false)
  const prefersReduced = useReducedMotion()
  const displayText    = useTypewriter(ROLES)

  useEffect(() => {
    const t = setTimeout(() => setCanvasReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  // ── Framer Motion variants ─────────────────────────────────

  const containerVariants: Variants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.04 } },
  }

  const letterVariants: Variants = prefersReduced
    ? { hidden: {}, visible: {} }
    : {
        hidden:  { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ease: [0.22, 1, 0.36, 1], duration: 0.55 },
        },
      }

  const fadeUp: Variants = prefersReduced
    ? { hidden: {}, visible: {} }
    : {
        hidden:  { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0 },
      }

  const btnVariants: Variants = {
    rest:  { scale: 1 },
    hover: { scale: 1.03 },
    tap:   { scale: 0.97 },
  }

  const NAME    = 'Ayush Roy'
  const letters = NAME.split('')

  return (
    <>
      {/* ── Scoped styles ─────────────────────────────────── */}
      <style>{`
        /* ── Root grid ── */
        .hero-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: var(--ds-bg, #060a14);
        }

        /* faint grid lines */
        .hero-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.035) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          z-index: 0;
        }

        /* soft primary glow on right */
        .hero-root::after {
          content: '';
          position: absolute;
          top: -25%;
          right: -15%;
          width: 75%;
          height: 150%;
          background: radial-gradient(
            ellipse at center,
            rgba(99,102,241,0.13) 0%,
            transparent 62%
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── Left half ── */
        .hero-left {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding:
            clamp(2.5rem, 6vw, 5rem)
            clamp(2rem, 4vw, 3.5rem)
            clamp(2.5rem, 6vw, 5rem)
            clamp(2.5rem, 7vw, 6rem);
        }

        /* ── Name ── */
        .hero-name {
          font-family: var(--font-ds-display, 'Playfair Display', ui-serif, serif);
          font-size: clamp(2.5rem, 5.5vw, 4rem);
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: -0.025em;
          color: var(--ds-text, #e8effe);
          margin: 0 0 1.125rem;
          display: flex;
          flex-wrap: wrap;
          overflow: visible;
        }

        .hero-name__letter {
          display: inline-block;
          white-space: pre;
        }

        /* ── Subtitle (typewriter) ── */
        .hero-subtitle {
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          font-size: clamp(0.9rem, 1.4vw, 1.1rem);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ds-primary, #6366f1);
          min-height: 1.75em;
          display: flex;
          align-items: center;
          margin-bottom: 1.375rem;
        }

        /* blinking cursor */
        .hero-cursor {
          display: inline-block;
          width: 2px;
          height: 1.1em;
          background: var(--ds-primary, #6366f1);
          margin-left: 2px;
          vertical-align: middle;
          animation: hero-blink 1s step-end infinite;
        }

        @keyframes hero-blink {
          0%,  100% { opacity: 1; }
          50%        { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-cursor { animation: none; opacity: 1; }
        }

        /* ── Tagline ── */
        .hero-tagline {
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          font-size: clamp(1rem, 1.35vw, 1.125rem);
          line-height: 1.75;
          color: var(--ds-text-muted, #8892aa);
          max-width: 480px;
          margin: 0 0 2.5rem;
        }

        /* ── CTA row ── */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 0.875rem;
          margin-bottom: 3.5rem;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.015em;
          padding: 0.8rem 1.875rem;
          border-radius: 0.5rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          will-change: transform;
        }

        .hero-btn--primary {
          background: var(--ds-primary, #6366f1);
          color: #fff;
          box-shadow: 0 4px 22px rgba(99,102,241,0.38);
        }

        .hero-btn--ghost {
          background: transparent;
          color: var(--ds-text, #e8effe);
          border: 1.5px solid rgba(99,102,241,0.38);
        }

        /* ── Scroll chevron ── */
        .hero-scroll {
          display: inline-flex;
          align-items: center;
          color: var(--ds-text-muted, #8892aa);
          will-change: transform;
        }

        /* ── Right half ── */
        .hero-right {
          position: relative;
          z-index: 2;
          height: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-canvas-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* ── Code block fallback ── */
        .hero-code {
          width: min(420px, 88%);
          background: rgba(6, 8, 18, 0.93);
          border: 1px solid rgba(99,102,241,0.18);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.07),
            0 28px 72px rgba(0,0,0,0.55);
          backdrop-filter: blur(10px);
        }

        .hero-code__bar {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.875rem 1.125rem 0.7rem;
          border-bottom: 1px solid rgba(99,102,241,0.1);
        }

        .hero-code__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .hero-code__dot--red   { background: rgba(248,113,113,0.55); }
        .hero-code__dot--amber { background: rgba(251,191,36,0.55);  }
        .hero-code__dot--green { background: rgba(52,211,153,0.55);  }

        .hero-code__bar-label {
          font-family: var(--font-ds-mono, ui-monospace, monospace);
          font-size: 0.7rem;
          color: var(--ds-text-muted, #8892aa);
          margin-left: auto;
          letter-spacing: 0.06em;
        }

        .hero-code__pre {
          font-family: var(--font-ds-mono, 'DM Mono', 'Fira Code', ui-monospace, monospace);
          font-size: 0.875rem;
          line-height: 1.8;
          padding: 1.25rem 1.5rem 1.625rem;
          margin: 0;
          color: var(--ds-text, #e8effe);
          overflow: hidden;
        }

        .hero-code__line {
          display: flex;
          gap: 1.25rem;
        }

        .hero-code__ln {
          color: rgba(99,102,241,0.3);
          user-select: none;
          min-width: 1.4rem;
          text-align: right;
          font-size: 0.72rem;
          line-height: 1.8;
        }

        .hero-code__text {
          color: #c4b9f7;
        }

        .hero-code__cursor {
          display: inline-block;
          width: 2px;
          height: 0.95em;
          background: var(--ds-primary, #6366f1);
          vertical-align: text-bottom;
          margin-left: 0.125rem;
          animation: hero-blink 1s step-end infinite;
        }

        .hero-code__cursor--end {
          margin-left: 1.125rem;
        }

        /* ── Accent line left edge ── */
        .hero-left::before {
          content: '';
          position: absolute;
          left: 0;
          top: 15%;
          height: 70%;
          width: 2px;
          background: linear-gradient(
            180deg,
            transparent 0%,
            var(--ds-primary, #6366f1) 30%,
            var(--ds-primary, #6366f1) 70%,
            transparent 100%
          );
          opacity: 0.35;
          border-radius: 2px;
        }

        /* ── Mobile: single column, hide right ── */
        @media (max-width: 767px) {
          .hero-root {
            grid-template-columns: 1fr;
          }
          .hero-right {
            display: none;
          }
          .hero-left {
            padding: 7rem 1.75rem 4.5rem;
          }
          .hero-left::before { display: none; }
        }
      `}</style>

      <section id="home" className="hero-root" aria-label="Ayush Roy – introduction">

        {/* ══════ LEFT HALF — text content (SSR) ══════ */}
        <div className="hero-left">

          {/* Name — each letter fades+slides up */}
          <motion.h1
            className="hero-name"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            aria-label={NAME}
          >
            {letters.map((char, i) => (
              <motion.span
                key={i}
                className="hero-name__letter"
                variants={letterVariants}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Typewriter role */}
          <p className="hero-subtitle" aria-live="polite" aria-atomic="true">
            <span>{displayText}</span>
            <span className="hero-cursor" aria-hidden="true" />
          </p>

          {/* Tagline */}
          <motion.p
            className="hero-tagline"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            I design and build production-ready systems, creative developer
            tooling, and beautiful web experiences.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="hero-ctas"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, delay: 0.76, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.a
              href="/projects"
              className="hero-btn hero-btn--primary"
              variants={btnVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              View Projects
            </motion.a>

            <motion.a
              href="/contact"
              className="hero-btn hero-btn--ghost"
              variants={btnVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            >
              Contact Me
            </motion.a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
          >
            <ScrollIndicator />
          </motion.div>
        </div>

        {/* ══════ RIGHT HALF — 3D canvas, client-only ══════ */}
        <div className="hero-right" aria-hidden="true">
          {canvasReady ? (
            <div className="hero-canvas-wrap">
              <Suspense fallback={<FallbackCodeBlock />}>
                <NameCanvas3D />
              </Suspense>
            </div>
          ) : (
            <FallbackCodeBlock />
          )}
        </div>

      </section>
    </>
  )
}
