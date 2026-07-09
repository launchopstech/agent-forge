import Image from 'next/image'
import { Home, Calendar, Shield, Star } from 'lucide-react'

const STATS = [
  { icon: <Home size={22} />, value: '200+', label: 'Projects Completed' },
  { icon: <Calendar size={22} />, value: '10+ Years', label: 'In Business' },
  { icon: <Shield size={22} />, value: 'Licensed & Insured', label: 'NJ State Certified' },
  { icon: <Star size={22} />, value: '5-Star', label: 'Google Reviews' },
]

export function AboutSection() {
  return (
    <section id="about" style={{ padding: '96px 24px', background: 'var(--bg)' }}>
      <div
        className="about-grid"
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Text */}
        <div className="reveal">
          <div className="eyebrow">Who We Are</div>
          <h2 className="section-heading">New Jersey&apos;s Trusted General Contractor</h2>
          <p style={{ color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 20 }}>
            Blue Stone Construction LLC is a family-operated general contracting company based in
            Lake Hiawatha, NJ. We specialize in residential and commercial construction — from full
            home remodels to room additions, new builds, and everything in between.
          </p>
          <p style={{ color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 36 }}>
            When you hire Blue Stone, you get a hands-on team that shows up, communicates clearly,
            and delivers work you&apos;ll be proud of for decades. No shortcuts. No runaround. Just
            honest craftsmanship from people who care about your home as much as you do.
          </p>

          {/* Stats grid */}
          <div
            className="about-stats"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '16px',
                  background: 'var(--green-light)',
                  borderRadius: 'var(--r)',
                }}
              >
                <span style={{ color: 'var(--green)', marginTop: 2, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            style={{
              color: 'var(--green)',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Get a Free Estimate →
          </a>
        </div>

        {/* Photo */}
        <div
          className="reveal d1"
          style={{
            position: 'relative',
            height: 480,
            borderRadius: 'var(--r-lg)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
            alt="Blue Stone Construction team on job site"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-grid .photo-placeholder { height: 280px !important; }
        }
        @media (max-width: 480px) {
          .about-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
