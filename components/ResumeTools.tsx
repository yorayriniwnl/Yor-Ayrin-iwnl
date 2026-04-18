"use client"

import React from 'react'
import generateResumeJSON from '../lib/resumeGenerator'

export default function ResumeTools({ showPrint = true }: { showPrint?: boolean }): JSX.Element {
  const downloadJSON = () => {
    try {
      const data = generateResumeJSON()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.profile.name.replace(/\s+/g, '_')}_resume.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1500)
    } catch (_error) {
      // silent
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className="btn btn-outline w-full sm:w-auto"
        onClick={downloadJSON}
        data-disable-custom-cursor="true"
      >
        Download JSON
      </button>
      {showPrint ? (
        <button
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => window.print()}
          data-disable-custom-cursor="true"
        >
          Print / Save PDF
        </button>
      ) : null}
    </div>
  )
}
