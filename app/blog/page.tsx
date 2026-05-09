import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Section } from '@/components/ui/Section'
import { RevealProvider } from '@/components/ui/Reveal'
import { Ic } from '@/components/ui/Icons'
import { BLOG_POSTS } from './data'

export const metadata: Metadata = {
  title: 'Travel Blog | Pathankot Travel Tips, Cab Guides & Destination Guides | Sonia Travels',
  description: 'Travel guides, cab tips and destination highlights from Pathankot. Plan your trip to Dalhousie, Dharamshala, Vaishno Devi, Amritsar and more.',
  keywords: 'pathankot travel blog, travel guide pathankot, dalhousie travel guide, himachal travel tips, vaishno devi guide',
}

const CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map(p => p.category)))]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <RevealProvider>
      <Navbar/>
      <main>

        {/* ── Hero ── */}
        <div style={{ background: 'var(--sand-100)', paddingTop: 80, paddingBottom: 64 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 16 }}>
              Travel Blog
            </div>
            <h1 className="page-hero-h1" style={{ fontFamily: 'var(--serif)', fontSize: 64, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 16px', maxWidth: 600 }}>
              Guides &amp; tips for<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--terra-700)' }}>smarter travel.</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--ink-700)', margin: 0, maxWidth: 500, lineHeight: 1.6 }}>
              Destination guides, cab tips, itinerary ideas and insider advice from the Sonia Travels team in Pathankot.
            </p>
          </div>
        </div>

        {/* ── Featured post ── */}
        <Section padded>
          <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="lift featured-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', background: 'white' }}>
              <div className={`ph-img ${featured.hero}`} style={{ minHeight: 360 }}/>
              <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--terra-100)', color: 'var(--terra-700)', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{featured.category}</span>
                  <span style={{ background: 'var(--sand-100)', color: 'var(--ink-600)', fontSize: 11, padding: '4px 10px', borderRadius: 99 }}>Featured</span>
                </div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{featured.title}</h2>
                <p style={{ fontSize: 15, color: 'var(--ink-600)', lineHeight: 1.6, margin: '0 0 20px' }}>{featured.excerpt}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--ink-600)' }}>
                  <span>{formatDate(featured.publishedAt)}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <div style={{ marginTop: 20, fontSize: 14, fontWeight: 600, color: 'var(--terra-700)' }}>Read article →</div>
              </div>
            </div>
          </Link>
        </Section>

        {/* ── All posts ── */}
        <div style={{ background: 'var(--sand-50)' }}>
          <Section eyebrow="All articles" title="From the blog.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="grid-3">
              {rest.map((post, i) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="lift reveal" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', transitionDelay: `${i * 0.07}s` }}>
                    <div className={`ph-img ${post.hero}`} style={{ height: 200 }}/>
                    <div style={{ padding: 24 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <span style={{ background: 'var(--terra-100)', color: 'var(--terra-700)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{post.category}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 500, margin: '0 0 10px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>{post.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.55, margin: '0 0 16px' }}>{post.excerpt}</p>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-600)', paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>
        </div>

        {/* ── CTA ── */}
        <div style={{ background: 'var(--ink-900)', color: 'white', padding: '64px 32px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--gold-500)', textTransform: 'uppercase', marginBottom: 12 }}>Plan your trip</div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Ready to go? We'll handle the travel.</h2>
            <p style={{ fontSize: 16, opacity: 0.7, margin: '0 0 32px' }}>Cabs, tour packages, flights, hotels — one call does it all.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+918460222809" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-500)', color: 'var(--ink-900)', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <Ic.phone s={15}/> +91 84602 22809
              </a>
              <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: 'var(--ink-900)', padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                View Tour Packages →
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer/>
    </RevealProvider>
  )
}
