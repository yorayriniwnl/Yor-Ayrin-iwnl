import React from 'react'
import { notFound } from 'next/navigation'
import { getProjectById } from '../../../lib/projects'
import ProjectCase from '../../../components/ProjectCase'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const project = getProjectById(slug)
  if (!project) return notFound()

  return <ProjectCase project={project} />
}
