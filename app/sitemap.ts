import { MetadataRoute } from 'next'
import { CAB_ROUTES } from './cabs/data'
import { BLOG_POSTS } from './blog/data'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://soniatravels.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch active packages from Supabase at build time
  let packageIds: string[] = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await supabase.from('packages').select('id').eq('active', true)
    packageIds = (data || []).map((p: { id: string }) => p.id)
  } catch {
    // Fallback to empty if DB unreachable at build time
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cabs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/packages`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const cabRoutePages: MetadataRoute.Sitemap = CAB_ROUTES.map(r => ({
    url: `${BASE_URL}/cabs/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: r.popular ? 0.85 : 0.75,
  }))

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(p => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const packagePages: MetadataRoute.Sitemap = packageIds.map(id => ({
    url: `${BASE_URL}/packages/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...cabRoutePages, ...blogPages, ...packagePages]
}
