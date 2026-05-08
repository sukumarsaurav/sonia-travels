'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PackageCard } from '@/components/packages/PackageCard'
import { Section } from '@/components/ui/Section'
import { PACKAGES } from '@/lib/data'
import { RevealProvider } from '@/components/ui/Reveal'

export default function PackagesPage() {
  const [filter, setFilter] = useState('All')
  const tags = ['All', ...Array.from(new Set(PACKAGES.map(p => p.tag)))]
  const filtered = filter === 'All' ? PACKAGES : PACKAGES.filter(p => p.tag === filter)
  return (
    <RevealProvider>
      <Navbar/>
      <main style={{ paddingTop: 40 }}>
        <Section eyebrow="Tour Packages" title="Ten destinations, year-round.">
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding: '8px 16px', borderRadius: 99,
                border: filter === t ? '1px solid var(--ink-900)' : '1px solid var(--line)',
                background: filter === t ? 'var(--ink-900)' : 'white',
                color: filter === t ? 'white' : 'var(--ink-700)',
                fontSize: 13, fontWeight: 500,
              }}>{t}</button>
            ))}
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {filtered.map(p => <PackageCard key={p.id} pkg={p}/>)}
          </div>
        </Section>
      </main>
      <Footer/>
    </RevealProvider>
  )
}
