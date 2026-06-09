'use client'

import { ChevronRight } from 'lucide-react'

const SERVICES = [
  {
    icon: '🏗️',
    title: 'General Contracting',
    desc: "Full project management from permits to final walkthrough. We coordinate everything so you don't have to.",
  },
  {
    icon: '🏠',
    title: 'Home Remodels',
    desc: 'Kitchen, bathroom, basement, and whole-home renovations built to your vision and budget.',
  },
  {
    icon: '🏡',
    title: 'Room Additions',
    desc: "Expand your living space with seamlessly integrated additions that match your home's existing style.",
  },
  {
    icon: '🔨',
    title: 'New Construction',
    desc: 'Ground-up residential and commercial builds, from foundation to roof.',
  },
  {
    icon: '🔧',
    title: 'Exterior Work',
    desc: 'Siding, roofing, decks, patios, and curb appeal improvements that last.',
  },
  {
    icon: '🏢',
    title: 'Commercial Projects',
    desc: 'Light commercial construction for small businesses, offices, and investment properties across NJ.',
  },
]

export function ServicesSection() {
  return (
    <section id="services" style={{ padding: '96px 24px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div
            className="eyebrow"
            style={{
              background: 'rgba(45,122,79,0.2)',
              borderColor: 'rgba(45,122,79,0.3)',
              color: '#7ECFA0',
            }}
          >
            What We Do
          </div>
          <h2 className="section-heading" style={{ color: '#fff' }}>
            Full-Service Construction,
            <br />
            Start to Finish
          </h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.6)', margin: '0 auto' }}>
            We handle every phase of your project in-house. One point of contact, no confusion, no
            surprises.
          </p>
        </div>

        {/* Cards grid */}
        <div
          className="svc-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
            marginBottom: 48,
          }}
        >
          {SERVICES.map((s) => (
            <div
              key={s.title}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: '3px solid var(--green)',
                borderRadius: 'var(--r-lg)',
                padding: '28px 24px',
                transition: 'background 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = 'rgba(45,122,79,0.1)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = 'rgba(255,255,255,0.04)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{s.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading), sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 10,
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}
              >
                {s.desc}
              </p>
              <a
                href="#contact"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#7ECFA0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Learn More <ChevronRight size={14} />
              </a>
            </div>
          ))}
        </div>

        {/* CTA band */}
        <div
          style={{
            background: 'var(--green)',
            borderRadius: 'var(--r-xl)',
            padding: '32px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Ready to start your project?
          </p>
          <a
            href="#contact"
            style={{
              background: 'var(--navy)',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 'var(--r)',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Get a Free Estimate
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .svc-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .svc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
