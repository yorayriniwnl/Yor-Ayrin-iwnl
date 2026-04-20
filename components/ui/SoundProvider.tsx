"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

type SoundContextType = {
  enabled: boolean
  toggle: () => void
  playClick: () => void
  playHover: () => void
  playWhoosh: () => void
  resumeAudio: () => Promise<void>
}

const SoundContext = createContext<SoundContextType | null>(null)

const LOCAL_KEY = 'pref:sounds'

function createNoiseBuffer(ctx: AudioContext, duration = 1) {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * duration)
  const buffer = ctx.createBuffer(1, len, sr)
  const out = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) out[i] = (Math.random() * 2 - 1) * 0.6
  return buffer
}

export function useSound() {
  const ctx = useContext(SoundContext)
  // provide safe no-op defaults when provider is absent (avoid crashes in tests)
  if (!ctx) {
    return {
      enabled: false,
      toggle: () => {},
      playClick: () => {},
      playHover: () => {},
      playWhoosh: () => {},
      resumeAudio: async () => {},
    }
  }
  return ctx
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const saved = window.localStorage.getItem(LOCAL_KEY)
    if (saved !== null) return saved === 'true'
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return !reduce
  })

  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const noiseBufferRef = useRef<AudioBuffer | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_KEY, enabled ? 'true' : 'false')
    } catch {}
  }, [enabled])

  function initAudio() {
    if (audioCtxRef.current) return
    try {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx: AudioContext = new Ctx()
      const master = ctx.createGain()
      master.gain.value = 0.035
      master.connect(ctx.destination)
      audioCtxRef.current = ctx
      masterGainRef.current = master
      noiseBufferRef.current = createNoiseBuffer(ctx, 1)
    } catch (e) {
      // audio not available
      audioCtxRef.current = null
      masterGainRef.current = null
    }
  }

  async function resumeAudio() {
    if (!audioCtxRef.current) initAudio()
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume()
    } catch {}
  }

  function playClick() {
    if (!enabled) return
    try {
      initAudio()
      const ctx = audioCtxRef.current!
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(720, now)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.00001, now)
      g.gain.linearRampToValueAtTime(0.03, now + 0.006)
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.14)
      osc.connect(g)
      g.connect(masterGainRef.current!)
      osc.start(now)
      osc.stop(now + 0.16)
    } catch {}
  }

  function playHover() {
    if (!enabled) return
    try {
      initAudio()
      const ctx = audioCtxRef.current!
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1400, now)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.00001, now)
      g.gain.linearRampToValueAtTime(0.01, now + 0.004)
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.06)
      osc.connect(g)
      g.connect(masterGainRef.current!)
      osc.start(now)
      osc.stop(now + 0.08)
    } catch {}
  }

  function playWhoosh() {
    if (!enabled) return
    try {
      initAudio()
      const ctx = audioCtxRef.current!
      if (!ctx) return
      if (ctx.state === 'suspended') ctx.resume()
      const now = ctx.currentTime
      const src = ctx.createBufferSource()
      src.buffer = noiseBufferRef.current!
      const filt = ctx.createBiquadFilter()
      filt.type = 'bandpass'
      filt.frequency.setValueAtTime(220, now)
      filt.frequency.linearRampToValueAtTime(1500, now + 0.36)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.00001, now)
      g.gain.linearRampToValueAtTime(0.02, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.44)
      src.connect(filt)
      filt.connect(g)
      g.connect(masterGainRef.current!)
      src.start(now)
      src.stop(now + 0.45)
    } catch {}
  }

  const value: SoundContextType = {
    enabled,
    toggle: () => setEnabled((s) => !s),
    playClick,
    playHover,
    playWhoosh,
    resumeAudio,
  }

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
