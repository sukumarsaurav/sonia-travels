import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimisation — serve WebP/AVIF automatically, cache for 1 year
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zcizoajjjqqlclmvwqow.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Security & performance HTTP headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Force HTTPS (1 year)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Referrer policy for privacy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — disable unused APIs
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Long-lived cache for static assets (Next.js immutable chunks)
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache public images for 1 week
        source: '/(.*).(png|jpg|jpeg|svg|ico|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ]
  },

  // Redirect www → non-www (set your actual domain)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.soniatravels.in' }],
        destination: 'https://soniatravels.in/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
