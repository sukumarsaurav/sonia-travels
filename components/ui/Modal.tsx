'use client'
import React from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  sub?: string
  width?: number
  children: React.ReactNode
  actions?: React.ReactNode
}

export function Modal({ open, onClose, title, sub, width = 640, children, actions }: ModalProps) {
  if (!open) return null
  return (
    <div onClick={onClose} className="modal-scrim" style={{
      position: 'fixed', inset: 0, background: 'rgba(26,24,20,0.55)', zIndex: 200,
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="modal-card" style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: width,
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 32px 80px -20px rgba(0,0,0,0.4)', overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 28px 18px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
            {sub && <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 4 }}>{sub}</div>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 8, color: 'var(--ink-500)', display: 'grid', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6L18 18M6 18L18 6"/></svg>
          </button>
        </div>
        <div style={{ padding: '24px 28px', overflow: 'auto', flex: 1 }}>{children}</div>
        {actions && (
          <div style={{ padding: '16px 28px', borderTop: '1px solid var(--line)', background: 'var(--sand-50)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
