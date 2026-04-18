"use client"

import React from 'react'

export default function ProfileCard(): JSX.Element {
  return (
    <article className="ds-card">
      <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-[var(--ds-border)] bg-[var(--ds-bg-raised)]">
          <img src="/images/profile.svg" alt="Ayush Roy" className="h-full w-full object-cover" />
        </div>

        <div className="ds-stack ds-stack--tight text-center md:text-left">
          <span className="ds-badge ds-tag--accent">Profile Snapshot</span>
          <h3 className="ds-subheading">Ayush Roy</h3>
          <p className="ds-text">
            Systems-focused developer building polished web products, thoughtful
            interfaces, and interactive experiences.
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <a href="/resume.pdf" className="ds-button ds-button--secondary ds-button--sm">
              Resume
            </a>
            <a href="/#contact" className="ds-button ds-button--ghost ds-button--sm">
              Contact
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
