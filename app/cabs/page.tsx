import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/ui/Section'
import { RevealProvider } from '@/components/ui/Reveal'
import { Ic } from '@/components/ui/Icons'
import { CAB_ROUTES, VEHICLE_TYPES } from './data'

export const metadata: Metadata = {
  title: 'Cab & Taxi Services in Pathankot | Outstation Cabs from ₹12/km | Sonia Travels',
  description: 'Best cab service in Pathankot for outstation routes — Dalhousie, Dharamshala, Amritsar, Jammu, Katra, Manali & Delhi. AC sedan, SUV & Tempo Traveller. Verified drivers, 24×7 helpline.',
  keywords: 'cab service pathankot, taxi pathankot, outstation cab pathankot, pathankot to dalhousie cab, pathankot taxi, best cab pathankot, tourist taxi pathankot',
  openGraph: {
    title: 'Cab & Taxi Services in Pathankot — Sonia Travels',
    description: 'Outstation cabs from Pathankot to Dalhousie, Dharamshala, Amritsar, Jammu, Katra, Manali and more. Book 24×7.',
    type: 'website',
  },
}

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN')

const POPULAR_ROUTES = CAB_ROUTES.filter(r => r.popular)
const ALL_ROUTES = CAB_ROUTES

export default function CabsPage() {
  return (
    <RevealProvider>
      <Navbar/>
      <main>

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, var(--ink-900) 0%, #1a2a1a 100%)', paddingTop: 96, paddingBottom: 80, color: 'white' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 16 }}>
              Cab &amp; Taxi Services · Pathankot
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 64, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 20px', maxWidth: 700 }}>
              Best cab service<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold-400)' }}>in Pathankot.</span>
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', margin: '0 0 32px', maxWidth: 560, lineHeight: 1.6 }}>
              Outstation taxis to Dalhousie, Dharamshala, Amritsar, Jammu, Katra, Manali &amp; beyond.
              AC sedans, SUVs and Tempo Travellers. Verified drivers. Fixed fares.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="tel:+918460222809"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-500)', color: 'var(--ink-900)', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <Ic.phone s={16}/> +91 84602 22809
              </a>
              <a href="https://wa.me/918460222809?text=Hi%2C+I+need+a+cab+from+Pathankot" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <Ic.whatsapp s={16}/> WhatsApp Us
              </a>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['10,000+', 'trips completed'], ['4.8', 'average rating'], ['24×7', 'helpline'], ['Zero', 'hidden charges']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 600, color: 'var(--gold-400)' }}>{n}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Vehicle types ── */}
        <div style={{ background: 'var(--sand-50)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 24 }}>Fleet</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-3">
              {VEHICLE_TYPES.map(v => (
                <div key={v.id} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: '24px 20px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--sand-100)', color: 'var(--terra-700)', display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                    {v.id === 'tt' ? <Ic.truck s={22}/> : <Ic.car s={22}/>}
                  </div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 8 }}>{v.examples} · {v.seats} seats</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.5, marginBottom: 12 }}>{v.desc}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--forest-700)' }}>{v.rate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Popular routes ── */}
        <Section eyebrow="Popular routes" title="Where are you headed?">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-3">
            {POPULAR_ROUTES.map((route, i) => (
              <Link key={route.slug} href={`/cabs/${route.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="lift reveal" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: 24, transitionDelay: `${i * 0.06}s`, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 4 }}>{route.distance} · {route.duration}</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{route.from} → {route.to}</div>
                    </div>
                    <span style={{ background: 'var(--terra-100)', color: 'var(--terra-700)', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0, marginTop: 4 }}>Popular</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16, background: 'var(--sand-50)', borderRadius: 10, padding: 12 }}>
                    {VEHICLE_TYPES.map(v => (
                      <div key={v.id} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: 'var(--ink-500)', marginBottom: 2 }}>{v.name}</div>
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: 13, color: 'var(--ink-900)' }}>{formatINR(route[v.priceKey])}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {route.highlights.slice(0, 3).map(h => (
                      <span key={h} style={{ fontSize: 11, background: 'var(--sand-100)', padding: '3px 8px', borderRadius: 99, color: 'var(--ink-600)', border: '1px solid var(--sand-200)' }}>{h}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: 'var(--terra-700)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    View details &amp; book <Ic.arrow s={13}/>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* ── All routes table ── */}
        <div style={{ background: 'var(--sand-50)' }}>
          <Section eyebrow="All routes" title="Complete fare chart.">
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: 'var(--ink-900)', color: 'white' }}>
                    {['Route', 'Distance', 'Duration', 'Sedan', 'SUV / MUV', 'Tempo 9+', ''].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: h === '' ? 'center' : 'left', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_ROUTES.map((r, i) => (
                    <tr key={r.slug} style={{ borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'white' : 'var(--sand-50)' }}>
                      <td style={{ padding: '14px 16px' }}><div style={{ fontWeight: 600 }}>{r.from} → {r.to}</div></td>
                      <td style={{ padding: '14px 16px', color: 'var(--ink-600)' }}>{r.distance}</td>
                      <td style={{ padding: '14px 16px', color: 'var(--ink-600)' }}>{r.duration}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--forest-700)' }}>{formatINR(r.sedanPrice)}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--forest-700)' }}>{formatINR(r.suvPrice)}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--forest-700)' }}>{formatINR(r.ttPrice)}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <Link href={`/cabs/${r.slug}`} style={{ fontSize: 12, fontWeight: 700, color: 'var(--terra-700)', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          Book <Ic.arrow s={12}/>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 12 }}>
              Prices are one-way. Toll, state permits &amp; driver night charges (if applicable) included. Round-trip gets 10% off return leg.
            </p>
          </Section>
        </div>

        {/* ── Why us ── */}
        <Section eyebrow="Why choose us" title="Pathankot's trusted taxi service.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-3">
            {([
              ['shield',     'Verified & trained drivers',  'All drivers are police-verified, licensed and familiar with mountain routes.'],
              ['navigation', 'GPS-tracked vehicles',        'Real-time tracking on every cab. Share your live location with family.'],
              ['clock',      'On-time guarantee',           'We track your flight/train and adjust pickup time automatically.'],
              ['tag',        'Fixed transparent fares',     'Price quoted is price paid. No surge, no hidden charges, no waiting fees.'],
              ['phone',      '24×7 helpline',               'Call or WhatsApp any time — before, during or after your journey.'],
              ['mountain',   'Mountain road expertise',     'Our drivers handle Himachal & J&K routes including Rohtang, Jalori, Sinthan.'],
            ] as [string, string, string][]).map(([iconKey, title, desc], i) => (
              <div key={i} className="reveal" style={{ padding: '24px 20px', background: 'var(--sand-50)', border: '1px solid var(--line)', borderRadius: 14, transitionDelay: `${i * 0.07}s` }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--terra-100)', color: 'var(--terra-700)', display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                  {iconKey === 'shield'     && <Ic.shield s={20}/>}
                  {iconKey === 'navigation' && <Ic.navigation s={20}/>}
                  {iconKey === 'clock'      && <Ic.clock s={20}/>}
                  {iconKey === 'tag'        && <Ic.tag s={20}/>}
                  {iconKey === 'phone'      && <Ic.phone s={20}/>}
                  {iconKey === 'mountain'   && <Ic.mountain s={20}/>}
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CTA banner ── */}
        <div style={{ background: 'var(--terra-700)', color: 'white', padding: '64px 32px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr auto', gap: 40, alignItems: 'center' }} className="cta-strip">
            <div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
                Ready to book your cab?
              </h2>
              <p style={{ fontSize: 16, opacity: 0.85, margin: 0 }}>Call or WhatsApp us — we will confirm your cab within minutes. No app needed.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="tel:+918460222809"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'white', color: 'var(--terra-800)', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <Ic.phone s={16}/> +91 84602 22809
              </a>
              <a href="https://wa.me/918460222809?text=Hi%2C+I+need+a+cab+from+Pathankot" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                <Ic.whatsapp s={16}/> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <Section eyebrow="FAQ" title="Common questions.">
          <div style={{ maxWidth: 760, display: 'grid', gap: 0 }}>
            {[
              { q: 'Are the fares one-way or round-trip?', a: 'All fares listed are one-way. For round trips we offer a 10% discount on the return leg. Inform us at the time of booking for the best rate.' },
              { q: 'Is there a waiting charge if my train/flight is delayed?', a: 'We track your PNR / flight number and adjust pickup time automatically at no extra charge up to 60 minutes. Beyond that, ₹150/hour waiting applies.' },
              { q: 'What vehicles are available for large groups?', a: 'We have 9-seater, 12-seater and 17-seater Tempo Travellers for groups. For very large groups (20+) we can arrange multiple vehicles.' },
              { q: 'Do you operate to/from Pathankot Railway Station and Bus Stand?', a: 'Yes, we cover Pathankot Cantt Railway Station, Pathankot City Railway Station, and ISBT Pathankot for all pickups and drops.' },
              { q: 'Can I book a cab for multiple days (outstation multi-day)?', a: 'Absolutely. We offer multi-day cab rentals for Himachal and J&K circuits. Pricing is based on km + driver night allowance. Contact us for a quote.' },
            ].map((f, i) => (
              <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>{f.q}</div>
                <div style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </Section>

      </main>
      <Footer/>
    </RevealProvider>
  )
}
