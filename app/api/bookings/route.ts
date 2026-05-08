import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function generateRef() {
  const now = new Date()
  const pad = (n: number, l = 2) => String(n).padStart(l, '0')
  const datePart = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth()+1)}${pad(now.getDate())}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `BK${datePart}${rand}`
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    customer_name, customer_phone, customer_email,
    package_id, package_name, travelers, depart_date,
    amount, room_type, notes, add_ons
  } = body

  if (!customer_name || !customer_phone || !package_name) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  const booking_ref = generateRef()

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      booking_ref, customer_name, customer_phone, customer_email,
      package_id, package_name, travelers, depart_date,
      amount, room_type, notes, add_ons: add_ons || [],
      status: 'pending', payment_status: 'unpaid'
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id, booking_ref: data.booking_ref })
}

export async function GET() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
