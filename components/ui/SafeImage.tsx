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

  // Local images (/public) and Supabase Storage are optimized normally.
  // Only bypass optimization for *external* CDN URLs (e.g. Unsplash), which
  // can block Vercel's serverless IPs and make _next/image 404 in production.
  const src = typeof props.src === 'string' ? props.src : ''
  const isExternal = /^https?:\/\//i.test(src)
  const unoptimized = isExternal && !src.includes('supabase.co')

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
