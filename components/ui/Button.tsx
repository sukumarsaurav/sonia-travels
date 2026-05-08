'use client'
import React from 'react'

type Variant = 'primary' | 'dark' | 'ghost' | 'forest' | 'whatsapp' | 'razorpay' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface BtnProps {
  children?: React.ReactNode
  variant?: Variant
  size?: Size
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  full?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--terra-600)', color: 'white', border: '1px solid var(--terra-700)' },
  dark: { background: 'var(--ink-900)', color: 'var(--sand-50)', border: '1px solid var(--ink-900)' },
  ghost: { background: 'transparent', color: 'var(--ink-900)', border: '1px solid var(--line)' },
  forest: { background: 'var(--forest-700)', color: 'white', border: '1px solid var(--forest-700)' },
  whatsapp: { background: '#25D366', color: 'white', border: '1px solid #1ebe5c' },
  razorpay: { background: '#0d2366', color: 'white', border: '1px solid #0d2366' },
  danger: { background: 'white', color: 'var(--terra-700)', border: '1px solid var(--terra-100)' },
}
const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 13, borderRadius: 6 },
  md: { padding: '10px 18px', fontSize: 14, borderRadius: 8 },
  lg: { padding: '14px 24px', fontSize: 15, borderRadius: 10 },
}

export function Btn({ children, variant = 'primary', size = 'md', onClick, type, full, icon, disabled, className }: BtnProps) {
  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      className={`press ${className || ''}`}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        fontWeight: 600,
        letterSpacing: '0.01em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        width: full ? '100%' : 'auto',
        justifyContent: 'center',
        transition: 'transform 0.05s, box-shadow 0.15s',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {icon}{children}
    </button>
  )
}

export function Pill({ children, color = 'sand', size = 'md' }: { children: React.ReactNode; color?: string; size?: 'sm' | 'md' }) {
  const colors: Record<string, { bg: string; fg: string; bd: string }> = {
    sand: { bg: 'var(--sand-100)', fg: 'var(--ink-700)', bd: 'var(--sand-200)' },
    forest: { bg: 'var(--forest-100)', fg: 'var(--forest-700)', bd: 'transparent' },
    terra: { bg: 'var(--terra-100)', fg: 'var(--terra-700)', bd: 'transparent' },
    gold: { bg: '#fbf2dc', fg: '#8a6a1f', bd: '#f1dfae' },
    green: { bg: '#dff0e1', fg: '#1f6e3a', bd: 'transparent' },
    red: { bg: '#fadcd6', fg: '#9b3220', bd: 'transparent' },
    grey: { bg: '#eee9e0', fg: 'var(--ink-500)', bd: 'transparent' },
  }
  const c = colors[color] || colors.sand
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: 99,
      background: c.bg, color: c.fg,
      fontSize: size === 'sm' ? 11 : 12,
      fontWeight: 600, letterSpacing: '0.02em',
      border: `1px solid ${c.bd}`,
    }}>{children}</span>
  )
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: 'green', Pending: 'gold', Cancelled: 'red',
    Captured: 'green', Refunded: 'grey', Awaiting: 'gold',
  }
  const color = map[status] || 'sand'
  const dotColor = color === 'green' ? 'var(--forest-600)' : color === 'red' ? 'var(--terra-600)' : color === 'gold' ? 'var(--gold-500)' : 'var(--ink-500)'
  return (
    <Pill color={color} size="sm">
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dotColor, display: 'inline-block' }}/>
      {status}
    </Pill>
  )
}
