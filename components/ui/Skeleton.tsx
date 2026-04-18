import React from 'react'

type SkeletonProps = {
  className?: string
  height?: string
}

export default function Skeleton({
  className = '',
  height = '1rem',
}: SkeletonProps): JSX.Element {
  return <div className={['skeleton', className].filter(Boolean).join(' ')} style={{ height }} aria-hidden />
}
