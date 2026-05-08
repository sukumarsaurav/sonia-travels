'use client'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Btn } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { Ic } from '@/components/ui/Icons'
import { RevealProvider } from '@/components/ui/Reveal'

const services = [
  { id: 'packages', ic: Ic.pkg, hero: 'terra', title: 'Tour Packages', tagline: '10 destinations, fully arranged', desc: 'Hand-built itineraries across India — mountains, beaches, heritage and backwaters. Hotels, transfers, guides and meals bundled into one fixed price.', starts: '₹6,300', unit: 'per person', bullets: ['Customised by group size & pace', '3-star or better stays', 'Private vehicle + local guide', 'Daily breakfast included'], cta: 'Browse packages' },
  { id: 'air', ic: Ic.plane, hero: 'dark', title: 'Air Ticketing', tagline: 'Domestic & international', desc: 'We watch fares across all major carriers and lock the best combination of price, layover and refund flexibility for your dates.', starts: '₹0', unit: 'service charge on bookings under ₹1L', bullets: ['All domestic & GCC routes', 'Group fares for 6+ travellers', 'Web check-in & seat selection', 'Reschedule support 24×7'], cta: 'Get a fare quote' },
  { id: 'taxi', ic: Ic.car, hero: 'forest', title: 'Tourist Taxi', tagline: 'Outstation & local hire', desc: 'Sedans, SUVs and Tempo Travellers from Pathankot — to Dalhousie, Dharamshala, Amritsar, Jammu, Katra and the wider Himachal circuit.', starts: '₹12', unit: 'per km · sedan', bullets: ['Verified drivers, GPS tracked', 'AC sedans · 6/9/12-seaters', 'All toll & state permits included', 'Hourly hire from 4 hrs'], cta: 'Book a taxi' },
  { id: 'rail', ic: Ic.train, hero: 'terra', title: 'Railway Booking', tagline: 'Tatkal, Premium Tatkal & general', desc: 'IRCTC-authorised counter — we handle Tatkal queues, waitlist watching and PNR transfers so you don\'t lose hours on it.', starts: '₹40', unit: 'convenience fee per ticket', bullets: ['All AC & sleeper classes', 'Senior citizen & lower berth', 'Confirmed alternative if WL', 'Cancellation processed same day'], cta: 'Reserve a berth' },
  { id: 'bus', ic: Ic.bus, hero: 'forest', title: 'Bus Booking', tagline: 'Volvo, sleeper & semi-sleeper', desc: 'Volvo and sleeper coaches for Delhi, Chandigarh, Manali, Shimla, Dharamshala, Jammu and onwards.', starts: '₹450', unit: 'Pathankot → Chandigarh', bullets: ['AC Volvo & sleeper coaches', 'Live boarding-point updates', 'Reserved seat selection', 'Group block-booking discounts'], cta: 'Find a bus' },
  { id: 'visa', ic: Ic.shield, hero: 'dark', title: 'Visa Assistance', tagline: 'Documentation & forwarding', desc: 'End-to-end help for tourist and business visas — Schengen, UK, USA, Canada, Australia, Thailand, UAE, Singapore and more.', starts: '₹2,500', unit: 'service charge + consular fees', bullets: ['Form filling & checklist review', 'Appointment booking', 'Cover letter & itinerary drafts', 'Courier to consulate / VFS'], cta: 'Start a visa file' },
]

const extras = [
  { ic: Ic.shield, t: 'Travel insurance', d: 'Trip cancellation, baggage & medical cover from ICICI Lombard / Bajaj Allianz.' },
  { ic: Ic.users, t: 'Group & corporate', d: 'Conferences, weddings, school trips, college tours — fully managed.' },
  { ic: Ic.cal, t: 'Honeymoon planning', d: 'Curated stays, candle-lit dinners, photographer days and surprise touches.' },
  { ic: Ic.pin, t: 'Pilgrimage tours', d: 'Char Dham, Vaishno Devi, Amarnath Yatra, Hemkund — registrations & logistics handled.' },
  { ic: Ic.plane, t: 'Forex & travel cards', d: 'Multi-currency forex cards and cash through partner authorised dealers.' },
  { ic: Ic.car, t: 'Airport transfers', d: 'Pickup and drop from Amritsar, Chandigarh, Jammu and Delhi airports.' },
]

const process = [
  { n: '01', t: 'Tell us the brief', d: 'Call, WhatsApp or send the form. Dates, travellers, preferences — even rough ones.' },
  { n: '02', t: 'Get a tailored quote', d: 'Within a working day we send 1–2 itinerary options with transparent pricing.' },
  { n: '03', t: 'Lock with a deposit', d: '25% advance via Razorpay (UPI, card, netbanking) — full receipt issued instantly.' },
  { n: '04', t: 'Travel with backup', d: '24×7 WhatsApp helpline before, during and after your trip. Real humans, not bots.' },
]

