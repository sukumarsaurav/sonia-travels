import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Splash } from '@/components/layout/Splash'
import { Hero } from '@/components/home/Hero'
import { FeaturedPackages } from '@/components/packages/FeaturedPackages'
import { ServiceStrip } from '@/components/home/ServiceStrip'
import { WhyUs } from '@/components/home/WhyUs'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQSection } from '@/components/home/FAQ'
import { ContactSection } from '@/components/home/ContactSection'
import { HomeClient } from '@/components/home/HomeClient'
import { RevealProvider } from '@/components/ui/Reveal'
import { LocalBusinessSchema, FAQSchema } from '@/components/seo/JsonLd'
import { FAQS } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Cab Service in Pathankot | Travel Agency Since 2008 | Sonia Tour & Travels',
  description: 'Best cab service in Pathankot for outstation trips to Dalhousie, Dharamshala, Amritsar, Jammu & Katra. Tour packages, air ticketing, railway & bus booking. Call 24×7.',
  keywords: 'cab service pathankot, taxi pathankot, travel agency pathankot, outstation cab pathankot, pathankot taxi service, tour packages pathankot, pathankot to dalhousie cab',
  openGraph: {
    title: 'Sonia Tour & Travels — Best Cab Service & Travel Agency in Pathankot',
    description: 'Reliable cabs, tour packages, air & rail ticketing from Pathankot since 2008. 10,000+ happy travellers. Book 24×7.',
    url: 'https://soniatravels.in',
    siteName: 'Sonia Tour & Travels',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: 'https://soniatravels.in',
  },
}

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema/>
      <FAQSchema items={FAQS}/>
      <Splash/>
      <RevealProvider>
        <Navbar/>
        <main>
          <Hero/>
          <FeaturedPackages/>
          <ServiceStrip/>
          <WhyUs/>
          <Testimonials/>
          <FAQSection/>
          <ContactSection/>
        </main>
        <Footer/>
        <HomeClient/>
      </RevealProvider>
    </>
  )
}
