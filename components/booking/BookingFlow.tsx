'use client'
import { useState, useEffect } from 'react'
import { Btn } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Form'
import { Ic } from '@/components/ui/Icons'
import { PACKAGES, formatINR } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { Package } from '@/types'

interface Props { pkgId: string; onClose: () => void; onComplete?: () => void }

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {[...Array(total)].map((_, i) => (
        <div key={i} style={{ width: i === step ? 28 : 8, height: 8, borderRadius: 99, background: i <= step ? 'var(--terra-600)' : 'var(--sand-300)', transition: 'all 0.2s' }}/>
      ))}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--sand-300)' }}>{k}</span>
      <span style={{ fontWeight: 500, color: 'var(--sand-50)' }}>{v}</span>
    </div>
  )
}

function RazorpayCheckout({ total, pkg, data, onComplete }: { total: number; pkg: Package; data: any; onComplete?: () => void }) {
  const [method, setMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handlePay = async () => {
    if (processing) return
    setProcessing(true)
    try {
      // Generate a collision-resistant booking ID using timestamp + random suffix
      const bookingId = 'STT-' + Date.now().toString(36).toUpperCase().slice(-4) + Math.random().toString(36).toUpperCase().slice(2, 5)
      const { error } = await supabase.from('bookings').insert({
        booking_id: bookingId,
        customer: data.name, phone: data.phone, email: data.email,
        package: pkg.name, travelers: data.travelers,
        depart: data.depart, amount: total,
        status: 'Pending', payment: `Razorpay · ${method.toUpperCase()}`,
        room: data.room, notes: data.notes || '',
      })
      if (error) throw error
      setSuccess(true)
    } catch {
      // On error, keep form open — don't silently fail
      alert('Booking could not be saved. Please WhatsApp us on +91 84602 22809 to confirm.')
    } finally {
      setProcessing(false)
    }
  }

  if (success) return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 72, height: 72, borderRadius: 99, background: 'var(--forest-100)', color: 'var(--forest-700)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
        <Ic.check s={36}/>
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '0 0 8px', fontWeight: 500 }}>Booking confirmed</h3>
      <div style={{ color: 'var(--ink-600)', marginBottom: 24 }}>We'll send your itinerary on WhatsApp & email.</div>
      <Btn variant="dark" onClick={onComplete}>Done</Btn>
    </div>
  )

  return (
    <div>
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ background: '#0d2366', color: 'white', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'white', color: '#0d2366', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16 }}>R</div>
            <div><div style={{ fontSize: 12, opacity: 0.8 }}>Sonia Tour & Travels</div></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Amount</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{formatINR(total)}</div>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div className="rzp-grid" style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              {[{k:'upi',l:'UPI',sub:'GPay, PhonePe, BHIM'},{k:'card',l:'Cards',sub:'Visa, Mastercard'},{k:'netbanking',l:'Net Banking',sub:'All major banks'},{k:'wallet',l:'Wallets',sub:'Paytm, Mobikwik'},{k:'emi',l:'EMI',sub:`From ${formatINR(Math.round(total/3))}/mo`}].map(m => (
                <button key={m.k} onClick={() => setMethod(m.k)} style={{ padding: '10px 12px', borderRadius: 8, textAlign: 'left', background: method === m.k ? '#eef1f9' : 'transparent', border: method === m.k ? '1px solid #0d2366' : '1px solid transparent' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0d2366' }}>{m.l}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-600)' }}>{m.sub}</div>
                </button>
              ))}
            </div>
            <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20, minHeight: 180 }}>
              {method === 'upi' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Pay using UPI</div><Field label="UPI ID"><Input placeholder="yourname@okaxis"/></Field></div>}
              {method === 'card' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Card details</div><Field label="Card number"><Input placeholder="1234 5678 9012 3456"/></Field></div>}
              {method === 'netbanking' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Choose your bank</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{['HDFC Bank','ICICI Bank','SBI','Axis Bank'].map(b => <button key={b} style={{ padding: 10, border: '1px solid var(--line)', borderRadius: 6, textAlign: 'left', background: 'white', fontSize: 13 }}>{b}</button>)}</div></div>}
              {method === 'wallet' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Wallets</div><div style={{ display: 'grid', gap: 8 }}>{['Paytm','Mobikwik','Amazon Pay'].map(w => <button key={w} style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 6, textAlign: 'left', background: 'white', fontSize: 13, fontWeight: 500 }}>{w}</button>)}</div></div>}
              {method === 'emi' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>EMI plans</div><div style={{ display: 'grid', gap: 6 }}>{[3,6,9,12].map(m => <div key={m} style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{m} months</span><span style={{ fontWeight: 600 }}>{formatINR(Math.round(total/m*1.05))}/mo</span></div>)}</div></div>}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--sand-50)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-600)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>SECURED BY RAZORPAY</div>
          <Btn variant="razorpay" onClick={handlePay}>{processing ? 'Processing…' : `Pay ${formatINR(total)}`}</Btn>
        </div>
      </div>
    </div>
  )
}

