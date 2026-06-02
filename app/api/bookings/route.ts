import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase-server'

// Service-role client: bypasses RLS, server-only. Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[bookings] SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon key. Set this env var.')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

function generateRef() {
  const now = new Date()
  const pad = (n: number, l = 2) => String(n).padStart(l, '0')
  const datePart = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  // crypto.randomUUID gives 122 bits of entropy — no collision risk
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `BK${datePart}${rand}`
}

// POST — public: anyone can submit a booking request
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    customer_name, customer_phone, customer_email,
    package_id, package_name, travelers, depart_date,
    amount, room_type, notes, add_ons,
  } = body as Record<string, unknown>

  if (!customer_name || !customer_phone || !package_name) {
    return NextResponse.json({ error: 'customer_name, customer_phone and package_name are required' }, { status: 400 })
  }

  // Basic phone sanity check
  if (typeof customer_phone === 'string' && !/^[+0-9\s\-]{7,20}$/.test(customer_phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }

  const booking_ref = generateRef()
  const supabase = adminClient()

  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      booking_ref,
      customer_name, customer_phone, customer_email,
      package_id, package_name, travelers, depart_date,
      amount, room_type, notes,
      add_ons: add_ons ?? [],
      status: 'pending',
      payment_status: 'unpaid',
    }])
    .select()
    .single()

  if (error) {
    console.error('[bookings POST]', error.message)
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id, booking_ref: data.booking_ref })
}

// GET — admin only: verify session role before returning data
export async function GET() {
  const sessionSupabase = await createServerSupabase()
  const { data: { user } } = await sessionSupabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await sessionSupabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await adminClient()
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
