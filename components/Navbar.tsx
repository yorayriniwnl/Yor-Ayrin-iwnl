"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { NAV_LINKS, NAV_MENU_GROUPS, SITE_PROFILE } from '../lib/data'

export default function Navbar(): JSX.Element {
  const pathname = usePathname() ?? '/'
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0
      setScrolled(y > 12)

      const delta = y - lastY.current
      if (Math.abs(delta) > 8) setHidden(delta > 0 && y > 180)
      lastY.current = y
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(handleScroll)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const navClassName = `site-header ${scrolled ? 'site-header--scrolled' : ''} ${
    hidden && !isMenuOpen ? 'site-header--hidden' : ''
  }`

  return (
    <header className={navClassName}>
      <div className="site-header__inner">
        <div className="site-header__left">
          <Link href="/" className="site-logo" aria-label={`${SITE_PROFILE.name} home`}>
            {SITE_PROFILE.name}
          </Link>
          <span className="site-header__tag ds-tag ds-tag--singleline">Editorial portfolio system</span>
        </div>

        <nav className="site-nav" role="navigation" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`))

            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                >
                  {link.label}
                </a>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <div className="site-header__desktop-actions">
            <Link href="/resume" className="ds-button ds-button--ghost ds-button--sm">
              Resume
            </Link>
            <Link href="/settings" className="ds-button ds-button--secondary ds-button--sm">
              Settings
            </Link>
          </div>
          <button
            type="button"
            className="ds-button ds-button--secondary ds-button--sm site-header__menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="site-explore-menu"
          >
            {isMenuOpen ? 'Close' : 'Explore'}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div id="site-explore-menu" className="site-menu" role="dialog" aria-label="Explore site pages">
          <div className="site-menu__panel">
            <div className="site-menu__top">
              <div>
                <p className="site-menu__eyebrow">Full site map</p>
                <p className="site-menu__copy">
                  Resume, stats, dashboard, profile, media, and archive pages are now surfaced here so the rest of the app is reachable from one place.
                </p>
              </div>

              <div className="site-menu__actions">
                <Link href="/resume" className="ds-button ds-button--ghost ds-button--sm">
                  Resume
                </Link>
                <Link href="/settings" className="ds-button ds-button--secondary ds-button--sm">
                  Settings
                </Link>
              </div>
            </div>

            <div className="site-menu__grid">
              {NAV_MENU_GROUPS.map((group) => (
                <section key={group.title} className="site-menu__group" aria-label={group.title}>
                  <p className="site-menu__group-title">{group.title}</p>
                  <div className="site-menu__links">
                    {group.links.map((link) => {
                      const isActive =
                        pathname === link.href ||
                        (link.href !== '/' && pathname.startsWith(`${link.href}/`))

                      if (link.external) {
                        return (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`site-menu__link ${isActive ? 'site-menu__link--active' : ''}`}
                          >
                            {link.label}
                          </a>
                        )
                      }

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`site-menu__link ${isActive ? 'site-menu__link--active' : ''}`}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
