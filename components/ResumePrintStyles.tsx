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

        [data-resume-shell] {
          background: #ffffff !important;
          padding-top: 0 !important;
        }

        [data-resume-page] {
          --resume-card-bg: #ffffff !important;
          --resume-card-border: rgba(151, 132, 95, 0.22) !important;
          --resume-divider: rgba(151, 132, 95, 0.2) !important;
          --resume-heading: #181109 !important;
          --resume-subheading: #20180f !important;
          --resume-body: #4d3d2b !important;
          --resume-muted: #6d5d46 !important;
          --resume-panel: #ffffff !important;
          --resume-shadow: none !important;
          --ds-text: #2d2317 !important;
          --ds-text-soft: #181109 !important;
          --ds-text-muted: #6d5d46 !important;
          --ds-border: rgba(151, 132, 95, 0.26) !important;
          --ds-primary: #8b6a26 !important;
          --ds-primary-strong: #8b6a26 !important;
          color: #2d2317 !important;
          background: #ffffff !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        main {
          padding: 0 !important;
        }
      }
    `}</style>
  )
}
