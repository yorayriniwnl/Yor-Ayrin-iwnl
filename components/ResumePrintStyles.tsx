'use client'

export default function ResumePrintStyles(): JSX.Element {
  return (
    <style jsx global>{`
      @media print {
        .site-header,
        footer,
        .cinematic-bg,
        .cursor-dot,
        .cursor-trail,
        [data-resume-actions] {
          display: none !important;
        }

        body {
          background: #ffffff !important;
        }

        main {
          padding: 0 !important;
        }
      }
    `}</style>
  )
}
