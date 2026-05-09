import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/ui/Section'
import { Testimonials } from '@/components/home/Testimonials'
import { FAQSection } from '@/components/home/FAQ'
import { RevealProvider } from '@/components/ui/Reveal'

export const metadata: Metadata = {
  title: 'About Us | Sonia Tour & Travels — Travel Agency in Pathankot Since 2008',
  description: 'Sonia Tour & Travels has served 10,000+ travellers from Pathankot since 2008. Learn about our team, values and why we are the most trusted travel agency in Pathankot.',
  keywords: 'about sonia travels pathankot, travel agency pathankot, trusted travel agent pathankot, sonia tour travels, pathankot travel company',
  openGraph: {
    title: 'About Sonia Tour & Travels — Pathankot\'s Trusted Travel Agency Since 2008',
    description: 'Learn about 18 years of travel experience, 10,000+ satisfied customers and what makes us Pathankot\'s most trusted travel desk.',
    url: 'https://soniatravels.in/about',
    type: 'website',
  },
  alternates: { canonical: 'https://soniatravels.in/about' },
}

export default function AboutPage() {
  return (
    <RevealProvider>
      <Navbar/>
      <main>
        <Section eyebrow="About" title="A travel desk in Pathankot, since 2008.">
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'start' }}>
            <div style={{ fontSize: 17, lineHeight: 1.65, color: 'var(--ink-700)' }}>
              <p>Sonia Tour and Travels has been arranging holidays out of a small office on Defence Road for over eighteen years. What started as a railway-and-bus booking counter has grown into a full travel desk — air tickets, taxis, hotels, full packages — but the desk hasn't moved, and the team hasn't changed.</p>
              <p>We work with solo travellers, young families and big multi-generation groups. Our specialty is reading what kind of trip <em>you</em> want — slow or packed, adventurous or restful — and shaping the itinerary around it.</p>
              <p>Bookings are processed through Razorpay so you get a proper invoice and PCI-grade payment security. The trip helpline runs 24×7 — including the day you fly.</p>
            </div>
            <div className="about-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { val: '18+', label: 'Years in business', bg: 'var(--sand-100)', color: 'var(--terra-700)' },
                { val: '10k+', label: 'Travellers served', bg: 'var(--forest-100)', color: 'var(--forest-700)' },
                { val: '4.6★', label: 'Average rating', bg: 'var(--terra-100)', color: 'var(--terra-700)' },
                { val: '24×7', label: 'Trip helpline', bg: 'var(--sand-200)', color: 'var(--ink-900)' },
              ].map((s,i) => (
                <div key={i} className={`lift reveal reveal-delay-${i}`} style={{ padding: 24, background: s.bg, borderRadius: 12 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-700)', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>
        <Testimonials/>
        <FAQSection/>
      </main>
      <Footer/>
    </RevealProvider>
  )
}
