import { Section } from '@/components/ui/Section'

const reasons = [
  { n: '01', t: 'Eighteen years, one office.', d: 'Since 2008, on Defence Road in Pathankot — same family, same desk, same number.' },
  { n: '02', t: 'Itineraries, not templates.', d: 'We start from how you travel — early-riser or slow morning, group meals or solo cafés — then build around it.' },
  { n: '03', t: 'Razorpay-secured payments.', d: 'Every booking is paid through Razorpay. UPI, cards, netbanking, wallets. PCI-compliant, 100% receipts.' },
  { n: '04', t: 'On-trip helpline, 24×7.', d: 'A WhatsApp number that\'s actually answered. Lost luggage, hotel switch, late train — call us first.' },
]

export function WhyUs() {
  return (
    <div style={{ background: 'var(--ink-900)', color: 'var(--sand-100)' }}>
      <Section eyebrow="Why Sonia" title={<span style={{ color: 'var(--sand-50)' }}>Local desk, national reach.</span>}>
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 48, marginTop: -8 }}>
          {reasons.map((r, i) => (
            <div key={r.n} className="reveal" style={{ borderTop: '1px solid #3a342b', paddingTop: 24, transitionDelay: `${i * 0.06}s` }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold-500)', letterSpacing: '0.1em', marginBottom: 12 }}>{r.n}</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500, margin: '0 0 12px', color: 'var(--sand-50)', letterSpacing: '-0.01em' }}>{r.t}</h3>
              <p style={{ color: 'var(--sand-300)', margin: 0, fontSize: 15, lineHeight: 1.6 }}>{r.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
