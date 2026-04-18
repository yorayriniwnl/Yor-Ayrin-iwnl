export type SpeakOptions = {
  voiceName?: string
  rate?: number
  pitch?: number
  lang?: string
}

// Lightweight per-page TTS state to avoid repeated triggers and leaked timers
declare global {
  interface Window {
    __yor_tts_state?: {
      currentId?: number
      currentUtter?: SpeechSynthesisUtterance | null
      visemeInterval?: number | null
    }
  }
}

let nextTtsId = 1

/**
 * Speak the provided text using the browser SpeechSynthesis API.
 * Emits `tts-start`, `tts-viseme`, `tts-end`, and `tts-error` events with
 * a numeric `detail.id` so listeners can correlate events and ignore
 * out-of-order deliveries. Accepts optional `setTalking` callback
 * for caller-controlled speaking state.
 */
export function speak(text: string, setTalkingOrOpts?: ((v: boolean) => void) | SpeakOptions, maybeOpts: SpeakOptions = {}): Promise<void> {
  const setTalking = typeof setTalkingOrOpts === 'function' ? (setTalkingOrOpts as (v: boolean) => void) : undefined
  const opts: SpeakOptions = typeof setTalkingOrOpts === 'function' ? maybeOpts : ((setTalkingOrOpts as SpeakOptions) || maybeOpts)

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !(window as any).speechSynthesis) {
      try { window.dispatchEvent(new CustomEvent('tts-error', { detail: { id: null, error: 'unsupported' } })) } catch (e) {}
      reject(new Error('SpeechSynthesis not supported'))
      return
    }

    const synth = (window as any).speechSynthesis as SpeechSynthesis

    // Cancel any prior utterance and clear viseme timers
    try {
      if (window.__yor_tts_state && window.__yor_tts_state.currentUtter) {
        try { synth.cancel() } catch (_) {}
        if (window.__yor_tts_state.visemeInterval) {
          clearInterval(window.__yor_tts_state.visemeInterval)
          window.__yor_tts_state.visemeInterval = null
        }
        window.__yor_tts_state.currentUtter = null
        window.__yor_tts_state.currentId = undefined
      }
    } catch (e) {
      // ignore
    }

    const id = nextTtsId++
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = opts.lang || 'en-US'
    utter.rate = opts.rate ?? 1
    utter.pitch = opts.pitch ?? 1

    let started = false
    let boundarySeen = false

    const cleanup = () => {
      try {
        utter.onstart = null
        utter.onend = null
        utter.onerror = null
        // @ts-ignore
        utter.onboundary = null
      } catch (e) {}
      try {
        if (window.__yor_tts_state && window.__yor_tts_state.visemeInterval) {
          clearInterval(window.__yor_tts_state.visemeInterval)
          window.__yor_tts_state.visemeInterval = null
        }
      } catch (e) {}
      try {
        if (setTalking) setTalking(false)
      } catch (e) {}
      if (window.__yor_tts_state && window.__yor_tts_state.currentId === id) {
        window.__yor_tts_state.currentId = undefined
        window.__yor_tts_state.currentUtter = null
      }
    }

    utter.onstart = () => {
      started = true
      window.__yor_tts_state = window.__yor_tts_state || {}
      window.__yor_tts_state.currentId = id
      window.__yor_tts_state.currentUtter = utter
      try { if (setTalking) setTalking(true) } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('tts-start', { detail: { id } })) } catch (e) {}

      // Start a fallback viseme interval. If onboundary fires we'll still use that
      // and clear this interval.
      try {
        if (window.__yor_tts_state) {
          window.__yor_tts_state.visemeInterval = window.setInterval(() => {
            const amplitude = 0.18 + Math.random() * 0.7
            try { window.dispatchEvent(new CustomEvent('tts-viseme', { detail: { id, amplitude } })) } catch (e) {}
          }, 90)
        }
      } catch (e) {}
    }

    // Some browsers (Chrome) fire onboundary with word/char info
    // @ts-ignore - not all TS envs expose onboundary typings
    utter.onboundary = (ev: any) => {
      boundarySeen = true
      try {
        const idx = typeof ev.charIndex === 'number' ? ev.charIndex : 0
        const textUpTo = text.slice(0, Math.max(0, idx + 1))
        const match = textUpTo.match(/([A-Za-z']+)$/)
        let amp = 0.5
        if (match && match[1]) {
          const w = match[1]
          const v = (w.match(/[aeiouyAEIOUY]/g) || []).length
          amp = Math.min(1, Math.max(0.15, v / Math.max(1, w.length)))
          amp = Math.min(1, amp + Math.min(0.4, w.length / 10))
        } else {
          amp = 0.45 + Math.random() * 0.45
        }
        try { window.dispatchEvent(new CustomEvent('tts-viseme', { detail: { id, amplitude: amp } })) } catch (e) {}
      } catch (e) {}
    }

    utter.onend = () => {
      cleanup()
      try { window.dispatchEvent(new CustomEvent('tts-end', { detail: { id } })) } catch (e) {}
      resolve()
    }

    utter.onerror = (ev) => {
      cleanup()
      try { window.dispatchEvent(new CustomEvent('tts-error', { detail: { id, error: ev } })) } catch (e) {}
      reject(ev)
    }

    const applyVoiceAndSpeak = () => {
      try {
        const voices = synth.getVoices() || []
        if (opts.voiceName && voices.length) {
          const match = voices.find((v) => v.name === opts.voiceName || (opts.voiceName && v.name.includes(opts.voiceName)))
          if (match) utter.voice = match
        }
        // finally speak
        synth.speak(utter)
      } catch (err) {
        cleanup()
        try { window.dispatchEvent(new CustomEvent('tts-error', { detail: { id, error: err } })) } catch (e) {}
        reject(err)
      }
    }

    // Some browsers populate voices asynchronously
    const voicesNow = synth.getVoices()
    if (!voicesNow || voicesNow.length === 0) {
      const onVoices = () => {
        try { applyVoiceAndSpeak() } finally { (window as any).speechSynthesis.removeEventListener('voiceschanged', onVoices) }
      }
      ;(window as any).speechSynthesis.addEventListener('voiceschanged', onVoices)
      // fallback attempt after brief delay
      setTimeout(() => {
        try { applyVoiceAndSpeak() } catch (e) { /* ignore */ }
      }, 420)
    } else {
      applyVoiceAndSpeak()
    }
  })
}
