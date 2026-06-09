'use client'

import { Phone, Mail, MapPin } from 'lucide-react'

const SERVICES_LINKS = [
  'General Contracting',
  'Home Remodels',
  'Room Additions',
  'New Construction',
  'Exterior Work',
  'Commercial Projects',
]

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#111827', padding: '64px 24px 0' }}>
      <div
        className="footer-grid"
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: 48,
          paddingBottom: 48,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-heading), sans-serif',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#7BC4EE',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Blue Stone Construction LLC
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            Built Right. Built to Last.
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.8,
              maxWidth: 280,
            }}
          >
            Family-operated general contractor serving Morris County and all of New Jersey. Licensed
            &amp; insured.
          </p>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
            <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
            Lake Hiawatha, NJ 07034
          </div>
        </div>

        {/* Services */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 20,
            }}
          >
            Services
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICES_LINKS.map((s) => (
              <a
                key={s}
                href="#services"
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#7BC4EE')}
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')
                }
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 20,
            }}
          >
            Quick Links
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {QUICK_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.5)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#7BC4EE')}
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)')
                }
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 20,
            }}
          >
            Contact
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE ?? ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <Phone size={14} />
              {process.env.NEXT_PUBLIC_PHONE ?? '(862) XXX-XXXX'}
            </a>
            <a
              href="mailto:bluestonegcllc@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <Mail size={14} />
              bluestonegcllc@gmail.com
            </a>
            <a
              href="#contact"
              style={{
                marginTop: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--green)',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: 'var(--r)',
                fontSize: '0.85rem',
                fontWeight: 700,
                width: 'fit-content',
              }}
            >
              Free Estimate
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '20px 0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
          © {year} Blue Stone Construction LLC. All rights reserved.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
          Website by{' '}
          <a
            href="https://ploutossolutions.com"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ploutos Solutions LLC
          </a>
        </p>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
