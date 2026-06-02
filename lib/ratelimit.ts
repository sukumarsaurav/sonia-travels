import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── Upstash-backed limiter (reliable across serverless instances) ────────────
// Activates automatically when UPSTASH_REDIS_REST_URL + _TOKEN are set.
let upstash: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  upstash = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(15, '60 s'),
    prefix: 'sonia-rl',
    analytics: false,
  })
}

// ── In-memory fallback (best-effort; per-instance only) ──────────────────────
const WINDOW_MS = 60_000
const MAX = 15
const counters = new Map<string, { count: number; resetAt: number }>()

function memoryLimit(ip: string): boolean {
  const now = Date.now()
  const e = counters.get(ip)
  if (!e || now > e.resetAt) {
    counters.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  e.count++
  return e.count <= MAX
}

/** Returns true if the request is allowed, false if rate-limited. */
export async function checkRateLimit(ip: string): Promise<boolean> {
  if (upstash) {
    const { success } = await upstash.limit(ip)
    return success
  }
  return memoryLimit(ip)
}

export const usingDurableLimiter = upstash !== null
