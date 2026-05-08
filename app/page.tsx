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

export default function HomePage() {
  return (
    <>
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
