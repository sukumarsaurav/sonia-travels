import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'
import { computePricing, type AddonKey } from '@/lib/pricing'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  // Razorpay not configured — tell the client to use the manual-callback flow.
  if (!keyId || !keySecret) {
    return NextResponse.json({ configured: false })
  }

  let body: { booking_id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { booking_id } = body
  if (!booking_id) {
    return NextResponse.json({ error: 'booking_id is required' }, { status: 400 })
  }

  const supabase = adminClient()

  // Load the booking and its package to recompute the authoritative amount.
  const { data: booking, error: bErr } = await supabase
    .from('bookings')
    .select('id, booking_ref, package_id, travelers, add_ons, payment_status')
    .eq('id', booking_id)
    .single()

  if (bErr || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  if (booking.payment_status === 'paid') {
    return NextResponse.json({ error: 'Booking already paid' }, { status: 409 })
  }

  let packagePrice = 0
  if (booking.package_id) {
    const { data: pkg } = await supabase
      .from('packages')
      .select('price')
      .eq('id', booking.package_id)
      .single()
    packagePrice = pkg?.price ?? 0
  }
  if (!packagePrice) {
    return NextResponse.json({ error: 'Unable to price this booking' }, { status: 422 })
  }

  const addonList: AddonKey[] = Array.isArray(booking.add_ons) ? booking.add_ons : []
  const addons = Object.fromEntries(addonList.map(k => [k, true]))
  const { total } = computePricing({ packagePrice, travelers: booking.travelers, addons })
  const amountPaise = total * 100

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

  try {
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: booking.booking_ref,
      notes: { booking_id: booking.id, booking_ref: booking.booking_ref },
    })

    // Record a pending payment linked to the order.
    await supabase.from('payments').insert({
      booking_id: booking.id,
      amount: total,
      method: 'razorpay',
      status: 'pending',
      razorpay_order_id: order.id,
    })

    return NextResponse.json({
      configured: true,
      order_id: order.id,
      amount: amountPaise,
      currency: 'INR',
      key_id: keyId,
      booking_ref: booking.booking_ref,
    })
  } catch (e) {
    console.error('[create-order]', e)
    return NextResponse.json({ error: 'Could not create payment order' }, { status: 502 })
  }
}
