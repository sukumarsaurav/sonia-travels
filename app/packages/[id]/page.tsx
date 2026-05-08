import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BookingButton } from '@/components/booking/BookingButton'
import { Btn, Pill } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { Section } from '@/components/ui/Section'
import { RevealProvider } from '@/components/ui/Reveal'
import { createServerSupabase } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import type { Package, ItineraryDay } from '@/types'

export const revalidate = 60

export async function generateStaticParams() {
  // generateStaticParams runs at build time — cannot use cookies()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { data } = await supabase.from('packages').select('id').eq('active', true)
  return (data || []).map(p => ({ id: p.id }))
}

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN')

const DEFAULT_INCLUSIONS = [
  'Hotel stay (3-star or better)',
  'Daily breakfast & one signature meal',
  'Private AC vehicle for sightseeing',
  'English-speaking local guide',
  'All current taxes & toll',
  '24×7 trip helpline',
]
const DEFAULT_EXCLUSIONS = [
  'Airfare to/from origin',
  'Lunch & dinner unless specified',
  'Entry tickets to monuments',
  'Personal expenses & tips',
  'Travel insurance (we can arrange)',
]

function defaultItinerary(days: number): ItineraryDay[] {
  return [
    { day: 'Day 1', title: 'Arrive & welcome', body: 'Pick-up from arrival point, check-in, evening orientation walk and a relaxed dinner with the local team.' },
    { day: 'Day 2', title: 'Headline sights', body: 'Full-day with private vehicle and guide. Two main sights, lunch at a hand-picked spot, photo time at golden hour.' },
    { day: 'Day 3', title: 'Slow morning + experience', body: 'Late breakfast, then a hands-on cultural experience — cooking, market walk or craft demo. Evening free.' },
    { day: `Day ${days - 1}`, title: 'Adventure / nature day', body: 'Optional add-ons: trekking, water sports, wildlife. Group lunch outdoors.' },
    { day: `Day ${days}`, title: 'Departure', body: 'Brunch, last-minute shopping, transfer to your departure point. Onward assistance.' },
  ]
}

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data } = await supabase.from('packages').select('*').eq('id', id).single()

  if (!data) notFound()
  const pkg = data as Package

  const itinerary: ItineraryDay[] = pkg.itinerary?.length ? pkg.itinerary : defaultItinerary(pkg.days)
  const inclusions = pkg.inclusions?.length ? pkg.inclusions : DEFAULT_INCLUSIONS
  const exclusions = pkg.exclusions?.length ? pkg.exclusions : DEFAULT_EXCLUSIONS

  return (
    <RevealProvider>
      <Navbar/>
      <main>
        {/* Hero */}
        <div style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
          {pkg.hero_url ? (
            <Image src={pkg.hero_url} alt={pkg.name} fill priority style={{ objectFit: 'cover' }}/>
          ) : (
            <div className={`ph-img ${pkg.hero}`} style={{ height: '100%' }}/>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.6))' }}/>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 32, color: 'white' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
              <Link href="/packages" style={{ color: 'rgba(255,255,255,0.85)', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 16 }}>
                <Ic.arrowL s={14}/> All packages
              </Link>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <Pill color="sand" size="sm">{pkg.tag}</Pill>
                <Pill color="sand" size="sm">{pkg.region}</Pill>
              </div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 80, fontWeight: 500, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{pkg.name}</h1>
              <div style={{ display: 'flex', gap: 24, marginTop: 16, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.92 }}>
                <span>{pkg.nights}N · {pkg.days}D</span><span>·</span>
                <span>From {formatINR(pkg.price)}/pax</span><span>·</span>
                <span>Group · 2–15</span>
              </div>
            </div>
          </div>
        </div>

        <Section padded>
          <div className="pkg-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              {/* Description */}
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.02em' }}>Why this trip</h2>
              <p style={{ fontSize: 17, color: 'var(--ink-700)', lineHeight: 1.6, margin: '0 0 40px' }}>
                {pkg.description || pkg.desc} An itinerary built for {pkg.days} days that balances headline sights with quiet, local moments.
              </p>

              {/* Highlights */}
              {pkg.highlights && pkg.highlights.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.01em' }}>Highlights</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {pkg.highlights.map((h, i) => (
                      <span key={i} style={{ padding: '6px 14px', background: 'var(--sand-100)', borderRadius: 99, fontSize: 13, color: 'var(--ink-700)', border: '1px solid var(--sand-200)' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em' }}>Day-by-day</h3>
              <div style={{ borderLeft: '1px solid var(--sand-300)', paddingLeft: 24, marginBottom: 40 }}>
                {itinerary.map((it, i) => (
                  <div key={i} style={{ position: 'relative', paddingBottom: 24 }}>
                    <div style={{ position: 'absolute', left: -32, top: 4, width: 14, height: 14, borderRadius: 99, background: 'var(--terra-600)', border: '3px solid var(--sand-50)' }}/>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--terra-700)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{it.day}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{it.title}</div>
                    <div style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.5 }}>{it.body}</div>
                  </div>
                ))}
              </div>

              {/* Inclusions / Exclusions */}
              <div className="pkg-incl-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: '0 0 12px' }}>Included</h3>
                  {inclusions.map((x, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', fontSize: 14 }}>
                      <span style={{ color: 'var(--forest-600)', marginTop: 2 }}><Ic.check s={14}/></span>{x}
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: '0 0 12px' }}>Not included</h3>
                  {exclusions.map((x, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', fontSize: 14, color: 'var(--ink-500)' }}>
                      <span style={{ marginTop: 2 }}><Ic.x s={14}/></span>{x}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking sidebar */}
            <aside style={{ position: 'sticky', top: 96, background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>From</span>
                <span style={{ fontSize: 12, color: 'var(--forest-600)', fontWeight: 600 }}>Razorpay secured</span>
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 600, color: 'var(--terra-700)', lineHeight: 1, margin: '4px 0' }}>{formatINR(pkg.price)}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 20 }}>per person · twin sharing</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                <div style={{ padding: 12, background: 'var(--sand-100)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Duration</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>{pkg.nights}N · {pkg.days}D</div>
                </div>
                <div style={{ padding: 12, background: 'var(--sand-100)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Group</div>
                  <div style={{ fontWeight: 600, marginTop: 2 }}>2 – 15</div>
                </div>
              </div>
              <BookingButton pkgId={pkg.id}/>
              <div style={{ marginTop: 8 }}>
                <Btn variant="whatsapp" full icon={<Ic.whatsapp s={16}/>}
                  onClick={() => {}} // handled client-side via BookingButton sibling
                >
                  <a href="https://wa.me/918460222809" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', width: '100%', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    Chat on WhatsApp
                  </a>
                </Btn>
              </div>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--line)', display: 'grid', gap: 8, fontSize: 12, color: 'var(--ink-700)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Ic.shield s={14}/> No advance until itinerary locked</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Ic.users s={14}/> Free changes up to 14 days out</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Ic.clock s={14}/> 24×7 trip helpline</div>
              </div>
            </aside>
          </div>
        </Section>
      </main>
      <Footer/>
    </RevealProvider>
  )
}
