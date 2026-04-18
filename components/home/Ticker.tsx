// Server Component — no 'use client' needed (purely presentational)

import { HOME_TICKER_ITEMS } from '../../data/home'

/**
 * Ticker
 *
 * Infinitely-scrolling marquee between the Hero and About sections.
 * The animation is driven entirely by the `ticker` CSS keyframe in
 * GlobalStyles — no JS required.
 */
export default function Ticker() {
  // Duplicate the items once so the seamless loop trick works at any
  // viewport width (identical to the original inline duplication).
  const doubled = [...HOME_TICKER_ITEMS, ...HOME_TICKER_ITEMS]

  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((item, index) => (
          <div className="ticker-item" key={`${item}-${index}`}>
            <span className="ticker-dot" /> {item}
          </div>
        ))}
      </div>
    </div>
  )
}
