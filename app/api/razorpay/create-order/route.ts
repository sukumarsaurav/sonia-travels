import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Mark as dynamic so Next.js never tries to pre-render this route at build time
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret || keyId.includes('REPLACE_ME')) {
    return NextResponse.json({ error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables.' }, { status: 503 })
  }

  // Instantiate inside handler — avoids build-time evaluation when keys are absent
  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret })

  const { amount, currency = 'INR', receipt } = await req.json()

  if (!amount || typeof amount !== 'number' || amount < 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  try {
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    })
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Order creation failed' }, { status: 500 })
  }
}
