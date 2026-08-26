import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects } from '../../work-data'
import './work.css'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((item) => item.slug === slug)
  if (!project) notFound()
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length]

  return (
    <main className={'work-detail work-detail--' + project.accent}>
      <header className="work-detail__nav"><Link href="/" className="work-detail__brand"><span>AR</span><span>AYUSH ROY / PRODUCT ENGINEER</span></Link><Link href="/#work" className="work-detail__back">Back to selected work <span>↗</span></Link></header>
      <div className="work-detail__shell">
        <div className="work-detail__eyebrow"><span>{project.number} / CASE FILE</span><span>{project.status}</span></div>
        <h1>{project.title}</h1>
        <p className="work-detail__thesis">{project.thesis}</p>
        <div className="work-detail__actions">{project.live ? <a href={project.live} target="_blank" rel="noreferrer">Open live build ↗</a> : <span>Source study · live build offline</span>}<a href={project.source} target="_blank" rel="noreferrer">Inspect source ↗</a></div>
        <div className="work-detail__hero"><Image src={project.evidence} alt={project.title + ' artifact preview'} fill priority sizes="(max-width: 900px) 100vw, 78vw" /></div>
        <div className="work-detail__grid"><aside><span>THE LENS</span><p>{project.discipline}</p><div className="work-detail__tags">{project.stack.map((item) => <small key={item}>{item}</small>)}</div></aside><div className="work-detail__copy"><section><span>01 / THE PROBLEM</span><h2>Make the difficult part visible.</h2><p>{project.challenge}</p></section><section><span>02 / MY CONTRIBUTION</span><h2>Stay close to the decision.</h2><p>{project.contribution}</p></section><section><span>03 / THE RESULT</span><h2>A clearer next move.</h2><p>{project.outcome}</p></section></div></div>
        <nav className="work-detail__next" aria-label="Next case study"><span>Continue through the work</span><Link href={'/work/' + nextProject.slug}>{nextProject.title} <span>→</span></Link></nav>
      </div>
    </main>
  )
}
