'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Logo } from '@/components/ui/Logo'
import { Btn } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Form'

type Mode = 'login' | 'signup'

function AuthForm() {
  const supabase = createBrowserSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(searchParams.get('error') ? 'Authentication failed. Please try again.' : '')
  const [success, setSuccess] = useState('')

  const signInWithGoogle = async () => {
    setGoogleLoading(true); setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` },
      })
      if (error) setError(error.message)
      else setSuccess('Check your email for a confirmation link.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/account')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleEmail}>
      {error && <div style={{ background: '#fadcd6', border: '1px solid #f5c4bc', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)', marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ background: '#dff0e1', border: '1px solid #b3dbb8', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1f6e3a', marginBottom: 16 }}>{success}</div>}

      {/* Google */}
      <button type="button" onClick={signInWithGoogle} disabled={googleLoading}
        style={{ width: '100%', padding: '13px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, border: '1px solid var(--line)', borderRadius: 10, background: googleLoading ? 'var(--sand-100)' : 'white', fontSize: 14, fontWeight: 600, cursor: googleLoading ? 'not-allowed' : 'pointer', color: 'var(--ink-900)', marginBottom: 20 }}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {googleLoading ? 'Redirecting…' : `${mode === 'signup' ? 'Sign up' : 'Sign in'} with Google`}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
        <span style={{ fontSize: 12, color: 'var(--ink-400)', fontFamily: 'var(--mono)' }}>or with email</span>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {mode === 'signup' && (
          <>
            <Field label="Full name">
              <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required/>
            </Field>
            <Field label="Phone (optional)">
              <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 …"/>
            </Field>
          </>
        )}
        <Field label="Email address">
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required/>
        </Field>
        <Field label="Password">
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required minLength={6}/>
        </Field>
        <Btn type="submit" variant="dark" size="lg" full disabled={loading}>
          {loading ? (mode === 'signup' ? 'Creating account…' : 'Signing in…') : (mode === 'signup' ? 'Create account' : 'Sign in')}
        </Btn>
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--ink-500)' }}>
        {mode === 'login' ? (
          <>Don&apos;t have an account? <button type="button" onClick={() => { setMode('signup'); setError(''); setSuccess('') }} style={{ color: 'var(--terra-700)', fontWeight: 600 }}>Sign up</button></>
        ) : (
          <>Already have an account? <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }} style={{ color: 'var(--terra-700)', fontWeight: 600 }}>Sign in</button></>
        )}
      </div>
    </form>
  )
}

export default function AccountLoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--sand-100)', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 20, padding: '40px 40px 32px', boxShadow: '0 24px 48px -12px rgba(26,24,20,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <Link href="/"><Logo size="lg"/></Link>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>My Account</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: 0 }}>Sign in to view your bookings and manage your trips.</p>
          </div>
          <Suspense fallback={<div style={{ height: 200, display: 'grid', placeItems: 'center', color: 'var(--ink-400)' }}>Loading…</div>}>
            <AuthForm/>
          </Suspense>
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--ink-500)' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
