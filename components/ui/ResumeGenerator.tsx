"use client"

import React, { useState } from 'react'

export default function ResumeGenerator() {
  const [loadingText, setLoadingText] = useState(false)

  async function downloadText() {
    setLoadingText(true)
    try {
      const res = await fetch('/api/resume-text')
      if (!res.ok) throw new Error('Failed to fetch resume text')
      const text = await res.text()
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.txt'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(err)
      }
      alert('Failed to download resume text')
    } finally {
      setLoadingText(false)
    }
  }

  function downloadPDF() {
    // Open the printable resume page which will auto-print
    const w = window.open('/resume?print=1', '_blank')
    if (!w) alert('Popup blocked — allow popups to generate PDF')
  }

  function openPreview() {
    const w = window.open('/resume', '_blank')
    if (!w) alert('Popup blocked — allow popups to preview resume')
  }

  return (
    <div className="resume-generator inline-block">
      <button
        type="button"
        className="px-3 py-1 text-sm bg-white/6 hover:bg-white/8 rounded-md"
        onClick={openPreview}
      >
        Preview Resume
      </button>

      <button
        type="button"
        className="ml-2 px-3 py-1 text-sm bg-white/6 hover:bg-white/8 rounded-md"
        onClick={downloadText}
        disabled={loadingText}
      >
        {loadingText ? 'Preparing…' : 'Download Text'}
      </button>

      <button
        type="button"
        className="ml-2 px-3 py-1 text-sm bg-white/6 hover:bg-white/8 rounded-md"
        onClick={downloadPDF}
      >
        Download PDF
      </button>
    </div>
  )
}
