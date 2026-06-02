'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface to monitoring in production (Sentry/console for now)
    console.error('Route error:', error)
  }, [error])

  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '80px 32px', textAlign: 'center' }}>
      <div style={{ maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 88, fontWeight: 500, lineHeight: 1, color: 'var(--sand-300)', letterSpacing: '-0.04em', userSelect: 'none' }}>
          Oops
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontWeight: 500, margin: '8px 0 16px', letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-600)', lineHeight: 1.6, margin: '0 0 32px' }}>
          We hit an unexpected error. Please try again — if it keeps happening, reach us directly and we&apos;ll sort it out.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ padding: '12px 24px', background: 'var(--ink-900)', color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
            Try again
          </button>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', padding: '12px 24px', border: '1px solid var(--line)', background: 'white', color: 'var(--ink-900)', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
            Go home
          </Link>
        </div>
        <div style={{ marginTop: 28, fontSize: 13, color: 'var(--ink-500)' }}>
          Or call us:{' '}
          <a href="tel:+918460222809" style={{ color: 'var(--terra-700)', fontWeight: 600 }}>+91 84602 22809</a>
        </div>
      </div>
    </div>
  )
}
