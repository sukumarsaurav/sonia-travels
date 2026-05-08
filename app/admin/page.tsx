import { createServerSupabase } from '@/lib/supabase-server'
import { AdminShell } from '@/components/admin/AdminShell'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <AdminShell
      user={{ name: user.user_metadata?.full_name || user.email || 'Admin', email: user.email || '', avatar: user.user_metadata?.avatar_url || '' }}
    />
  )
}
