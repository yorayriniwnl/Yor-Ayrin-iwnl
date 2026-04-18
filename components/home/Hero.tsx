// Server Component — no 'use client' needed (purely presentational)

/**
 * Hero
 *
 * Full-viewport hero section.  Relies exclusively on CSS keyframe animations
 * (fadeUp, lineFade) defined in GlobalStyles — no JS state required.
 */
export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" />
      <div className="hero-line" />
      <div className="hero-line" />

      <p className="hero-issue">Ayush Roy - Est. 2024</p>

      <h1 className="hero-title">
        Build <em>Systems,</em>
        <br />
        Ship <em>Products.</em>
      </h1>

      <div className="hero-sub">
        <p className="hero-desc">
          Building production-minded systems, interactive product surfaces, and
          recruiter-ready portfolio experiences with a strong editorial point of
          view. Open to roles that value frontend execution and systems thinking.
        </p>
        <div className="hero-links">
          <a href="#projects" className="hero-cta">
            View Projects
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path
                d="M11 1L15 5M15 5L11 9M15 5H1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <a href="/resume.pdf" className="hero-cta secondary">
            Resume PDF
          </a>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="line" />
        Scroll
      </div>
    </section>
  )
}
