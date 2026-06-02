'use client'
import { useState } from 'react'
import { Btn } from '@/components/ui/Button'
import { Ic } from '@/components/ui/Icons'
import { BookingFlow } from './BookingFlow'
import type { Package } from '@/types'

interface Props {
  pkgId: string
  pkg?: Package
}

export function BookingButton({ pkgId, pkg }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Btn variant="primary" size="lg" full onClick={() => setOpen(true)}>
        Book this trip <Ic.arrow s={16}/>
      </Btn>
      {open && (
        <BookingFlow
          pkgId={pkgId}
          pkg={pkg}
          onClose={() => setOpen(false)}
          onComplete={() => setOpen(false)}
        />
      )}
    </>
  )
}
