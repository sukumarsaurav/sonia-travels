import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

// Rate-limits POST to API write endpoints. Uses Upstash Redis when configured
// (UPSTASH_REDIS_REST_URL + _TOKEN) for reliable cross-instance limiting on
// Vercel; otherwise falls back to a best-effort in-memory counter. See
// lib/ratelimit.ts.
export async function middleware(req: NextRequest) {
  if (req.method === 'POST' && req.nextUrl.pathname.startsWith('/api/')) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    const allowed = await checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests — please wait a moment.' },
        { status: 429, headers: { 'Retry-After': '60', 'Content-Type': 'application/json' } }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
