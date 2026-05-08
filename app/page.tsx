'use client'
import { useState } from 'react'
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
import { BookingFlow } from '@/components/booking/BookingFlow'
import { Ic } from '@/components/ui/Icons'
import { RevealProvider } from '@/components/ui/Reveal'

export default function HomePage() {
  const [bookingFor, setBookingFor] = useState<string | null>(null)
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
        {bookingFor && <BookingFlow pkgId={bookingFor} onClose={() => setBookingFor(null)} onComplete={() => setBookingFor(null)}/>}
        <button
          onClick={() => window.open('https://wa.me/918460222809', '_blank')}
          className="wa-pulse press"
          style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 90, background: '#25D366', color: 'white', width: 56, height: 56, borderRadius: 99, display: 'grid', placeItems: 'center', boxShadow: '0 8px 24px rgba(37,211,102,0.4)' }}
          title="Chat on WhatsApp"
        >
          <Ic.whatsapp s={28}/>
        </button>
      </RevealProvider>
    </>
  )
}
