'use client'
import { useState } from 'react'
import { Ic } from '@/components/ui/Icons'

interface FAQItem { q: string; a: string }

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState(-1)
  return (
    <div style={{ maxWidth: 760 }}>
      {items.map((f, i) => {
        const answerId = `faq-answer-${i}`
        const isOpen = open === i
        return (
          <div key={i} style={{ borderTop: '1px solid var(--line)' }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', padding: '20px 0' }}
            >
              <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>{f.q}</span>
              <span style={{ color: 'var(--terra-700)', flexShrink: 0, marginLeft: 16 }}>
                {isOpen ? <Ic.minus s={18}/> : <Ic.plus s={18}/>}
              </span>
            </button>
            <p
              id={answerId}
              role="region"
              hidden={!isOpen}
              style={{ margin: '0 0 20px', color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.6, maxWidth: 660 }}
            >
              {f.a}
            </p>
          </div>
        )
      })}
      <div style={{ borderTop: '1px solid var(--line)' }}/>
    </div>
  )
}