export default function ServicesPage() {
  return (
    <RevealProvider>
      <Navbar/>
      <main>
        {/* Hero */}
        <div style={{ background: 'var(--sand-100)', paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 16 }}>Our Services</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 72, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
              One desk for<br/><span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>every leg</span> of the trip.
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-700)', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
              Tickets, hotels, taxis, visas, packages, insurance — handled by one team you can phone, message or walk in to.
            </p>
          </div>
        </div>

        {/* Quick jump */}
        <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'white' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '16px 32px', display: 'flex', gap: 8, overflowX: 'auto' }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-500)', textTransform: 'uppercase', padding: '8px 12px 8px 0', flexShrink: 0 }}>Jump to</span>
            {services.map(s => <a key={s.id} href={`#svc-${s.id}`} style={{ padding: '8px 14px', borderRadius: 99, background: 'var(--sand-100)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>{s.title}</a>)}
          </div>
        </div>

        {/* Service blocks */}
        <Section padded={false}>
          <div style={{ padding: '80px 0', display: 'grid', gap: 80 }}>
            {services.map((s, i) => {
              const I = s.ic; const reverse = i % 2 === 1
              return (
                <div key={s.id} id={`svc-${s.id}`} className="services-row reveal" style={{ display: 'grid', gridTemplateColumns: reverse ? '1fr 1.2fr' : '1.2fr 1fr', gap: 56, alignItems: 'center', scrollMarginTop: 100 }}>
                  <div style={{ order: reverse ? 2 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--sand-100)', color: 'var(--terra-700)', display: 'grid', placeItems: 'center' }}><I s={22}/></div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>0{i+1} · {s.tagline}</div>
                    </div>
                    <h2 style={{ fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{s.title}</h2>
                    <p style={{ fontSize: 16, color: 'var(--ink-700)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 540 }}>{s.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28, maxWidth: 540 }}>
                      {s.bullets.map((b, k) => <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: 'var(--ink-700)' }}><span style={{ color: 'var(--forest-600)', marginTop: 2, flexShrink: 0 }}><Ic.check s={14}/></span>{b}</div>)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 20, borderTop: '1px dashed var(--line)' }}>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Starts at</div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 600, color: 'var(--terra-700)', lineHeight: 1.1 }}>{s.starts}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{s.unit}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn variant="dark" size="md" icon={<Ic.arrow s={14}/>}>{s.cta}</Btn>
                        <Btn variant="whatsapp" size="md" icon={<Ic.whatsapp s={14}/>} onClick={() => window.open('https://wa.me/918460222809', '_blank')}>WhatsApp</Btn>
                      </div>
                    </div>
                  </div>
                  <div style={{ order: reverse ? 1 : 2, position: 'relative', height: 420 }}>
                    <div className={`ph-img ${s.hero}`} style={{ position: 'absolute', inset: 0, borderRadius: 16, boxShadow: 'var(--shadow-md)' }}/>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Extras */}
        <div style={{ background: 'var(--sand-100)' }}>
          <Section eyebrow="Also available" title="Beyond the basics.">
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {extras.map((e, i) => { const I = e.ic; return (
                <div key={i} className="lift reveal" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: 24, transitionDelay: `${i * 0.05}s` }}>
                  <div className="ic-spin-hover" style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--terra-100)', color: 'var(--terra-700)', display: 'grid', placeItems: 'center', marginBottom: 14 }}><I s={20}/></div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 6, letterSpacing: '-0.01em' }}>{e.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-700)', lineHeight: 1.5 }}>{e.d}</div>
                </div>
              )})}
            </div>
          </Section>
        </div>

        {/* How it works */}
        <Section eyebrow="How it works" title="From inquiry to handshake.">
          <div className="process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 1, background: 'var(--sand-300)', zIndex: 0 }}/>
            {process.map((p, i) => (
              <div key={p.n} className="reveal" style={{ position: 'relative', zIndex: 1, background: 'var(--sand-50)', paddingRight: 16, transitionDelay: `${i * 0.08}s` }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--gold-500)', display: 'grid', placeItems: 'center', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 20 }}>{p.n}</div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>{p.t}</div>
                <div style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.55 }}>{p.d}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div style={{ background: 'var(--ink-900)', color: 'var(--sand-100)', padding: '72px 32px' }}>
          <div className="cta-strip" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr auto', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 12 }}>Ready when you are</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 500, margin: 0, color: 'var(--sand-50)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>Tell us where you want to go. We'll handle the rest.</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn variant="primary" size="lg" icon={<Ic.arrow s={16}/>}>Send a brief</Btn>
              <Btn variant="whatsapp" size="lg" icon={<Ic.whatsapp s={18}/>} onClick={() => window.open('https://wa.me/918460222809', '_blank')}>+91 84602 22809</Btn>
              <div style={{ fontSize: 12, color: 'var(--sand-300)', textAlign: 'center', marginTop: 4 }}>Open 24×7 · We answer fast</div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </RevealProvider>
  )
}
