'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Btn } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'

export function Hero() {
  const [dest, setDest] = useState('')
  const router = useRouter()
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--sand-100)' }}>
      <div className="hero-grid" style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 32px 0', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1px solid var(--sand-300)', borderRadius: 99, fontSize: 12, marginBottom: 24 }}>
            <Ic.star s={12}/> 4.6 / 5 · 90+ verified reviews · since 2008
          </div>
          <h1 className="hero-h1" style={{ fontFamily: 'var(--serif)', fontSize: 84, fontWeight: 500, lineHeight: 0.95, letterSpacing: '-0.035em', margin: '0 0 24px' }}>
            India,<br/>
            <span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>handcrafted</span><br/>
            for you.
          </h1>
          <p style={{ fontSize: 17, color: 'var(--ink-700)', maxWidth: 480, margin: '0 0 32px', lineHeight: 1.5 }}>
            From the apple orchards of Manali to the backwaters of Kerala — eighteen years of itineraries built around how <em>you</em> like to travel.
          </p>
          <div className="hero-search" style={{ background: 'white', borderRadius: 14, padding: 12, display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr auto', gap: 8, boxShadow: 'var(--shadow-md)', border: '1px solid var(--line)' }}>
            <div style={{ padding: '8px 14px', borderRight: '1px solid var(--line)' }}>
              <div style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Destination</div>
              <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Manali, Goa, Kerala…"
                style={{ border: 'none', outline: 'none', fontSize: 15, fontWeight: 500, width: '100%', background: 'transparent' }}/>
            </div>
            <div style={{ padding: '8px 14px', borderRight: '1px solid var(--line)' }}>
              <div style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Depart</div>
              <input type="date" defaultValue="2026-05-20" style={{ border: 'none', outline: 'none', fontSize: 15, fontWeight: 500, width: '100%', background: 'transparent', fontFamily: 'inherit' }}/>
            </div>
            <div style={{ padding: '8px 14px', borderRight: '1px solid var(--line)' }}>
              <div style={{ fontSize: 10, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Travellers</div>
              <select defaultValue="2" style={{ border: 'none', outline: 'none', fontSize: 15, fontWeight: 500, width: '100%', background: 'transparent', fontFamily: 'inherit' }}>
                <option>1 traveller</option><option>2 travellers</option><option>3 travellers</option><option>4 travellers</option><option>5+ travellers</option>
              </select>
            </div>
            <Btn variant="dark" size="md" icon={<Ic.search s={14}/>} onClick={() => router.push('/packages')}>Search</Btn>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 32, fontSize: 13, color: 'var(--ink-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ic.shield s={14}/> Razorpay-secured payments</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ic.clock s={14}/> 24×7 trip helpline</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ic.check s={14}/> JD Verified</div>
          </div>
        </div>
        <div className="hero-collage" style={{ position: 'relative', height: 560 }}>
          <div className="ph-img terra" style={{ position: 'absolute', top: 0, right: 0, width: 360, height: 460, borderRadius: 16, transform: 'rotate(2deg)' }}/>
          <div className="ph-img forest" style={{ position: 'absolute', bottom: 0, left: 0, width: 280, height: 340, borderRadius: 16, transform: 'rotate(-3deg)', boxShadow: 'var(--shadow-lg)' }}/>
          <div style={{ position: 'absolute', top: 220, left: 60, background: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: 'var(--shadow-md)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10, transform: 'rotate(-2deg)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--forest-100)', display: 'grid', placeItems: 'center', color: 'var(--forest-700)' }}><Ic.check s={18}/></div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Just confirmed</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Manali · 4N5D · 4 guests</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 80, borderTop: '1px solid var(--sand-200)', padding: '20px 32px', display: 'flex', justifyContent: 'center', gap: 64, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <span>18+ Years in business</span><span>·</span><span>10,000+ happy travellers</span><span>·</span><span>10 destinations</span><span>·</span><span>JD Verified</span>
      </div>
    </div>
  )
}
