// Single source of truth for booking pricing — imported by both the client
// (BookingFlow) and the server (create-order). The server recomputes the
// amount from these constants so a tampered client payload cannot change
// what the customer is actually charged.

export const ADDON_PRICES = {
  insurance: 600,
  photo: 2400,
  airport: 1200,
} as const

export type AddonKey = keyof typeof ADDON_PRICES

export const GST_RATE = 0.05

export interface PricingInput {
  packagePrice: number
  travelers: number
  addons: Partial<Record<AddonKey, boolean>>
}

export interface PricingBreakdown {
  base: number
  addonsTotal: number
  gst: number
  total: number
}

export function computePricing({ packagePrice, travelers, addons }: PricingInput): PricingBreakdown {
  const safeTravelers = Math.max(1, Math.min(15, Math.floor(travelers || 1)))
  const base = packagePrice * safeTravelers
  const addonsTotal = (Object.keys(ADDON_PRICES) as AddonKey[]).reduce(
    (sum, key) => (addons[key] ? sum + ADDON_PRICES[key] * safeTravelers : sum),
    0
  )
  const gst = Math.round((base + addonsTotal) * GST_RATE)
  return { base, addonsTotal, gst, total: base + addonsTotal + gst }
}
