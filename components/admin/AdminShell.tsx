'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Logo } from '@/components/ui/Logo'
import { Btn, StatusPill, Pill } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { Field, Input, Select, Textarea } from '@/components/ui/Form'
import { Modal } from '@/components/ui/Modal'
import { PackageModal } from '@/components/admin/PackageModal'
import { createBrowserSupabase } from '@/lib/supabase-browser'

// ─── types ────────────────────────────────────────────────────────────────────
interface UserInfo { name: string; email: string; avatar: string }
interface ContentRow { key: string; value: string; type: string; label: string; section: string }

interface DBBooking {
  id: string; booking_ref: string; customer_name: string; customer_phone: string
  customer_email: string | null; package_id: string | null; package_name: string
  travelers: number; depart_date: string | null; amount: number; status: string
  payment_status: string; notes: string | null; created_at: string
}
interface DBPackage {
  id: string; name: string; region: string; tag: string; nights: number; days: number
  price: number; hero: string; hero_url?: string | null; description: string
  highlights: string[]; itinerary: import('@/types').ItineraryDay[]; inclusions: string[]; exclusions: string[]; active: boolean
}
interface DBInquiry {
  id: string; name: string; phone: string; email: string | null
  interest: string | null; message: string | null; channel: string | null
  unread: boolean; replied: boolean; created_at: string
}
interface DBPayment {
  id: string; booking_id: string | null; amount: number; method: string
  status: string; razorpay_payment_id: string | null; created_at: string
  bookings?: { booking_ref: string }
}
interface DBCustomer {
  id: string; name: string; phone: string; email: string | null
  city: string | null; created_at: string
}
interface DBTestimonial {
  id: string; customer_name: string; trip: string; rating: number
  body: string; approved: boolean; created_at: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────
const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN')
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const fmtDate = (d: string | null) => d
  ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const fmtDateTime = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

// Collision-resistant booking ref: BK + YYMMDD + 4-digit random
// Does not rely on reading the last row — safe under concurrent inserts
function generateBookingRef(): string {
  const now = new Date()
  const pad = (n: number, l = 2) => String(n).padStart(l, '0')
  const date = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `BK${date}${rand}`
}

function exportCSV(rows: DBBooking[]) {
  const h = ['Ref', 'Customer', 'Phone', 'Package', 'Pax', 'Depart', 'Amount', 'Payment', 'Status']
  const lines = rows.map(r => [
    r.booking_ref, r.customer_name, r.customer_phone, r.package_name,
    r.travelers, r.depart_date ?? '', r.amount, r.payment_status, r.status,
  ].join(','))
  const blob = new Blob([[h.join(','), ...lines].join('\n')], { type: 'text/csv' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'bookings.csv' })
  a.click(); URL.revokeObjectURL(a.href)
}

// ─── shared UI ────────────────────────────────────────────────────────────────
function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, margin: 0, fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</h1>
        {sub && <div style={{ color: 'var(--ink-500)', fontSize: 14, marginTop: 4 }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  )
}

function StatCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 12, color: 'var(--ink-500)', letterSpacing: '0.04em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
        {delta && <Pill color="green" size="sm">{delta}</Pill>}
      </div>
    </div>
  )
}

function Spinner() {
  return <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-400)', fontSize: 14 }}>Loading…</div>
}

