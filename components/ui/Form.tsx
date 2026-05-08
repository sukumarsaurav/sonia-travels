'use client'
import React from 'react'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  border: '1px solid var(--line)', borderRadius: 8,
  background: 'white', fontSize: 14, color: 'var(--ink-900)', outline: 'none',
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 6, letterSpacing: '0.02em' }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 4 }}>{hint}</div>}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} className={`input-base ${props.className || ''}`}/>
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{props.children}</select>
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, minHeight: 96, resize: 'vertical', ...(props.style || {}) }}/>
}
