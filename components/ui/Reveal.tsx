'use client'
import { useEffect, useRef } from 'react'

export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const nodes = document.querySelectorAll('.reveal')
    nodes.forEach(n => obs.observe(n))
    return () => obs.disconnect()
  }, [])
}

export function RevealProvider({ children }: { children: React.ReactNode }) {
  useReveal()
  return <>{children}</>
}
