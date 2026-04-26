export {}

declare global {
  interface AnalyticEvent {
    name: string
    payload?: Record<string, unknown>
    ts: number
  }

  interface Window {
    __analyticsEvents?: AnalyticEvent[]
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number
    cancelIdleCallback?: (handle?: number) => void
    SpeechRecognition?: any
    webkitSpeechRecognition?: any
    speechSynthesis?: SpeechSynthesis
    AudioContext?: typeof AudioContext
    webkitAudioContext?: typeof AudioContext
  }

  interface Navigator {
    deviceMemory?: number
    hardwareConcurrency?: number
    connection?: { effectiveType?: string; downlink?: number; rtt?: number }
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }
}