// Default depart date = 14 days from today
function defaultDepart() {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().split('T')[0]
}

export function BookingFlow({ pkgId, onClose, onComplete }: Props) {
  const pkg = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0]
  const [step, setStep] = useState(0)
  const [data, setData] = useState({ travelers: 2, depart: defaultDepart(), room: 'twin', name: '', email: '', phone: '', notes: '', addons: { insurance: true, photo: false, airport: true } })
  const setD = (k: string, v: any) => setData(d => ({ ...d, [k]: v }))
  const toggleAddon = (k: string) => setData(d => ({ ...d, addons: { ...d.addons, [k]: !d.addons[k as keyof typeof d.addons] } }))

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const addonPrices = { insurance: 600, photo: 2400, airport: 1200 }
  const baseTotal = pkg.price * data.travelers
  const addonsTotal = Object.entries(data.addons).filter(([,v]) => v).reduce((s, [k]) => s + addonPrices[k as keyof typeof addonPrices] * data.travelers, 0)
  const gst = Math.round((baseTotal + addonsTotal) * 0.05)
  const total = baseTotal + addonsTotal + gst
  const stepNames = ['Trip details', 'Your info', 'Add-ons & review', 'Payment']

  return (
    <div className="booking-modal-wrap modal-scrim" role="dialog" aria-modal="true" aria-label="Book a trip" style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,20,0.55)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 24 }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="booking-modal" style={{ background: 'var(--sand-50)', width: '100%', maxWidth: 1080, maxHeight: '92vh', borderRadius: 16, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.5fr 1fr', boxShadow: 'var(--shadow-lg)' }}>
        <div className="booking-main" style={{ padding: '32px 40px', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 4 }}>Step {step+1} of 4 · {stepNames[step]}</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 30, margin: 0, fontWeight: 500 }}>Book {pkg.name}</h2>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 99, border: '1px solid var(--line)', background: 'white', display: 'grid', placeItems: 'center' }}><Ic.x s={16}/></button>
          </div>
          <div style={{ marginBottom: 28 }}><StepDots step={step} total={4}/></div>

          {step === 0 && (
            <div style={{ display: 'grid', gap: 18 }}>
              <Field label="Departure date"><Input type="date" value={data.depart} onChange={e => setD('depart', e.target.value)}/></Field>
              <Field label="Number of travellers">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 8, background: 'white', justifyContent: 'space-between' }}>
                  <div><div style={{ fontWeight: 600 }}>Adults</div><div style={{ fontSize: 12, color: 'var(--ink-600)' }}>{formatINR(pkg.price)} per person</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setD('travelers', Math.max(1, data.travelers-1))} style={{ width: 32, height: 32, borderRadius: 99, border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Ic.minus s={14}/></button>
                    <div style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{data.travelers}</div>
                    <button onClick={() => setD('travelers', Math.min(15, data.travelers+1))} style={{ width: 32, height: 32, borderRadius: 99, border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Ic.plus s={14}/></button>
                  </div>
                </div>
              </Field>
              <Field label="Room preference">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[['twin','Twin sharing'],['double','Double bed'],['single','Single + supplement']] .map(([v,l]) => (
                    <button key={v} onClick={() => setD('room', v)} style={{ padding: 14, borderRadius: 8, textAlign: 'left', border: data.room === v ? '1.5px solid var(--ink-900)' : '1px solid var(--line)', background: data.room === v ? 'var(--sand-100)' : 'white' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{l}</div>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}
          {step === 1 && (
            <div style={{ display: 'grid', gap: 18 }}>
              <Field label="Lead traveller name"><Input placeholder="Full name as on ID" value={data.name} onChange={e => setD('name', e.target.value)}/></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Email"><Input type="email" placeholder="you@example.com" value={data.email} onChange={e => setD('email', e.target.value)}/></Field>
                <Field label="Phone (WhatsApp)"><Input placeholder="+91 …" value={data.phone} onChange={e => setD('phone', e.target.value)}/></Field>
              </div>
              <Field label="Special requests (optional)"><Textarea placeholder="Vegetarian only, parents along, anniversary, etc." value={data.notes} onChange={e => setD('notes', e.target.value)}/></Field>
            </div>
          )}
          {step === 2 && (
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-600)', marginBottom: -4 }}>Optional add-ons (per traveller)</div>
              {[{k:'insurance',t:'Travel insurance',d:'Trip cancellation, baggage & medical cover',p:600},{k:'photo',t:'Photographer day',d:'Professional shoot, edited photos in 7 days',p:2400},{k:'airport',t:'Airport pickup & drop',d:'Private vehicle, both ways',p:1200}].map(a => (
                <button key={a.k} onClick={() => toggleAddon(a.k)} style={{ padding: 16, borderRadius: 10, textAlign: 'left', border: data.addons[a.k as keyof typeof data.addons] ? '1.5px solid var(--terra-600)' : '1px solid var(--line)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: data.addons[a.k as keyof typeof data.addons] ? 'var(--terra-600)' : 'white', border: data.addons[a.k as keyof typeof data.addons] ? '1px solid var(--terra-700)' : '1.5px solid var(--sand-300)', display: 'grid', placeItems: 'center', color: 'white' }}>
                      {data.addons[a.k as keyof typeof data.addons] && <Ic.check s={14}/>}
                    </div>
                    <div><div style={{ fontWeight: 600 }}>{a.t}</div><div style={{ fontSize: 12, color: 'var(--ink-600)' }}>{a.d}</div></div>
                  </div>
                  <div style={{ fontWeight: 600 }}>+{formatINR(a.p)}</div>
                </button>
              ))}
            </div>
          )}
          {step === 3 && <RazorpayCheckout total={total} pkg={pkg} data={data} onComplete={onComplete}/>}

          {step < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <Btn variant="ghost" onClick={step === 0 ? onClose : () => setStep(s => s-1)}>{step === 0 ? 'Cancel' : 'Back'}</Btn>
              <Btn variant="dark" onClick={() => setStep(s => s+1)} icon={<Ic.arrow s={14}/>}>{step === 2 ? `Pay ${formatINR(total)}` : 'Continue'}</Btn>
            </div>
          )}
        </div>

        <aside className="booking-aside" style={{ background: 'var(--ink-900)', color: 'var(--sand-100)', padding: '32px', overflow: 'auto' }}>
          <div className={`ph-img ${pkg.hero}`} style={{ height: 140, borderRadius: 10, marginBottom: 20 }}/>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 6 }}>Trip summary</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, margin: '0 0 4px', color: 'var(--sand-50)', fontWeight: 500 }}>{pkg.name}</h3>
          <div style={{ fontSize: 12, color: 'var(--sand-300)', marginBottom: 24 }}>{pkg.region} · {pkg.nights}N · {pkg.days}D</div>
          <div style={{ display: 'grid', gap: 10, fontSize: 13, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #3a342b' }}>
            <Row k="Departure" v={new Date(data.depart).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}/>
            <Row k="Travellers" v={`${data.travelers} adult${data.travelers>1?'s':''}`}/>
            <Row k="Room" v={data.room === 'twin' ? 'Twin sharing' : data.room === 'double' ? 'Double bed' : 'Single + supplement'}/>
          </div>
          <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
            <Row k={`Package × ${data.travelers}`} v={formatINR(baseTotal)}/>
            {data.addons.insurance && <Row k={`Insurance × ${data.travelers}`} v={formatINR(600*data.travelers)}/>}
            {data.addons.photo && <Row k={`Photographer × ${data.travelers}`} v={formatINR(2400*data.travelers)}/>}
            {data.addons.airport && <Row k={`Airport transfer × ${data.travelers}`} v={formatINR(1200*data.travelers)}/>}
            <Row k="GST 5%" v={formatINR(gst)}/>
          </div>
          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #3a342b', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontSize: 13, color: 'var(--sand-300)' }}>Total payable</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 600, color: 'var(--sand-50)' }}>{formatINR(total)}</div>
          </div>
          <div style={{ marginTop: 24, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--sand-300)' }}>
            <Ic.shield s={14}/> Secured by Razorpay · 256-bit encryption
          </div>
        </aside>
      </div>
    </div>
  )
}