// ─── dashboard ────────────────────────────────────────────────────────────────
function AdminDashboard({ onNewBooking, goRoute }: { onNewBooking: () => void; goRoute: (r: string) => void }) {
  const supabase = createBrowserSupabase()
  const [bookings, setBookings] = useState<DBBooking[]>([])
  const [inquiries, setInquiries] = useState<DBInquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    ]).then(([{ data: b }, { data: i }]) => {
      setBookings(b || [])
      setInquiries(i || [])
      setLoading(false)
    })
  }, []) // eslint-disable-line

  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const revenue = confirmed.reduce((s, b) => s + b.amount, 0)
  const avg = confirmed.length ? Math.round(revenue / confirmed.length) : 0

  const activity = [
    ...bookings.slice(0, 3).map(b => ({
      color: b.status === 'confirmed' ? 'var(--forest-600)' : b.status === 'cancelled' ? 'var(--terra-600)' : 'var(--gold-500)',
      title: `${b.booking_ref} ${b.status}`,
      sub: `${b.customer_name} · ${formatINR(b.amount)}`,
      time: fmtDateTime(b.created_at),
    })),
    ...inquiries.slice(0, 2).map(i => ({
      color: 'var(--gold-500)',
      title: `Inquiry via ${i.channel || 'web'}`,
      sub: `${i.name} · ${i.interest || '—'}`,
      time: fmtDateTime(i.created_at),
    })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 4)

  return (
    <div>
      <PageHeader title="Dashboard" sub="All time" actions={
        <><Btn variant="ghost" size="sm" onClick={() => exportCSV(bookings)}>Export CSV</Btn>
          <Btn variant="dark" size="sm" icon={<Ic.plus s={14}/>} onClick={onNewBooking}>New booking</Btn></>
      }/>
      <div style={{ padding: 40 }}>
        {loading ? <Spinner/> : <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
            <StatCard label="Total revenue" value={formatINR(revenue)}/>
            <StatCard label="Confirmed bookings" value={String(confirmed.length)}/>
            <StatCard label="Avg. ticket size" value={avg ? formatINR(avg) : '—'}/>
            <StatCard label="Pending" value={String(bookings.filter(b => b.status === 'pending').length)}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>Recent bookings</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead><tr style={{ color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'left' }}>
                  {['Ref','Customer','Package','Amount','Status'].map(h => <th key={h} style={{ padding: '8px 10px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {bookings.slice(0, 6).map(b => (
                    <tr key={b.id}>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--terra-700)', fontSize: 12 }}>{b.booking_ref}</td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--line)', fontWeight: 600 }}>{b.customer_name}</td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--line)' }}>{b.package_name}</td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(b.amount)}</td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid var(--line)' }}><StatusPill status={cap(b.status)}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => goRoute('bookings')} style={{ marginTop: 12, fontSize: 12, color: 'var(--terra-700)', fontWeight: 600 }}>View all →</button>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>Activity</h3>
              {activity.length === 0 ? <p style={{ color: 'var(--ink-400)', fontSize: 13 }}>No recent activity</p> :
                <div style={{ display: 'grid', gap: 14 }}>
                  {activity.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: i < activity.length - 1 ? '1px dashed var(--line)' : 'none' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 99, background: a.color, marginTop: 6, flexShrink: 0 }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{a.sub}</div>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--ink-300)', whiteSpace: 'nowrap' }}>{a.time}</div>
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
        </>}
      </div>
    </div>
  )
}

