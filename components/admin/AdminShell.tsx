'use client'
import { useState, useEffect, useCallback } from 'react'
import { Logo } from '@/components/ui/Logo'
import { Btn, StatusPill, Pill } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { Field, Input, Select, Textarea } from '@/components/ui/Form'
import { Modal } from '@/components/ui/Modal'
import { BOOKINGS, INQUIRIES, PAYMENTS, PACKAGES, formatINR } from '@/lib/data'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { Booking } from '@/types'

interface UserInfo { name: string; email: string; avatar: string }
interface ContentRow { key: string; value: string; type: string; label: string; section: string }

const nav = [
  { id: 'dashboard',  l: 'Dashboard',   ic: Ic.chart },
  { id: 'bookings',   l: 'Bookings',    ic: Ic.cal, badge: '23' },
  { id: 'packages',   l: 'Packages',    ic: Ic.pkg },
  { id: 'inquiries',  l: 'Inquiries',   ic: Ic.inbox, badge: '2' },
  { id: 'payments',   l: 'Payments',    ic: Ic.card },
  { id: 'customers',  l: 'Customers',   ic: Ic.users },
  { id: 'reviews',    l: 'Reviews',     ic: Ic.star },
  { id: 'content',    l: 'Content',     ic: Ic.cog },
  { id: 'settings',   l: 'Settings',    ic: Ic.cog },
]

function PageHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="admin-page-head" style={{ padding: '32px 40px 24px', borderBottom: '1px solid var(--line)', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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

function BookingsTable({ rows, onSelect }: { rows: Booking[]; onSelect?: (b: Booking) => void }) {
  return (
    <div style={{ overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {['Booking','Customer','Package','Depart','Amount','Payment','Status'].map(h => (
              <th key={h} style={{ padding: '10px 12px', borderBottom: '1px solid var(--line)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} onClick={() => onSelect?.(r)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--terra-700)' }}>{r.id}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}><div style={{ fontWeight: 600 }}>{r.customer}</div><div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{r.phone}</div></td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}>{r.package} <span style={{ color: 'var(--ink-500)' }}>· {r.travelers} pax</span></td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}>{r.depart}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(r.amount)}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)', fontSize: 12, color: 'var(--ink-500)' }}>{r.payment}</td>
              <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--line)' }}><StatusPill status={r.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminDashboard({ onNewBooking, goRoute }: { onNewBooking: () => void; goRoute: (r: string) => void }) {
  return (
    <div>
      <PageHeader title="Dashboard" sub="Last 30 days" actions={<><Btn variant="ghost" size="sm">Export CSV</Btn><Btn variant="dark" size="sm" icon={<Ic.plus s={14}/>} onClick={onNewBooking}>New booking</Btn></>}/>
      <div className="admin-page-pad" style={{ padding: 40 }}>
        <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard label="Revenue (30d)" value="₹3.42L" delta="+18%"/>
          <StatCard label="Confirmed bookings" value="47" delta="+12%"/>
          <StatCard label="Avg. ticket size" value="₹12,400" delta="+4%"/>
          <StatCard label="Conversion" value="38%" delta="+6 pp"/>
        </div>
        <div className="admin-row-2" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 20 }}>
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>Revenue by destination</h3>
            {[{l:'Ladakh',v:135000,c:'var(--ink-700)'},{l:'Manali',v:86000,c:'var(--terra-600)'},{l:'Kerala',v:72000,c:'var(--forest-600)'},{l:'Himachal',v:54000,c:'var(--terra-700)'},{l:'Ooty',v:18900,c:'var(--forest-700)'}].map(d => (
              <div key={d.l} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-700)', width: 72, textAlign: 'right' }}>{d.l}</div>
                <div style={{ flex: 1, background: 'var(--sand-100)', borderRadius: 4, height: 20, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: d.c, borderRadius: 4, width: `${(d.v/135000)*100}%` }}/>
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--ink-500)', width: 52 }}>{formatINR(d.v)}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
            <h3 style={{ margin: '0 0 20px', fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>Activity</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              {[{c:'var(--forest-600)',t:'STT-2614 confirmed',s:'Anjali Sharma · ₹28,800',time:'12 min ago'},{c:'var(--gold-500)',t:'Inquiry from WhatsApp',s:'Aarav Khanna · Ladakh',time:'38 min ago'},{c:'var(--forest-600)',t:'Payment captured',s:'pay_NxR2k9LpMq · ₹28,800',time:'1 hr ago'},{c:'var(--terra-600)',t:'Refund processed',s:'STT-2609 · ₹14,400',time:'Yesterday'}].map((a,i) => (
                <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: i<3 ? '1px dashed var(--line)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: a.c, marginTop: 6, flexShrink: 0 }}/>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{a.t}</div><div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{a.s}</div></div>
                  <div style={{ fontSize: 11, color: 'var(--ink-300)' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500 }}>Latest bookings</h3>
            <button onClick={() => goRoute('bookings')} style={{ fontSize: 12, color: 'var(--terra-700)', fontWeight: 600 }}>View all →</button>
          </div>
          <BookingsTable rows={BOOKINGS.slice(0,5)}/>
        </div>
      </div>
    </div>
  )
}

function AdminBookings({ onNewBooking }: { onNewBooking: () => void }) {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Booking | null>(null)
  const filtered = BOOKINGS.filter(b => (filter === 'All' || b.status === filter) && (b.customer.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())))

  if (selected) return (
    <div>
      <PageHeader title={selected.id} sub={`${selected.customer} · ${selected.package}`} actions={<><Btn variant="ghost" size="sm" onClick={() => setSelected(null)} icon={<Ic.arrowL s={14}/>}>Back</Btn><Btn variant="dark" size="sm">Edit booking</Btn></>}/>
      <div className="admin-page-pad admin-detail-grid" style={{ padding: 40, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>Trip details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['Package',selected.package],['Travellers',`${selected.travelers} adults`],['Departure',selected.depart],['Status',selected.status],['Payment',selected.payment]].map(([k,v]) => (
              <div key={k}><div style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div><div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div></div>
            ))}
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500 }}>Amount</h3>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 600, color: 'var(--terra-700)', letterSpacing: '-0.02em' }}>{formatINR(selected.amount)}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 16 }}>Paid via {selected.payment}</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <Btn variant="ghost" size="sm" full>Download invoice</Btn>
            {selected.status === 'Confirmed' && <Btn variant="danger" size="sm" full>Initiate refund</Btn>}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <PageHeader title="Bookings" sub={`${BOOKINGS.length} total · ${BOOKINGS.filter(b=>b.status==='Pending').length} need attention`} actions={<><Btn variant="ghost" size="sm">Export</Btn><Btn variant="dark" size="sm" icon={<Ic.plus s={14}/>} onClick={onNewBooking}>New booking</Btn></>}/>
      <div className="admin-page-pad" style={{ padding: 40 }}>
        <div className="admin-bookings-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['All','Confirmed','Pending','Cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, border: filter === s ? '1px solid var(--ink-900)' : '1px solid var(--line)', background: filter === s ? 'var(--ink-900)' : 'white', color: filter === s ? 'white' : 'var(--ink-700)' }}>
                {s} <span style={{ opacity: 0.6, marginLeft: 4 }}>{s === 'All' ? BOOKINGS.length : BOOKINGS.filter(b=>b.status===s).length}</span>
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', width: 280 }}>
            <span style={{ position: 'absolute', left: 10, top: 11, color: 'var(--ink-500)' }}><Ic.search s={14}/></span>
            <Input placeholder="Search by name or ID…" style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'auto' }}>
          <BookingsTable rows={filtered} onSelect={setSelected}/>
        </div>
      </div>
    </div>
  )
}

