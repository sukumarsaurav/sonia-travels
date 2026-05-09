'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PackageCard } from './PackageCard'
import type { Package } from '@/types'

export function PackagesClient({ packages }: { packages: Package[] }) {
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Initialise search from URL query param (from hero search bar)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearch(q)
  }, [searchParams])

  const tags = ['All', ...Array.from(new Set(packages.map(p => p.tag)))]

  const filtered = packages.filter(p => {
    const matchTag = filter === 'All' || p.tag === filter
    const q = search.trim().toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q)
    return matchTag && matchSearch
  })

  return (
    <>
      {/* Search refinement bar */}
      {search && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 16px', background: 'var(--sand-100)', borderRadius: 8, border: '1px solid var(--sand-200)' }}>
          <span style={{ fontSize: 14, color: 'var(--ink-700)' }}>
            Showing results for <strong>"{search}"</strong>
          </span>
          <button
            onClick={() => setSearch('')}
            style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--terra-700)', fontWeight: 600, padding: '2px 8px', border: '1px solid var(--terra-100)', borderRadius: 6, background: 'white' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Tag filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }} role="group" aria-label="Filter by category">
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            aria-pressed={filter === t}
            style={{
              padding: '8px 16px', borderRadius: 99,
              border: filter === t ? '1px solid var(--ink-900)' : '1px solid var(--line)',
              background: filter === t ? 'var(--ink-900)' : 'white',
              color: filter === t ? 'white' : 'var(--ink-700)',
              fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
            }}
          >{t}</button>
        ))}
      </div>

      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {filtered.map(p => <PackageCard key={p.id} pkg={p}/>)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--ink-600)', marginBottom: 12 }}>No packages found{search ? ` for "${search}"` : ' in this category'}.</p>
          <button
            onClick={() => { setFilter('All'); setSearch('') }}
            style={{ fontSize: 13, color: 'var(--terra-700)', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Show all packages
          </button>
        </div>
      )}
    </>
  )
}
