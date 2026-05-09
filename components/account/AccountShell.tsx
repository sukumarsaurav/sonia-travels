'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Logo } from '@/components/ui/Logo'
import { Btn, StatusPill, Pill } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { Field, Input } from '@/components/ui/Form'
import { formatINR } from '@/lib/data'

interface UserInfo { id: string; name: string; email: string; phone: string; avatar: string }
interface Booking {
  id: string; booking_ref: string; package_name: string; travelers: number
  depart_date: string | null; amount: number; status: string; payment_status: string
  created_at: string; room_type: string | null
}

function Avatar({ name, avatar, size = 64 }: { name: string; avatar: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  if (avatar) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={avatar} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--sand-200)' }}/>
  )
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--terra-600)', color: 'white', display: 'grid', placeItems: 'center', fontSize: size * 0.3, fontWeight: 700, border: '3px solid var(--sand-200)', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function ProfileTab({ user }: { user: UserInfo }) {
  const supabase = createBrowserSupabase()
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const save = async () => {
    setSaving(true); setSaveError('')
    const { error } = await supabase
      .from('user_profiles')
      .update({ full_name: name, phone, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      setSaveError('Could not save changes. Please try again.')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Avatar + name card */}
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: 28, display: 'flex', gap: 20, alignItems: 'center' }}>
        <Avatar name={user.name} avatar={user.avatar} size={72}/>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, letterSpacing: '-0.01em' }}>{user.name}</div>
          <div style={{ fontSize: 14, color: 'var(--ink-500)', marginTop: 4 }}>{user.email}</div>
          <div style={{ marginTop: 8 }}><Pill color="forest" size="sm">Verified traveller</Pill></div>
        </div>
      </div>

      {/* Edit form */}
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em' }}>Edit profile</h2>
        <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
          <Field label="Full name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"/></Field>
          <Field label="Email"><Input value={user.email} readOnly style={{ color: 'var(--ink-400)', cursor: 'not-allowed' }}/></Field>
          <Field label="Phone number"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 …"/></Field>
          {saveError && (
            <div style={{ fontSize: 13, color: 'var(--terra-700)', padding: '8px 12px', background: 'var(--terra-100)', borderRadius: 6 }}>{saveError}</div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="dark" size="md" onClick={save} disabled={saving}>{saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}</Btn>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: 28 }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>Account</h2>
        <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '0 0 16px' }}>Signing out will end your current session.</p>
        <Btn variant="ghost" size="md" onClick={logout}>Sign out</Btn>
      </div>
    </div>
  )
}

function BookingsTab({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✈️</div>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, marginBottom: 8 }}>No bookings yet</div>
        <p style={{ fontSize: 15, color: 'var(--ink-500)', marginBottom: 24 }}>When you book a trip with us, it will appear here.</p>
        <Link href="/packages"><Btn variant="dark" size="md">Browse packages</Btn></Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {bookings.map(b => (
        <div key={b.id} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--terra-700)', letterSpacing: '0.1em', marginBottom: 4 }}>{b.booking_ref}</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{b.package_name}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <StatusPill status={b.status.charAt(0).toUpperCase() + b.status.slice(1)}/>
              <StatusPill status={b.payment_status === 'paid' ? 'Confirmed' : b.payment_status === 'partial' ? 'Pending' : 'Awaiting'}/>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              ['Travellers', `${b.travelers} adult${b.travelers > 1 ? 's' : ''}`],
              ['Departure', b.depart_date ? new Date(b.depart_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
              ['Room type', b.room_type || 'Twin sharing'],
              ['Amount', formatINR(b.amount)],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 11, color: 'var(--ink-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ paddingTop: 16, borderTop: '1px dashed var(--line)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn variant="ghost" size="sm" icon={<Ic.whatsapp s={14}/>} onClick={() => window.open('https://wa.me/918460222809', '_blank')}>
              Contact us about this booking
            </Btn>
            {b.status === 'pending' && b.payment_status === 'unpaid' && (
              <Btn variant="primary" size="sm">Complete payment</Btn>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const tabs = [
  { id: 'bookings', label: 'My Bookings', icon: Ic.cal },
  { id: 'profile',  label: 'Profile',     icon: Ic.users },
]

export function AccountShell({ user, bookings }: { user: UserInfo; bookings: Booking[] }) {
  const [tab, setTab] = useState('bookings')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sand-50)' }}>
      {/* Top bar */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, zIndex: 40, backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/"><Logo/></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--ink-500)' }}>Hi, {user.name.split(' ')[0]}</span>
            <Link href="/" style={{ fontSize: 13, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Ic.arrowL s={13}/> Back to site
            </Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 8 }}>My Account</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 500, margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>{user.name.split(' ')[0]}</span>
          </h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--line)', paddingBottom: 0 }}>
          {tabs.map(t => {
            const I = t.icon; const active = tab === t.id
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontSize: 14, fontWeight: 500, color: active ? 'var(--terra-700)' : 'var(--ink-500)', borderBottom: active ? '2px solid var(--terra-700)' : '2px solid transparent', marginBottom: -1, background: 'none', cursor: 'pointer', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                <I s={16}/>{t.label}
                {t.id === 'bookings' && bookings.length > 0 && (
                  <span style={{ background: 'var(--terra-100)', color: 'var(--terra-700)', padding: '1px 7px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>{bookings.length}</span>
                )}
              </button>
            )
          })}
        </div>

        {tab === 'bookings' && <BookingsTab bookings={bookings}/>}
        {tab === 'profile'  && <ProfileTab user={user}/>}
      </div>
    </div>
  )
}