// ─── bookings ─────────────────────────────────────────────────────────────────
function AdminBookings({ onNewBooking }: { onNewBooking: () => void }) {
  const supabase = createBrowserSupabase()
  const [bookings, setBookings] = useState<DBBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<DBBooking | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const filtered = bookings.filter(b =>
    (filter === 'all' || b.status === filter) &&
    (b.customer_name.toLowerCase().includes(search.toLowerCase()) || b.booking_ref.toLowerCase().includes(search.toLowerCase()))
  )

  const saveBooking = async () => {
    if (!selected) return
    setSaving(true)
    await supabase.from('bookings').update({ status: editStatus, notes: editNotes }).eq('id', selected.id)
    await load()
    setSaving(false)
    setSelected(null)
  }

  if (selected) return (
    <div>
      <PageHeader title={selected.booking_ref} sub={`${selected.customer_name} · ${selected.package_name}`}
        actions={<><Btn variant="ghost" size="sm" onClick={() => setSelected(null)} icon={<Ic.arrowL s={14}/>}>Back</Btn>
          <Btn variant="dark" size="sm" onClick={saveBooking} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Btn></>}/>
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>Trip details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[['Package', selected.package_name], ['Travellers', `${selected.travelers} pax`],
              ['Departure', fmtDate(selected.depart_date)], ['Email', selected.customer_email || '—'],
              ['Phone', selected.customer_phone]].map(([k, v]) => (
              <div key={k}><div style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div></div>
            ))}
          </div>
          <Field label="Status">
            <Select value={editStatus || selected.status} onChange={e => setEditStatus(e.target.value)}>
              {['pending', 'confirmed', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{cap(s)}</option>)}
            </Select>
          </Field>
          <div style={{ marginTop: 16 }}>
            <Field label="Internal notes">
              <Textarea value={editNotes !== '' ? editNotes : (selected.notes || '')} onChange={e => setEditNotes(e.target.value)} placeholder="Notes visible only to admin…"/>
            </Field>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>Payment</h3>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 600, color: 'var(--terra-700)', letterSpacing: '-0.02em' }}>{formatINR(selected.amount)}</div>
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <StatusPill status={cap(selected.payment_status)}/>
          </div>
          <Field label="Payment status">
            <Select defaultValue={selected.payment_status} onChange={async e => {
              await supabase.from('bookings').update({ payment_status: e.target.value }).eq('id', selected.id)
              setSelected({ ...selected, payment_status: e.target.value })
            }}>
              {['unpaid', 'partial', 'paid'].map(s => <option key={s} value={s}>{cap(s)}</option>)}
            </Select>
          </Field>
          <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
            <Btn variant="ghost" size="sm" full onClick={() => {
              const text = `Dear ${selected.customer_name}, your booking ${selected.booking_ref} for ${selected.package_name} is confirmed. Departure: ${fmtDate(selected.depart_date)}. Amount: ${formatINR(selected.amount)}. — Sonia Travels`
              navigator.clipboard.writeText(text)
            }}>Copy confirmation message</Btn>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Bookings" sub={`${bookings.length} total · ${bookings.filter(b => b.status === 'pending').length} pending`}
        actions={<><Btn variant="ghost" size="sm" onClick={() => exportCSV(filtered)}>Export CSV</Btn>
          <Btn variant="dark" size="sm" icon={<Ic.plus s={14}/>} onClick={onNewBooking}>New booking</Btn></>}/>
      <div style={{ padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: filter === s ? '1px solid var(--ink-900)' : '1px solid var(--line)', background: filter === s ? 'var(--ink-900)' : 'white', color: filter === s ? 'white' : 'var(--ink-700)' }}>
                {cap(s)} <span style={{ opacity: 0.6, marginLeft: 3 }}>{s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length}</span>
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 10, top: 11, color: 'var(--ink-500)' }}><Ic.search s={14}/></span>
            <Input placeholder="Search by name or ref…" style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        {loading ? <Spinner/> : (
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {['Booking', 'Customer', 'Package', 'Depart', 'Amount', 'Payment', 'Status'].map(h => <th key={h} style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} onClick={() => { setSelected(b); setEditStatus(b.status); setEditNotes(b.notes || '') }} style={{ cursor: 'pointer' }}>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--terra-700)' }}>{b.booking_ref}</td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}><div style={{ fontWeight: 600 }}>{b.customer_name}</div><div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{b.customer_phone}</div></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}>{b.package_name} <span style={{ color: 'var(--ink-500)' }}>· {b.travelers} pax</span></td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}>{fmtDate(b.depart_date)}</td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(b.amount)}</td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)', fontSize: 12, color: 'var(--ink-500)' }}>{cap(b.payment_status)}</td>
                    <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}><StatusPill status={cap(b.status)}/></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-400)' }}>No bookings found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── packages ─────────────────────────────────────────────────────────────────