function AdminPackages({ onNewPackage }: { onNewPackage: () => void }) {
  return (
    <div>
      <PageHeader title="Packages" sub={`${PACKAGES.length} active`} actions={<Btn variant="dark" size="sm" icon={<Ic.plus s={14}/>} onClick={onNewPackage}>Add package</Btn>}/>
      <div style={{ padding: 40 }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{['Destination','Region','Duration','Price from','Status',''].map(h=><th key={h} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {PACKAGES.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><div className={`ph-img ${p.hero}`} style={{ width: 48, height: 48, borderRadius: 6 }}/><div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 11, color: 'var(--ink-500)' }}>{p.tag}</div></div></div></td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{p.region}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{p.nights}N · {p.days}D</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(p.price)}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}><Pill color="green" size="sm">Active</Pill></td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', textAlign: 'right' }}><button style={{ fontSize: 12, color: 'var(--terra-700)', fontWeight: 600 }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminInquiries() {
  const [selected, setSelected] = useState(INQUIRIES[0])
  return (
    <div>
      <PageHeader title="Inquiries" sub={`${INQUIRIES.filter(i=>i.unread).length} unread`}/>
      <div className="admin-page-pad admin-inq-grid" style={{ padding: 40, display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          {INQUIRIES.map(inq => (
            <button key={inq.id} onClick={() => setSelected(inq)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '16px 18px', borderBottom: '1px solid var(--line)', background: selected?.id === inq.id ? 'var(--sand-100)' : (inq.unread ? 'rgba(199,152,73,0.05)' : 'white') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{inq.name} {inq.unread && <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--terra-600)', display: 'inline-block', marginLeft: 4, verticalAlign: 'middle' }}/>}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-500)' }}>{inq.at}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 6 }}>{inq.phone} · {inq.channel}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-700)' }}>{inq.interest}</div>
            </button>
          ))}
        </div>
        {selected && (
          <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div><h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, margin: 0, fontWeight: 500 }}>{selected.name}</h3><div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>{selected.phone} · via {selected.channel}</div></div>
              <Pill color={selected.channel === 'WhatsApp' ? 'green' : 'sand'}>{selected.channel}</Pill>
            </div>
            <div style={{ background: 'var(--sand-100)', padding: 16, borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-500)', letterSpacing: '0.1em', marginBottom: 6 }}>INTEREST</div>
              {selected.interest}
            </div>
            <h4 style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 8px', fontWeight: 500 }}>Quick reply</h4>
            <Textarea placeholder="Hi, thanks for reaching out…" defaultValue={`Hi ${selected.name.split(' ')[0]}, thanks for the interest! I'd be happy to put together an itinerary. A few quick questions — preferred travel dates, total travellers and approximate budget per person?`}/>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <Btn variant="ghost" size="sm">Convert to booking</Btn>
              <Btn variant="whatsapp" size="sm" icon={<Ic.whatsapp s={14}/>}>Send via WhatsApp</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AdminPayments() {
  return (
    <div>
      <PageHeader title="Payments" sub="Razorpay live mode"/>
      <div className="admin-page-pad" style={{ padding: 40 }}>
        <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Captured (30d)" value="₹3.42L"/><StatCard label="Refunded" value="₹14,400"/><StatCard label="Settlement next" value="₹68,200"/><StatCard label="Failed" value="2"/>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{['Payment ID','Booking','Method','Amount','Status','When'].map(h=><th key={h} style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {PAYMENTS.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontSize: 12 }}>{p.id}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--terra-700)' }}>{p.booking}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>{p.method}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{formatINR(p.amount)}</td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}><StatusPill status={p.status}/></td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', color: 'var(--ink-500)' }}>{p.at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminSettings() {
  return (
    <div>
      <PageHeader title="Settings"/>
      <div className="admin-page-pad grid-2" style={{ padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '0 0 4px', fontWeight: 500 }}>Razorpay integration</h3>
          <div style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 20 }}>Live mode connected</div>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Key ID"><Input defaultValue="rzp_live_NxR2k9LpMqSt7v" readOnly/></Field>
            <Field label="Key secret"><Input type="password" defaultValue="••••••••••••••••" readOnly/></Field>
            <Field label="Webhook URL"><Input defaultValue="https://soniatravels.in/api/razorpay/webhook" readOnly/></Field>
          </div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, margin: '0 0 20px', fontWeight: 500 }}>Business profile</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <Field label="Business name"><Input defaultValue="Sonia Tour and Travels"/></Field>
            <Field label="Address"><Textarea defaultValue="Opposite Gurudwara, Near TCP Gate, Defence Road, Mamoon, Pathankot - 145001"/></Field>
            <Field label="Support phone"><Input defaultValue="+91 84602 22809"/></Field>
            <Btn variant="dark" size="sm">Save changes</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

const SECTION_LABELS: Record<string, string> = {
  business: 'Business Info',
  contact:  'Contact Details',
  hero:     'Hero Section',
  about:    'About Page',
  stats:    'Stats & Numbers',
  images:   'Images & Media',
  social:   'Social Links',
}

function AdminContent() {
  const supabase = createBrowserSupabase()
  const [rows, setRows] = useState<ContentRow[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('site_content').select('*').order('section').order('key')
    if (data) {
      setRows(data)
      const map: Record<string, string> = {}
      data.forEach((r: ContentRow) => { map[r.key] = r.value ?? '' })
      setValues(map)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    setSaving(true)
    const updates = Object.entries(values).map(([key, value]) =>
      supabase.from('site_content').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
    )
    await Promise.all(updates)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const sections = [...new Set(rows.map(r => r.section))]

  if (loading) {
    return (
      <div>
        <PageHeader title="Content" sub="Edit website text, images and contact details"/>
        <div style={{ padding: 40, color: 'var(--ink-500)' }}>Loading…</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Content"
        sub="Changes go live as soon as you save"
        actions={
          <Btn variant="dark" size="md" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save all changes'}
          </Btn>
        }
      />
      <div style={{ padding: 40, display: 'grid', gap: 24 }}>
        {sections.map(section => {
          const sectionRows = rows.filter(r => r.section === section)
          return (
            <div key={section} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', background: 'var(--sand-50)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 500 }}>{SECTION_LABELS[section] || section}</div>
                <Pill color="sand" size="sm">{sectionRows.length} fields</Pill>
              </div>
              <div style={{ padding: 24, display: 'grid', gap: 18 }}>
                {sectionRows.map(row => (
                  <Field key={row.key} label={row.label}>
                    {row.type === 'textarea' ? (
                      <Textarea
                        value={values[row.key] ?? ''}
                        onChange={e => setValues(v => ({ ...v, [row.key]: e.target.value }))}
                        placeholder={`Enter ${row.label.toLowerCase()}…`}
                      />
                    ) : (
                      <Input
                        value={values[row.key] ?? ''}
                        onChange={e => setValues(v => ({ ...v, [row.key]: e.target.value }))}
                        placeholder={section === 'images' || section === 'social' ? 'https://…' : `Enter ${row.label.toLowerCase()}…`}
                      />
                    )}
                    {section === 'images' && values[row.key] && (
                      <div style={{ marginTop: 8 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={values[row.key]}
                          alt={row.label}
                          style={{ maxWidth: 200, maxHeight: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--line)' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                    )}
                  </Field>
                ))}
              </div>
            </div>
          )
        })}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="dark" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ All saved' : 'Save all changes'}
          </Btn>
        </div>
      </div>
    </div>
  )
}

function NewBookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false); setDone(true)
    setTimeout(() => { setDone(false); onClose() }, 1200)
  }
  return (
    <Modal open={open} onClose={onClose} title="New booking" sub="Create a manual booking"
      actions={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="dark" onClick={handleSave}>{saving ? 'Saving…' : done ? '✓ Saved' : 'Create booking'}</Btn></>}>
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Customer name"><Input placeholder="Full name"/></Field>
          <Field label="Phone"><Input placeholder="+91 …"/></Field>
        </div>
        <Field label="Package">
          <Select defaultValue=""><option value="" disabled>Select package</option>{PACKAGES.map(p=><option key={p.id}>{p.name}</option>)}<option>Custom itinerary</option></Select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Field label="Travellers"><Input type="number" defaultValue="2" min="1" max="15"/></Field>
          <Field label="Departure"><Input type="date"/></Field>
          <Field label="Payment mode"><Select><option>Razorpay link</option><option>Cash</option><option>Pay later</option></Select></Field>
        </div>
        <Field label="Internal notes"><Textarea placeholder="Any notes for the team…"/></Field>
      </div>
    </Modal>
  )
}

function NewPackageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Add package" sub="Create a new tour package"
      actions={<><Btn variant="ghost" onClick={onClose}>Cancel</Btn><Btn variant="dark">Save package</Btn></>}>
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Destination name"><Input placeholder="e.g. Spiti Valley"/></Field>
          <Field label="Region"><Input placeholder="e.g. Himachal Pradesh"/></Field>
        </div>
        <Field label="Short description"><Textarea placeholder="One-liner about the destination…"/></Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Field label="Nights"><Input type="number" defaultValue="4"/></Field>
          <Field label="Days"><Input type="number" defaultValue="5"/></Field>
          <Field label="Price / pax (₹)"><Input type="number" defaultValue="7200"/></Field>
        </div>
        <Field label="Tags"><Input placeholder="Mountains, Beach, Heritage…"/></Field>
      </div>
    </Modal>
  )
}

export function AdminShell({ user }: { user: UserInfo }) {
  const supabase = createBrowserSupabase()
  const [route, setRoute] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [showNewPackage, setShowNewPackage] = useState(false)
  const goRoute = (id: string) => { setRoute(id); setDrawerOpen(false) }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="admin-shell" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: '#f6f4ef', position: 'relative' }}>
      {/* Mobile top bar */}
      <div className="admin-mobile-bar" style={{ display: 'none', position: 'sticky', top: 0, zIndex: 40, background: 'var(--ink-900)', color: 'var(--sand-100)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid #2a2520' }}>
        <button onClick={() => setDrawerOpen(true)} aria-label="Menu" style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'var(--sand-100)', display: 'grid', placeItems: 'center' }}>
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
        <div className="admin-sidebar-head" style={{ padding: '8px 24px 24px', borderBottom: '1px solid #2a2520', marginBottom: 12, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div><Logo dark/><div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold-500)', marginTop: 8 }}>ADMIN CONSOLE</div></div>
          <button className="admin-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 8, color: 'var(--sand-300)', display: 'none', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6L18 18M6 18L18 6"/></svg>
          </button>
        </div>

        {nav.map(n => {
          const I = n.ic; const active = route === n.id
          return (
            <button key={n.id} onClick={() => goRoute(n.id)} style={{ margin: '0 12px', padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: active ? 'rgba(199,152,73,0.12)' : 'transparent', color: active ? 'var(--gold-500)' : 'var(--sand-300)', fontSize: 13, fontWeight: 500, borderLeft: active ? '2px solid var(--gold-500)' : '2px solid transparent', paddingLeft: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><I s={16}/>{n.l}</span>
              {n.badge && <span style={{ background: 'var(--terra-600)', color: 'white', padding: '1px 7px', borderRadius: 99, fontSize: 10, fontWeight: 700 }}>{n.badge}</span>}
            </button>
          )
        })}

        {/* User footer */}
        <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid #2a2520' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} style={{ width: 34, height: 34, borderRadius: 99, border: '2px solid rgba(255,255,255,0.1)' }}/>
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: 99, background: 'var(--terra-600)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{initials}</div>
            )}
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
        {route === 'dashboard' && <AdminDashboard onNewBooking={() => setShowNewBooking(true)} goRoute={goRoute}/>}
        {route === 'bookings'  && <AdminBookings onNewBooking={() => setShowNewBooking(true)}/>}
        {route === 'packages'  && <AdminPackages onNewPackage={() => setShowNewPackage(true)}/>}
        {route === 'inquiries' && <AdminInquiries/>}
        {route === 'payments'  && <AdminPayments/>}
        {route === 'content'   && <AdminContent/>}
        {route === 'settings'  && <AdminSettings/>}
        {route === 'customers' && <div style={{ padding: 40 }}><PageHeader title="Customers"/><p style={{ color: 'var(--ink-500)', marginTop: 20 }}>Customer CRM coming soon.</p></div>}
        {route === 'reviews'   && <div style={{ padding: 40 }}><PageHeader title="Reviews" sub="4.6 average · 90 total"/></div>}
      </main>

      <NewBookingModal open={showNewBooking} onClose={() => setShowNewBooking(false)}/>
      <NewPackageModal open={showNewPackage} onClose={() => setShowNewPackage(false)}/>
    </div>
  )
}
