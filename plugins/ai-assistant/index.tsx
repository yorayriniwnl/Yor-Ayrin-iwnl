'use client'

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'

// ─── Knowledge base ───────────────────────────────────────────────────────────

const KNOWLEDGE = {
  name: 'Ayush Roy',
  role: 'System Builder & Developer',
  location: 'India',
  available: true,
  skills: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Python', 'Node.js', 'WebGL'],
  projects: [
    { name: 'Yor Zenith',       desc: 'Solar planning platform with React + D3. Scaled 10x, cut latency 40%.' },
    { name: 'AI Detector',  desc: 'Low-latency image classifier. PyTorch + React frontend.' },
    { name: 'Neo Sculpt',   desc: 'Interactive 3D web sculpting tool. Three.js + WebGL.' },
  ],
  contact: 'Contact via the /contact page or ayush@example.com',
  github: 'https://github.com/yorayriniwnl',
}

function getAnswer(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('skill') || q.includes('tech') || q.includes('stack'))
    return 'Ayush works with: ' + KNOWLEDGE.skills.join(', ') + '. Strong focus on React, TypeScript, and Three.js.'
  if (q.includes('project') || q.includes('built') || q.includes('work'))
    return KNOWLEDGE.projects.map((p) => p.name + ': ' + p.desc).join('\n\n')
  if (q.includes('available') || q.includes('hire') || q.includes('open'))
    return 'Yes! Ayush is currently open to work. Best way to reach out: ' + KNOWLEDGE.contact
  if (q.includes('contact') || q.includes('email') || q.includes('reach'))
    return KNOWLEDGE.contact
  if (q.includes('where') || q.includes('location') || q.includes('based'))
    return 'Based in India, open to remote work worldwide.'
  if (q.includes('github') || q.includes('code') || q.includes('repo'))
    return 'GitHub: ' + KNOWLEDGE.github
  return "I can answer questions about Ayush's skills, projects, availability, and contact info. What would you like to know?"
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string
  role: 'user' | 'ai'
  text: string
}

const PRESET_QUESTIONS = [
  'What projects has Ayush built?',
  'Is he available for work?',
  "What's his tech stack?",
  'How can I contact him?',
]

const SESSION_LIMIT = 20

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIAssistant(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState<string>('')
  const [thinking, setThinking] = useState<boolean>(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  const atLimit  = messages.length >= SESSION_LIMIT
  const hasChats = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function sendMessage(text: string): void {
    const trimmed = text.trim()
    if (!trimmed || thinking || atLimit) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    setTimeout(() => {
      const answer = getAnswer(trimmed)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: answer,
      }
      setMessages((prev) => [...prev, aiMsg])
      setThinking(false)
    }, 300)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      <style>{`
        .aip-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: var(--ds-bg, #060a14);
          font-family: var(--font-ds-body, 'DM Sans', ui-sans-serif, sans-serif);
        }

        /* header */
        .aip-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
          height: 52px;
          border-bottom: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          flex-shrink: 0;
        }
        .aip-header__title {
          font-size: 14px;
          font-weight: 700;
          color: var(--ds-text, #e8effe);
          flex: 1;
        }
        .aip-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #fff;
          background: var(--ds-primary, #6366f1);
          padding: 2px 7px;
          border-radius: 99px;
        }

        /* messages */
        .aip-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--ds-border, rgba(255,255,255,0.07)) transparent;
        }

        /* preset chips */
        .aip-presets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px 0 4px;
        }
        .aip-presets__label {
          font-size: 11px;
          color: var(--ds-text-muted, #8892aa);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .aip-chip {
          display: inline-flex;
          align-items: center;
          background: var(--ds-surface, rgba(255,255,255,0.04));
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          border-radius: 8px;
          padding: 7px 12px;
          font-size: 13px;
          color: var(--ds-text, #e8effe);
          cursor: pointer;
          text-align: left;
          transition: border-color 0.15s, background 0.15s;
          font-family: inherit;
          width: 100%;
        }
        .aip-chip:hover {
          border-color: var(--ds-primary, #6366f1);
          background: rgba(99,102,241,0.07);
        }

        /* bubbles */
        .aip-bubble {
          max-width: 88%;
          padding: 10px 14px;
          font-size: 13.5px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .aip-bubble--user {
          align-self: flex-end;
          background: var(--ds-primary, #6366f1);
          color: #fff;
          border-radius: 12px 12px 2px 12px;
        }
        .aip-bubble--ai {
          align-self: flex-start;
          background: #1e293b;
          color: #fff;
          border-radius: 12px 12px 12px 2px;
        }

        /* thinking dots */
        .aip-thinking {
          align-self: flex-start;
          background: #1e293b;
          border-radius: 12px 12px 12px 2px;
          padding: 12px 16px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .aip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          animation: aip-bounce 1.2s infinite ease-in-out;
        }
        .aip-dot:nth-child(2) { animation-delay: 0.2s; }
        .aip-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aip-bounce {
          0%,80%,100% { transform: translateY(0); }
          40%          { transform: translateY(-6px); }
        }

        /* limit notice */
        .aip-limit {
          align-self: center;
          font-size: 12px;
          color: var(--ds-text-muted, #8892aa);
          background: var(--ds-surface, rgba(255,255,255,0.04));
          border: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          border-radius: 8px;
          padding: 8px 14px;
          text-align: center;
        }

        /* input bar */
        .aip-footer {
          flex-shrink: 0;
          padding: 12px 16px;
          border-top: 1px solid var(--ds-border, rgba(255,255,255,0.07));
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .aip-input {
          flex: 1;
          background: var(--ds-surface, rgba(255,255,255,0.04));
          border: 1px solid var(--ds-border, rgba(255,255,255,0.09));
          border-radius: 8px;
          padding: 9px 13px;
          font-size: 13.5px;
          color: var(--ds-text, #e8effe);
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s;
        }
        .aip-input::placeholder {
          color: var(--ds-text-muted, #8892aa);
        }
        .aip-input:focus {
          border-color: var(--ds-primary, #6366f1);
        }
        .aip-input:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .aip-send {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--ds-primary, #6366f1);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: opacity 0.15s;
        }
        .aip-send:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .aip-send:not(:disabled):hover {
          opacity: 0.85;
        }
      `}</style>

      <div className="aip-root">
        {/* Header */}
        <div className="aip-header">
          <span className="aip-header__title">Ask about Ayush</span>
          <span className="aip-badge">AI</span>
        </div>

        {/* Messages */}
        <div className="aip-messages">
          {!hasChats && (
            <div className="aip-presets">
              <p className="aip-presets__label">Try asking</p>
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className="aip-chip"
                  onClick={() => sendMessage(q)}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`aip-bubble ${msg.role === 'user' ? 'aip-bubble--user' : 'aip-bubble--ai'}`}
            >
              {msg.text}
            </div>
          ))}

          {thinking && (
            <div className="aip-thinking" aria-label="AI is thinking">
              <span className="aip-dot" />
              <span className="aip-dot" />
              <span className="aip-dot" />
            </div>
          )}

          {atLimit && (
            <div className="aip-limit">Session limit reached. Refresh to start over.</div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="aip-footer">
          <input
            ref={inputRef}
            className="aip-input"
            type="text"
            placeholder={atLimit ? 'Session limit reached' : 'Ask a question…'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={atLimit || thinking}
            aria-label="Chat input"
          />
          <button
            className="aip-send"
            type="button"
            onClick={() => sendMessage(input)}
            disabled={atLimit || thinking || !input.trim()}
            aria-label="Send"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M1 7.5h12M8.5 2l5 5.5-5 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
