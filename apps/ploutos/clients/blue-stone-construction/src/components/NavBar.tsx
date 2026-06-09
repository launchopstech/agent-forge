'use client'

import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#fff',
        boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '0 24px',
          height: 70,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a href="#home" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--navy)',
              fontFamily: 'var(--font-heading), sans-serif',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Blue Stone Construction
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-sub)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            LLC · Lake Hiawatha, NJ
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'nowrap' }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-sub)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--green)')}
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = 'var(--text-sub)')
              }
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            Free Quote
          </a>
        </nav>

        {/* Mobile hamburger — shown via CSS @media, not inline style */}
        <button
          className="mobile-ham"
          onClick={() => setOpen(!open)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid var(--border-sub)',
            padding: '20px 24px 28px',
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text)',
                borderBottom: '1px solid var(--border-sub)',
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="tel:8621234567" className="btn-outline" style={{ justifyContent: 'center' }}>
              <Phone size={16} /> Call Now
            </a>
            <a
              href="#contact"
              className="btn-primary"
              style={{ justifyContent: 'center' }}
              onClick={() => setOpen(false)}
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
