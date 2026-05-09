'use client'
import { Section } from '@/components/ui/Section'
import { Ic } from '@/components/ui/Icons'

const services = [
  { ic: Ic.plane, label: 'Air Ticketing', sub: 'Domestic & International' },
  { ic: Ic.car, label: 'Tourist Taxi', sub: 'Outstation & local' },
  { ic: Ic.train, label: 'Railway Booking', sub: 'All classes' },
  { ic: Ic.bus, label: 'Bus Booking', sub: 'Volvo & sleeper' },
  { ic: Ic.pkg, label: 'Tour Packages', sub: '10 destinations' },
  { ic: Ic.shield, label: 'Visa Assist', sub: 'Documentation' },
]

export function ServiceStrip() {
  return (
    <Section eyebrow="What we do" title="Six services. One trusted desk.">
      <div className="grid-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16 }}>
        {services.map((s, i) => {
          const Icon = s.ic
          return (
            <div key={i} className="lift reveal" style={{ padding: 20, border: '1px solid var(--line)', borderRadius: 12, background: 'white', transitionDelay: `${i * 0.05}s` }}>
              <div className="ic-spin-hover" style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--sand-100)', display: 'grid', placeItems: 'center', color: 'var(--terra-700)', marginBottom: 14 }}>
                <Icon s={20}/>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-600)' }}>{s.sub}</div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
