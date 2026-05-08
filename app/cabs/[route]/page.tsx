import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/ui/Section'
import { RevealProvider } from '@/components/ui/Reveal'
import { CAB_ROUTES, VEHICLE_TYPES } from '../data'

export async function generateStaticParams() {
  return CAB_ROUTES.map(r => ({ route: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ route: string }> }): Promise<Metadata> {
  const { route } = await params
  const r = CAB_ROUTES.find(r => r.slug === route)
  if (!r) return { title: 'Route not found' }
  return {
    title: r.seoTitle,
    description: r.seoDesc,
    keywords: `${r.from.toLowerCase()} to ${r.to.toLowerCase()} cab, ${r.from.toLowerCase()} to ${r.to.toLowerCase()} taxi, cab from ${r.from.toLowerCase()}, taxi ${r.to.toLowerCase()}, outstation cab pathankot`,
    openGraph: { title: r.seoTitle, description: r.seoDesc, type: 'website' },
  }
}

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN')

export default async function CabRoutePage({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params
  const r = CAB_ROUTES.find(r => r.slug === route)
  if (!r) notFound()

  const related = CAB_ROUTES.filter(c => c.slug !== r.slug && c.popular).slice(0, 3)

  return (
    <RevealProvider>
      <Navbar/>
      <main>

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f1f0f 0%, #1c2e1c 100%)', paddingTop: 96, paddingBottom: 72, color: 'white' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
            <Link href="/cabs" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, textDecoration: 'none' }}>
              ← All cab routes
            </Link>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 12 }}>
              {r.distance} · {r.duration} · from Pathankot
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 60, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
              {r.from} to {r.to}<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold-400)', fontSize: 48 }}>Cab Booking</span>
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.72)', margin: '0 0 32px', maxWidth: 560, lineHeight: 1.6 }}>
              {r.description}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="tel:+918460222809" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-500)', color: 'var(--ink-900)', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                📞 Book Now — Call Us
              </a>
              <a href={`https://wa.me/918460222809?text=Hi%2C+I+need+a+cab+from+${encodeURIComponent(r.from)}+to+${encodeURIComponent(r.to)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* ── Fare cards ── */}
        <div style={{ background: 'var(--sand-50)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 20 }}>Fare details</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-3">
              {VEHICLE_TYPES.map(v => (
                <div key={v.id} style={{ background: 'white', border: '2px solid var(--line)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{v.icon}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 16 }}>{v.examples} · upto {v.seats} pax</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 600, color: 'var(--forest-700)', lineHeight: 1, marginBottom: 4 }}>
                    {formatINR(r[v.priceKey])}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 20 }}>one way · all-inclusive</div>
                  <a href={`https://wa.me/918460222809?text=Hi%2C+I+need+a+${v.name}+cab+from+${encodeURIComponent(r.from)}+to+${encodeURIComponent(r.to)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', background: 'var(--ink-900)', color: 'white', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    Book {v.name}
                  </a>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 12 }}>
              * One-way fare. Toll, state permits &amp; parking included. Round-trip bookings get 10% off return leg. Night charges: ₹300 extra if drop after 11 PM.
            </p>
          </div>
        </div>

        {/* ── Route highlights + details ── */}
        <Section padded>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, alignItems: 'start' }} className="pkg-detail-grid">
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                About this route
              </h2>
              <p style={{ fontSize: 16, color: 'var(--ink-700)', lineHeight: 1.65, marginBottom: 32 }}>
                {r.description} Our drivers know every pothole, shortcut and rest stop on this route — so you travel comfortably and arrive on time.
              </p>

              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, margin: '0 0 16px' }}>Route highlights</h3>
              <div style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
                {r.highlights.map(h => (
                  <div key={h} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 15, color: 'var(--ink-700)', padding: '10px 14px', background: 'var(--sand-50)', border: '1px solid var(--sand-200)', borderRadius: 8 }}>
                    <span style={{ color: 'var(--forest-600)' }}>✓</span> {h}
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, margin: '0 0 16px' }}>What's included</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 32 }}>
                {['Fuel & driver charges', 'All state permits & toll', 'Air-conditioned vehicle', 'GPS tracking', 'GST (if applicable)', 'Parking at drop point'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-700)' }}>
                    <span style={{ color: 'var(--forest-600)', flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, margin: '0 0 16px' }}>Not included</h3>
              <div style={{ display: 'grid', gap: 6 }}>
                {['Passenger food & accommodation', 'Night charges if drop after 11 PM (₹300)', 'Multiple stopovers beyond 30 min total'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ink-500)' }}>
                    <span style={{ flexShrink: 0 }}>×</span> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Booking sidebar ── */}
            <aside style={{ position: 'sticky', top: 96, background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 8 }}>
                {r.from} → {r.to}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 600, color: 'var(--terra-700)', lineHeight: 1, marginBottom: 4 }}>
                {formatINR(r.sedanPrice)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 20 }}>sedan · one way · all-inclusive</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {[['Distance', r.distance], ['Duration', r.duration], ['From', r.from], ['To', r.to]].map(([k, v]) => (
                  <div key={k} style={{ padding: 12, background: 'var(--sand-50)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontWeight: 600, marginTop: 2, fontSize: 14 }}>{v}</div>
                  </div>
                ))}
              </div>

              <a href="tel:+918460222809"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--ink-900)', color: 'white', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', marginBottom: 8 }}>
                📞 Call to Book
              </a>
              <a href={`https://wa.me/918460222809?text=Hi%2C+I+need+a+cab+from+${encodeURIComponent(r.from)}+to+${encodeURIComponent(r.to)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: 'white', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                💬 WhatsApp Us
              </a>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--line)', display: 'grid', gap: 8, fontSize: 12, color: 'var(--ink-700)' }}>
                <div>✅ Fixed price — no surge</div>
                <div>✅ Verified, trained driver</div>
                <div>✅ AC vehicle guaranteed</div>
                <div>✅ 24×7 helpline</div>
              </div>
            </aside>
          </div>
        </Section>

        {/* ── Related routes ── */}
        {related.length > 0 && (
          <div style={{ background: 'var(--sand-50)' }}>
            <Section eyebrow="Also popular" title="Other routes from Pathankot.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-3">
                {related.map(rel => (
                  <Link key={rel.slug} href={`/cabs/${rel.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="lift" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 20 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{rel.from} → {rel.to}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 12 }}>{rel.distance} · {rel.duration}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 16, color: 'var(--forest-700)' }}>{formatINR(rel.sedanPrice)} <span style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 400 }}>sedan</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </Section>
          </div>
        )}

      </main>
      <Footer/>
    </RevealProvider>
  )
}
