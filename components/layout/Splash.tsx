'use client'
import Image from 'next/image'

export function Splash() {
  return (
    <div className="splash-anim" style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'var(--sand-50)',
      display: 'grid', placeItems: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 96, height: 96 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid var(--sand-200)', borderTopColor: 'var(--terra-600)',
            animation: 'spinSlow 1s linear infinite',
          }}/>
          <Image src="/sonia-logo.png" alt="" width={96} height={96} style={{
            position: 'absolute', inset: 12, width: 'calc(100% - 24px)', height: 'calc(100% - 24px)',
            objectFit: 'cover', objectPosition: 'center 35%', borderRadius: '50%', transform: 'scale(1.6)',
          }}/>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600, color: 'var(--ink-900)', letterSpacing: '-0.01em' }}>
            Sonia <span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>Travels</span>
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-500)', textTransform: 'uppercase', marginTop: 4 }}>
            Loading your trip…
          </div>
        </div>
      </div>
    </div>
  )
}
