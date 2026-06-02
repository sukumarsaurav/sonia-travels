'use client'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Btn } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Form'
import { Ic } from '@/components/ui/Icons'
import { PACKAGES } from '@/lib/data'

export function ContactSection() {
  const [form, setForm] = useState({
    name: '', phone: '', destination: '', travelers: '2', dates: '', notes: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^[+0-9\s\-]{7,20}$/.test(form.phone.trim())) {
      setError('Please enter a valid phone number (digits, spaces, + or - only).')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          interest: [form.destination, `${form.travelers} pax`, form.dates, form.notes]
            .filter(Boolean).join(' · '),
          message: form.notes || null,
          channel: 'web',
        }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Something went wrong. Please try WhatsApp instead.')
        setStatus('idle')
        return
      }

      setStatus('sent')
    } catch {
      setError('Network error — please check your connection.')
      setStatus('idle')
    }
  }

  return (
    <div style={{ background: 'var(--sand-100)' }}>
      <Section eyebrow="Visit or message" title="Defence Road, Pathankot.">
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { ic: Ic.pin, t: 'Office', d: <>Opposite Gurudwara, Near TCP Gate,<br/>Defence Road, Mamoon, Pathankot — 145001<br/>Punjab, India</> },
              { ic: Ic.phone, t: 'Phone &amp; WhatsApp', d: '+91 84602 22809 — instant inquiries' },
              { ic: Ic.clock, t: 'Hours', d: 'Open 24 hours · Monday to Sunday' },
            ].map((item, i) => {
              const Icon = item.ic
              return (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'white', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--terra-700)', flexShrink: 0 }}>
                    <Icon s={18}/>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.t}</div>
                    <div style={{ color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                </div>
              )
            })}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13543.83786221447!2d75.6445585!3d32.2755106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391c78ca14902cd5%3A0x6b63d1a88481ff23!2sDefence%20Road%2C%20Pathankot%2C%20Punjab!5e0!3m2!1sen!2sin!4v1715364123456!5m2!1sen!2sin"
              style={{ width: '100%', height: 240, border: 0, borderRadius: 12, marginTop: 8 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sonia Tour & Travels office location"
            />
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'white', padding: 32, borderRadius: 14, border: '1px solid var(--line)' }} noValidate>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '0 0 8px', fontWeight: 500 }}>Send us a quick brief</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--ink-600)', fontSize: 14 }}>We reply within a working day, usually faster.</p>

            {status === 'sent' ? (
              <div style={{ background: 'var(--forest-100)', color: 'var(--forest-700)', padding: 20, borderRadius: 10, fontSize: 14, lineHeight: 1.5 }}>
                ✓ Inquiry sent! We&apos;ll get back to you shortly on WhatsApp or phone.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {error && (
                  <div style={{ background: '#fadcd6', border: '1px solid #f5c4bc', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)' }}>
                    {error}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Your name">
                    <Input
                      placeholder="Full name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </Field>
                  <Field label="Phone" hint="Digits, +, spaces and - only">
                    <Input
                      type="tel"
                      placeholder="+91 84602 22809"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      pattern="[+0-9\s\-]{7,20}"
                      required
                    />
                  </Field>
                </div>
                <Field label="Where to?">
                  <Select value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}>
                    <option value="" disabled>Pick a destination</option>
                    {PACKAGES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    <option value="Other">Other / not sure</option>
                  </Select>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Travellers">
                    <Select value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))}>
                      <option>1</option><option>2</option><option>3-5</option><option>5+</option>
                    </Select>
                  </Field>
                  <Field label="Approx. dates">
                    <Input type="month" value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))}/>
                  </Field>
                </div>
                <Field label="Anything specific?">
                  <Textarea placeholder="Honeymoon, parents along, vegetarian only, etc." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/>
                </Field>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Btn variant="dark" full type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send inquiry'}
                  </Btn>
                  <Btn variant="whatsapp" icon={<Ic.whatsapp s={16}/>} onClick={() => window.open('https://wa.me/918460222809', '_blank')}>
                    WhatsApp
                  </Btn>
                </div>
              </div>
            )}
          </form>
        </div>
      </Section>
    </div>
  )
}
