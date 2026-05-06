"use client"

import React, { useEffect, useRef, useState } from 'react'
import TimeBanner from './TimeBanner'

function getPeriod(d: Date) {
  const h = d.getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 21) return 'evening'
  return 'night'
}

export default function TimeProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState<Date>(() => new Date())
  const [period, setPeriod] = useState<string>(() => getPeriod(new Date()))
  const [greeting, setGreeting] = useState<string>('')
  const [special, setSpecial] = useState<string | null>(null)
  const lastSpecialKey = useRef<string | null>(null)

  useEffect(() => {
    function compute(d: Date) {
      const p = getPeriod(d)
      setPeriod(p)
      // greeting
      const greet = p === 'morning' ? 'Good morning' : p === 'afternoon' ? 'Good afternoon' : p === 'evening' ? 'Good evening' : 'Working late?'
      setGreeting(greet)

      // night mode class
      try {
        document.documentElement.classList.toggle('time-night', p === 'night')
        document.documentElement.classList.toggle('time-morning', p === 'morning')
        document.documentElement.classList.toggle('time-afternoon', p === 'afternoon')
        document.documentElement.classList.toggle('time-evening', p === 'evening')
      } catch (err) {
        // ignore
      }

      // special messages at certain hours / weekends
      const h = d.getHours()
      const dow = d.getDay()
      let msg: string | null = null
      if (h === 12) msg = "Lunch time — take a break!"
      else if (h === 18) msg = "Golden hour — good time to ship something beautiful."
      else if (h >= 0 && h < 5) msg = "Burning the midnight oil? Here's some calm colors."
      if (dow === 0 || dow === 6) msg = msg ? `${msg} Happy weekend!` : 'Happy weekend!'

      // only show a special once per unique day/hour to avoid spam
      if (msg) {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${h}`
        if (lastSpecialKey.current !== key) {
          lastSpecialKey.current = key
          setSpecial(msg)
          // clear after a short time
          setTimeout(() => setSpecial(null), 5200)
        }
      }

      // dispatch event for other systems
      try {
        window.dispatchEvent(new CustomEvent('time-updated', { detail: { now: d.toISOString(), period: p } }))
      } catch {}
    }

    compute(now)
    const id = setInterval(() => {
      const d = new Date()
      setNow(d)
      compute(d)
    }, 60 * 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <>
      {children}
      <TimeBanner greeting={greeting} message={special} period={period} />
    </>
  )
}
