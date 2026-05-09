import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PackagesClient } from '@/components/packages/PackagesClient'
import { Section } from '@/components/ui/Section'
import { RevealProvider } from '@/components/ui/Reveal'
import { createServerSupabase } from '@/lib/supabase-server'
import type { Package } from '@/types'

export const metadata: Metadata = {
  title: 'Tour Packages from Pathankot | Manali, Goa, Kerala, Ladakh & More | Sonia Travels',
  description: 'Explore handcrafted tour packages from Pathankot — Manali, Goa, Jaipur, Kerala, Ladakh, Darjeeling and more. Fixed prices, private vehicles, 3-star stays. Book with 18+ years trusted agency.',
  keywords: 'tour packages pathankot, travel packages pathankot, manali tour package, himachal tour package, kerala tour, ladakh tour package, holiday packages from pathankot',
  openGraph: {
    title: 'Tour Packages from Pathankot — Sonia Tour & Travels',
    description: 'Handcrafted holiday packages to 10 destinations across India. Fixed prices, private vehicles and experienced local guides.',
    url: 'https://soniatravels.in/packages',
    type: 'website',
  },
  alternates: { canonical: 'https://soniatravels.in/packages' },
}

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
