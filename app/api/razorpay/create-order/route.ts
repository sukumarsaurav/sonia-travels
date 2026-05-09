import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: NextRequest) {
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
