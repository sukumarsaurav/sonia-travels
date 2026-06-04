'use client'
import { useState } from 'react'
import { BookingFlow } from '@/components/booking/BookingFlow'

export function HomeClient() {
  const [bookingFor, setBookingFor] = useState<string | null>(null)
  // The floating WhatsApp button is now global (see app/layout.tsx).
  if (!bookingFor) return null
  return (
    <BookingFlow
      pkgId={bookingFor}
      onClose={() => setBookingFor(null)}
      onComplete={() => setBookingFor(null)}
    />
  )
}
