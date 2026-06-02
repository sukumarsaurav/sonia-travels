import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function POST(req: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  let body: {
    razorpay_order_id?: string
    razorpay_payment_id?: string
    razorpay_signature?: string
    booking_id?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking_id } = body
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !booking_id) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 })
  }

  // Verify the signature: HMAC-SHA256(order_id|payment_id, key_secret).
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  // Constant-time comparison to avoid timing attacks.
  const valid =
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))

  const supabase = adminClient()

  if (!valid) {
    await supabase
      .from('payments')
      .update({ status: 'failed', razorpay_payment_id })
      .eq('razorpay_order_id', razorpay_order_id)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
  }

  // Signature valid — mark payment captured and booking paid + confirmed.
  await supabase
    .from('payments')
    .update({ status: 'captured', razorpay_payment_id })
    .eq('razorpay_order_id', razorpay_order_id)

  await supabase
    .from('bookings')
    .update({ payment_status: 'paid', status: 'confirmed' })
    .eq('id', booking_id)

  return NextResponse.json({ success: true })
}
