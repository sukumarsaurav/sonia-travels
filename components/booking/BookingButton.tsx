'use client'
import { useState } from 'react'
import { Btn } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { BookingFlow } from './BookingFlow'

export function BookingButton({ pkgId }: { pkgId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Btn variant="primary" size="lg" full onClick={() => setOpen(true)}>
        Book on Razorpay <Ic.arrow s={16}/>
      </Btn>
      {open && <BookingFlow pkgId={pkgId} onClose={() => setOpen(false)} onComplete={() => setOpen(false)}/>}
    </>
  )
}
