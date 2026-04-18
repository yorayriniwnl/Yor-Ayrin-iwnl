import React from 'react'

type ModalProps = {
  children: React.ReactNode
  onClose: () => void
  title?: string
}

export default function Modal({ children, onClose, title }: ModalProps): JSX.Element {
  return (
    <div className="ds-modal" role="dialog" aria-modal="true" aria-label={title || 'Modal'}>
      <button type="button" className="ds-modal__backdrop" aria-label="Close modal" onClick={onClose} />
      <div className="ds-modal__panel">
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? <h3 className="ds-subheading">{title}</h3> : <span />}
          <button type="button" className="ds-modal__close" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
