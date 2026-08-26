'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { capabilities, projects, timeline, type WorkProject } from './work-data'

function Arrow({ down = false }: { down?: boolean }) {
  return <span className="arrow" aria-hidden="true">{down ? '↓' : '↗'}</span>
}

function ProjectVisual({ project, featured = false }: { project: WorkProject; featured?: boolean }) {
  const className = 'project-visual project-visual--' + project.accent + (featured ? ' project-visual--featured' : '')
  return (
    <div className={className}>
      <div className="project-visual__chrome"><span>{project.number} / evidence board</span><span>{project.status}</span></div>
      <div className="project-visual__image"><Image src={project.evidence} alt={project.title + ' project artifact preview'} fill sizes={featured ? '(max-width: 900px) 100vw, 58vw' : '(max-width: 900px) 100vw, 32vw'} /></div>
      <div className="project-visual__caption"><span>{project.discipline}</span><strong>{project.shortTitle}</strong></div>
    </div>
  )
}

function ProjectLinks({ project }: { project: WorkProject }) {
  return (
    <div className="project-links">
      <Link href={'/work/' + project.slug}>Read the case <Arrow /></Link>
      {project.live ? <a href={project.live} target="_blank" rel="noreferrer">Open build <Arrow /></a> : <span>Source study</span>}
    </div>
  )
}

function ProjectCard({ project }: { project: WorkProject }) {
  return (
    <article className={'project-card project-card--' + project.accent}>
      <ProjectVisual project={project} />
      <div className="project-card__body">
        <div className="project-card__meta"><span>{project.number}</span><span>{project.status}</span></div>
        <h3>{project.title}</h3>
        <p>{project.thesis}</p>
        <div className="project-card__tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        <ProjectLinks project={project} />
      </div>
    </article>
  )
}

