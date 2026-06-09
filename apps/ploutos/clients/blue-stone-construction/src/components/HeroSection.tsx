import Image from 'next/image'
import { ChevronRight, Star, MapPin, HardHat } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background photo */}
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
      />

      {/* Dark overlay for text contrast */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,20,10,0.6) 0%, rgba(10,20,10,0.45) 55%, rgba(10,20,10,0.75) 100%)',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '140px 24px 80px',
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
            background: 'rgba(27,111,171,0.25)',
            border: '1px solid rgba(27,111,171,0.5)',
            borderRadius: 99,
            padding: '6px 18px',
            marginBottom: 32,
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7BC4EE',
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
          <span style={{ color: '#7BC4EE' }}>Built to Last.</span>
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.82)',
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
              borderColor: 'rgba(255,255,255,0.35)',
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
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid rgba(255,255,255,0.1)',
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
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#7BC4EE' }}>{item.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{item.stat}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
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
