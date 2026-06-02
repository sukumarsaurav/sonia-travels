import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar/>
      <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 120, fontWeight: 500, lineHeight: 1, color: 'var(--sand-200)', letterSpacing: '-0.04em', userSelect: 'none' }}>
            404
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 500, margin: '-16px 0 16px', letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>
            Page not found
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-600)', lineHeight: 1.6, margin: '0 0 32px' }}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Try exploring our packages or get in touch.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--ink-900)', color: 'white', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
              View packages
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', border: '1px solid var(--line)', background: 'white', color: 'var(--ink-900)', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
              Go home
            </Link>
          </div>
          <div style={{ marginTop: 32, fontSize: 13, color: 'var(--ink-500)' }}>
            Or call us directly:{' '}
            <a href="tel:+918460222809" style={{ color: 'var(--terra-700)', fontWeight: 600 }}>+91 84602 22809</a>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
