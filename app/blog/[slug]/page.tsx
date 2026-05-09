import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { RevealProvider } from '@/components/ui/Reveal'
import { Ic } from '@/components/ui/Icons'
import { BLOG_POSTS } from '../data'
import { ArticleSchema } from '@/components/seo/JsonLd'

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
    openGraph: { title: post.seoTitle, description: post.seoDesc, type: 'article', url: `https://soniatravels.in/blog/${post.slug}` },
    alternates: { canonical: `https://soniatravels.in/blog/${post.slug}` },
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Escape HTML special characters before applying inline transforms */
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Convert inline markdown (bold, italic, links) to HTML string */
function inl(text: string): string {
  return esc(text)
    .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#c75b3a;text-decoration:underline">$1</a>')
}

/** Convert markdown body to an HTML string — no JSX, no dynamic element types */
function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      out.push(`<h2 style="font-family:var(--serif);font-size:30px;font-weight:500;margin:40px 0 12px;letter-spacing:-0.01em">${inl(line.slice(3))}</h2>`)
      i++; continue
    }
    if (line.startsWith('### ')) {
      out.push(`<h3 style="font-family:var(--serif);font-size:22px;font-weight:500;margin:28px 0 8px">${inl(line.slice(4))}</h3>`)
      i++; continue
    }
    if (line.startsWith('---')) {
      out.push('<hr style="border:none;border-top:1px solid #e5e0d6;margin:32px 0"/>')
      i++; continue
    }
    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
      const rows = tableLines.filter(l => !/^\|[-| ]+\|$/.test(l))
      const tHead = rows[0] ? `<thead><tr>${rows[0].split('|').slice(1,-1).map(c => `<th style="padding:10px 14px;text-align:left;background:#1c1c1c;color:white;font-size:11px;letter-spacing:0.1em;text-transform:uppercase">${esc(c.trim())}</th>`).join('')}</tr></thead>` : ''
      const tBody = rows.slice(1).map((row, ri) => `<tr style="background:${ri % 2 === 0 ? 'white' : '#faf8f4'}">${row.split('|').slice(1,-1).map(c => `<td style="padding:10px 14px;border-bottom:1px solid #e5e0d6;font-size:14px">${inl(c.trim())}</td>`).join('')}</tr>`).join('')
      out.push(`<div style="overflow-x:auto;margin:16px 0"><table style="width:100%;border-collapse:collapse;font-size:14px">${tHead}<tbody>${tBody}</tbody></table></div>`)
      continue
    }
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++ }
      out.push(`<ul style="padding-left:20px;margin:12px 0">${items.map(it => `<li style="font-size:15px;color:#3d3530;line-height:1.6;margin-bottom:6px">${inl(it)}</li>`).join('')}</ul>`)
      continue
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++ }
      out.push(`<ol style="padding-left:24px;margin:12px 0">${items.map(it => `<li style="font-size:15px;color:#3d3530;line-height:1.6;margin-bottom:6px">${inl(it)}</li>`).join('')}</ol>`)
      continue
    }
    if (line.trim() === '') { i++; continue }
    out.push(`<p style="font-size:16px;color:#3d3530;line-height:1.7;margin:0 0 16px">${inl(line)}</p>`)
    i++
  }

  return out.join('\n')
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (!post) notFound()

  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <>
      <ArticleSchema post={post}/>
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
                <Ic.arrowL s={13}/> All articles
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

          {/* Body rendered from HTML string — avoids dynamic JSX element types */}
          <div dangerouslySetInnerHTML={{ __html: mdToHtml(post.body) }}/>

          {/* ── CTA strip ── */}
          <div style={{ marginTop: 48, padding: '28px', background: 'var(--sand-100)', borderRadius: 14, border: '1px solid var(--sand-200)' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Planning this trip?</div>
            <p style={{ fontSize: 14, color: 'var(--ink-700)', margin: '0 0 16px' }}>We handle cabs, packages, hotels and more from Pathankot. Call or WhatsApp us — we will sort out the details.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="tel:+918460222809" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--ink-900)', color: 'white', padding: '11px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                <Ic.phone s={14}/> Call Now
              </a>
              <a href="https://wa.me/918460222809" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#25D366', color: 'white', padding: '11px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                <Ic.whatsapp s={14}/> WhatsApp
              </a>
              <Link href="/cabs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid var(--line)', color: 'var(--ink-900)', padding: '11px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                View cab fares <Ic.arrow s={13}/>
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
    </>
  )
}
