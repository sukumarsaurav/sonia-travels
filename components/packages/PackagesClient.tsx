'use client'
import { useState } from 'react'
import { PackageCard } from './PackageCard'
import type { Package } from '@/types'

export function PackagesClient({ packages }: { packages: Package[] }) {
  const [filter, setFilter] = useState('All')
  const tags = ['All', ...Array.from(new Set(packages.map(p => p.tag)))]
  const filtered = filter === 'All' ? packages : packages.filter(p => p.tag === filter)

  return (
    <>
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
      {filtered.length === 0 && (
        <p style={{ color: 'var(--ink-400)', textAlign: 'center', padding: '60px 0' }}>No packages in this category.</p>
      )}
    </>
  )
}
