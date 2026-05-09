import { createServerSupabase } from '@/lib/supabase-server'
import { AdminShell } from '@/components/admin/AdminShell'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  // Role check — only users with role='admin' in user_profiles may enter
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <AdminShell
      user={{ name: user.user_metadata?.full_name || user.email || 'Admin', email: user.email || '', avatar: user.user_metadata?.avatar_url || '' }}
    />
  )
}
