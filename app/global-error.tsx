'use client'
import { useEffect } from 'react'

// global-error replaces the root layout when an error is thrown in it,
// so it must render its own <html> and <body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#faf6f0', color: '#1a1814' }}>
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px', textAlign: 'center' }}>
          <div style={{ maxWidth: 440 }}>
            <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px' }}>Something went wrong</h1>
            <p style={{ fontSize: 15, color: '#524940', lineHeight: 1.6, margin: '0 0 28px' }}>
              The application hit a critical error. Please reload the page.
            </p>
            <button onClick={reset} style={{ padding: '12px 24px', background: '#1a1814', color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