export default function PortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('work')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['work', 'capabilities', 'about', 'contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-20% 0px -62% 0px', threshold: [0.1, 0.35, 0.7] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const navItems = [['work', 'Work'], ['capabilities', 'Capabilities'], ['about', 'About'], ['contact', 'Contact']]

  return (
    <div className="portfolio-site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-meter" aria-hidden="true"><span style={{ transform: 'scaleX(' + progress + ')' }} /></div>
      <header className="site-header">
        <Link href="#top" className="brand" aria-label="Ayush Roy portfolio home"><span>AR</span><span><strong>AYUSH ROY</strong><small>PRODUCT ENGINEER</small></span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map(([id, label]) => <Link key={id} href={'#' + id} className={activeSection === id ? 'is-active' : ''}>{label}</Link>)}</nav>
        <div className="header-actions"><span className="availability"><i /> Open to product engineering</span><a className="header-contact" href="mailto:ayushroy.dev@gmail.com">Start a conversation <Arrow /></a><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? 'Close' : 'Menu'}</span><i /><i /></button></div>
        <nav id="mobile-menu" className={'mobile-menu ' + (menuOpen ? 'is-open' : '')} aria-label="Mobile navigation">{navItems.map(([id, label], index) => <Link key={id} href={'#' + id} onClick={closeMenu}><span>0{index + 1}</span>{label}<Arrow /></Link>)}</nav>
      </header>

      <main id="main-content">
        <section className="portfolio-hero section-shell" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="overline"><span>AYUSH ROY</span> / PRODUCT ENGINEER / INDIA</p>
            <h1 id="hero-title">I make complex software <em>legible, useful, and worth returning to.</em></h1>
            <p className="hero-intro">Product-minded engineering across decision tools, computer vision, workflow systems, and personal software—from the first interaction model to the data underneath it.</p>
            <div className="hero-proof"><div><strong>04</strong><span>selected systems</span></div><div><strong>01</strong><span>continuous surface<br />interface → API → data</span></div></div>
            <div className="hero-actions"><Link className="button button--ink" href="#work">See the work <Arrow down /></Link><a className="button button--line" href="/resume.pdf" target="_blank" rel="noreferrer">Open résumé <Arrow /></a></div>
            <div className="hero-links" aria-label="Professional links"><a href="https://github.com/yorayriniwnl" target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href="https://linkedin.com/in/yorayriniwnl" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a><a href="mailto:ayushroy.dev@gmail.com">Email <Arrow /></a></div>
          </div>
          <aside className="portrait-stage" aria-label="Ayush Roy profile">
            <div className="portrait-stage__label"><span>PROFILE / 01</span><span>DELHI / UTC +5:30</span></div>
            <div className="portrait-card"><div className="portrait-image"><Image src="/images/ayush-portrait.png" alt="Ayush Roy" fill priority sizes="(max-width: 900px) 86vw, 38vw" /></div><div className="portrait-meta"><div><small>Working on</small><strong>Systems that explain themselves.</strong></div><span className="portrait-status"><i /> Available</span></div></div>
            <a className="player-signal" href="https://steamcommunity.com/id/yorayriniwnl/" target="_blank" rel="noreferrer"><span><i /> Off-hours identity</span><strong>Yor Ayrin · iwnl</strong><small>Steam level 125 <Arrow /></small></a>
          </aside>
        </section>

        <section className="signal-strip section-shell" aria-label="Portfolio signals"><div><span>01</span><strong>Decision tools</strong><small>Make difficult choices inspectable.</small></div><div><span>02</span><strong>Trust interfaces</strong><small>Make technical output reviewable.</small></div><div><span>03</span><strong>Playable systems</strong><small>Make interaction worth returning to.</small></div><Link href="https://yorayriniwnl.in" target="_blank"><span>04</span><strong>Wider world</strong><small>Games, media, and experiments <Arrow /></small></Link></section>

        <section className="work-zone" id="work" aria-labelledby="work-title">
          <div className="section-shell">
            <div className="section-heading section-heading--dark"><div><p className="section-index">01 / SELECTED SYSTEMS</p><h2 id="work-title">Work that makes a decision easier.</h2></div><p>Every project is a small argument: what was difficult, what I changed, and how the finished surface helps someone move.</p></div>
            <article className="feature-project"><ProjectVisual project={projects[0]} featured /><div className="feature-project__body"><div className="project-card__meta"><span>{projects[0].number} / FEATURED</span><span>{projects[0].status}</span></div><h3>{projects[0].title}</h3><p className="feature-project__thesis">{projects[0].thesis}</p><div className="feature-project__facts"><div><span>Problem</span><p>{projects[0].challenge}</p></div><div><span>Contribution</span><p>{projects[0].contribution}</p></div><div><span>Result</span><p>{projects[0].outcome}</p></div></div><div className="project-card__tags">{projects[0].stack.map((item) => <span key={item}>{item}</span>)}</div><ProjectLinks project={projects[0]} /></div></article>
            <div className="project-grid">{projects.slice(1).map((project) => <ProjectCard project={project} key={project.slug} />)}</div>
          </div>
        </section>

        <section className="capability-zone section-shell" id="capabilities" aria-labelledby="capabilities-title"><div className="section-heading"><div><p className="section-index">02 / HOW I CONTRIBUTE</p><h2 id="capabilities-title">One person across the seams.</h2></div><p>The useful part is not knowing every tool. It is keeping product judgment and engineering judgment in the same conversation.</p></div><div className="capability-grid">{capabilities.map((capability) => <article key={capability.number}><span>{capability.number}</span><h3>{capability.title}</h3><p>{capability.text}</p><div>{capability.tags.map((tag) => <small key={tag}>{tag}</small>)}</div></article>)}</div><div className="method-line" aria-label="Working method"><span>WORKING METHOD</span><strong>Frame <i /> model <i /> build <i /> test <i /> finish</strong></div></section>

        <section className="about-zone" id="about" aria-labelledby="about-title"><div className="section-shell about-grid"><div className="about-copy"><p className="section-index">03 / ABOUT THE BUILDER</p><h2 id="about-title">Curious enough to go deep. Practical enough to ship.</h2><p className="about-lede">I’m Ayush Roy, a computer science student and independent product builder. I like domains with real complexity—and the work of making that complexity feel calm in someone else’s hands.</p><p>I approach interfaces like playable systems: every action needs feedback, every state needs a reason, and the next move should feel obvious without feeling dull.</p><div className="about-actions"><a href="/resume.pdf" target="_blank" rel="noreferrer">Read the résumé <Arrow /></a><a href="https://yorayriniwnl.in" target="_blank" rel="noreferrer">Explore the hub <Arrow /></a></div></div><div className="timeline" aria-label="Experience timeline">{timeline.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><small>{item.period}</small><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></div></section>

        <section className="contact-zone section-shell" id="contact" aria-labelledby="contact-title"><div className="contact-card"><div><p className="section-index">04 / OPEN CHANNEL</p><h2 id="contact-title">Bring me the problem that refuses to become simple.</h2><p>I’m looking for a team where product judgment, technical range, and care for the finished experience are part of the same job.</p></div><div className="contact-actions"><a className="button button--paper" href="mailto:ayushroy.dev@gmail.com">Start a conversation <Arrow /></a><span>India · UTC +5:30<br />Open to remote collaboration</span></div><div className="contact-monogram" aria-hidden="true">AR</div></div></section>
      </main>

      <footer className="site-footer section-shell"><div><strong>Ayush Roy</strong><span>Product engineer · © 2026</span></div><p>Built with Next.js, TypeScript, and a refusal to hide the hard part.</p><div className="footer-links"><a href="https://github.com/yorayriniwnl">GitHub</a><a href="https://linkedin.com/in/yorayriniwnl">LinkedIn</a><Link href="#top">Back to top ↑</Link></div></footer>
    </div>
  )
}
