'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Btn } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Form'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { ItineraryDay } from '@/types'

interface DBPackage {
  id: string; name: string; region: string; tag: string; nights: number; days: number
  price: number; hero: string; hero_url?: string | null; description: string
  highlights: string[]; itinerary: ItineraryDay[]; inclusions: string[]; exclusions: string[]
  active: boolean
}

interface Props {
  open: boolean
  onClose: () => void
  onSaved: () => void
  pkg?: DBPackage
}

const STORAGE_URL = 'https://zcizoajjjqqlclmvwqow.supabase.co/storage/v1/object/public/packages'

const DEFAULT_INCLUSIONS = [
  'Hotel stay (3-star or better)', 'Daily breakfast & one signature meal',
  'Private AC vehicle for sightseeing', 'English-speaking local guide',
  'All current taxes & toll', '24×7 trip helpline',
]
const DEFAULT_EXCLUSIONS = [
  'Airfare to/from origin', 'Lunch & dinner unless specified',
  'Entry tickets to monuments', 'Personal expenses & tips',
]

export function PackageModal({ open, onClose, onSaved, pkg }: Props) {
  const supabase = createBrowserSupabase()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [region, setRegion] = useState('')
  const [tag, setTag] = useState('')
  const [nights, setNights] = useState('4')
  const [days, setDays] = useState('5')
  const [price, setPrice] = useState('7200')
  const [description, setDescription] = useState('')
  const [highlights, setHighlights] = useState('')
  const [inclusions, setInclusions] = useState<string[]>(DEFAULT_INCLUSIONS)
  const [exclusions, setExclusions] = useState<string[]>(DEFAULT_EXCLUSIONS)
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [heroUrl, setHeroUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (pkg) {
      setName(pkg.name); setRegion(pkg.region); setTag(pkg.tag)
      setNights(String(pkg.nights)); setDays(String(pkg.days)); setPrice(String(pkg.price))
      setDescription(pkg.description || ''); setHighlights((pkg.highlights || []).join(', '))
      setInclusions(pkg.inclusions?.length ? pkg.inclusions : DEFAULT_INCLUSIONS)
      setExclusions(pkg.exclusions?.length ? pkg.exclusions : DEFAULT_EXCLUSIONS)
      setItinerary(pkg.itinerary?.length ? pkg.itinerary : [])
      setHeroUrl(pkg.hero_url || null)
    } else {
      setName(''); setRegion(''); setTag(''); setNights('4'); setDays('5'); setPrice('7200')
      setDescription(''); setHighlights('')
      setInclusions(DEFAULT_INCLUSIONS); setExclusions(DEFAULT_EXCLUSIONS)
      setItinerary([]); setHeroUrl(null)
    }
    setError('')
  }, [open, pkg])

  // ── image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError('')
    const ext = file.name.split('.').pop()
    const filename = `${pkg?.id || name.toLowerCase().replace(/\s+/g, '-') || Date.now()}-hero.${ext}`
    const { error: upErr } = await supabase.storage.from('packages').upload(filename, file, { upsert: true })
    if (upErr) { setError(upErr.message); setUploading(false); return }
    setHeroUrl(`${STORAGE_URL}/${filename}`)
    setUploading(false)
  }

  // ── itinerary helpers ─────────────────────────────────────────────────────
  const addDay = () => setItinerary(prev => [...prev, { day: `Day ${prev.length + 1}`, title: '', body: '' }])
  const removeDay = (i: number) => setItinerary(prev => prev.filter((_, idx) => idx !== i))
  const updateDay = (i: number, field: keyof ItineraryDay, val: string) =>
    setItinerary(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d))

  // ── list helpers (inclusions/exclusions) ──────────────────────────────────
  const addItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter(prev => [...prev, ''])
  const removeItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number) =>
    setter(prev => prev.filter((_, idx) => idx !== i))
  const updateItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number, val: string) =>
    setter(prev => prev.map((x, idx) => idx === i ? val : x))

  // ── save ──────────────────────────────────────────────────────────────────
  const submit = async () => {
    if (!name || !region) { setError('Name and region are required.'); return }
    setSaving(true); setError('')
    const payload = {
      name, region, tag, nights: parseInt(nights, 10), days: parseInt(days, 10),
      price: parseInt(price, 10), description, hero: 'terra',
      hero_url: heroUrl || null,
      highlights: highlights ? highlights.split(',').map(s => s.trim()).filter(Boolean) : [],
      itinerary, inclusions: inclusions.filter(Boolean), exclusions: exclusions.filter(Boolean),
      active: true,
    }
    const { error: err } = pkg
      ? await supabase.from('packages').update(payload).eq('id', pkg.id)
      : await supabase.from('packages').insert({ ...payload, id: name.toLowerCase().replace(/\s+/g, '-') })
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false); onSaved(); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} width={760}
      title={pkg ? `Edit — ${pkg.name}` : 'Add package'}
      sub={pkg ? 'Update destination details' : 'Create a new tour package'}
      actions={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="dark" onClick={submit} disabled={saving || uploading}>{saving ? 'Saving…' : pkg ? 'Save changes' : 'Add package'}</Btn></>}>

      {error && <div style={{ background: '#fadcd6', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)', marginBottom: 16 }}>{error}</div>}

      {/* ── Hero image ── */}
      <section style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Hero image</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 180, height: 120, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--sand-100)', flexShrink: 0, position: 'relative' }}>
            {heroUrl
              ? <Image src={heroUrl} alt="Hero" fill style={{ objectFit: 'cover' }}/>
              : <div style={{ height: '100%', display: 'grid', placeItems: 'center', color: 'var(--ink-400)', fontSize: 12 }}>No image</div>
            }
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageUpload}/>
            <Btn variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? 'Uploading…' : heroUrl ? 'Replace image' : 'Upload image'}
            </Btn>
            {heroUrl && <span style={{ marginLeft: 8 }}><Btn variant="danger" size="sm" onClick={() => setHeroUrl(null)}>Remove</Btn></span>}
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-400)' }}>JPG, PNG or WebP · max 5 MB</div>
          </div>
        </div>
      </section>

      {/* ── Basic info ── */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', marginBottom: 12, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Basic info</div>
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Destination name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Spiti Valley" required/></Field>
            <Field label="Region"><Input value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Himachal Pradesh" required/></Field>
          </div>
          <Field label="Category / tag"><Input value={tag} onChange={e => setTag(e.target.value)} placeholder="Mountains, Beach, Heritage…"/></Field>
          <Field label="Short description"><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="One-liner about the destination…" style={{ minHeight: 72 }}/></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Field label="Nights"><Input type="number" value={nights} onChange={e => setNights(e.target.value)}/></Field>
            <Field label="Days"><Input type="number" value={days} onChange={e => setDays(e.target.value)}/></Field>
            <Field label="Price / pax (₹)"><Input type="number" value={price} onChange={e => setPrice(e.target.value)}/></Field>
          </div>
          <Field label="Highlights" hint="Comma-separated — e.g. Rohtang Pass, Solang Valley">
            <Input value={highlights} onChange={e => setHighlights(e.target.value)} placeholder="Highlight 1, Highlight 2…"/>
          </Field>
        </div>
      </section>

      {/* ── Itinerary ── */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Itinerary</div>
          <Btn variant="ghost" size="sm" onClick={addDay}>+ Add day</Btn>
        </div>
        {itinerary.length === 0
          ? <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--ink-400)' }}>No itinerary added — a default template will be shown on the package page.</div>
          : <div style={{ display: 'grid', gap: 12 }}>
              {itinerary.map((it, i) => (
                <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 14, display: 'grid', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 10, alignItems: 'start' }}>
                    <Field label="Day label"><Input value={it.day} onChange={e => updateDay(i, 'day', e.target.value)} placeholder="Day 1"/></Field>
                    <Field label="Title"><Input value={it.title} onChange={e => updateDay(i, 'title', e.target.value)} placeholder="e.g. Arrive & welcome"/></Field>
                    <button onClick={() => removeDay(i)} style={{ marginTop: 24, color: 'var(--terra-600)', fontSize: 18, lineHeight: 1 }}>×</button>
                  </div>
                  <Field label="Description">
                    <Textarea value={it.body} onChange={e => updateDay(i, 'body', e.target.value)} placeholder="What happens this day…" style={{ minHeight: 64 }}/>
                  </Field>
                </div>
              ))}
            </div>
        }
      </section>

      {/* ── Inclusions ── */}
      <section style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Inclusions</div>
          <Btn variant="ghost" size="sm" onClick={() => addItem(setInclusions)}>+ Add item</Btn>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {inclusions.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--forest-600)', fontSize: 14 }}>✓</span>
              <Input value={item} onChange={e => updateItem(setInclusions, i, e.target.value)} placeholder="e.g. Hotel stay (3-star or better)"/>
              <button onClick={() => removeItem(setInclusions, i)} style={{ color: 'var(--terra-600)', fontSize: 18, flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Exclusions ── */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Exclusions</div>
          <Btn variant="ghost" size="sm" onClick={() => addItem(setExclusions)}>+ Add item</Btn>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {exclusions.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ color: 'var(--terra-600)', fontSize: 14 }}>✗</span>
              <Input value={item} onChange={e => updateItem(setExclusions, i, e.target.value)} placeholder="e.g. Airfare to/from origin"/>
              <button onClick={() => removeItem(setExclusions, i)} style={{ color: 'var(--terra-600)', fontSize: 18, flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      </section>
    </Modal>
  )
}
