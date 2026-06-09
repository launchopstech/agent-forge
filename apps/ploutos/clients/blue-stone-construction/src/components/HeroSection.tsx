import { ChevronRight, Star, MapPin, HardHat } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--navy) 0%, #1E3A5F 60%, #2D4A6B 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle texture overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '120px 24px 80px',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Trust badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(45,122,79,0.2)',
            border: '1px solid rgba(45,122,79,0.4)',
            borderRadius: 99,
            padding: '6px 18px',
            marginBottom: 32,
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7ECFA0',
          }}
        >
          <Star size={12} fill="currentColor" />
          Trusted by New Jersey Homeowners
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading), sans-serif',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            marginBottom: 24,
          }}
        >
          Built Right.
          <br />
          <span style={{ color: '#7ECFA0' }}>Built to Last.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.72)',
            marginBottom: 40,
            lineHeight: 1.7,
          }}
        >
          General Contracting · Remodels · Additions · New Construction
          <br />
          Serving Lake Hiawatha, Morris County &amp; all of New Jersey
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#contact"
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '16px 32px' }}
          >
            Get Your Free Quote <ChevronRight size={18} />
          </a>
          <a
            href="#portfolio"
            className="btn-outline"
            style={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.3)',
              fontSize: '1rem',
              padding: '16px 32px',
            }}
          >
            View Our Work
          </a>
        </div>

        {/* Trust stats bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            marginTop: 64,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: <HardHat size={20} />, stat: '200+', label: 'Projects Completed' },
            { icon: <Star size={20} />, stat: '5-Star', label: 'Google Rated' },
            { icon: <MapPin size={20} />, stat: 'Lake Hiawatha, NJ', label: 'Based Locally' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                flex: '1 1 200px',
                padding: '20px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#7ECFA0' }}>{item.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{item.stat}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
