export default function Loading() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid var(--sand-200)',
          borderTopColor: 'var(--terra-600)',
          animation: 'spinSlow 0.8s linear infinite',
        }}/>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-500)', textTransform: 'uppercase' }}>
          Loading…
        </div>
      </div>
    </div>
  )
}
