'use client'
import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackClass?: string
}

/**
 * Wraps next/image with a graceful fallback: if the remote URL 404s or fails,
 * the placeholder gradient div is shown instead of a broken image icon.
 */
export function SafeImage({ fallbackClass = '', className, style, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`ph-img ${fallbackClass}`}
        style={{ position: 'absolute', inset: 0, ...style }}
      />
    )
  }

  // Bypass Next.js server-side image optimization for external CDN URLs.
  // Unsplash (and similar CDNs) block requests from Vercel's serverless IPs,
  // so _next/image returns 404 in production. Supabase Storage URLs are safe
  // to optimize because they're fetched from a trusted, predictable origin.
  const src = typeof props.src === 'string' ? props.src : ''
  const unoptimized = src.length > 0 && !src.includes('supabase.co')

  return (
    <Image
      {...props}
      unoptimized={unoptimized}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  )
}
