'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Ic } from '@/components/ui/Icons'
import { PACKAGES, formatINR } from '@/lib/data'

export function Hero() {
  const [dest, setDest] = useState('')
  const [travelers, setTravelers] = useState('2')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const destRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Filtered destination suggestions
  const q = dest.trim().toLowerCase()
  const suggestions = q
    ? PACKAGES.filter(p => p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q))
    : PACKAGES

  const goSearch = (query: string) => {
    const params = new URLSearchParams()
    const v = query.trim()
    if (v) params.set('q', v)
    if (travelers !== '2') params.set('travelers', travelers)
    router.push(`/packages${params.size ? `?${params.toString()}` : ''}`)
  }

  const handleSearch = () => goSearch(dest)

  const selectDest = (name: string) => {
    setDest(name)
    setOpen(false)
    goSearch(name)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setOpen(true); setActive(a => Math.min(a + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && active >= 0 && suggestions[active]) selectDest(suggestions[active].name)
      else handleSearch()
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

          <div className="hero-search" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr auto', gap: 12, alignItems: 'stretch' }}>
            {/* Destination — outlined field with autocomplete dropdown */}
            <div ref={destRef} className="hero-field" style={{ position: 'relative', border: '1.5px solid var(--line)', borderRadius: 12, background: 'white', boxShadow: 'var(--shadow-sm)' }}>
              <label htmlFor="hero-dest" className="hero-field-label" style={{ position: 'absolute', top: -8, left: 12, background: 'white', padding: '0 6px', fontSize: 12, fontWeight: 500, color: 'var(--ink-600)', pointerEvents: 'none' }}>Destination</label>
              <input
                id="hero-dest"
                value={dest}
                onChange={e => { setDest(e.target.value); setOpen(true); setActive(-1) }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKey}
                placeholder="Where to? Manali, Goa, Kerala…"
                autoComplete="off"
                role="combobox"
                aria-expanded={open}
                aria-controls="hero-dest-list"
                style={{ border: 'none', outline: 'none', fontSize: 16, fontWeight: 500, width: '100%', background: 'transparent', padding: '17px 16px', color: 'var(--ink-900)' }}
              />
              {open && suggestions.length > 0 && (
                <div id="hero-dest-list" role="listbox" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'white', border: '1px solid var(--line)', borderRadius: 12, boxShadow: 'var(--shadow-lg)', overflow: 'hidden auto', zIndex: 30, maxHeight: 312 }}>
                  {suggestions.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      onMouseDown={e => { e.preventDefault(); selectDest(p.name) }}
                      onMouseEnter={() => setActive(i)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', padding: '11px 14px', background: i === active ? 'var(--sand-100)' : 'white', border: 'none', borderBottom: i < suggestions.length - 1 ? '1px solid var(--sand-100)' : 'none', cursor: 'pointer' }}
                    >
                      <span style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--sand-100)', color: 'var(--terra-700)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic.pin s={16}/></span>
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>{p.name}</span>
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--ink-500)' }}>{p.region} · from {formatINR(p.price)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Travellers — outlined field */}
            <div className="hero-field" style={{ position: 'relative', border: '1.5px solid var(--line)', borderRadius: 12, background: 'white', boxShadow: 'var(--shadow-sm)' }}>
              <label htmlFor="hero-travelers" className="hero-field-label" style={{ position: 'absolute', top: -8, left: 12, background: 'white', padding: '0 6px', fontSize: 12, fontWeight: 500, color: 'var(--ink-600)', pointerEvents: 'none' }}>Travellers</label>
              <select
                id="hero-travelers"
                value={travelers}
                onChange={e => setTravelers(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: 16, fontWeight: 500, width: '100%', background: 'transparent', fontFamily: 'inherit', padding: '17px 36px 17px 16px', color: 'var(--ink-900)', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
              >
                <option value="1">1 traveller</option>
                <option value="2">2 travellers</option>
                <option value="3">3 travellers</option>
                <option value="4">4 travellers</option>
                <option value="5">5+ travellers</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-400)" strokeWidth="2.5" strokeLinecap="round" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><path d="M6 9l6 6 6-6"/></svg>
            </div>

            <button onClick={handleSearch} className="hero-search-btn press" style={{ background: 'var(--ink-900)', color: 'white', borderRadius: 12, padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Ic.search s={16}/> Search
            </button>
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
