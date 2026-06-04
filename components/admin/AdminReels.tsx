'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { Btn, Pill } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Form'
import { Ic } from '@/components/ui/Icons'
import type { Reel } from '@/types'

const BUCKET_URL = 'https://zcizoajjjqqlclmvwqow.supabase.co/storage/v1/object/public/reels'

export function AdminReels() {
  const supabase = createBrowserSupabase()
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)

  // add-form state
  const [caption, setCaption] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const videoRef = useRef<HTMLInputElement>(null)
  const posterRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const { data } = await supabase.from('reels').select('*').order('sort_order', { ascending: true })
    setReels((data as Reel[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  async function uploadFile(file: File, prefix: string): Promise<string> {
    const ext = file.name.split('.').pop()
    const name = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: upErr } = await supabase.storage.from('reels').upload(name, file, { upsert: true, contentType: file.type })
    if (upErr) throw new Error(upErr.message)
    return `${BUCKET_URL}/${name}`
  }

  const resetForm = () => {
    setCaption(''); setInstagramUrl(''); setSortOrder(String(reels.length))
    setVideoFile(null); setPosterFile(null)
    if (videoRef.current) videoRef.current.value = ''
    if (posterRef.current) posterRef.current.value = ''
  }

  const add = async () => {
    setError('')
    if (!videoFile && !instagramUrl.trim()) {
      setError('Add either a video file or an Instagram link.')
      return
    }
    setSaving(true)
    try {
      const video_url = videoFile ? await uploadFile(videoFile, 'vid') : null
      const poster_url = posterFile ? await uploadFile(posterFile, 'poster') : null
      const { error: insErr } = await supabase.from('reels').insert({
        caption: caption.trim() || null,
        video_url,
        poster_url,
        instagram_url: instagramUrl.trim() || null,
        sort_order: parseInt(sortOrder) || 0,
        active: true,
      })
      if (insErr) throw new Error(insErr.message)
      resetForm()
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (id: string, active: boolean) => {
    await supabase.from('reels').update({ active }).eq('id', id)
    setReels(prev => prev.map(r => r.id === id ? { ...r, active } : r))
  }

  const updateOrder = async (id: string, sort_order: number) => {
    await supabase.from('reels').update({ sort_order }).eq('id', id)
    setReels(prev => [...prev].map(r => r.id === id ? { ...r, sort_order } : r).sort((a, b) => a.sort_order - b.sort_order))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this reel?')) return
    await supabase.from('reels').delete().eq('id', id)
    setReels(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--line)', background: 'white' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 500, margin: 0 }}>Reels</h1>
        <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '4px 0 0' }}>
          Shown on the homepage after the Services section. Upload a vertical video (autoplays) or paste an Instagram reel link with a thumbnail.
        </p>
      </div>

      <div style={{ padding: 40, display: 'grid', gap: 28 }}>

        {/* Add form */}
        <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 14, padding: 24 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Add a reel</div>
          {error && <div style={{ background: '#fadcd6', border: '1px solid #f5c4bc', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--terra-700)', marginBottom: 16 }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Video file (vertical .mp4 — autoplays)">
              <input ref={videoRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={e => setVideoFile(e.target.files?.[0] || null)} style={{ fontSize: 13 }}/>
            </Field>
            <Field label="Thumbnail / poster (image)">
              <input ref={posterRef} type="file" accept="image/*" onChange={e => setPosterFile(e.target.files?.[0] || null)} style={{ fontSize: 13 }}/>
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="Instagram reel link (optional if a video is uploaded)">
              <Input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…"/>
            </Field>
            <Field label="Order">
              <Input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)}/>
            </Field>
          </div>

          <Field label="Caption (optional)">
            <Textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Happy customer in Manali…" style={{ minHeight: 60 }}/>
          </Field>

          <div style={{ marginTop: 16 }}>
            <Btn variant="dark" onClick={add} disabled={saving} icon={<Ic.plus s={14}/>}>
              {saving ? 'Uploading…' : 'Add reel'}
            </Btn>
          </div>
        </div>

        {/* List */}
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--ink-500)', textTransform: 'uppercase', marginBottom: 14 }}>
            {reels.length} reel{reels.length === 1 ? '' : 's'}
          </div>
          {loading ? (
            <div style={{ color: 'var(--ink-400)', fontSize: 14 }}>Loading…</div>
          ) : reels.length === 0 ? (
            <div style={{ color: 'var(--ink-500)', fontSize: 14 }}>No reels yet — add one above.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {reels.map(r => (
                <div key={r.id} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: 12, padding: 14, display: 'flex', gap: 16, alignItems: 'center' }}>
                  {/* preview */}
                  <div style={{ width: 64, height: 96, borderRadius: 8, overflow: 'hidden', background: 'var(--ink-900)', flexShrink: 0 }}>
                    {r.video_url ? (
                      <video src={r.video_url} poster={r.poster_url || undefined} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : r.poster_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.poster_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    ) : (
                      <div className="ph-img terra" style={{ width: '100%', height: '100%' }}/>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                      <Pill color={r.video_url ? 'green' : 'gold'} size="sm">{r.video_url ? 'Video' : 'Instagram link'}</Pill>
                      <Pill color={r.active ? 'green' : 'gold'} size="sm">{r.active ? 'Live' : 'Hidden'}</Pill>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--ink-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.caption || r.instagram_url || '(no caption)'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                    <label style={{ fontSize: 12, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      Order
                      <input type="number" defaultValue={r.sort_order} onBlur={e => updateOrder(r.id, parseInt(e.target.value) || 0)} style={{ width: 56, padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 6, fontSize: 13 }}/>
                    </label>
                    {r.active
                      ? <Btn variant="ghost" size="sm" onClick={() => toggle(r.id, false)}>Hide</Btn>
                      : <Btn variant="dark" size="sm" onClick={() => toggle(r.id, true)}>Show</Btn>}
                    <Btn variant="danger" size="sm" onClick={() => del(r.id)}>Delete</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
