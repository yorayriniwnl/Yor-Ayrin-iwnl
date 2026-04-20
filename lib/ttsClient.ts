import { speak } from './tts'

export function speakText(text: string) {
  void speak(text, { rate: 1, pitch: 1 })
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export default speakText
