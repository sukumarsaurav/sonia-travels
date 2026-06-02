import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AccountShell } from '@/components/account/AccountShell'

export default async function AccountPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/account/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // RLS (bookings_select) already scopes rows to this user — matches on
  // user_id = auth.uid() OR customer_email = auth.email(). No need to
  // interpolate user-controlled values into a PostgREST filter string.
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <AccountShell
      user={{
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveller',
        email: user.email || '',
        phone: profile?.phone || '',
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
      }}
      bookings={bookings || []}
    />
  )
}
