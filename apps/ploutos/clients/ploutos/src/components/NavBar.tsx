'use client'

/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { memo, useCallback, useEffect, useRef, useState } from 'react'

export const NavBar = memo(function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#process' },
    { label: 'Work', href: '#work' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        transition: 'background .3s, border-color .3s',
        borderBottom: `1px solid ${scrolled ? 'rgba(0,0,0,.08)' : 'transparent'}`,
        background: scrolled ? 'rgba(250,247,242,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : undefined,
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : undefined,
      }}
    >
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: 'var(--accent)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                color: '#fff',
                fontFamily: 'var(--font-serif), Georgia, serif',
                flexShrink: 0,
                boxShadow: '0 0 20px rgba(16,185,129,.3)',
              }}
            >
              Π
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: 'var(--text)',
                textTransform: 'uppercase',
              }}
            >
              PLOUTOS
            </span>
          </a>

          {/* Desktop links */}
          <ul
            className="hide-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {links.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--sub)',
                    transition: 'color .2s',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--sub)')}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href="#contact"
            className="btn-vio hide-mobile"
            style={{ fontSize: '0.8rem', padding: '10px 20px', letterSpacing: '0.05em' }}
          >
            Get My Free Website Review
          </a>

          {/* Mobile hamburger */}
          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text)',
            }}
            className="show-mobile-flex"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              width={22}
              height={22}
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          style={{
            background: 'rgba(250,247,242,0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0,0,0,.08)',
            padding: '20px 28px 28px',
          }}
        >
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={closeMenu}
              style={{
                minHeight: 48,
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--sub)',
                borderBottom: '1px solid rgba(0,0,0,.06)',
                textDecoration: 'none',
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            className="btn-vio"
            style={{ marginTop: 18, display: 'flex', justifyContent: 'center', minHeight: 48 }}
          >
            Get My Free Website Review
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
      `}</style>
    </nav>
  )
})
