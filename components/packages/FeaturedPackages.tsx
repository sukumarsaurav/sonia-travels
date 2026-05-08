import { Section } from '@/components/ui/Section'
import { PackageCard } from './PackageCard'
import { PACKAGES } from '@/lib/data'

export function FeaturedPackages() {
  const top3 = ['manali', 'kerala', 'ladakh'].map(id => PACKAGES.find(p => p.id === id)!)
  return (
    <Section eyebrow="Most loved" title="Three picks for May.">
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {top3.map(p => <PackageCard key={p.id} pkg={p} featured/>)}
      </div>
    </Section>
  )
}
