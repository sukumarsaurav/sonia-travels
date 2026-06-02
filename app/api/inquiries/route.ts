import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase-server'

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[inquiries] SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon key.')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

// POST — public: contact form submissions
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, email, interest, message } = body as Record<string, unknown>

  if (!name || !phone) {
    return NextResponse.json({ error: 'name and phone are required' }, { status: 400 })
  }

  if (typeof phone === 'string' && !/^[+0-9\s\-]{7,20}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
  }

  const { data, error } = await adminClient()
    .from('inquiries')
    .insert([{ name, phone, email, interest, message, channel: 'web', unread: true }])
    .select()
    .single()

  if (error) {
    console.error('[inquiries POST]', error.message)
    return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

// GET — admin only
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
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
