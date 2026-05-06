// device heuristics for 3D performance tuning

type NetworkInformation = {
  saveData?: boolean
  effectiveType?: string
  downlink?: number
  rtt?: number
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation
}

export function getDeviceScale(): number {
  if (typeof window === 'undefined') return 1
  const cores = navigator.hardwareConcurrency || 4
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let scale = 1
  if (cores <= 2) scale = 0.45
  else if (cores <= 4) scale = 0.75
  else scale = 1
  if (dpr > 1.5) scale *= 0.85
  return scale
}

export function getSegmentCount(base = 28): number {
  const s = getDeviceScale()
  const seg = Math.max(8, Math.round(base * s))
  return seg
}

export function shouldDisable3D(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const cores = navigator.hardwareConcurrency || 4
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const navConn = (navigator as NavigatorWithConnection).connection ?? {}
    const saveData = Boolean(navConn.saveData)
    const effective = (navConn.effectiveType || '').toLowerCase()

    if (saveData) return true
    if (prefersReduced) return true
    if (cores <= 2) return true
    if (dpr >= 2.5) return true
    if (effective === '2g' || effective === 'slow-2g') return true
  } catch (e) {
    // conservative default: do not disable
  }
  return false
}
