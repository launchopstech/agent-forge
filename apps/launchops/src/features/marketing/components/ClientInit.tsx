'use client'

import { useEffect } from 'react'

export function ClientInit() {
  useEffect(() => {
    // Scroll reveal
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('up')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    // Spotlight on service cards
    const cards = document.querySelectorAll<HTMLElement>('.svc-card-spotlight')
    const handlers = new Map<HTMLElement, (e: MouseEvent) => void>()
    cards.forEach((card) => {
      const fn = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
      }
      handlers.set(card, fn)
      card.addEventListener('mousemove', fn)
    })

    return () => {
      io.disconnect()
      handlers.forEach((fn, card) => card.removeEventListener('mousemove', fn))
    }
  }, [])

  return null
}
