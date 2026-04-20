import speakText, { stopSpeaking } from '../lib/ttsClient'

console.log('TTS demo: speaking short phrases...')
speakText('Hello. This is a low-latency speech demo. The avatar mouth should move in time with speech amplitude.')

setTimeout(() => {
  speakText('Second chunk streamed immediately after the first for minimal latency and natural flow.')
}, 2000)

// optional: stop after 8s
setTimeout(() => {
  stopSpeaking()
  console.log('Stopped speaking')
}, 8000)
