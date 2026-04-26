"use client"
import React, { useEffect, useRef, useState } from 'react'
import { speak } from '../../lib/tts'
import {
  findProjectByIdOrName,
  explainProjectText,
  generateAnswerFromKnowledge,
  type AssistantKnowledgeData,
  type AssistantProject,
} from './chatHelpers'

type Message = { id: number; role: 'user' | 'assistant' | 'system'; text: string; loading?: boolean }
type Suggestion = {
  id?: string
  label: string
  action?: { type: 'send' | 'focus' | 'nav' | 'explain'; query?: string; id?: string }
}

export default function ChatWidget(): JSX.Element {
  const idRef = useRef(1)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: idRef.current++, role: 'assistant', text: 'Hi — ask me about my projects, skills, or experience. Try "Tell me about Yor Zenith".' },
  ])

  const dataRef = useRef<AssistantKnowledgeData | null>(null)
  const mounted = useRef(true)
  const pendingGitHubRef = useRef<AssistantProject[] | null>(null)

  const [srSupported, setSrSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [recognizing, setRecognizing] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(false)

  const [section, setSection] = useState<string | null>(null)
  const [focusedProject, setFocusedProject] = useState<string | null>(null)
  const [in3D, setIn3D] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const seenContextIntroRef = useRef(false)

  useEffect(() => {
    mounted.current = true
    fetch('/assistant_data.json')
      .then((r) => r.json())
      .then((d) => {
        dataRef.current = d
        computeSuggestions(d, section, focusedProject, in3D)
        // if there were pending github-updated events before data loaded, merge them now
        if (pendingGitHubRef.current && Array.isArray(pendingGitHubRef.current)) {
          try {
            mergeGitHubProjects(pendingGitHubRef.current)
          } catch (err) {
            // ignore
          }
          pendingGitHubRef.current = null
        }

        // attempt to load an optional knowledge graph for richer answers
        fetch('/api/knowledge-graph')
          .then((r) => r.json())
          .then((g) => {
            try {
              if (dataRef.current) {
                dataRef.current.graph = g
              }
            } catch (e) {
              /* ignore */
            }
          })
          .catch(() => {})
      })
      .catch(() => {
        dataRef.current = null
      })

    const onSection = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      setSection(id || null)
      setIn3D(false)
      computeSuggestions(dataRef.current, id || null, focusedProject, false)
    }

    const onFocusProject = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      setFocusedProject(id || null)
      setIn3D(true)
      computeSuggestions(dataRef.current, section, id || null, true)
    }

    const onFocusPanel = (e: Event) => {
      const ev = e as CustomEvent
      const id = ev?.detail?.id
      if (id) setFocusedProject(id)
      setIn3D(true)
      computeSuggestions(dataRef.current, section, id || null, true)
    }

    const onIntroStart = () => setIn3D(true)
    const onIntroEnd = () => setIn3D(false)

    const onGithubUpdated = (e: Event) => {
      const ev = e as CustomEvent
      const mapped = ev?.detail?.repos
      if (!mapped || !Array.isArray(mapped)) return
      if (!dataRef.current) {
        pendingGitHubRef.current = mapped
        return
      }
      try {
        mergeGitHubProjects(mapped)
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('section-focus', onSection as EventListener)
    window.addEventListener('focus-project', onFocusProject as EventListener)
    window.addEventListener('focus-panel', onFocusPanel as EventListener)
    window.addEventListener('intro-start', onIntroStart as EventListener)
    window.addEventListener('intro-end', onIntroEnd as EventListener)
    window.addEventListener('github-updated', onGithubUpdated as EventListener)

    const onAssistantOpen = () => setOpen(true)
    const onAssistantClose = () => setOpen(false)
    const onAssistantToggle = () => setOpen((s) => !s)
    window.addEventListener('assistant-open', onAssistantOpen as EventListener)
    window.addEventListener('assistant-close', onAssistantClose as EventListener)
    window.addEventListener('assistant-toggle', onAssistantToggle as EventListener)

    return () => {
      mounted.current = false
      window.removeEventListener('section-focus', onSection as EventListener)
      window.removeEventListener('focus-project', onFocusProject as EventListener)
      window.removeEventListener('focus-panel', onFocusPanel as EventListener)
      window.removeEventListener('intro-start', onIntroStart as EventListener)
      window.removeEventListener('intro-end', onIntroEnd as EventListener)
      window.removeEventListener('github-updated', onGithubUpdated as EventListener)
      window.removeEventListener('assistant-open', onAssistantOpen as EventListener)
      window.removeEventListener('assistant-close', onAssistantClose as EventListener)
      window.removeEventListener('assistant-toggle', onAssistantToggle as EventListener)
    }
  }, [])

  function mergeGitHubProjects(mapped: AssistantProject[]) {
    if (!dataRef.current) return
    const existing = Array.isArray(dataRef.current.projects) ? [...dataRef.current.projects] : []
    const byId = new Map(existing.map((project) => [String(project.id).toLowerCase(), project]))

    for (const mp of mapped) {
      if (!mp || !mp.id) continue
      const id = String(mp.id).toLowerCase()
      if (byId.has(id)) {
        const e = byId.get(id)
        if (!e) continue
        // update select fields
        if (mp.github) e.github = mp.github
        if (!e.shortDescription && mp.shortDescription) e.shortDescription = mp.shortDescription
        if ((!e.tech || e.tech.length === 0) && mp.tech && mp.tech.length) e.tech = mp.tech
      } else {
        // add new project entry
        const newP = {
          id: mp.id,
          title: mp.title || mp.id,
          shortDescription: mp.shortDescription || '',
          fullDescription: mp.fullDescription || '',
          tech: mp.tech || [],
          github: mp.github || '',
          category: mp.category || 'GitHub',
        }
        existing.push(newP)
      }
    }

    dataRef.current.projects = existing
    computeSuggestions(dataRef.current, section, focusedProject, in3D)
  }

  // detect speech recognition availability
  useEffect(() => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSrSupported(Boolean(SR))
    return () => {
      // noop
    }
  }, [])

  function startRecognition() {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
        recognitionRef.current = null
      }
      const r = new SR()
      recognitionRef.current = r
      r.lang = 'en-US'
      r.interimResults = false
      r.maxAlternatives = 1
      r.onstart = () => setRecognizing(true)
      r.onerror = (_ev: Event) => {
        setRecognizing(false)
      }
      r.onend = () => setRecognizing(false)
      r.onresult = (ev: SpeechRecognitionEvent) => {
        const res = ev.results && ev.results[0] && ev.results[0][0] && ev.results[0][0].transcript
        if (res) {
          setInput(res)
          void sendQuery(res)
        }
      }
      r.start()
    } catch (err) {
      // ignore speech recognition start errors in all environments
    }
  }

  function stopRecognition() {
    try {
      if (recognitionRef.current) recognitionRef.current.stop()
    } catch {}
    recognitionRef.current = null
    setRecognizing(false)
  }

  function toggleRecording() {
    if (!srSupported) return
    if (recognizing) stopRecognition()
    else startRecognition()
  }

  function pushMessage(m: Message) {
    setMessages((s) => [...s, m])
  }

  function updateMessageText(id: number, text: string, loading = false) {
    setMessages((s) => s.map((m) => (m.id === id ? { ...m, text, loading } : m)))
  }

  function computeSuggestions(
    data: AssistantKnowledgeData | null,
    sec: string | null,
    focused: string | null,
    in3dFlag: boolean,
  ) {
    if (!data) return setSuggestions([])
    const projects = Array.isArray(data.projects) ? data.projects : []
    const s: Suggestion[] = []

    if (sec === 'projects') {
      s.push({ id: 'list-projects', label: 'List projects', action: { type: 'send', query: 'List projects' } })
      const featured = projects.find((project) => project.featured)
      if (featured) s.push({ id: 'about-featured', label: `Tell me about ${featured.title}`, action: { type: 'send', query: `Tell me about ${featured.title}` } })
      s.push({ id: 'center-zenith', label: 'Center Yor Zenith', action: { type: 'focus', id: 'zenith' } })
    } else if (sec === 'skills' || sec === 'resume') {
      s.push({ id: 'top-skills', label: 'Show top skills', action: { type: 'send', query: 'Show top skills' } })
      s.push({ id: 'explain-ts', label: 'Explain TypeScript', action: { type: 'send', query: 'Explain TypeScript' } })
      s.push({ id: 'dev-path', label: 'Recommend development path', action: { type: 'send', query: 'Recommend a development path for frontend development' } })
    } else if (in3dFlag) {
      s.push({ id: 'nav-3d', label: 'How to navigate the 3D scene', action: { type: 'send', query: 'How to navigate the 3D scene' } })
      s.push({ id: 'center-zenith-2', label: 'Center Yor Zenith', action: { type: 'focus', id: 'zenith' } })
      s.push({ id: 'show-details', label: 'Show project details', action: { type: 'send', query: focused ? `Show project details for ${focused}` : 'Show project details' } })
      if (focused) s.push({ id: 'explain-project', label: 'Explain this project', action: { type: 'explain', id: focused } })
    } else {
      s.push({ id: 'what-projects', label: 'What projects have you built?', action: { type: 'send', query: 'What projects have you built?' } })
      s.push({ id: 'what-skills', label: 'What are your top skills?', action: { type: 'send', query: 'What are your top skills?' } })
      s.push({ id: 'tell-zenith', label: 'Tell me about Yor Zenith', action: { type: 'send', query: 'Tell me about Yor Zenith' } })
    }

    setSuggestions(s)
  }

  

  async function typeWrite(id: number, text: string) {
    let i = 0
    const speed = 18
    while (i <= text.length && mounted.current) {
      updateMessageText(id, text.slice(0, i), true)
      // small await
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, speed))
      i += 1
    }
    if (mounted.current) updateMessageText(id, text, false)
  }

  function speakText(text: string) {
    if (!ttsEnabled) return
    try {
      void speak(text).catch(() => { /* swallow TTS runtime errors */ })
    } catch (_err) {
      // swallow TTS errors
    }
  }

  async function sendQuery(query: string) {
    const text = query.trim()
    if (!text) return
    const userId = idRef.current++
    pushMessage({ id: userId, role: 'user', text })

    const botId = idRef.current++
    pushMessage({ id: botId, role: 'assistant', text: '', loading: true })

    // ensure data loaded
    if (!dataRef.current) {
      try {
        const r = await fetch('/assistant_data.json')
        dataRef.current = await r.json()
      } catch (err) {
        const errText = "Sorry — couldn't load local knowledge."
        updateMessageText(botId, errText, false)
        return
      }
    }

    const answer = generateAnswerFromKnowledge(dataRef.current, text)
    // simulate typing
    await typeWrite(botId, answer)
    // optional TTS
    if (ttsEnabled) speakText(answer)
  }

  async function handleSend() {
    await sendQuery(input)
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void handleSend()
    }
  }

  function clearConversation() {
    setMessages([{ id: idRef.current++, role: 'assistant', text: 'Hi — ask me about my projects, skills, or experience. Try "Tell me about Yor Zenith".' }])
  }

  async function handleSuggestionClick(s: Suggestion) {
    const action = s.action

    if (action?.type === 'send') {
      await sendQuery(action.query || s.label)
      return
    }

    if (action?.type === 'explain' && action.id) {
      const botId = idRef.current++
      pushMessage({ id: botId, role: 'assistant', text: '', loading: true })
      const proj = findProjectByIdOrName(dataRef.current, action.id)
      const txt = explainProjectText(proj)
      await typeWrite(botId, txt)
      if (ttsEnabled) speakText(txt)
      return
    }

    if (action?.type === 'focus' && action.id) {
      // dispatch focus events used by the 3D scene
      window.dispatchEvent(new CustomEvent('focus-panel', { detail: { id: action.id } }))
      window.dispatchEvent(new CustomEvent('focus-project', { detail: { id: action.id } }))

      // acknowledgment in chat
      const botId = idRef.current++
      pushMessage({ id: botId, role: 'assistant', text: '', loading: true })
      const proj = dataRef.current?.projects?.find((project) => project.id === action.id)
      const title = proj ? proj.title : action.id
      await typeWrite(botId, `Centered ${title}. Ask me for details about this project.`)
      if (ttsEnabled) speakText(`Centered ${title}. Ask me for details about this project.`)
      return
    }

    // fallback: send as text
    await sendQuery(s.label)
  }

  useEffect(() => {
    if (!open) return
    // on first open, show contextual hint once
    if (open && !seenContextIntroRef.current) {
      seenContextIntroRef.current = true
      if (section) {
        const sysId = idRef.current++
        pushMessage({ id: sysId, role: 'system', text: `I see you're viewing ${section}. Here are quick suggestions.` })
      }
    }
  }, [open, section])

  return (
    <div>
      <button
        aria-label="Open chat"
        className="ai-chat-button"
        onClick={() => setOpen((s) => !s)}
        title="Chat with me"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" />
        </svg>
      </button>

      <div className={`ai-chat-panel ${open ? 'open' : ''}`} role="dialog" aria-hidden={!open}>
        <div className="ai-chat-header">
          <div className="ai-chat-title">Assistant</div>
          <div className="ai-chat-actions">
            <button className="ai-clear" onClick={clearConversation} title="Clear conversation">
              Clear
            </button>
            <button className="ai-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>
        </div>

        {/* suggestions */}
        <div className="ai-suggestions" aria-hidden={!open}>
          {suggestions.map((sug) => (
            <button key={sug.id || sug.label} className="ai-suggestion" onClick={() => void handleSuggestionClick(sug)}>
              {sug.label}
            </button>
          ))}
        </div>

        <div className="ai-chat-body">
          {messages.map((m) => (
            <div key={m.id} className={`ai-msg ${m.role}`}>
              {m.loading ? (
                <div className="ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <div className="ai-msg-text">{m.text}</div>
              )}
            </div>
          ))}
        </div>

        <div className="ai-chat-footer">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about projects, skills, experience..."
            className="ai-input"
          />
          {srSupported && (
            <button
              className={`ai-voice-btn ${recognizing ? 'active' : ''}`}
              onClick={() => toggleRecording()}
              aria-pressed={recognizing}
              title={recognizing ? 'Stop recording' : 'Ask by voice'}
            >
              {recognizing ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" rx="2" fill="white"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" fill="white"/><path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-3.08A7 7 0 0 0 19 11z" fill="white"/></svg>
              )}
            </button>
          )}

          <button
            className={`ai-tts-btn ${ttsEnabled ? 'on' : ''}`}
            onClick={() => setTtsEnabled((s) => !s)}
            title={ttsEnabled ? 'Disable voice responses' : 'Enable voice responses'}
          >
            {ttsEnabled ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9v6h4l5 5V4L9 9H5z" fill="white"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9v6h4l5 5V4L9 9H5z" stroke="white" strokeWidth="1.2" fill="none"/></svg>
            )}
          </button>

          <button className="ai-send" onClick={() => void handleSend()}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