function AdminPackages({ onNewPackage, refreshKey }: { onNewPackage: (pkg?: DBPackage) => void; refreshKey: number }) {
  const supabase = createBrowserSupabase()
  const [packages, setPackages] = useState<DBPackage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('packages').select('*').order('name')
    setPackages(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load, refreshKey])

  const toggleActive = async (pkg: DBPackage) => {
    await supabase.from('packages').update({ active: !pkg.active }).eq('id', pkg.id)
    setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, active: !p.active } : p))
  }

  return (
    <div>
      <PageHeader title="Packages" sub={`${packages.filter(p => p.active).length} active`}
        actions={<Btn variant="dark" size="sm" icon={<Ic.plus s={14}/>} onClick={() => onNewPackage()}>Add package</Btn>}/>
      <div style={{ padding: 40 }}>
        {loading ? <Spinner/> : (
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {['Destination', 'Region', 'Duration', 'Price / pax', 'Status', ''].map(h => <th key={h} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{p.tag}</div>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{p.region}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{p.nights}N · {p.days}D</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(p.price)}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
                      <button onClick={() => toggleActive(p)}>
                        <Pill color={p.active ? 'green' : 'grey'} size="sm">{p.active ? 'Active' : 'Inactive'}</Pill>
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', textAlign: 'right' }}>
                      <button onClick={() => onNewPackage(p)} style={{ fontSize: 12, color: 'var(--terra-700)', fontWeight: 600 }}>Edit</button>
                    </td>
                  </tr>
                ))}
                {packages.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-400)' }}>No packages yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── inquiries ────────────────────────────────────────────────────────────────
function AdminInquiries({ onConvertToBooking }: { onConvertToBooking: (inq: DBInquiry) => void }) {
  const supabase = createBrowserSupabase()
  const [inquiries, setInquiries] = useState<DBInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<DBInquiry | null>(null)
  const [reply, setReply] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    setInquiries(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const select = async (inq: DBInquiry) => {
    setSelected(inq)
    setReply(`Hi ${inq.name.split(' ')[0]}, thanks for reaching out to Sonia Travels! I'd love to put together a personalised itinerary for you. Could you share your preferred travel dates, total number of travellers, and approximate budget per person?`)
    if (inq.unread) {
      await supabase.from('inquiries').update({ unread: false }).eq('id', inq.id)
      setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, unread: false } : i))
    }
  }

  const markReplied = async () => {
    if (!selected) return
    await supabase.from('inquiries').update({ replied: true }).eq('id', selected.id)
    setInquiries(prev => prev.map(i => i.id === selected.id ? { ...i, replied: true } : i))
    setSelected(prev => prev ? { ...prev, replied: true } : null)
  }

  const deleteInquiry = async (id: string) => {
    await supabase.from('inquiries').delete().eq('id', id)
    setInquiries(prev => prev.filter(i => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unreadCount = inquiries.filter(i => i.unread).length

  return (
    <div>
      <PageHeader title="Inquiries" sub={`${unreadCount} unread · ${inquiries.length} total`}/>
      {loading ? <Spinner/> : (
        <div style={{ padding: 40, display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
            {inquiries.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-400)', fontSize: 13 }}>No inquiries yet</div>}
            {inquiries.map(inq => (
              <button key={inq.id} onClick={() => select(inq)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '16px 18px', borderBottom: '1px solid var(--line)', background: selected?.id === inq.id ? 'var(--sand-100)' : inq.unread ? 'rgba(199,152,73,0.05)' : 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {inq.name}
                    {inq.unread && <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--terra-600)', display: 'inline-block', marginLeft: 6, verticalAlign: 'middle' }}/>}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>{fmtDateTime(inq.created_at)}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 4 }}>{inq.phone} · {inq.channel || 'web'}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-700)' }}>{inq.interest || inq.message || '—'}</div>
                {inq.replied && <Pill color="forest" size="sm" >Replied</Pill>}
              </button>
            ))}
          </div>
          {selected ? (
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, margin: 0, fontWeight: 500 }}>{selected.name}</h3>
                  <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>{selected.phone}{selected.email ? ` · ${selected.email}` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Pill color={selected.channel === 'WhatsApp' ? 'green' : 'sand'}>{selected.channel || 'Web'}</Pill>
                  {selected.replied && <Pill color="forest">Replied</Pill>}
                </div>
              </div>
              {selected.interest && (
                <div style={{ background: 'var(--sand-100)', padding: 16, borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', marginBottom: 6 }}>INTEREST</div>
                  {selected.interest}
                </div>
              )}
              {selected.message && (
                <div style={{ background: 'var(--sand-100)', padding: 16, borderRadius: 10, marginBottom: 16, fontSize: 14 }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', marginBottom: 6 }}>MESSAGE</div>
                  {selected.message}
                </div>
              )}
              <Field label="WhatsApp reply">
                <Textarea value={reply} onChange={e => setReply(e.target.value)} style={{ minHeight: 120 }}/>
              </Field>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="ghost" size="sm" onClick={() => deleteInquiry(selected.id)}>Delete</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => onConvertToBooking(selected)}>Convert to booking</Btn>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!selected.replied && <Btn variant="ghost" size="sm" onClick={markReplied}>Mark replied</Btn>}
                  <Btn variant="whatsapp" size="sm" icon={<Ic.whatsapp s={14}/>}
                    onClick={() => window.open(waLink(selected.phone, reply), '_blank')}>
                    Send via WhatsApp
                  </Btn>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--ink-400)', fontSize: 14 }}>
              Select an inquiry to view details
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── payments ─────────────────────────────────────────────────────────────────
function AdminPayments() {
  const supabase = createBrowserSupabase()
  const [payments, setPayments] = useState<DBPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('payments').select('*, bookings(booking_ref)').order('created_at', { ascending: false })
      .then(({ data }) => { setPayments(data || []); setLoading(false) })
  }, []) // eslint-disable-line

  const captured = payments.filter(p => p.status === 'captured').reduce((s, p) => s + p.amount, 0)
  const refunded = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      <PageHeader title="Payments" sub="Razorpay live mode"/>
      <div style={{ padding: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Captured (all time)" value={formatINR(captured)}/>
          <StatCard label="Refunded" value={formatINR(refunded)}/>
          <StatCard label="Total transactions" value={String(payments.length)}/>
          <StatCard label="Failed" value={String(payments.filter(p => p.status === 'failed').length)}/>
        </div>
        {loading ? <Spinner/> : (
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {['Payment ID', 'Booking', 'Method', 'Amount', 'Status', 'When'].map(h => <th key={h} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontSize: 12 }}>{p.razorpay_payment_id || p.id.slice(0, 12) + '…'}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--terra-700)' }}>{(p.bookings as { booking_ref: string } | undefined)?.booking_ref || '—'}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{p.method}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(p.amount)}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}><StatusPill status={cap(p.status)}/></td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', color: 'var(--ink-500)' }}>{fmtDateTime(p.created_at)}</td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-400)' }}>No payments yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── customers ────────────────────────────────────────────────────────────────
function AdminCustomers() {
  const supabase = createBrowserSupabase()
  const [customers, setCustomers] = useState<DBCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('customers').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCustomers(data || []); setLoading(false) })
  }, []) // eslint-disable-line

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader title="Customers" sub={`${customers.length} total`}/>
      <div style={{ padding: 40 }}>
        <div style={{ marginBottom: 16, position: 'relative', maxWidth: 320 }}>
          <span style={{ position: 'absolute', left: 10, top: 11, color: 'var(--ink-500)' }}><Ic.search s={14}/></span>
          <Input placeholder="Search by name or phone…" style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        {loading ? <Spinner/> : (
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {['Name', 'Phone', 'Email', 'City', 'Since'].map(h => <th key={h} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)' }}>{c.phone}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', color: 'var(--ink-500)' }}>{c.email || '—'}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{c.city || '—'}</td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', color: 'var(--ink-500)' }}>{fmtDate(c.created_at)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--ink-400)' }}>No customers found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── reviews ──────────────────────────────────────────────────────────────────
function AdminReviews() {
  const supabase = createBrowserSupabase()
  const [reviews, setReviews] = useState<DBTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  const load = useCallback(async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setReviews(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const toggle = async (id: string, approved: boolean) => {
    await supabase.from('testimonials').update({ approved }).eq('id', id)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r))
  }

  const del = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id)
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  const filtered = reviews.filter(r =>
    filter === 'all' ? true : filter === 'approved' ? r.approved : !r.approved
  )

  return (
    <div>
      <PageHeader title="Reviews" sub={`${reviews.filter(r => r.approved).length} approved · ${reviews.filter(r => !r.approved).length} pending`}/>
      <div style={{ padding: 40 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: filter === f ? '1px solid var(--ink-900)' : '1px solid var(--line)', background: filter === f ? 'var(--ink-900)' : 'white', color: filter === f ? 'white' : 'var(--ink-700)' }}>
              {cap(f)} <span style={{ opacity: 0.6, marginLeft: 3 }}>{f === 'all' ? reviews.length : f === 'approved' ? reviews.filter(r => r.approved).length : reviews.filter(r => !r.approved).length}</span>
            </button>
          ))}
        </div>
        {loading ? <Spinner/> : (
          <div style={{ display: 'grid', gap: 16 }}>
            {filtered.map(r => (
              <div key={r.id} style={{ background: 'white', border: `1px solid ${r.approved ? 'var(--line)' : 'var(--terra-100)'}`, borderRadius: 12, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{r.customer_name}</span>
                      <span style={{ fontSize: 12, color: 'var(--ink-500)' }}>{r.trip}</span>
                      <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <Pill color={r.approved ? 'green' : 'gold'} size="sm">{r.approved ? 'Live' : 'Pending'}</Pill>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6 }}>{r.body}</p>
                    <div style={{ fontSize: 11, color: 'var(--ink-400)', marginTop: 8 }}>{fmtDate(r.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    {r.approved
                      ? <Btn variant="ghost" size="sm" onClick={() => toggle(r.id, false)}>Unpublish</Btn>
                      : <Btn variant="dark" size="sm" onClick={() => toggle(r.id, true)}>Approve</Btn>
                    }
                    <Btn variant="danger" size="sm" onClick={() => del(r.id)}>Delete</Btn>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: 60, textAlign: 'center', color: 'var(--ink-400)', background: 'white', border: '1px solid var(--line)', borderRadius: 12 }}>No reviews in this category</div>}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── content ──────────────────────────────────────────────────────────────────
const SECTION_LABELS: Record<string, string> = {
  business: 'Business Info', contact: 'Contact Details', hero: 'Hero Section',
  about: 'About Page', stats: 'Stats & Numbers', images: 'Images & Media', social: 'Social Links',
}

function AdminContent() {
  const supabase = createBrowserSupabase()
  const [rows, setRows] = useState<ContentRow[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('site_content').select('*').order('section').order('key').then(({ data }) => {
      if (data) { setRows(data); const m: Record<string, string> = {}; data.forEach((r: ContentRow) => { m[r.key] = r.value ?? '' }); setValues(m) }
      setLoading(false)
    })
  }, []) // eslint-disable-line

  const handleSave = async () => {
    setSaving(true)
    await Promise.all(Object.entries(values).map(([key, value]) =>
      supabase.from('site_content').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
    ))
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <div><PageHeader title="Content"/><Spinner/></div>

  return (
    <div>
      <PageHeader title="Content" sub="Changes go live as soon as you save"
        actions={<Btn variant="dark" size="md" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save all changes'}</Btn>}/>
      <div style={{ padding: 40, display: 'grid', gap: 24 }}>
        {[...new Set(rows.map(r => r.section))].map(section => (
          <div key={section} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', background: 'var(--sand-50)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500 }}>{SECTION_LABELS[section] || section}</div>
            </div>
            <div style={{ padding: 24, display: 'grid', gap: 18 }}>
              {rows.filter(r => r.section === section).map(row => (
                <Field key={row.key} label={row.label}>
                  {row.type === 'textarea'
                    ? <Textarea value={values[row.key] ?? ''} onChange={e => setValues(v => ({ ...v, [row.key]: e.target.value }))}/>
                    : <Input value={values[row.key] ?? ''} onChange={e => setValues(v => ({ ...v, [row.key]: e.target.value }))}/>
                  }
                </Field>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="dark" size="lg" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : saved ? '✓ All saved' : 'Save all changes'}</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── settings ─────────────────────────────────────────────────────────────────
function AdminSettings() {
  const supabase = createBrowserSupabase()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [bizName, setBizName] = useState('Sonia Tour and Travels')
  const [address, setAddress] = useState('Opposite Gurudwara, Near TCP Gate, Defence Road, Mamoon, Pathankot - 145001')
  const [phone, setPhone] = useState('+91 84602 22809')

  const save = async () => {
    setSaving(true)
    await Promise.all([
      supabase.from('site_content').upsert({ key: 'biz_name', value: bizName, label: 'Business name', section: 'business', type: 'text' }),
      supabase.from('site_content').upsert({ key: 'biz_address', value: address, label: 'Address', section: 'business', type: 'textarea' }),
      supabase.from('site_content').upsert({ key: 'contact_phone', value: phone, label: 'Support phone', section: 'contact', type: 'text' }),
    ])
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageHeader title="Settings"/>
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '0 0 4px', fontWeight: 500 }}>Business profile</h3>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 20 }}>Synced to site content</div>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Business name"><Input value={bizName} onChange={e => setBizName(e.target.value)}/></Field>
            <Field label="Address"><Textarea value={address} onChange={e => setAddress(e.target.value)}/></Field>
            <Field label="Support phone"><Input value={phone} onChange={e => setPhone(e.target.value)}/></Field>
            <Btn variant="dark" size="sm" onClick={save} disabled={saving}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}</Btn>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '0 0 4px', fontWeight: 500 }}>Razorpay integration</h3>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 20 }}>Live mode · manage keys in Vercel env vars</div>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Key ID"><Input value="RAZORPAY_KEY_ID (set in Vercel)" readOnly style={{ color: 'var(--ink-400)' }}/></Field>
            <Field label="Webhook URL"><Input value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/razorpay/webhook`} readOnly/></Field>
          </div>
          <div style={{ marginTop: 16, padding: 14, background: 'var(--sand-100)', borderRadius: 8, fontSize: 12, color: 'var(--ink-600)' }}>
            Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your Vercel environment variables.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── new booking modal ────────────────────────────────────────────────────────
interface NewBookingModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  prefill?: { name?: string; phone?: string; interest?: string }
}

function NewBookingModal({ open, onClose, onSaved, prefill }: NewBookingModalProps) {
  const supabase = createBrowserSupabase()
  const [packages, setPackages] = useState<DBPackage[]>([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', pkg: '', pkgName: '', travelers: '2', depart: '', amount: '', notes: '', payment: 'unpaid' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      supabase.from('packages').select('id,name,price').eq('active', true).order('name')
        .then(({ data }) => setPackages((data as DBPackage[]) || []))
      setForm(f => ({ ...f, name: prefill?.name || '', phone: prefill?.phone || '', notes: prefill?.interest || '' }))
    }
  }, [open]) // eslint-disable-line

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handlePkgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkg = packages.find(p => p.id === e.target.value)
    setForm(f => ({ ...f, pkg: e.target.value, pkgName: pkg?.name || e.target.value, amount: pkg ? String(pkg.price * parseInt(f.travelers || '1', 10)) : f.amount }))
  }

  const submit = async () => {
    if (!form.name || !form.phone || !form.pkgName) { setError('Name, phone and package are required.'); return }
    setSaving(true); setError('')
    const ref = generateBookingRef()
    const { error: err } = await supabase.from('bookings').insert({
      booking_ref: ref,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || null,
      package_id: form.pkg || null,
      package_name: form.pkgName,
      travelers: parseInt(form.travelers, 10) || 1,
      depart_date: form.depart || null,
      amount: parseInt(form.amount, 10) || 0,
      status: 'pending',
      payment_status: form.payment,
      notes: form.notes || null,
    })
    if (err) { setError(err.message); setSaving(false); return }
    // upsert customer
    await supabase.from('customers').upsert({ name: form.name, phone: form.phone, email: form.email || null }, { onConflict: 'phone' })
    setSaving(false)
    onSaved(); onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New booking" sub="Create a manual booking"
      actions={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="dark" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Create booking'}</Btn></>}>
      {error && <div style={{ background: '#fadcd6', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)', marginBottom: 16 }}>{error}</div>}
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Customer name"><Input value={form.name} onChange={set('name')} placeholder="Full name" required/></Field>
          <Field label="Phone"><Input value={form.phone} onChange={set('phone')} placeholder="+91 …" required/></Field>
        </div>
        <Field label="Email (optional)"><Input value={form.email} onChange={set('email')} placeholder="email@example.com" type="email"/></Field>
        <Field label="Package">
          <Select value={form.pkg} onChange={handlePkgChange}>
            <option value="">— Custom / other —</option>
            {packages.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.price}/pax)</option>)}
          </Select>
        </Field>
        {!form.pkg && <Field label="Package name"><Input value={form.pkgName} onChange={set('pkgName')} placeholder="e.g. Ladakh Custom Tour"/></Field>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Field label="Travellers"><Input type="number" value={form.travelers} onChange={set('travelers')} min="1" max="30"/></Field>
          <Field label="Departure"><Input type="date" value={form.depart} onChange={set('depart')}/></Field>
          <Field label="Amount (₹)"><Input type="number" value={form.amount} onChange={set('amount')} placeholder="0"/></Field>
        </div>
        <Field label="Payment status">
          <Select value={form.payment} onChange={set('payment')}>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </Select>
        </Field>
        <Field label="Internal notes"><Textarea value={form.notes} onChange={set('notes')} placeholder="Any notes for the team…"/></Field>
      </div>
    </Modal>
  )
}

// ─── shell ────────────────────────────────────────────────────────────────────
export function AdminShell({ user }: { user: UserInfo }) {
  const supabase = createBrowserSupabase()
  const [route, setRoute] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [showPackageModal, setShowPackageModal] = useState(false)
  const [editPkg, setEditPkg] = useState<DBPackage | undefined>(undefined)
  const [pkgRefreshKey, setPkgRefreshKey] = useState(0)
  const [bookingPrefill, setBookingPrefill] = useState<{ name?: string; phone?: string; interest?: string } | undefined>(undefined)
  const [pendingCount, setPendingCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadCounts = useCallback(async () => {
    const [{ count: p }, { count: u }] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('unread', true),
    ])
    setPendingCount(p || 0)
    setUnreadCount(u || 0)
  }, [supabase])

  useEffect(() => { loadCounts() }, [loadCounts])

  const goRoute = (id: string) => { setRoute(id); setDrawerOpen(false) }
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = '/account/login' }
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const nav = [
    { id: 'dashboard', l: 'Dashboard', ic: Ic.chart },
    { id: 'bookings',  l: 'Bookings',  ic: Ic.cal,   badge: pendingCount || undefined },
    { id: 'packages',  l: 'Packages',  ic: Ic.pkg },
    { id: 'inquiries', l: 'Inquiries', ic: Ic.inbox,  badge: unreadCount || undefined },
    { id: 'payments',  l: 'Payments',  ic: Ic.card },
    { id: 'customers', l: 'Customers', ic: Ic.users },
    { id: 'reviews',   l: 'Reviews',   ic: Ic.star },
    { id: 'content',   l: 'Content',   ic: Ic.cog },
    { id: 'settings',  l: 'Settings',  ic: Ic.cog },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: '#f6f4ef', position: 'relative' }}>
      {/* mobile top bar */}
      <div className="admin-mobile-bar" style={{ display: 'none', position: 'sticky', top: 0, zIndex: 40, background: 'var(--ink-900)', color: 'var(--sand-100)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <button onClick={() => setDrawerOpen(true)} style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'var(--sand-100)', display: 'grid', placeItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold-500)' }}>ADMIN</div>
          <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'capitalize' }}>{route}</div>
        </div>
        <a href="/" style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'var(--sand-100)', display: 'grid', placeItems: 'center' }}><Ic.arrowL s={16}/></a>
      </div>

      <div className={`admin-drawer-scrim ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}/>

      <aside className={`admin-sidebar ${drawerOpen ? 'drawer-open' : ''}`} style={{ background: 'var(--ink-900)', color: 'var(--sand-100)', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: '8px 24px 24px', borderBottom: '1px solid #2a2520', marginBottom: 12, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div><Logo dark/><div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold-500)', marginTop: 8 }}>ADMIN CONSOLE</div></div>
          <button className="admin-drawer-close" onClick={() => setDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, color: 'var(--sand-300)', display: 'none', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6L18 18M6 18L18 6"/></svg>
          </button>
        </div>

        {nav.map(n => {
          const I = n.ic; const active = route === n.id
          return (
            <button key={n.id} onClick={() => goRoute(n.id)} style={{ margin: '0 12px', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: active ? 'rgba(199,152,73,0.12)' : 'transparent', color: active ? 'var(--gold-500)' : 'var(--sand-300)', fontSize: 13, fontWeight: 500, borderLeft: active ? '2px solid var(--gold-500)' : '2px solid transparent', paddingLeft: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><I s={16}/>{n.l}</span>
              {n.badge ? <span style={{ background: 'var(--terra-600)', color: 'white', padding: '1px 7px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>{n.badge}</span> : null}
            </button>
          )
        })}

        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid #2a2520' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {user.avatar
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={user.avatar} alt={user.name} style={{ width: 34, height: 34, borderRadius: 99, border: '2px solid rgba(255,255,255,0.1)' }}/>
              : <div style={{ width: 34, height: 34, borderRadius: 99, background: 'var(--terra-600)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials}</div>
            }
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sand-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="/" style={{ flex: 1, fontSize: 12, color: 'var(--sand-300)', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)' }}>
              <Ic.arrowL s={12}/> Website
            </a>
            <button onClick={handleLogout} style={{ flex: 1, fontSize: 12, color: 'var(--sand-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main style={{ overflow: 'auto' }}>
        {route === 'dashboard' && <AdminDashboard onNewBooking={() => { setBookingPrefill(undefined); setShowNewBooking(true) }} goRoute={goRoute}/>}
        {route === 'bookings'  && <AdminBookings onNewBooking={() => { setBookingPrefill(undefined); setShowNewBooking(true) }}/>}
        {route === 'packages'  && <AdminPackages onNewPackage={pkg => { setEditPkg(pkg); setShowPackageModal(true) }} refreshKey={pkgRefreshKey}/>}
        {route === 'inquiries' && <AdminInquiries onConvertToBooking={inq => { setBookingPrefill({ name: inq.name, phone: inq.phone, interest: inq.interest || inq.message || '' }); setShowNewBooking(true); goRoute('bookings') }}/>}
        {route === 'payments'  && <AdminPayments/>}
        {route === 'customers' && <AdminCustomers/>}
        {route === 'reviews'   && <AdminReviews/>}
        {route === 'content'   && <AdminContent/>}
        {route === 'settings'  && <AdminSettings/>}
      </main>

      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)} onSaved={loadCounts} prefill={bookingPrefill}/>
      <PackageModal open={showPackageModal} onClose={() => { setShowPackageModal(false); setEditPkg(undefined) }} onSaved={() => setPkgRefreshKey(k => k + 1)} pkg={editPkg}/>
    </div>
  )
}
