import React from 'react'

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-950/10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
      {children}
    </article>
  )
}
