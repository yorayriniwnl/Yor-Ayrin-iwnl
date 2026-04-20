import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import TechCloud3D, { FlatCloud } from '../../components/TechCloud3D'
import { SITE_PROFILE } from '../../lib/data'
import { PROFILE_PHOTO_SRC } from '../../lib/profilePhoto'

export const metadata: Metadata = {
  title:       'About | Ayush Roy',
  description: "I'm Ayush Roy (virtual alias: Yor Ayrin), a full-stack developer intern candidate at KIIT building Next.js, Python, realtime, and computer-vision products.",
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PHILOSOPHY = [
  {
    icon:  '⚙️',
    title: 'Build to Ship',
    body:  'Production-ready from day one. No half-measures, no prototype debt.',
  },
  {
    icon:  '🫀',
    title: 'Make it Human',
    body:  'Interfaces should feel alive. Animation, feedback, and care in every interaction.',
  },
  {
    icon:  '🗂️',
    title: 'Own the Stack',
    body:  'From WebGL shaders to database indexes. Depth over breadth, always.',
  },
] as const

const STATS = [
  { value: '9',      label: 'Portfolio projects' },
  { value: '2027',   label: 'Graduation year'   },
  { value: '3',      label: 'Hackathons shipped' },
  { value: '9',      label: 'Public repos'       },
] as const

const FUN_FACTS = [
  { tag: 'KIIT', text: 'Computer Science & Communication Engineering student at KIIT University, class of 2027' },
  { tag: 'HACK', text: 'Participated in 3 hackathons' },
  { tag: 'SUN',  text: 'Built Yor Zenith, a full-stack solar planning platform with modular 3D dashboards - As a startup.' },
  { tag: 'MUS',  text: "Plays piano and guitar. Also a serious chess player and Rubik's Cube solver" },
  { tag: 'BSG',  text: 'Completed Pratham, Dwitiya, and Tritiya Sopan in Bharat Scouts & Guides' },
  { tag: 'IN',   text: 'Based in India and open to remote internships and collaboration' },
] as const

// ─── Page-level CSS ────────────────────────────────────────────────────────────

const PAGE_CSS = `
  :root {
    --bg:         #0a0906;
    --bg2:        #111009;
    --surface:    #1a1710;
    --surface2:   #252118;
    --gold:       #c9a84c;
    --gold-light: #e8c96e;
    --gold-dim:   #7a6228;
    --cream:      #f0e8d8;
    --cream-dim:  #a89878;
    --border:     #2a2520;
    --text-dim:   #7a7060;
  }

  [data-theme='light'] {
    --bg:         #f6f0e4;
    --bg2:        #ece2cf;
    --surface:    #f4ead8;
    --surface2:   #e8dbc2;
    --gold:       #9a6f11;
    --gold-light: #b8891f;
    --gold-dim:   #7d5b14;
    --cream:      #1e1a12;
    --cream-dim:  #4b4336;
    --border:     #d8c7a9;
    --text-dim:   #6a604f;
  }

  .about-page { background: var(--bg); padding-bottom: 6rem; }

  @keyframes _revealUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes _spinRing {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    @keyframes _revealUp { from { opacity: 0; } to { opacity: 1; } }
    @keyframes _spinRing { from { transform: none; } to { transform: none; } }
  }

  .about-section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.35em;
    color: var(--gold);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  .about-section-label::before {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--gold);
    flex-shrink: 0;
  }

  .about-section {
    padding: clamp(5rem, 9vw, 8rem) 0;
    border-bottom: 1px solid var(--border);
  }
  .about-section:last-child { border-bottom: none; }

  /* Hero */
  .about-hero {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 3.5rem clamp(4rem, 7vw, 6rem);
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }
  .about-hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 70% at 80% 30%, rgba(201,168,76,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 15% 85%, rgba(58,138,124,0.04) 0%, transparent 55%),
      linear-gradient(160deg, #0d0b08 0%, #0a0906 60%, #0f0d0a 100%);
  }
  [data-theme='light'] .about-hero-bg {
    background:
      radial-gradient(ellipse 60% 70% at 80% 30%, rgba(154,111,17,0.09) 0%, transparent 62%),
      radial-gradient(ellipse 40% 50% at 15% 85%, rgba(47,114,103,0.07) 0%, transparent 58%),
      linear-gradient(160deg, #f4ecdc 0%, #f6f0e4 60%, #efe4d1 100%);
  }
  .about-hero-line {
    position: absolute; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border), transparent);
    animation: _lineFade 3s ease-in-out infinite alternate;
  }
  .about-hero-line:nth-child(2) { left: 33.3%; }
  .about-hero-line:nth-child(3) { left: 66.6%; animation-delay: 1.5s; }
  @keyframes _lineFade { from { opacity: 0.3; } to { opacity: 0.8; } }

  .about-hero-inner {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: clamp(2rem, 5vw, 5rem);
    align-items: flex-end;
    max-width: 1300px;
    margin: 0 auto;
    animation: _revealUp 700ms cubic-bezier(0.16,1,0.3,1) both;
  }
  .about-issue {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem; letter-spacing: 0.3em;
    color: var(--gold-dim); text-transform: uppercase; margin-bottom: 1.8rem;
  }
  .about-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(4rem, 9vw, 8.5rem);
    font-weight: 900; line-height: 0.9;
    color: var(--cream); letter-spacing: -0.02em; margin: 0 0 2.5rem;
  }
  .about-title em { font-style: italic; color: var(--gold); }
  .about-hero-desc {
    font-size: 0.95rem; color: var(--cream-dim);
    line-height: 1.85; max-width: 44ch; margin-bottom: 2rem;
  }
  .about-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
  .about-cta-primary {
    display: inline-flex; align-items: center; gap: 0.8rem;
    padding: 0.9rem 2rem; border: 1px solid var(--gold); color: var(--gold);
    font-family: 'DM Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;
    transition: background 0.3s, color 0.3s; white-space: nowrap;
  }
  .about-cta-primary:hover { background: var(--gold); color: var(--bg); }
  .about-cta-secondary {
    display: inline-flex; align-items: center; padding: 0.9rem 2rem;
    border: 1px solid var(--border); color: var(--cream-dim);
    font-family: 'DM Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;
    transition: background 0.3s, color 0.3s;
  }
  .about-cta-secondary:hover { background: var(--surface); color: var(--cream); }

  /* Avatar */
  .about-avatar-wrap {
    position: relative;
    width: clamp(220px, 23vw, 280px);
    aspect-ratio: 4 / 5;
    flex-shrink: 0; align-self: flex-end; margin-bottom: 0.5rem;
  }
  .about-avatar-ring-spin {
    position: absolute; inset: 1rem -0.9rem -0.9rem 1rem;
    border-radius: 2rem;
    border: 1.5px dashed rgba(201,168,76,0.3);
    animation: none;
  }
  .about-avatar-ring-static {
    position: absolute; inset: -0.6rem 0.9rem 0.9rem -0.6rem;
    border-radius: 2rem;
    border: 1px solid rgba(201,168,76,0.15);
  }
  .about-avatar-circle {
    width: 100%; height: 100%;
    border-radius: 1.7rem;
    background:
      radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08) 0%, transparent 30%),
      linear-gradient(160deg, #1a1710 0%, #0a0906 100%);
    position: relative; overflow: hidden;
    border: 1px solid rgba(201,168,76,0.18);
    box-shadow: 0 0 48px rgba(201,168,76,0.12), inset 0 0 24px rgba(201,168,76,0.05);
  }
  .about-avatar-circle::after {
    content: '';
    position: absolute; inset: 0;
    background:
      linear-gradient(180deg, rgba(10,9,6,0.01) 0%, rgba(10,9,6,0.26) 100%),
      radial-gradient(circle at 70% 12%, rgba(255,255,255,0.12) 0%, transparent 30%);
    pointer-events: none;
  }
  .about-avatar-image {
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: center top;
    transform: scale(1.01);
  }

  /* Stats */
  .about-section-wrap { max-width: 1300px; margin: 0 auto; padding: 0 3.5rem; }
  .about-stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
  }
  .about-stat { background: var(--bg); padding: 2rem 1.5rem; transition: background 0.3s; }
  .about-stat:hover { background: var(--surface); }
  .about-stat-value {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.2rem, 4vw, 3rem); font-weight: 900; color: var(--gold);
    line-height: 1; margin-bottom: 0.5rem; font-variant-numeric: tabular-nums;
  }
  .about-stat-label {
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-dim);
  }

  /* Philosophy cards */
  .about-philosophy-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
  }
  .about-philosophy-card {
    background: var(--bg); padding: 2.5rem;
    display: flex; flex-direction: column; gap: 1rem; transition: background 0.3s;
  }
  .about-philosophy-card:hover { background: var(--surface); }
  .about-philosophy-icon { font-size: 2rem; line-height: 1; }
  .about-philosophy-title {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.15rem; font-weight: 700; color: var(--cream); margin: 0;
  }
  .about-philosophy-body { font-size: 0.9rem; line-height: 1.8; color: var(--cream-dim); margin: 0; }

  /* Fun facts */
  .about-facts-list {
    list-style: none; padding: 0; margin: 0;
    display: flex; flex-direction: column;
    gap: 1px; background: var(--border); border: 1px solid var(--border);
  }
  .about-fact-item {
    display: flex; align-items: flex-start; gap: 1.5rem;
    background: var(--bg); padding: 1.5rem 2rem; transition: background 0.3s;
  }
  .about-fact-item:hover { background: var(--surface); }
  .about-fact-tag {
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold-dim);
    border: 1px solid var(--border); padding: 0.25rem 0.6rem;
    flex-shrink: 0; margin-top: 0.1rem; white-space: nowrap;
  }
  .about-fact-text { font-size: 0.95rem; color: var(--cream-dim); line-height: 1.75; }

  /* Bio */
  .about-bio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: start; }
  .about-bio-heading {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.2rem, 4.5vw, 4rem); font-weight: 700;
    line-height: 1.1; letter-spacing: -0.02em; color: var(--cream); margin: 0 0 2rem;
  }
  .about-bio-heading em { font-style: italic; color: var(--gold); }
  .about-bio-text { font-size: 0.95rem; line-height: 1.9; color: var(--cream-dim); margin-bottom: 1.4rem; }
  .about-bio-links { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 2rem; }
  .about-bio-pill {
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold-dim);
    border: 1px solid var(--border); padding: 0.4rem 0.9rem;
    text-decoration: none; transition: border-color 0.3s, color 0.3s;
  }
  .about-bio-pill:hover { border-color: var(--gold); color: var(--gold); }

  /* Tech hint */
  .about-tech-hint {
    text-align: center; font-family: 'DM Mono', monospace;
    font-size: 0.6rem; letter-spacing: 0.12em; color: var(--text-dim);
    margin-top: 1rem; text-transform: uppercase;
  }

  /* Section heading shared */
  .about-sh {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700;
    line-height: 1.1; letter-spacing: -0.02em;
    color: var(--cream); margin-bottom: 3rem;
  }
  .about-sh em { font-style: italic; color: var(--gold); }

  @media (max-width: 900px) {
    .about-hero { padding: 0 1.5rem clamp(3rem, 6vw, 5rem); }
    .about-hero-inner { grid-template-columns: 1fr; }
    .about-avatar-wrap {
      width: min(62vw, 220px);
      justify-self: start; margin-top: 1rem;
    }
    .about-section-wrap { padding: 0 1.5rem; }
    .about-stats-grid { grid-template-columns: 1fr 1fr; }
    .about-philosophy-grid { grid-template-columns: 1fr; }
    .about-bio-grid { grid-template-columns: 1fr; gap: 3rem; }
  }
`

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage(): React.ReactElement {
  return (
    <div className="about-page">
      <style>{PAGE_CSS}</style>

      {/* ══ Hero ══════════════════════════════════════════════════════════ */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-line" />
        <div className="about-hero-line" />

        <div className="about-hero-inner">
          <div>
            <p className="about-issue">Ayush Roy — Est. 2024</p>
            <h1 className="about-title">
              The person<br />
              behind the <em>work.</em>
            </h1>
            <p className="about-hero-desc">
              Real name: Ayush Roy. Virtual alias: Yor Ayrin. Full-stack developer intern candidate
              at KIIT building Next.js product surfaces, Python backend systems, realtime dashboards,
              and computer-vision tools.
            </p>
            <div className="about-hero-ctas">
              <Link href="/contact" className="about-cta-primary">
                Get in touch
                <svg width="14" height="9" viewBox="0 0 16 10" fill="none">
                  <path d="M11 1L15 5M15 5L11 9M15 5H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
              <Link href="/projects" className="about-cta-secondary">
                See my work
              </Link>
            </div>
          </div>

          <div className="about-avatar-wrap">
            <div className="about-avatar-ring-spin" aria-hidden="true" />
            <div className="about-avatar-ring-static" aria-hidden="true" />
            <div className="about-avatar-circle">
              <Image
                src={PROFILE_PHOTO_SRC}
                alt="Portrait of Ayush Roy"
                fill
                priority
                sizes="(max-width: 900px) 160px, 180px"
                className="about-avatar-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ Stats ════════════════════════════════════════════════════════ */}
      <section className="about-section" style={{ paddingBlock: 'clamp(2.5rem,5vw,4rem)' }}>
        <div className="about-section-wrap">
          <div className="about-stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="about-stat">
                <div className="about-stat-value">{stat.value}</div>
                <div className="about-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Bio ══════════════════════════════════════════════════════════ */}
      <section className="about-section">
        <div className="about-section-wrap">
          <div className="about-bio-grid">
            <div>
              <div className="about-section-label">About Me</div>
              <h2 className="about-bio-heading">
                I build things<br />that <em>think.</em>
              </h2>
            </div>
            <div>
              <p className="about-bio-text">
                I&apos;m Ayush Roy (virtual alias: Yor Ayrin), a full-stack developer intern candidate
                at KIIT focused on shipping Next.js product surfaces, Python backend systems,
                realtime dashboards, and computer-vision workflows.
              </p>
              <p className="about-bio-text">
                {SITE_PROFILE.seekingStatement}
              </p>
              <p className="about-bio-text">
                My strongest production-aligned work includes Yor Helios, Yor Zenith as a startup-style
                full-stack solar planning platform with modular 3D dashboards, Yor AI vs Real Image,
                and this portfolio platform itself.
              </p>
              <p className="about-bio-text">
                My portfolio uses my resume and GitHub as the single source of truth, so every project
                claim stays accurate, current, and easy to verify.
              </p>
              <div className="about-bio-links">
                <a href="https://github.com/yorayriniwnl" className="about-bio-pill" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/yorayriniwnl" className="about-bio-pill" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href="mailto:yorayriniwnl@gmail.com" className="about-bio-pill">Email</a>
                <Link href="/cv" className="about-bio-pill">CV</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Philosophy ═══════════════════════════════════════════════════ */}
      <section className="about-section">
        <div className="about-section-wrap">
          <div className="about-section-label">Philosophy</div>
          <h2 className="about-sh">How I <em>work.</em></h2>
          <div className="about-philosophy-grid">
            {PHILOSOPHY.map((card) => (
              <div key={card.title} className="about-philosophy-card">
                <span className="about-philosophy-icon" aria-hidden="true">{card.icon}</span>
                <h3 className="about-philosophy-title">{card.title}</h3>
                <p className="about-philosophy-body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Tech cloud ═══════════════════════════════════════════════════ */}
      <section id="skills" className="about-section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="about-section-wrap">
          <div className="about-section-label">Toolbox</div>
          <h2 className="about-sh">Tech I <em>work with.</em></h2>
          <Suspense fallback={<FlatCloud />}>
            <TechCloud3D />
          </Suspense>
          <p className="about-tech-hint">Hover to inspect · Click to scroll to skills</p>
        </div>
      </section>

      {/* ══ Fun facts ════════════════════════════════════════════════════ */}
      <section className="about-section" style={{ borderBottom: 'none' }}>
        <div className="about-section-wrap">
          <div className="about-section-label">A few more things</div>
          <h2 className="about-sh">Beyond the <em>resume.</em></h2>
          <ul className="about-facts-list">
            {FUN_FACTS.map((fact) => (
              <li key={fact.text} className="about-fact-item">
                <span className="about-fact-tag">{fact.tag}</span>
                <span className="about-fact-text">{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
