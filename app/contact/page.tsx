import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ContactSection } from '@/components/home/ContactSection'
import { RevealProvider } from '@/components/ui/Reveal'

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
