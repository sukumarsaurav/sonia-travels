'use client'
import { SafeImage } from '@/components/ui/SafeImage'

interface Props {
  src: string
  alt: string
  hero: string
}

export function PackageHeroImage({ src, alt, hero }: Props) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      fill
      priority
      style={{ objectFit: 'cover' }}
      fallbackClass={hero}
    />
  )
}
