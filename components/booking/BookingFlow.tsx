'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Btn } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Form'
import { Ic } from '@/components/ui/Icons'
import { PACKAGES, formatINR } from '@/lib/data'
import { computePricing } from '@/lib/pricing'
import type { Package } from '@/types'

interface Props {
  pkgId: string
  pkg?: Package
  onClose: () => void
  onComplete?: () => void
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void }
  }
}

const TODAY = new Date().toISOString().slice(0, 10)
const DEFAULT_DEPART = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)

// Load Razorpay checkout.js once, on demand.
let razorpayScriptPromise: Promise<boolean> | null = null
function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  if (razorpayScriptPromise) return razorpayScriptPromise
  razorpayScriptPromise = new Promise(resolve => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
  return razorpayScriptPromise
}

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

interface PayProps {
  total: number
  pkg: Package
  data: FormData
  onComplete?: () => void
}
interface FormData {
  travelers: number
  depart: string
  room: string
  name: string
  email: string
  phone: string
  notes: string
  addons: { insurance: boolean; photo: boolean; airport: boolean }
}

function BookingConfirm({
  total, pkg, data, onComplete,
}: PayProps) {
  const [method, setMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setProcessing(true)
    setError('')
    try {
      // 1. Create the booking record.
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: data.name,
          customer_phone: data.phone,
          customer_email: data.email || null,
          package_id: pkg.id,
          package_name: pkg.name,
          travelers: data.travelers,
          depart_date: data.depart,
          amount: total,
          room_type: data.room,
          notes: data.notes || null,
          add_ons: Object.entries(data.addons).filter(([, v]) => v).map(([k]) => k),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        setProcessing(false)
        return
      }
      const bookingId: string = json.id
      const ref: string = json.booking_ref

      // 2. Ask the server to create a Razorpay order (amount recomputed server-side).
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId }),
      })
      const order = await orderRes.json().catch(() => ({}))

      // Razorpay not configured (or order failed) → manual-callback fallback.
      if (!orderRes.ok || !order.configured) {
        setBookingRef(ref)
        setProcessing(false)
        return
      }

      // 3. Open Razorpay checkout.
      const ready = await loadRazorpay()
      if (!ready || !window.Razorpay) {
        setBookingRef(ref)
        setProcessing(false)
        return
      }

      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: 'Sonia Tour & Travels',
        description: `${pkg.name} package`,
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: '#b04a2f' },
        handler: async (resp: RazorpayResponse) => {
          // 4. Verify the signature server-side before confirming.
          const vr = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              booking_id: bookingId,
            }),
          })
          if (vr.ok) {
            setPaid(true)
            setBookingRef(ref)
          } else {
            setError('Payment could not be verified. If money was deducted, contact us with your reference number.')
            setProcessing(false)
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      })
      rzp.open()
    } catch {
      setError('Network error — please check your connection.')
      setProcessing(false)
    }
  }

  if (bookingRef) return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 72, height: 72, borderRadius: 99, background: 'var(--forest-100)', color: 'var(--forest-700)', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
        <Ic.check s={36}/>
      </div>
      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: '0 0 8px', fontWeight: 500 }}>
        {paid ? 'Booking confirmed' : 'Request received!'}
      </h3>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--terra-700)', letterSpacing: '0.1em', marginBottom: 12 }}>
        Ref: {bookingRef}
      </div>
      <div style={{ color: 'var(--ink-600)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
        {paid
          ? 'Payment received. We’ll send your itinerary on WhatsApp & email shortly.'
          : 'We’ll call you within 2 hours to confirm availability and collect payment via Razorpay. Check WhatsApp for updates.'}
      </div>
      <Btn variant="dark" onClick={onComplete}>Done</Btn>
    </div>
  )

  return (
    <div>
      {error && (
        <div style={{ background: '#fadcd6', border: '1px solid #f5c4bc', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)', marginBottom: 16 }}>
          {error}
        </div>
      )}
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ background: '#0d2366', color: 'white', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'white', color: '#0d2366', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16 }}>R</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Sonia Tour &amp; Travels</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Amount</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{formatINR(total)}</div>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 20 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              {[
                { k: 'upi', l: 'UPI', sub: 'GPay, PhonePe, BHIM' },
                { k: 'card', l: 'Cards', sub: 'Visa, Mastercard' },
                { k: 'netbanking', l: 'Net Banking', sub: 'All major banks' },
                { k: 'wallet', l: 'Wallets', sub: 'Paytm, Mobikwik' },
                { k: 'emi', l: 'EMI', sub: `From ${formatINR(Math.round(total / 3))}/mo` },
              ].map(m => (
                <button key={m.k} onClick={() => setMethod(m.k)} style={{ padding: '10px 12px', borderRadius: 8, textAlign: 'left', background: method === m.k ? '#eef1f9' : 'transparent', border: method === m.k ? '1px solid #0d2366' : '1px solid transparent' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#0d2366' }}>{m.l}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-600)' }}>{m.sub}</div>
                </button>
              ))}
            </div>
            <div style={{ borderLeft: '1px solid var(--line)', paddingLeft: 20, minHeight: 180 }}>
              {method === 'upi' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Pay using UPI</div><Field label="UPI ID"><Input placeholder="yourname@okaxis"/></Field></div>}
              {method === 'card' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Card details</div><Field label="Card number"><Input placeholder="1234 5678 9012 3456"/></Field></div>}
              {method === 'netbanking' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Choose your bank</div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>{['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map(b => <button key={b} style={{ padding: 10, border: '1px solid var(--line)', borderRadius: 6, textAlign: 'left', background: 'white', fontSize: 13 }}>{b}</button>)}</div></div>}
              {method === 'wallet' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Wallets</div><div style={{ display: 'grid', gap: 8 }}>{['Paytm', 'Mobikwik', 'Amazon Pay'].map(w => <button key={w} style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 6, textAlign: 'left', background: 'white', fontSize: 13, fontWeight: 500 }}>{w}</button>)}</div></div>}
              {method === 'emi' && <div><div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>EMI plans</div><div style={{ display: 'grid', gap: 6 }}>{[3, 6, 9, 12].map(m => <div key={m} style={{ padding: 12, border: '1px solid var(--line)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{m} months</span><span style={{ fontWeight: 600 }}>{formatINR(Math.round(total / m * 1.05))}/mo</span></div>)}</div></div>}
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--sand-50)' }}>
          <div style={{ fontSize: 11, color: 'var(--ink-600)', fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>SECURED BY RAZORPAY</div>
          <Btn variant="razorpay" onClick={handleSubmit} disabled={processing}>
            {processing ? 'Confirming…' : `Confirm & Pay ${formatINR(total)}`}
          </Btn>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-500)', textAlign: 'center' }}>
        Our team will call you to process payment via Razorpay within 2 hours of confirmation.
      </div>
    </div>
  )
}

export function BookingFlow({ pkgId, pkg: propPkg, onClose, onComplete }: Props) {
  const pkg = propPkg ?? PACKAGES.find(p => p.id === pkgId) ?? PACKAGES[0]
  const [step, setStep] = useState(0)
  const [validationErr, setValidationErr] = useState('')
  const [data, setData] = useState<FormData>({
    travelers: 2,
    depart: DEFAULT_DEPART,
    room: 'twin',
    name: '',
    email: '',
    phone: '',
    notes: '',
    addons: { insurance: false, photo: false, airport: false },
  })
  const dialogRef = useRef<HTMLDivElement>(null)

  // Focus the dialog when it mounts
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const setD = (k: keyof FormData, v: unknown) => setData(d => ({ ...d, [k]: v }))
  const toggleAddon = (k: keyof FormData['addons']) =>
    setData(d => ({ ...d, addons: { ...d.addons, [k]: !d.addons[k] } }))

  const { base: baseTotal, gst, total } = computePricing({
    packagePrice: pkg.price,
    travelers: data.travelers,
    addons: data.addons,
  })
  const stepNames = ['Trip details', 'Your info', 'Add-ons & review', 'Payment']

  function validate(): boolean {
    if (step === 0) {
      if (!data.depart || data.depart < TODAY) {
        setValidationErr('Please select a future departure date.')
        return false
      }
    }
    if (step === 1) {
      if (!data.name.trim()) { setValidationErr('Please enter your name.'); return false }
      if (!data.phone.trim()) { setValidationErr('Please enter your phone number.'); return false }
      if (!/^[+0-9\s\-]{7,20}$/.test(data.phone.trim())) {
        setValidationErr('Please enter a valid phone number.')
        return false
      }
    }
    setValidationErr('')
    return true
  }

  const handleNext = () => {
    if (validate()) setStep(s => s + 1)
  }

  const heroImgStyle: React.CSSProperties = {
    height: 140, borderRadius: 10, marginBottom: 20, overflow: 'hidden', position: 'relative',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      ref={dialogRef}
      tabIndex={-1}
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,20,0.55)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 24, outline: 'none' }}
    >
      <div className="booking-modal" style={{ background: 'var(--sand-50)', width: '100%', maxWidth: 1080, maxHeight: '92vh', borderRadius: 16, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.5fr 1fr', boxShadow: 'var(--shadow-lg)' }}>

        {/* ── Main panel ── */}
        <div className="booking-main" style={{ padding: '32px 40px', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 4 }}>
                Step {step + 1} of 4 · {stepNames[step]}
              </div>
              <h2 id="booking-title" style={{ fontFamily: 'var(--serif)', fontSize: 30, margin: 0, fontWeight: 500 }}>
                Book {pkg.name}
              </h2>
            </div>
            <button onClick={onClose} aria-label="Close booking" style={{ width: 36, height: 36, borderRadius: 99, border: '1px solid var(--line)', background: 'white', display: 'grid', placeItems: 'center' }}>
              <Ic.x s={16}/>
            </button>
          </div>

          <div style={{ marginBottom: 28 }}><StepDots step={step} total={4}/></div>

          {validationErr && (
            <div style={{ background: '#fadcd6', border: '1px solid #f5c4bc', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)', marginBottom: 16 }}>
              {validationErr}
            </div>
          )}

          {/* Step 0 — Trip details */}
          {step === 0 && (
            <div style={{ display: 'grid', gap: 18 }}>
              <Field label="Departure date">
                <Input
                  type="date"
                  value={data.depart}
                  min={TODAY}
                  onChange={e => setD('depart', e.target.value)}
                />
              </Field>
              <Field label="Number of travellers">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 8, background: 'white', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Adults</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-600)' }}>{formatINR(pkg.price)} per person</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => setD('travelers', Math.max(1, data.travelers - 1))} aria-label="Remove traveller" style={{ width: 32, height: 32, borderRadius: 99, border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Ic.minus s={14}/></button>
                    <div style={{ width: 32, textAlign: 'center', fontWeight: 600 }} aria-live="polite">{data.travelers}</div>
                    <button onClick={() => setD('travelers', Math.min(15, data.travelers + 1))} aria-label="Add traveller" style={{ width: 32, height: 32, borderRadius: 99, border: '1px solid var(--line)', display: 'grid', placeItems: 'center' }}><Ic.plus s={14}/></button>
                  </div>
                </div>
              </Field>
              <Field label="Room preference">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {([['twin', 'Twin sharing'], ['double', 'Double bed'], ['single', 'Single + supplement']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setD('room', v)} aria-pressed={data.room === v} style={{ padding: 14, borderRadius: 8, textAlign: 'left', border: data.room === v ? '1.5px solid var(--ink-900)' : '1px solid var(--line)', background: data.room === v ? 'var(--sand-100)' : 'white' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{l}</div>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* Step 1 — Your info */}
          {step === 1 && (
            <div style={{ display: 'grid', gap: 18 }}>
              <Field label="Lead traveller name *">
                <Input placeholder="Full name as on ID" value={data.name} onChange={e => setD('name', e.target.value)} required/>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Email">
                  <Input type="email" placeholder="you@example.com" value={data.email} onChange={e => setD('email', e.target.value)}/>
                </Field>
                <Field label="Phone (WhatsApp) *">
                  <Input
                    type="tel"
                    placeholder="+91 84602 22809"
                    value={data.phone}
                    onChange={e => setD('phone', e.target.value)}
                    pattern="[+0-9\s\-]{7,20}"
                    required
                  />
                </Field>
              </div>
              <Field label="Special requests (optional)">
                <Textarea placeholder="Vegetarian only, parents along, anniversary, etc." value={data.notes} onChange={e => setD('notes', e.target.value)}/>
              </Field>
            </div>
          )}

          {/* Step 2 — Add-ons */}
          {step === 2 && (
            <div style={{ display: 'grid', gap: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-600)', marginBottom: -4 }}>Optional add-ons (per traveller)</div>
              {([
                { k: 'insurance', t: 'Travel insurance', d: 'Trip cancellation, baggage & medical cover', p: 600 },
                { k: 'photo', t: 'Photographer day', d: 'Professional shoot, edited photos in 7 days', p: 2400 },
                { k: 'airport', t: 'Airport pickup & drop', d: 'Private vehicle, both ways', p: 1200 },
              ] as const).map(a => (
                <button
                  key={a.k}
                  onClick={() => toggleAddon(a.k)}
                  aria-pressed={data.addons[a.k]}
                  style={{ padding: 16, borderRadius: 10, textAlign: 'left', border: data.addons[a.k] ? '1.5px solid var(--terra-600)' : '1px solid var(--line)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: data.addons[a.k] ? 'var(--terra-600)' : 'white', border: data.addons[a.k] ? '1px solid var(--terra-700)' : '1.5px solid var(--sand-300)', display: 'grid', placeItems: 'center', color: 'white', flexShrink: 0 }}>
                      {data.addons[a.k] && <Ic.check s={14}/>}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-600)' }}>{a.d}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, flexShrink: 0 }}>+{formatINR(a.p)}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Payment */}
          {step === 3 && <BookingConfirm total={total} pkg={pkg} data={data} onComplete={onComplete}/>}

          {step < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
              <Btn variant="ghost" onClick={step === 0 ? onClose : () => { setValidationErr(''); setStep(s => s - 1) }}>
                {step === 0 ? 'Cancel' : 'Back'}
              </Btn>
              <Btn variant="dark" onClick={handleNext} icon={<Ic.arrow s={14}/>}>
                {step === 2 ? `Review & pay ${formatINR(total)}` : 'Continue'}
              </Btn>
            </div>
          )}
        </div>

        {/* ── Aside summary ── */}
        <aside className="booking-aside" style={{ background: 'var(--ink-900)', color: 'var(--sand-100)', padding: '32px', overflow: 'auto' }}>
          <div style={heroImgStyle}>
            {pkg.hero_url ? (
              <Image
                src={pkg.hero_url}
                alt={pkg.name}
                fill
                sizes="340px"
                style={{ objectFit: 'cover', borderRadius: 10 }}
              />
            ) : (
              <div className={`ph-img ${pkg.hero}`} style={{ height: 140, borderRadius: 10 }}/>
            )}
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 6 }}>Trip summary</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, margin: '0 0 4px', color: 'var(--sand-50)', fontWeight: 500 }}>{pkg.name}</h3>
          <div style={{ fontSize: 12, color: 'var(--sand-300)', marginBottom: 24 }}>{pkg.region} · {pkg.nights}N · {pkg.days}D</div>
          <div style={{ display: 'grid', gap: 10, fontSize: 13, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #3a342b' }}>
            <Row k="Departure" v={new Date(data.depart + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}/>
            <Row k="Travellers" v={`${data.travelers} adult${data.travelers > 1 ? 's' : ''}`}/>
            <Row k="Room" v={data.room === 'twin' ? 'Twin sharing' : data.room === 'double' ? 'Double bed' : 'Single + supplement'}/>
          </div>
          <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
            <Row k={`Package × ${data.travelers}`} v={formatINR(baseTotal)}/>
            {data.addons.insurance && <Row k={`Insurance × ${data.travelers}`} v={formatINR(600 * data.travelers)}/>}
            {data.addons.photo && <Row k={`Photographer × ${data.travelers}`} v={formatINR(2400 * data.travelers)}/>}
            {data.addons.airport && <Row k={`Airport transfer × ${data.travelers}`} v={formatINR(1200 * data.travelers)}/>}
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
