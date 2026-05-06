import React from 'react'
import Image from 'next/image'

type AvatarProps = React.ComponentPropsWithoutRef<'div'> & {
  alt: string
  size?: 'sm' | 'md' | 'lg'
  src: string
}

export default function Avatar({
  alt,
  className = '',
  size = 'md',
  src,
  ...props
}: AvatarProps): JSX.Element {
  return (
    <div
      className={['ds-avatar', 'relative', `ds-avatar--${size}`, className].filter(Boolean).join(' ')}
      {...props}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 112px, 112px" className="ds-avatar__image" />
    </div>
  )
}
