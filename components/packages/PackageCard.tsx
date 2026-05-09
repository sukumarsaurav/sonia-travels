import Link from 'next/link'
import Image from 'next/image'
import { Pill } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import type { Package } from '@/types'

const formatINR = (n: number) => '₹' + n.toLocaleString('en-IN')

export function PackageCard({ pkg, featured }: { pkg: Package; featured?: boolean }) {
  const imgHeight = featured ? 280 : 200
  return (
    <Link href={`/packages/${pkg.id}`} className="lift press reveal" style={{
      textAlign: 'left', display: 'block', width: '100%',
      background: 'white', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{ height: imgHeight, position: 'relative', overflow: 'hidden' }}>
        {pkg.hero_url ? (
          <Image
            src={pkg.hero_url}
            alt={pkg.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={featured}
          />
        ) : (
          <div className={`ph-img ${pkg.hero}`} style={{ height: '100%' }}/>
        )}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1 }}>
          <Pill color="sand" size="sm">{pkg.tag}</Pill>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>{pkg.name}</h3>
          <div style={{ fontSize: 11, color: 'var(--ink-600)', fontFamily: 'var(--mono)', letterSpacing: '0.08em' }}>{pkg.nights}N · {pkg.days}D</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-600)', marginBottom: 12 }}>{pkg.region}</div>
        <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: '0 0 16px', lineHeight: 1.5 }}>{pkg.desc || pkg.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--ink-600)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>From</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600, color: 'var(--terra-700)' }}>
              {formatINR(pkg.price)}<span style={{ fontSize: 12, color: 'var(--ink-600)', fontWeight: 400, fontFamily: 'var(--sans)' }}> / pax</span>
            </div>
          </div>
          <div style={{ color: 'var(--ink-700)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>View <Ic.arrow s={14}/></div>
        </div>
      </div>
    </Link>
  )
}
