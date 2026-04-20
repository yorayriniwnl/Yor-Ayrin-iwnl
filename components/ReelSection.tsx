"use client"

import React, { useEffect, useState } from 'react'
import Card from './ui/Card'
import { BodyText, Subheading } from './ui/Typography'

const REELS = [
  {
    id: 1,
    title: 'When the bug is on line 1',
    desc: 'Spent six hours debugging. The fix was a missing character at the very top.',
    likes: 4201,
    tag: 'codinglife',
  },
  {
    id: 2,
    title: 'It works on my machine',
    desc: 'The oldest software thriller remains undefeated.',
    likes: 9999,
    tag: 'devhumor',
  },
  {
    id: 3,
    title: 'Me explaining my code',
    desc: 'The important thing is it works. The second important thing is nobody touches it.',
    likes: 6942,
    tag: 'developer',
  },
]

export default function ReelSection(): JSX.Element {
  const [active, setActive] = useState(0)
  const [liked, setLiked] = useState<Set<number>>(new Set())

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((value) => (value + 1) % REELS.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [])

  const reel = REELS[active]

  return (
    <section id="reels" className="ds-section ds-section--soft">
      <div className="ds-container">
        <div className="ds-stack ds-stack--loose">
          <div className="ds-section-intro ds-section-intro--center">
            <Subheading>Reels and internet fragments</Subheading>
            <BodyText className="max-w-2xl">
              Humor and side-quest energy stay in the product, but the presentation now
              feels like the rest of the portfolio.
            </BodyText>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
            <Card as="article" interactive>
              <div className="ds-stack">
                <span className="ds-badge ds-tag--accent">Featured reel</span>
                <Subheading>{reel.title}</Subheading>
                <BodyText>{reel.desc}</BodyText>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="ds-tag">{reel.tag}</span>

                  <button
                    type="button"
                    className="ds-button ds-button--ghost ds-button--sm"
                    onClick={() =>
                      setLiked((previous) => {
                        const next = new Set(previous)
                        if (next.has(reel.id)) next.delete(reel.id)
                        else next.add(reel.id)
                        return next
                      })
                    }
                  >
                    {liked.has(reel.id) ? 'Liked' : 'Like'} ({reel.likes + (liked.has(reel.id) ? 1 : 0)})
                  </button>
                </div>
              </div>
            </Card>

            <div className="ds-grid ds-grid--cols-1 ds-grid--gap-sm">
              {REELS.map((item, index) => (
                <button key={item.id} type="button" onClick={() => setActive(index)} className="text-left">
                  <Card interactive>
                    <div className="ds-stack ds-stack--tight">
                      <span className="ds-badge">{index === active ? 'Now' : `Reel ${index + 1}`}</span>
                      <Subheading className="text-base">{item.title}</Subheading>
                      <BodyText className="ds-text--small">{item.tag}</BodyText>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
