import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiter — adequate for single-instance dev/small-traffic.
// For multi-region production replace with Upstash Redis + @upstash/ratelimit.
const WINDOW_MS = 60_000
const MAX_POST_PER_WINDOW = 15

const ipCounters = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipCounters.get(ip)
  if (!entry || now > entry.resetAt) {
    ipCounters.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  entry.count++
  return entry.count <= MAX_POST_PER_WINDOW
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Rate-limit POST to API write endpoints
  if (req.method === 'POST' && req.nextUrl.pathname.startsWith('/api/')) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      'unknown'

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests — please wait a moment.' },
        {
          status: 429,
          headers: { 'Retry-After': '60', 'Content-Type': 'application/json' },
        }
      )
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
