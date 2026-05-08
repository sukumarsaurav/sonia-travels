import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RevealProvider } from '@/components/ui/Reveal'
import { BLOG_POSTS } from '../data'

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.seoTitle,
    description: post.seoDesc,
    keywords: post.tags.join(', '),
    openGraph: { title: post.seoTitle, description: post.seoDesc, type: 'article', publishedTime: post.publishedAt },
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Very lightweight markdown → HTML: headings, bold, tables, paragraphs */
function renderBody(md: string) {
  const lines = md.split('\n')
  const out: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // H2
    if (line.startsWith('## ')) {
      out.push(<h2 key={i} style={{ fontFamily: 'var(--serif)', fontSize: 30, fontWeight: 500, margin: '40px 0 12px', letterSpacing: '-0.01em' }}>{line.slice(3)}</h2>)
      i++; continue
    }
    // H3
    if (line.startsWith('### ')) {
      out.push(<h3 key={i} style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, margin: '28px 0 8px' }}>{line.slice(4)}</h3>)
      i++; continue
    }
    // HR
    if (line.startsWith('---')) {
      out.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '32px 0' }}/>)
      i++; continue
    }
    // Table
    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/))
      out.push(
        <div key={`t${i}`} style={{ overflowX: 'auto', margin: '16px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            {rows.map((row, ri) => {
              const cells = row.split('|').slice(1, -1).map(c => c.trim())
              const Tag = ri === 0 ? 'th' : 'td'
              return (
                <tr key={ri} style={{ background: ri === 0 ? 'var(--ink-900)' : ri % 2 === 0 ? 'white' : 'var(--sand-50)' }}>
                  {cells.map((c, ci) => (
                    <Tag key={ci} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--line)', color: ri === 0 ? 'white' : 'inherit', fontFamily: ri === 0 ? 'var(--mono)' : undefined, fontSize: ri === 0 ? 11 : 14, letterSpacing: ri === 0 ? '0.1em' : undefined, textTransform: ri === 0 ? 'uppercase' : undefined }}>
                      {renderInline(c)}
                    </Tag>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )
      continue
    }
    // List item
    if (line.startsWith('- **') || line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++ }
      out.push(
        <ul key={`ul${i}`} style={{ paddingLeft: 20, margin: '12px 0', display: 'grid', gap: 6 }}>
          {items.map((it, k) => <li key={k} style={{ fontSize: 15, color: 'var(--ink-700)', lineHeight: 1.6 }}>{renderInline(it)}</li>)}
        </ul>
      )
      continue
    }
    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++ }
      out.push(
        <ol key={`ol${i}`} style={{ paddingLeft: 24, margin: '12px 0', display: 'grid', gap: 6 }}>
          {items.map((it, k) => <li key={k} style={{ fontSize: 15, color: 'var(--ink-700)', lineHeight: 1.6 }}>{renderInline(it)}</li>)}
        </ol>
      )
      continue
    }
    // Blank line
    if (line.trim() === '') { i++; continue }
    // Paragraph
    out.push(<p key={i} style={{ fontSize: 16, color: 'var(--ink-700)', lineHeight: 1.7, margin: '0 0 16px' }}>{renderInline(line)}</p>)
    i++
  }
  return out
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[.+?\]\(.+?\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    const linkMatch = part.match(/^\[(.+?)\]\((.+?)\)$/)
    if (linkMatch) return <a key={i} href={linkMatch[2]} style={{ color: 'var(--terra-700)', textDecoration: 'underline' }}>{linkMatch[1]}</a>
    return part
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <RevealProvider>
      <Navbar/>
      <main>

        {/* ── Hero ── */}
        <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
          <div className={`ph-img ${post.hero}`} style={{ height: '100%' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.72))' }}/>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, color: 'white' }}>
            <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>
              <Link href="/blog" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, textDecoration: 'none' }}>
                ← All articles
              </Link>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--terra-600)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{post.category}</span>
                {post.tags.slice(0, 3).map(t => (
                  <span key={t} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 11, padding: '4px 10px', borderRadius: 99 }}>{t}</span>
                ))}
              </div>
              <h1 style={{ fontFamily: 'var(--serif)', fontSize: 48, fontWeight: 500, margin: '0 0 12px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{post.title}</h1>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, opacity: 0.8 }}>
                <span>{formatDate(post.publishedAt)}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Article body ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 32px' }}>
          <p style={{ fontSize: 18, color: 'var(--ink-700)', lineHeight: 1.7, margin: '0 0 32px', fontStyle: 'italic', paddingBottom: 32, borderBottom: '1px solid var(--line)' }}>
            {post.excerpt}
          </p>
          <div>{renderBody(post.body)}</div>

          {/* ── Share / CTA strip ── */}
          <div style={{ marginTop: 48, padding: '28px', background: 'var(--sand-100)', borderRadius: 14, border: '1px solid var(--sand-200)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Planning this trip?</div>
            <p style={{ fontSize: 14, color: 'var(--ink-700)', margin: '0 0 16px' }}>We handle cabs, packages, hotels and more from Pathankot. Call or WhatsApp us — we'll sort out the details.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="tel:+918460222809" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--ink-900)', color: 'white', padding: '11px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                📞 Call Now
              </a>
              <a href="https://wa.me/918460222809" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#25D366', color: 'white', padding: '11px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                💬 WhatsApp
              </a>
              <Link href="/cabs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid var(--line)', color: 'var(--ink-900)', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                View cab fares →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related posts ── */}
        <div style={{ background: 'var(--sand-50)', paddingBottom: 64 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--terra-700)', textTransform: 'uppercase', marginBottom: 24, paddingTop: 48 }}>More articles</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-3">
              {related.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="lift" style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
                    <div className={`ph-img ${p.hero}`} style={{ height: 160 }}/>
                    <div style={{ padding: 20 }}>
                      <div style={{ fontSize: 11, color: 'var(--terra-700)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{p.category}</div>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 500, lineHeight: 1.25 }}>{p.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer/>
    </RevealProvider>
  )
}
