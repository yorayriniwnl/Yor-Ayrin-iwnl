"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ProfileMode = 'recruiter' | 'developer' | 'casual'

const STORAGE_KEY = 'profile_mode_v1'

type ProfileModeContextType = {
  mode: ProfileMode
  setMode: (m: ProfileMode) => void
  cycleMode: () => void
}

const ProfileModeContext = createContext<ProfileModeContextType | undefined>(undefined)

export function useProfileMode() {
  const ctx = useContext(ProfileModeContext)
  if (!ctx) throw new Error('useProfileMode must be used within ProfileModeProvider')
  return ctx
}

export default function ProfileModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ProfileMode>('casual')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ProfileMode | null
      if (saved) setMode(saved)
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode)
    } catch {}
    try {
      document.documentElement.dataset.profileMode = mode
    } catch {}
  }, [mode])

  const cycleMode = () => {
    const order: ProfileMode[] = ['recruiter', 'developer', 'casual']
    const idx = order.indexOf(mode)
    setMode(order[(idx + 1) % order.length])
  }

  return (
    <ProfileModeContext.Provider value={{ mode, setMode, cycleMode }}>
      {children}
    </ProfileModeContext.Provider>
  )
}
