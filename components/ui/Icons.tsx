'use client'

interface IconProps { s?: number; style?: React.CSSProperties; color?: string }

const ic = (d: string) => ({ s = 20, style, color }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={d}/></svg>
)
const ic2 = (d1: string, d2: string) => ({ s = 20, style, color }: IconProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={d1}/><path d={d2}/></svg>
)

export const Ic = {
  plane: ic("M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.78 9.5 19.79 19.79 0 01.7 6.3 2 2 0 012.7 4h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 11.6a16 16 0 006.29 6.29l1.68-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 18v.92z"),
  car: ic2("M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2", "M17 22H7a2 2 0 01-2-2v-4h14v4a2 2 0 01-2 2z"),
  train: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="4" y="4" width="16" height="12" rx="3"/>
      <path d="M4 10h16M8 16l-2 4M16 16l2 4M12 4v6"/>
    </svg>
  ),
  bus: ic("M8 6v6m0 0H3m5 0h13M3 12v5a1 1 0 001 1h1m0 0a2 2 0 004 0m-4 0h4m6 0a2 2 0 004 0m-4 0h4m0-6V7a2 2 0 00-2-2H5a2 2 0 00-2 2v5"),
  pkg: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
  shield: ic("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"),
  star: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  search: ic("M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"),
  arrow: ic("M5 12h14M12 5l7 7-7 7"),
  arrowL: ic("M19 12H5M12 19l-7-7 7-7"),
  check: ic("M20 6L9 17l-5-5"),
  x: ic2("M6 6L18 18", "M6 18L18 6"),
  plus: ic2("M12 5v14", "M5 12h14"),
  minus: ic("M5 12h14"),
  dot: ({ s = 8, color }: { s?: number; color?: string }) => (
    <span style={{ display: 'inline-block', width: s, height: s, borderRadius: '50%', background: color || 'currentColor' }}/>
  ),
  phone: ic("M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.78 9.5 19.79 19.79 0 01.7 6.3 2 2 0 012.7 4h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 11.6a16 16 0 006.29 6.29l1.68-1.29a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 18v.92z"),
  pin: ic2("M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z", "M12 10a2 2 0 100-4 2 2 0 000 4"),
  clock: ic2("M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"),
  users: ic2("M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"),
  cal: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  chart: ic2("M18 20V10", "M12 20V4M6 20v-6"),
  card: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  inbox: ic2("M22 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v7", "M22 13H16l-2 3H10l-2-3H2"),
  cog: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  navigation: ic("M3 11l19-9-9 19-2-8-8-2z"),
  tag: ic2("M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z", "M7 7h.01"),
  mountain: ic("M8 3l4 8 5-5 5 15H2L8 3z"),
  truck: ic("M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"),
  whatsapp: ({ s = 20, style }: IconProps) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" style={style}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M11.999 2C6.477 2 2 6.477 2 12c0 1.743.46 3.38 1.264 4.8L2 22l5.338-1.256A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
}
