import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ContactSection } from '@/components/home/ContactSection'
import { RevealProvider } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'Contact Us | Sonia Tour & Travels Pathankot — Call 24×7 | +91 84602 22809',
  description: 'Contact Sonia Tour & Travels in Pathankot. Call or WhatsApp +91 84602 22809 anytime — 24×7. Located at Defence Road, Mamoon, Pathankot, Punjab 145001.',
  keywords: 'contact sonia travels pathankot, travel agency contact pathankot, taxi booking pathankot number, pathankot cab booking phone, travel agent pathankot phone',
  openGraph: {
    title: 'Contact Sonia Tour & Travels — 24×7 helpline +91 84602 22809',
    description: 'Reach us anytime by call, WhatsApp or walk into our Pathankot office. We respond within the hour.',
    url: 'https://soniatravels.in/contact',
    type: 'website',
  },
  alternates: { canonical: 'https://soniatravels.in/contact' },
}

export default function ContactPage() {
  return (
    <RevealProvider>
      <Navbar/>
      <main style={{ paddingTop: 40 }}>
        <ContactSection/>
      </main>
      <Footer/>
    </RevealProvider>
  )
}
