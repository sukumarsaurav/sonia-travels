import React from 'react'

interface SectionProps {
  title?: React.ReactNode
  eyebrow?: string
  children: React.ReactNode
  padded?: boolean
  bg?: string
}

export function Section({ title, eyebrow, children, padded = true, bg }: SectionProps) {
  return (
    <section style={{ background: bg || 'transparent', padding: padded ? '80px 0' : 0 }}>
      <div className="container-pad" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
        {eyebrow && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 12 }}>
            {eyebrow}
          </div>
        )}
        {title && (
          <h2 className="section-h2" style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 500, lineHeight: 1.1, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  )
}
