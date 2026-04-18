'use client'

export default function PrintResumeButton(): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="ds-button ds-button--primary ds-button--sm"
    >
      Print / Save PDF
    </button>
  )
}
