'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type PreviewMode = 'solar' | 'vision' | 'matching' | 'memory'

type Project = {
  number: string
  title: string
  discipline: string
  thesis: string
  challenge: string
  contribution: string
  outcome: string
  stack: string[]
  live?: string
  source: string
  tone: string
  preview: PreviewMode
}

const navigation = [
  { id: 'work', label: 'Work' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const projects: Project[] = [
  {
    number: '01',
    title: 'Yor Zenith',
    discipline: 'Decision support · energy systems',
    thesis: 'Make a high-stakes technical decision feel inspectable before it feels simple.',
    challenge: 'Rooftop feasibility, yield, subsidy assumptions, and long-term return usually arrive as disconnected answers.',
    contribution: 'Product direction, interaction model, frontend system, 3D visualization, and modeling integration.',
    outcome: 'One decision surface that keeps the reasoning visible from first input to final recommendation.',
    stack: ['Next.js', 'TypeScript', 'Three.js', 'Python'],
    live: 'https://zenith-xi-snowy.vercel.app/',
    source: 'https://github.com/yorayriniwnl/Yor-Zenith',
    tone: 'ember',
    preview: 'solar',
  },
  {
    number: '02',
    title: 'Yor AI vs Real',
    discipline: 'Computer vision · explainability',
    thesis: 'A prediction is useful only when the person reviewing it can understand why it deserves trust.',
    challenge: 'Binary labels hide uncertainty and make classical image features feel like an inaccessible black box.',
    contribution: 'Vision pipeline, feature strategy, SVM inference flow, and the human-readable review experience.',
    outcome: 'A compact inspection workflow that presents classification and supporting evidence together.',
    stack: ['Python', 'OpenCV', 'Scikit-Learn', 'Streamlit'],
    live: 'https://yor-ai-vs-real-image.vercel.app',
    source: 'https://github.com/yorayriniwnl/Yor-Ai-vs-real-image',
    tone: 'cobalt',
    preview: 'vision',
  },
  {
    number: '03',
    title: 'Mentor / Mentee',
    discipline: 'Workflow design · matching systems',
    thesis: 'Turn an invisible coordination process into a workflow people can review, adjust, and repeat.',
    challenge: 'Mentor matching often lives inside spreadsheets and tacit judgment, making good decisions hard to reproduce.',
    contribution: 'Weighted matching logic, shared domain model, Flask API, SQLite persistence, and desktop workflow.',
    outcome: 'A traceable matching system with less manual repetition and clearer human control.',
    stack: ['Python', 'Flask', 'SQLite', 'SQLAlchemy'],
    source: 'https://github.com/yorayriniwnl/mentor-mentee-system',
    tone: 'teal',
    preview: 'matching',
  },
  {
    number: '04',
    title: 'Yor Smriti',
    discipline: 'Narrative interface · personal software',
    thesis: 'Some information should be experienced with pace and atmosphere, not flattened into another feed.',
    challenge: 'Memory products often optimize storage while losing the emotional rhythm that makes a moment worth revisiting.',
    contribution: 'Narrative structure, visual direction, interaction pacing, responsive implementation, and delivery.',
    outcome: 'A focused digital space where chronology, mood, and motion carry the story together.',
    stack: ['React', 'TypeScript', 'Motion', 'CSS'],
    live: 'https://yor-smriti.vercel.app',
    source: 'https://github.com/yorayriniwnl/Yor-Smriti',
    tone: 'plum',
    preview: 'memory',
  },
]

const capabilities = [
  {
    number: '01',
    title: 'Shape the product',
    text: 'I reduce a dense problem into a clear interaction model, useful states, and a surface that tells people what happens next.',
    tools: ['Product thinking', 'UX systems', 'Prototyping'],
  },
  {
    number: '02',
    title: 'Build the system',
    text: 'I move across interface, application state, API boundaries, and persistence without losing the reason the product exists.',
    tools: ['React / Next.js', 'TypeScript', 'Python / SQL'],
  },
  {
    number: '03',
    title: 'Finish the experience',
    text: 'I care about feedback, motion, keyboard and touch behavior, responsive composition, and the small details that earn trust.',
    tools: ['Interaction design', 'Accessibility', 'Performance'],
  },
]

const timeline = [
  {
    period: '2025 — now',
    title: 'Independent product engineering',
    body: 'Shipping decision tools, computer-vision interfaces, workflow systems, and personal software in public.',
  },
  {
    period: '2023 — 2027',
    title: 'B.Tech · CS & Communication Engineering',
    body: 'KIIT Deemed to be University · building the engineering range behind the product work.',
  },
  {
    period: 'Current',
    title: 'Looking for the right team',
    body: 'Open to internships, entry-level product engineering, and ambitious collaborations.',
  },
]

function Arrow({ down = false }: { down?: boolean }) {
  return <span className="arrow" aria-hidden="true">{down ? '↓' : '↗'}</span>
}

function ProductPreview({ mode, title }: { mode: PreviewMode; title: string }) {
  return (
    <div className={`product-preview product-preview--${mode}`} aria-hidden="true">
      <div className="preview-bar">
        <span className="preview-dots"><i /><i /><i /></span>
        <span>{title} / live system</span>
        <b>●</b>
      </div>

      {mode === 'solar' && (
        <div className="solar-ui">
          <div className="solar-map"><span className="solar-roof"><i /><i /><i /><i /></span><b>28.61° N</b></div>
          <div className="solar-readout"><small>Estimated yield</small><strong>8,420</strong><span>kWh / year</span><div className="solar-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
          <div className="solar-decision"><span>Recommendation</span><strong>High-fit rooftop</strong><i>Review assumptions →</i></div>
        </div>
      )}

      {mode === 'vision' && (
        <div className="vision-ui">
          <div className="vision-frame"><span className="vision-grid" /><b>INPUT / 01</b><i className="scan-line" /></div>
          <div className="vision-result"><small>Classification</small><strong>REAL</strong><span>Confidence signal</span><div className="confidence-track"><i /></div><ul><li>Texture continuity <b>stable</b></li><li>Edge variance <b>natural</b></li><li>Frequency noise <b>low</b></li></ul></div>
        </div>
      )}

      {mode === 'matching' && (
        <div className="matching-ui">
          <div className="match-person match-person--one"><span>AR</span><small>Data systems</small></div>
          <div className="match-person match-person--two"><span>SK</span><small>Product design</small></div>
          <div className="match-bridge"><i /><strong>86%</strong><small>weighted fit</small></div>
          <div className="match-factors"><span>Goals <b>0.92</b></span><span>Schedule <b>0.78</b></span><span>Domain <b>0.88</b></span></div>
        </div>
      )}

      {mode === 'memory' && (
        <div className="memory-ui">
          <div className="memory-date"><span>12</span><small>SEP · 2025</small></div>
          <div className="memory-line"><i /><i /><i /><i /></div>
          <div className="memory-card memory-card--back"><span>02</span></div>
          <div className="memory-card memory-card--front"><small>A MOMENT WORTH KEEPING</small><strong>Some stories need<br />room to breathe.</strong><span>Open memory ↗</span></div>
        </div>
      )}
    </div>
  )
}

function CaseStudy({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`case-study case-study--${project.tone} ${index % 2 ? 'case-study--reverse' : ''}`}>
      <div className="case-visual">
        <ProductPreview mode={project.preview} title={project.title} />
        <span className="case-visual__label">{project.number} / selected system</span>
      </div>
      <div className="case-copy">
        <div className="case-kicker"><span>{project.number}</span><p>{project.discipline}</p></div>
        <h3>{project.title}</h3>
        <p className="case-thesis">{project.thesis}</p>
        <dl className="case-facts">
          <div><dt>Problem</dt><dd>{project.challenge}</dd></div>
          <div><dt>My scope</dt><dd>{project.contribution}</dd></div>
          <div><dt>Result</dt><dd>{project.outcome}</dd></div>
        </dl>
        <div className="case-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="case-actions">
          {project.live ? <a href={project.live} target="_blank" rel="noreferrer">Open live product <Arrow /></a> : <span className="case-actions__offline">Live build offline</span>}
          <a href={project.source} target="_blank" rel="noreferrer">Inspect source <Arrow /></a>
        </div>
      </div>
    </article>
  )
}

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState('work')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(available > 0 ? window.scrollY / available : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = navigation
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-24% 0px -60% 0px', threshold: [0.12, 0.35, 0.65] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`)
      root.style.setProperty('--pointer-y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <div className="portfolio-site">
      <div className="scroll-meter" aria-hidden="true"><span style={{ transform: `scaleX(${scrollProgress})` }} /></div>
      <div className="pointer-light" aria-hidden="true" />

      <header className="site-header">
        <a href="#top" className="brand" aria-label="Ayush Roy portfolio home">
          <span>AR</span>
          <small>Product engineer</small>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'is-active' : ''}>{item.label}</a>
          ))}
        </nav>
        <div className="header-actions">
          <span className="availability"><i /> Available for the right role</span>
          <a className="header-contact" href="mailto:ayushroy.dev@gmail.com">Start a conversation <Arrow /></a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
            <span>{menuOpen ? 'Close' : 'Menu'}</span><i /><i />
          </button>
        </div>
        <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Mobile navigation">
          {navigation.map((item, index) => <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}<Arrow /></a>)}
        </nav>
      </header>

      <main id="top">
        <section className="portfolio-hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="overline"><span>AYUSH ROY</span> · PRODUCT ENGINEER · INDIA</p>
            <h1 id="hero-title">I turn difficult systems into <em>clear, useful products.</em></h1>
            <p className="hero-intro">Full-stack engineering with product judgment—from the interaction model and visual system to the API, data, and implementation details beneath it.</p>
            <div className="hero-actions">
              <a className="button button--ink" href="#work">View selected work <Arrow down /></a>
              <a className="button button--line" href="/resume.pdf" target="_blank" rel="noreferrer">Open résumé <Arrow /></a>
            </div>
            <div className="hero-links" aria-label="Professional links">
              <a href="https://github.com/yorayriniwnl" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
              <a href="https://linkedin.com/in/yorayriniwnl" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
              <a href="mailto:ayushroy.dev@gmail.com">Email <Arrow /></a>
            </div>
          </div>

          <aside className="portrait-stage" aria-label="Ayush Roy profile">
            <div className="portrait-backdrop"><span>BUILD</span><span>SHIP</span><span>LEARN</span></div>
            <div className="portrait-card">
              <div className="portrait-image">
                <Image src="/images/ayush-portrait.png" alt="Ayush Roy" fill priority sizes="(max-width: 900px) 86vw, 38vw" />
                <span className="portrait-index">PORTRAIT / 01</span>
              </div>
              <div className="portrait-meta">
                <div><small>Currently</small><strong>Building products that explain themselves.</strong></div>
                <span className="portrait-status"><i /> Open</span>
              </div>
            </div>
            <a className="player-signal" href="https://steamcommunity.com/id/yorayriniwnl/" target="_blank" rel="noreferrer">
              <span><i /> Off-hours identity</span><strong>Yor Ayrin · iwnl</strong><small>Player level 125 <Arrow /></small>
            </a>
          </aside>
        </section>

        <section className="proof-rail section-shell" aria-label="Portfolio overview">
          <div><span>01</span><strong>4 focused case studies</strong><small>Product thinking through implementation</small></div>
          <div><span>02</span><strong>Interface → API → data</strong><small>One continuous engineering surface</small></div>
          <div><span>03</span><strong>Web · vision · 3D · systems</strong><small>Range without losing the product</small></div>
          <a href="https://yorayriniwnl.in" target="_blank" rel="noreferrer"><span>04</span><strong>Enter the wider world</strong><small>Experiments, archive, and games <Arrow /></small></a>
        </section>

        <section className="work-zone" id="work" aria-labelledby="work-title">
          <div className="section-shell">
            <div className="section-heading section-heading--dark">
              <p className="section-index">01 / SELECTED WORK</p>
              <h2 id="work-title">Products with a point of view.</h2>
              <p>Each case study is framed around the decision it improves—not a list of technologies used along the way.</p>
            </div>
            <div className="case-list">
              {projects.map((project, index) => <CaseStudy project={project} index={index} key={project.number} />)}
            </div>
          </div>
        </section>

        <section className="capability-zone section-shell" id="capabilities" aria-labelledby="capabilities-title">
          <div className="section-heading">
            <p className="section-index">02 / HOW I CONTRIBUTE</p>
            <h2 id="capabilities-title">One person across the seams.</h2>
            <p>I am most useful where product decisions and engineering decisions need to stay in the same conversation.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map((capability) => (
              <article key={capability.number}>
                <span>{capability.number}</span>
                <h3>{capability.title}</h3>
                <p>{capability.text}</p>
                <div>{capability.tools.map((tool) => <small key={tool}>{tool}</small>)}</div>
              </article>
            ))}
          </div>
          <div className="toolchain">
            <span>WORKING TOOLCHAIN</span>
            <p>React / Next.js <i /> TypeScript <i /> Python <i /> OpenCV <i /> SQL <i /> Three.js <i /> Git</p>
          </div>
        </section>

        <section className="about-zone" id="about" aria-labelledby="about-title">
          <div className="section-shell about-grid">
            <div className="about-copy">
              <p className="section-index">03 / ABOUT THE BUILDER</p>
              <h2 id="about-title">Curious enough to go deep. Practical enough to ship.</h2>
              <p className="about-lede">I’m Ayush Roy, a computer science student and independent product builder. I enjoy domains with real complexity—energy, vision, coordination, interaction—and the work of making that complexity feel calm in someone else’s hands.</p>
              <p>I approach interfaces like playable systems: every action needs feedback, every state needs a reason, and the next move should feel obvious without feeling dull.</p>
              <div className="about-actions">
                <a href="/resume.pdf" target="_blank" rel="noreferrer">Read the résumé <Arrow /></a>
                <a href="https://yorayriniwnl.in" target="_blank" rel="noreferrer">Explore the hub <Arrow /></a>
              </div>
            </div>
            <div className="timeline" aria-label="Experience timeline">
              {timeline.map((item, index) => (
                <article key={item.title}>
                  <span>0{index + 1}</span>
                  <div><small>{item.period}</small><h3>{item.title}</h3><p>{item.body}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-zone section-shell" id="contact" aria-labelledby="contact-title">
          <div className="contact-card">
            <p className="section-index">04 / OPEN CHANNEL</p>
            <h2 id="contact-title">Bring me the problem that refuses to become simple.</h2>
            <p>I’m looking for a team where product judgment, technical range, and care for the finished experience are part of the same job.</p>
            <div className="contact-actions">
              <a className="button button--paper" href="mailto:ayushroy.dev@gmail.com">ayushroy.dev@gmail.com <Arrow /></a>
              <span>India · UTC +5:30<br />Open to remote collaboration</span>
            </div>
            <div className="contact-monogram" aria-hidden="true">AR</div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-shell">
        <div><strong>Ayush Roy</strong><span>Product engineer · © 2026</span></div>
        <p>Built with Next.js, TypeScript, and a refusal to hide the hard part.</p>
        <div className="footer-links"><a href="https://github.com/yorayriniwnl">GitHub</a><a href="https://linkedin.com/in/yorayriniwnl">LinkedIn</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  )
}
