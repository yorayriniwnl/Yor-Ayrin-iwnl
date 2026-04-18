'use client'

import React, { useEffect, useState } from 'react'

const CODE_LINES = [
  { text: '┌─ const me = {', key: 'key', string: '', bool: '', punct: '┌─ const me = {' },
  { text: '│    name: \'Ayush Roy\',', key: 'name', string: 'Ayush Roy', bool: '', punct: '│    : \'\',', },
  { text: '│    role: \'System Builder\',', key: 'role', string: 'System Builder', bool: '', punct: '│    : \'\',', },
  { text: '│    location: \'India\',', key: 'location', string: 'India', bool: '', punct: '│    : \'\',', },
  { text: '│    available: true,', key: 'available', string: '', bool: 'true', punct: '│    : ,', },
  { text: '│    stack: [\'React\', \'Three.js\', \'TypeScript\', \'Python\'],', key: 'stack', string: 'React|Three.js|TypeScript|Python', bool: '', punct: '│    : [\'\', \'\', \'\', \'\'],', },
  { text: '│    building: \'yor-website\',', key: 'building', string: 'yor-website', bool: '', punct: '│    : \'\',', },
  { text: '└─  }', key: '', string: '', bool: '', punct: '└─  }' },
]

function SyntaxLine({ line, index }: { line: typeof CODE_LINES[number]; index: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, index * 50 + 100)

    return () => clearTimeout(timer)
  }, [index])

  if (!visible) {
    return (
      <div style={{ opacity: 0, height: '1.5em' }}>
        <span>&nbsp;</span>
      </div>
    )
  }

  if (index === 0 || index === CODE_LINES.length - 1) {
    return (
      <div
        style={{
          opacity: 0,
          animation: 'fadeIn 300ms ease-out forwards',
          color: '#94a3b8',
        }}
      >
        {line.punct}
        <style jsx>{`
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    )
  }

  const renderLineContent = () => {
    if (line.key === 'stack') {
      const strings = line.string.split('|')
      return (
        <>
          <span style={{ color: '#94a3b8' }}>│    </span>
          <span style={{ color: '#7dd3fc' }}>{line.key}</span>
          <span style={{ color: '#94a3b8' }}>: [</span>
          {strings.map((str, i) => (
            <React.Fragment key={i}>
              <span style={{ color: '#86efac' }}>&apos;{str}&apos;</span>
              {i < strings.length - 1 && <span style={{ color: '#94a3b8' }}>, </span>}
            </React.Fragment>
          ))}
          <span style={{ color: '#94a3b8' }}>],</span>
        </>
      )
    }

    if (line.bool) {
      return (
        <>
          <span style={{ color: '#94a3b8' }}>│    </span>
          <span style={{ color: '#7dd3fc' }}>{line.key}</span>
          <span style={{ color: '#94a3b8' }}>: </span>
          <span style={{ color: '#f9a8d4' }}>{line.bool}</span>
          <span style={{ color: '#94a3b8' }}>,</span>
        </>
      )
    }

    if (line.string) {
      return (
        <>
          <span style={{ color: '#94a3b8' }}>│    </span>
          <span style={{ color: '#7dd3fc' }}>{line.key}</span>
          <span style={{ color: '#94a3b8' }}>: </span>
          <span style={{ color: '#86efac' }}>&apos;{line.string}&apos;</span>
          <span style={{ color: '#94a3b8' }}>,</span>
        </>
      )
    }

    return <span>{line.text}</span>
  }

  return (
    <div
      style={{
        opacity: 0,
        animation: 'fadeIn 300ms ease-out forwards',
      }}
    >
      {renderLineContent()}
      <style jsx>{`
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

function BlinkingCursor() {
  return (
    <span
      style={{
        color: '#7dd3fc',
        animation: 'blink 1s step-end infinite',
        marginLeft: '2px',
      }}
    >
      _
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  )
}

export default function HeroCodeBlock() {
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCursor(true)
    }, CODE_LINES.length * 50 + 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 2rem)',
        fontFamily: 'var(--font-ds-mono)',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        lineHeight: 1.8,
        overflowX: 'auto',
      }}
    >
      <div style={{ minWidth: 'max-content' }}>
        {CODE_LINES.map((line, index) => (
          <SyntaxLine key={index} line={line} index={index} />
        ))}
        {showCursor && <BlinkingCursor />}
      </div>
    </div>
  )
}
