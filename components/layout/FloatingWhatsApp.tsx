import { Ic } from '@/components/ui/Icons'

// Global floating WhatsApp button (bottom-right). Rendered once in the root
// layout so every page has it. On mobile this replaces the in-navbar icon.
export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918460222809"
      target="_blank"
      rel="noopener noreferrer"
      className="wa-pulse press wa-float"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 90,
        background: '#25D366', color: 'white', width: 56, height: 56,
        borderRadius: 99, display: 'grid', placeItems: 'center',
        boxShadow: '0 8px 24px rgba(37,211,102,0.4)',
      }}
    >
      <Ic.whatsapp s={28}/>
    </a>
  )
}
