'use client'
import { Section } from '@/components/ui/Section'
import { Ic } from '@/components/ui/Icons'
import { TESTIMONIALS } from '@/lib/data'

const avatarBgs = ['terra', 'forest', 'dark']
const ratings = [4, 4, 4]

export function Testimonials() {
  return (
    <Section eyebrow="What travellers say" title="4.6 out of 5, across 90 reviews.">
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: '-40px -20px', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 20, left: -20, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, var(--terra-100) 0, transparent 70%)', opacity: 0.6 }}/>
          <div style={{ position: 'absolute', bottom: -20, right: -40, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle at 70% 60%, var(--terra-100) 0, transparent 70%)', opacity: 0.5 }}/>
        </div>
        <div className="grid-3" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <figure key={i} className="testimonial-card lift reveal" style={{
              margin: 0, padding: '32px 32px 28px',
              background: 'white', borderRadius: 18,
              boxShadow: '0 18px 40px -18px rgba(26,24,20,0.18), 0 4px 10px -4px rgba(26,24,20,0.06)',
              position: 'relative',
              transitionDelay: `${i * 0.08}s`,
            }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 96, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 0.7, marginBottom: 12, letterSpacing: '-0.04em' }}>&ldquo;</div>
              <div className={`ph-img ${avatarBgs[i]}`} style={{ position: 'absolute', top: 28, right: 28, width: 72, height: 72, borderRadius: '50%', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}/>
              <div style={{ display: 'flex', gap: 4, marginBottom: 18, color: 'var(--terra-700)' }}>
                {[...Array(5)].map((_, k) => <Ic.star key={k} s={18} style={{ opacity: k < ratings[i] ? 1 : 0.22 }}/>)}
              </div>
              <blockquote style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-700)', marginBottom: 24 }}>{t.text}</blockquote>
              <figcaption style={{ paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: 14, fontWeight: 500, color: 'var(--ink-900)' }}>
                {t.name}<span style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 400, marginLeft: 8 }}>· {t.trip}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  )
}
