'use client'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Ic } from '@/components/ui/Icons'
import { FAQS } from '@/lib/data'

export function FAQSection() {
  const [open, setOpen] = useState(0)
  return (
    <Section eyebrow="Common questions" title="Before you book.">
      <div style={{ maxWidth: 800 }}>
        {FAQS.map((f, i) => (
          <div key={i} style={{ borderTop: '1px solid var(--line)', padding: '20px 0' }}>
            <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{f.q}</span>
              <span style={{ color: 'var(--terra-700)', flexShrink: 0, marginLeft: 16 }}>
                {open === i ? <Ic.minus s={20}/> : <Ic.plus s={20}/>}
              </span>
            </button>
            {open === i && <p style={{ margin: '14px 0 0', color: 'var(--ink-700)', fontSize: 15, lineHeight: 1.6, maxWidth: 660 }}>{f.a}</p>}
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--line)' }}/>
      </div>
    </Section>
  )
}
