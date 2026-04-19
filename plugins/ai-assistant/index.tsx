'use client'

import React, { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { generateAnswerFromKnowledge } from '../../lib/ai/chatHelpers'
import { ASSISTANT_KNOWLEDGE } from '../../lib/ai/knowledgeBase'

type Message = {
  id: string
  role: 'user' | 'ai'
  text: string
}

const PRESET_QUESTIONS = [
  'Explain Yor Zenith',
  'What projects have you built?',
  "What's your experience?",
  'How can I contact you?',
]

const SESSION_LIMIT = 20

export default function AIAssistant(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextIdRef = useRef(0)

  const atLimit = messages.length >= SESSION_LIMIT
  const hasChats = messages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function makeMessageId(): string {
    nextIdRef.current += 1
    return `msg-${nextIdRef.current}`
  }

  function sendMessage(text: string): void {
    const trimmed = text.trim()
    if (!trimmed || thinking || atLimit) return

    const userMsg: Message = { id: makeMessageId(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    window.setTimeout(() => {
      const answer = generateAnswerFromKnowledge(ASSISTANT_KNOWLEDGE, trimmed)
      const aiMsg: Message = {
        id: makeMessageId(),
        role: 'ai',
        text: answer,
      }
      setMessages((prev) => [...prev, aiMsg])
      setThinking(false)
    }, 260)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
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
          40% { transform: translateY(-6px); }
        }
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
        <div className="aip-header">
          <span className="aip-header__title">Ask about Ayush</span>
          <span className="aip-badge">AI</span>
        </div>

        <div className="aip-messages">
          {!hasChats && (
            <div className="aip-presets">
              <p className="aip-presets__label">Try asking</p>
              {PRESET_QUESTIONS.map((question) => (
                <button
                  key={question}
                  className="aip-chip"
                  onClick={() => sendMessage(question)}
                  type="button"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`aip-bubble ${message.role === 'user' ? 'aip-bubble--user' : 'aip-bubble--ai'}`}
            >
              {message.text}
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

        <div className="aip-footer">
          <input
            ref={inputRef}
            className="aip-input"
            type="text"
            placeholder={atLimit ? 'Session limit reached' : 'Ask about projects, skills, or experience...'}
            value={input}
            onChange={(event) => setInput(event.target.value)}
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
