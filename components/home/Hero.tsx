'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Btn } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'

export function Hero() {
  const [dest, setDest] = useState('')
  const [travelers, setTravelers] = useState('2')
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    const q = dest.trim()
    if (q) params.set('q', q)
    if (travelers !== '2') params.set('travelers', travelers)
    router.push(`/packages${params.size ? `?${params.toString()}` : ''}`)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

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

          <div className="hero-search" style={{ background: 'white', borderRadius: 14, padding: 12, display: 'grid', gridTemplateColumns: '1.4fr 1fr auto', gap: 8, boxShadow: 'var(--shadow-md)', border: '1px solid var(--line)' }}>
            <div style={{ padding: '8px 14px', borderRight: '1px solid var(--line)' }}>
              <label htmlFor="hero-dest" style={{ display: 'block', fontSize: 10, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Destination</label>
              <input
                id="hero-dest"
                value={dest}
                onChange={e => setDest(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Manali, Goa, Kerala…"
                style={{ border: 'none', outline: 'none', fontSize: 15, fontWeight: 500, width: '100%', background: 'transparent' }}
              />
            </div>
            <div style={{ padding: '8px 14px', borderRight: '1px solid var(--line)' }}>
              <label htmlFor="hero-travelers" style={{ display: 'block', fontSize: 10, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Travellers</label>
              <select
                id="hero-travelers"
                value={travelers}
                onChange={e => setTravelers(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 15, fontWeight: 500, width: '100%', background: 'transparent', fontFamily: 'inherit' }}
              >
                <option value="1">1 traveller</option>
                <option value="2">2 travellers</option>
                <option value="3">3 travellers</option>
                <option value="4">4 travellers</option>
                <option value="5">5+ travellers</option>
              </select>
            </div>
            <Btn variant="dark" size="md" icon={<Ic.search s={14}/>} onClick={handleSearch}>Search</Btn>
          </div>

          <div className="hero-trust" style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 28, fontSize: 13, color: 'var(--ink-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ic.shield s={14}/> Razorpay-secured payments</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ic.clock s={14}/> 24×7 trip helpline</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ic.check s={14}/> JD Verified</div>
          </div>
        </div>

        <div className="hero-collage" style={{ position: 'relative', height: 560 }}>
          <Image src="/hero/taj.jpg" alt="Taj Mahal, India" width={360} height={460} priority style={{ position: 'absolute', top: 0, right: 0, width: 360, height: 460, borderRadius: 16, transform: 'rotate(2deg)', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}/>
          <Image src="/hero/backwaters.jpg" alt="Kerala backwaters" width={280} height={340} priority style={{ position: 'absolute', bottom: 0, left: 0, width: 280, height: 340, borderRadius: 16, transform: 'rotate(-3deg)', objectFit: 'cover', boxShadow: 'var(--shadow-lg)' }}/>
        </div>
      </div>

      <div style={{ marginTop: 80, borderTop: '1px solid var(--sand-200)', padding: '20px 32px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 32, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-600)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <span>18+ Years in business</span>
        <span aria-hidden="true">·</span>
        <span>10,000+ happy travellers</span>
        <span aria-hidden="true">·</span>
        <span>10 destinations</span>
        <span aria-hidden="true">·</span>
        <span>JD Verified</span>
      </div>
    </div>
  )
}
