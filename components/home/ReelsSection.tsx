import { createServerSupabase } from '@/lib/supabase-server'
import { ReelsCarousel } from './ReelsCarousel'
import type { Reel } from '@/types'

const INSTAGRAM_URL = 'https://www.instagram.com/'

export async function ReelsSection() {
  const supabase = await createServerSupabase()
  const { data } = await supabase
    .from('reels')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  const reels = (data as Reel[] | null) ?? []
  if (!reels.length) return null

  return <ReelsCarousel reels={reels} instagramUrl={INSTAGRAM_URL}/>
}
