import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { PACKAGES } from '@/lib/data'

export function Footer() {
  return (
    <footer className="footer-pad" style={{ background: 'var(--ink-900)', color: 'var(--sand-300)', padding: '60px 32px 32px' }}>
      <div className="footer-grid" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <Logo dark/>
          <p style={{ marginTop: 20, fontSize: 13, lineHeight: 1.6, maxWidth: 320 }}>Travel agency in Pathankot, Punjab — crafting personalised itineraries since 2008.</p>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--sand-100)', textTransform: 'uppercase', marginBottom: 16 }}>Destinations</div>
          {PACKAGES.slice(0, 5).map(p => (
            <Link key={p.id} href={`/packages/${p.id}`} style={{ display: 'block', color: 'var(--sand-300)', fontSize: 13, padding: '4px 0' }}>{p.name}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--sand-100)', textTransform: 'uppercase', marginBottom: 16 }}>Services</div>
          {['Air Ticketing', 'Tourist Taxi', 'Railway Booking', 'Bus Booking', 'Visa Assist'].map(s => (
            <div key={s} style={{ fontSize: 13, padding: '4px 0' }}>{s}</div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--sand-100)', textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
          <div style={{ fontSize: 13, lineHeight: 1.7 }}>Defence Road, Mamoon<br/>Pathankot, Punjab 145001<br/>+91 84602 22809<br/>Open 24×7</div>
        </div>
      </div>
      <div className="footer-bottom" style={{ maxWidth: 1240, margin: '48px auto 0', paddingTop: 24, borderTop: '1px solid #3a342b', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'var(--mono)', letterSpacing: '0.1em', color: 'var(--sand-300)' }}>
        <span>© 2026 SONIA TOUR & TRAVELS</span>
        <span>JD VERIFIED · 4.6 ★</span>
      </div>
    </footer>
  )
}
