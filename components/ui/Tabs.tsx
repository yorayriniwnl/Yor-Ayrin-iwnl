'use client'

import React, { useState } from 'react'

type TabItem = {
  content: React.ReactNode
  id: string
  label: string
}

type TabsProps = {
  className?: string
  items: TabItem[]
}

export default function Tabs({ className = '', items }: TabsProps): JSX.Element {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const activeTab = items.find((item) => item.id === activeId) ?? items[0]

  return (
    <div className={['ds-tabs', className].filter(Boolean).join(' ')}>
      <div className="ds-tabs__list" role="tablist" aria-label="Tabs">
        {items.map((item) => {
          const selected = item.id === activeTab?.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={['ds-tabs__trigger', selected ? 'is-active' : ''].filter(Boolean).join(' ')}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      <div className="ds-tabs__panel" role="tabpanel">
        {activeTab?.content}
      </div>
    </div>
  )
}
