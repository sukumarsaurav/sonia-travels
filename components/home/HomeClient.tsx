'use client'
import { useState } from 'react'
import { BookingFlow } from '@/components/booking/BookingFlow'
import { Ic } from '@/components/ui/Icons'

export function HomeClient() {
  const [bookingFor, setBookingFor] = useState<string | null>(null)
  return (
    <>
      {bookingFor && (
        <BookingFlow
          pkgId={bookingFor}
          onClose={() => setBookingFor(null)}
          onComplete={() => setBookingFor(null)}
        />
      )}
      <button
        onClick={() => window.open('https://wa.me/918460222809', '_blank')}
        className="wa-pulse press"
        style={{
          position: 'fixed', right: 24, bottom: 24, zIndex: 90,
          background: '#25D366', color: 'white', width: 56, height: 56,
          borderRadius: 99, display: 'grid', placeItems: 'center',
          boxShadow: '0 8px 24px rgba(37,211,102,0.4)',
        }}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <Ic.whatsapp s={28}/>
      </button>
    </>
  )
}
