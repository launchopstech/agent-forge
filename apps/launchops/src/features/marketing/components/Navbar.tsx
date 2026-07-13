'use client'

import { useEffect, useState } from 'react'
import { LogoMark } from './LogoMark'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      id="nav"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: '64px',
        transition: 'background .3s, border-color .3s',
        borderBottom: scrolled ? '1px solid var(--border-sub)' : '1px solid transparent',
        background: scrolled ? 'rgba(6,6,15,.75)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : undefined,
      }}
    >
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '-.03em',
              textDecoration: 'none',
            }}
          >
            <LogoMark size={32} />
            <span>
              <span style={{ color: 'var(--lo-text)' }}>Launch</span>
              <span style={{ color: 'var(--violet-hi)' }}>Ops</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <ul
            className="nav-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {[
              ['Services', '#services'],
              ['Work', '#work'],
              ['Process', '#process'],
              ['Pricing', '#pricing'],
              ['FAQ', '#faq'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="nav-link">
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a href="#contact" className="lo-btn lo-btn-vio" style={{ fontSize: '.875rem' }}>
            Start a project
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--lo-text)',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '6px',
            }}
            className="mobile-ham"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border-sub)',
            padding: '20px 28px',
          }}
        >
          {[
            ['Services', '#services'],
            ['Work', '#work'],
            ['Process', '#process'],
            ['Pricing', '#pricing'],
            ['FAQ', '#faq'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '10px 0',
                fontSize: '.9rem',
                fontWeight: 500,
                color: 'var(--lo-text)',
                borderBottom: '1px solid var(--border-sub)',
                textDecoration: 'none',
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="lo-btn lo-btn-vio"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
          >
            Start a project
          </a>
        </div>
      )}
    </nav>
  )
}
