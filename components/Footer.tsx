import Link from 'next/link'
import React from 'react'
import { FOOTER_LINK_GROUPS, SITE_PROFILE } from '../lib/data'
import FooterJourney from './FooterJourney'

const YEAR = new Date().getFullYear()

export default function Footer(): JSX.Element {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <FooterJourney />

        <div className="site-footer__brand">
          <span className="site-footer__kicker">{SITE_PROFILE.role}</span>
          <span className="site-footer__title">{SITE_PROFILE.name}</span>
          <p className="site-footer__copy">
            Portfolio, profile, case studies, games, achievements, and dashboard
            surfaces now share one editorial system rooted in the hobbies design language.
          </p>
        </div>

        <div className="site-footer__column">
          <span className="site-footer__label">Explore</span>
          <div className="site-footer__links">
            {FOOTER_LINK_GROUPS.primary.map((link) =>
              link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ),
            )}
          </div>
          <div className="site-footer__links">
            {FOOTER_LINK_GROUPS.product.map((link) =>
              link.external ? (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="site-footer__column">
          <span className="site-footer__label">Resources</span>
          <div className="site-footer__links">
            {FOOTER_LINK_GROUPS.resources.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ),
            )}
          </div>

          <div className="site-footer__contact ds-stack ds-stack--tight">
            <a href={`mailto:${SITE_PROFILE.email}`}>{SITE_PROFILE.email}</a>
            <a href={`tel:${SITE_PROFILE.phone.replace(/\s+/g, '')}`}>{SITE_PROFILE.phone}</a>
            <a href={SITE_PROFILE.linkedinHref} target="_blank" rel="noopener noreferrer">
              {SITE_PROFILE.linkedinLabel}
            </a>
          </div>
          <span className="site-footer__legal">Copyright {YEAR} / Built with Next.js</span>
        </div>
      </div>
    </footer>
  )
}
