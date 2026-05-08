import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PackagesClient } from '@/components/packages/PackagesClient'
import { Section } from '@/components/ui/Section'
import { RevealProvider } from '@/components/ui/Reveal'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Package } from '@/types'

export const revalidate = 60

export default async function PackagesPage() {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('packages')
    .select('*')
    .eq('active', true)
    .order('name')

  const packages = (data || []) as Package[]

  return (
    <RevealProvider>
      <Navbar/>
      <main style={{ paddingTop: 40 }}>
        <Section eyebrow="Tour Packages" title="Ten destinations, year-round.">
          <PackagesClient packages={packages}/>
        </Section>
      </main>
      <Footer/>
    </RevealProvider>
  )
}
