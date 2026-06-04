import type { NextConfig } from "next";

// Pragmatic CSP: the app uses pervasive inline styles (style-src needs
// 'unsafe-inline') and Next.js injects inline bootstrap scripts. Allowlists
// cover Supabase (data + storage), Unsplash images, and the Google Maps embed.
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://www.google.com https://*.googleusercontent.com https://*.razorpay.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "media-src 'self' blob: https://*.supabase.co",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
  "connect-src 'self' https://*.supabase.co https://*.razorpay.com https://lumberjack.razorpay.com",
  "frame-src https://www.google.com https://api.razorpay.com https://checkout.razorpay.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zcizoajjjqqlclmvwqow.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
