import React from 'react'

export default function SummaryCard(): JSX.Element {
  return (
    <section aria-labelledby="summary-card" className="py-8">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="mx-auto rounded-xl p-4 bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(155,92,246,0.12)]">
          <h3 id="summary-card" className="text-lg font-semibold text-white text-center">Builds real-world systems — React + AI/ML</h3>
          <p className="text-sm text-indigo-100/90 mt-2 text-center">Strong in interactive and performance-focused applications.</p>
          <p className="text-sm text-indigo-100/90 mt-1 text-center">Focused on scalable and clean architecture.</p>

          <div className="mt-4 text-center">
            <a href="mailto:yorayriniwnl@gmail.com" className="text-sm text-indigo-200 font-medium">yorayriniwnl@gmail.com</a>
            <div className="mt-2">
              <a href="/resume.pdf" download className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/6 text-xs text-white/90 backdrop-blur-sm border border-white/6 hover:bg-white/10">Download Resume</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
