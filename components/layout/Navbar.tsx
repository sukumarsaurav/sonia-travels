'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/Logo'
import { Btn } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/packages', label: 'Packages' },
  { href: '/services', label: 'Services' },
  { href: '/about',    label: 'About' },
  { href: '/contact',  label: 'Contact' },
]

function UserMenu({ user }: { user: User }) {
  const supabase = createBrowserSupabase()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const name: string = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'
  const avatar: string = user.user_metadata?.avatar_url || ''
  const initials = name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', border: '1px solid var(--line)', borderRadius: 99, background: 'white', cursor: 'pointer' }}>
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}/>
        ) : (
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--terra-600)', color: 'white', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{initials}</div>
        )}
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-900)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name.split(' ')[0]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--ink-400)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {open && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'white', border: '1px solid var(--line)', borderRadius: 12, boxShadow: '0 12px 32px -8px rgba(26,24,20,0.16)', minWidth: 200, zIndex: 100, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'var(--sand-50)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)' }}>{name}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{user.email}</div>
          </div>
          <Link href="/account" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--ink-700)', borderBottom: '1px solid var(--line)' }}>
            <Ic.cal s={15}/> My Bookings
          </Link>
          <Link href="/account?tab=profile" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--ink-700)', borderBottom: '1px solid var(--line)' }}>
            <Ic.users s={15}/> Profile
          </Link>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'var(--terra-700)', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}>
            <Ic.arrowL s={15}/> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const supabase = createBrowserSupabase()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <header style={{ borderBottom: '1px solid var(--line)', background: 'rgba(250,246,240,0.92)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="nav-row" style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', gap: 16 }}>
        <Link href="/"><Logo/></Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              fontSize: 14, fontWeight: 500, padding: '6px 0',
              color: pathname === l.href ? 'var(--terra-700)' : 'var(--ink-700)',
              borderBottom: pathname === l.href ? '2px solid var(--terra-600)' : '2px solid transparent',
            }}>{l.label}</Link>
          ))}
        </nav>

        <div className="nav-admin-cta" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <UserMenu user={user}/>
          ) : (
            <Link href="/account/login">
              <Btn variant="ghost" size="sm" icon={<Ic.users s={14}/>}>Sign in</Btn>
            </Link>
          )}
          <Btn variant="whatsapp" size="sm" icon={<Ic.whatsapp s={16}/>}
            onClick={() => window.open('https://wa.me/918460222809', '_blank')}>
            84602 22809
          </Btn>
        </div>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu"
          style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid var(--line)', background: 'white', display: 'none', placeItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <g><path d="M6 6L18 18"/><path d="M6 18L18 6"/></g> : <g><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></g>}
          </svg>
        </button>
      </div>
    </header>
  )
}
