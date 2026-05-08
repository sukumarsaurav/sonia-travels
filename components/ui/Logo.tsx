/* eslint-disable @next/next/no-img-element */
interface LogoProps { dark?: boolean; size?: 'sm' | 'md' | 'lg' }

export function Logo({ dark, size = 'md' }: LogoProps) {
  const h = size === 'lg' ? 52 : size === 'sm' ? 30 : 40
  const sub = dark ? 'var(--sand-300)' : 'var(--ink-500)'
  const fg  = dark ? 'var(--sand-50)'  : 'var(--ink-900)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/sonia-logo.png"
        alt="Sonia Travels"
        style={{ height: h, width: 'auto', display: 'block', flexShrink: 0 }}
      />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: size === 'lg' ? 22 : size === 'sm' ? 15 : 18, fontWeight: 600, color: fg, letterSpacing: '-0.01em' }}>
          Sonia <span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>Travels</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.22em', color: sub, textTransform: 'uppercase', marginTop: 3 }}>
          Cab Booking · Tours
        </div>
      </div>
    </div>
  )
}
