'use client'
import { useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Btn } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Form'
import { Ic } from '@/components/ui/Icons'
import { PACKAGES } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', destination: '', travelers: '2', dates: '2026-06', notes: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    await supabase.from('inquiries').insert({
      name: form.name, phone: form.phone,
      interest: `${form.destination} · ${form.travelers} pax · ${form.dates}${form.notes ? ' · ' + form.notes : ''}`,
      channel: 'Web Form', unread: true,
    })
    setStatus('sent')
  }

  return (
    <div style={{ background: 'var(--sand-100)' }}>
      <Section eyebrow="Visit or message" title="Defence Road, Pathankot.">
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { ic: Ic.pin, t: 'Office', d: <>Opposite Gurudwara, Near TCP Gate,<br/>Defence Road, Mamoon, Pathankot — 145001<br/>Punjab, India</> },
              { ic: Ic.phone, t: 'Phone & WhatsApp', d: '+91 84602 22809 — instant inquiries' },
              { ic: Ic.clock, t: 'Hours', d: 'Open 24 hours · Monday to Sunday' },
            ].map((item, i) => {
              const Icon = item.ic
              return (
                <div key={i} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'white', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--terra-700)', flexShrink: 0 }}><Icon s={18}/></div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.t}</div>
                    <div style={{ color: 'var(--ink-700)', fontSize: 14, lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                </div>
              )
            })}
            <div className="ph-img" style={{ height: 240, borderRadius: 12, marginTop: 8 }}/>
          </div>
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: 32, borderRadius: 14, border: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '0 0 8px', fontWeight: 500 }}>Send us a quick brief</h3>
            <p style={{ margin: '0 0 24px', color: 'var(--ink-500)', fontSize: 14 }}>We reply within a working day, usually faster.</p>
            {status === 'sent' ? (
              <div style={{ background: 'var(--forest-100)', color: 'var(--forest-700)', padding: 20, borderRadius: 10, fontSize: 14 }}>
                ✓ Inquiry sent! We'll get back to you shortly on WhatsApp or phone.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Your name"><Input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required/></Field>
                  <Field label="Phone"><Input placeholder="+91 …" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required/></Field>
                </div>
                <Field label="Where to?">
                  <Select value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}>
                    <option value="" disabled>Pick a destination</option>
                    {PACKAGES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    <option>Other / not sure</option>
                  </Select>
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Travellers">
                    <Select value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))}>
                      <option>1</option><option>2</option><option>3-5</option><option>5+</option>
                    </Select>
                  </Field>
                  <Field label="Approx. dates"><Input type="month" value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))}/></Field>
                </div>
                <Field label="Anything specific?"><Textarea placeholder="Honeymoon, parents along, vegetarian only, etc." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}/></Field>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Btn variant="dark" full type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send inquiry'}</Btn>
                  <Btn variant="whatsapp" icon={<Ic.whatsapp s={16}/>} onClick={() => window.open('https://wa.me/918460222809', '_blank')}>WhatsApp</Btn>
                </div>
              </div>
            )}
          </form>
        </div>
      </Section>
    </div>
  )
}
