import { createServerSupabase } from '@/lib/supabase-server'
import { Section } from '@/components/ui/Section'
import { PackageCard } from './PackageCard'
import type { Package } from '@/types'

export async function FeaturedPackages() {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('packages')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const packages = (data || []) as Package[]

  if (packages.length === 0) return null

  return (
    <Section eyebrow="Most loved" title="Our top picks for you.">
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {packages.map(p => <PackageCard key={p.id} pkg={p} featured/>)}
      </div>
    </Section>
  )
}
