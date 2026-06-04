'use client'
import { useRef, useState } from 'react'
import { Ic } from '@/components/ui/Icons'
import type { Reel } from '@/types'

function ReelCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted) v.play().catch(() => {})
    setMuted(v.muted)
  }

  const cardStyle: React.CSSProperties = {
    position: 'relative', flexShrink: 0,
    width: 232, aspectRatio: '9 / 16',
    borderRadius: 18, overflow: 'hidden',
    background: 'var(--ink-900)',
    boxShadow: 'var(--shadow-md)',
    scrollSnapAlign: 'start',
    display: 'block', textDecoration: 'none',
  }

  // Uploaded video → autoplay muted inline
  if (reel.video_url) {
    return (
      <div className="reel-card" style={cardStyle}>
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.poster_url || undefined}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 99, background: 'rgba(0,0,0,0.55)', color: 'white', display: 'grid', placeItems: 'center', border: 'none', cursor: 'pointer' }}
        >
          {muted ? <Ic.mute s={16}/> : <Ic.unmute s={16}/>}
        </button>
        {reel.instagram_url && (
          <a href={reel.instagram_url} target="_blank" rel="noopener noreferrer"
            aria-label="View on Instagram"
            style={{ position: 'absolute', bottom: 12, right: 12, width: 34, height: 34, borderRadius: 99, background: 'rgba(0,0,0,0.55)', color: 'white', display: 'grid', placeItems: 'center' }}>
            <Ic.arrow s={15}/>
          </a>
        )}
      </div>
    )
  }

  // Instagram link + thumbnail → play overlay, opens Instagram
  return (
    <a href={reel.instagram_url || '#'} target="_blank" rel="noopener noreferrer" className="reel-card" style={cardStyle}>
      {reel.poster_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={reel.poster_url} alt={reel.caption || 'Reel'} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
      ) : (
        <div className="ph-img terra" style={{ position: 'absolute', inset: 0 }}/>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.45))' }}/>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 52, height: 52, borderRadius: 99, background: 'rgba(255,255,255,0.92)', color: 'var(--ink-900)', display: 'grid', placeItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
        <Ic.play s={22}/>
      </div>
      {reel.caption && (
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, color: 'white', fontSize: 12, fontWeight: 500, lineHeight: 1.3, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
          {reel.caption}
        </div>
      )}
    </a>
  )
}

export function ReelsCarousel({ reels, instagramUrl }: { reels: Reel[]; instagramUrl?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' })
  }

  if (!reels.length) return null

  return (
    <section style={{ background: 'var(--sand-50)', padding: '72px 0' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 8 }}>On the Gram</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 500, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
              Sonia Travels in <span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>reels</span>.
            </h2>
          </div>
          {instagramUrl && (
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--terra-600)', color: 'white', padding: '10px 18px', borderRadius: 99, fontWeight: 600, fontSize: 14, textDecoration: 'none', flexShrink: 0 }}>
              <Ic.film s={16}/> Follow us
            </a>
          )}
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => scrollBy(-1)} aria-label="Previous" className="reel-arrow reel-arrow-left"
            style={{ position: 'absolute', left: -18, top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: 44, height: 44, borderRadius: 99, background: 'white', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Ic.arrowL s={18}/>
          </button>

          <div
            ref={trackRef}
            className="reel-track"
            style={{ display: 'flex', gap: 18, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 8, scrollbarWidth: 'none' }}
          >
            {reels.map(r => <ReelCard key={r.id} reel={r}/>)}
          </div>

          <button onClick={() => scrollBy(1)} aria-label="Next" className="reel-arrow reel-arrow-right"
            style={{ position: 'absolute', right: -18, top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: 44, height: 44, borderRadius: 99, background: 'white', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <Ic.arrow s={18}/>
          </button>
        </div>
      </div>
    </section>
  )
}
