/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { ScrollReveal } from './ScrollReveal'

export function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 0 96px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '0 28px',
          width: '100%',
          position: 'relative',
        }}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}
          className="hero-grid"
        >
          {/* Left: Copy */}
          <ScrollReveal>
            <div>
              <div className="eyebrow">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  width={11}
                  height={11}
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Websites + Google growth for U.S. service businesses
              </div>

              <h1
                className="font-serif"
                style={{
                  fontSize: 'clamp(2.6rem,4.5vw,4rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: 24,
                  color: 'var(--text)',
                }}
              >
                Get Found. Get Called. <span style={{ color: 'var(--accent)' }}>Get Paid.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.08rem',
                  color: 'var(--sub)',
                  lineHeight: 1.8,
                  maxWidth: 480,
                  marginBottom: 40,
                }}
              >
                We build your website, strengthen your local Google presence, and manage your ads —
                with one accountable partner connecting every part of the system.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#contact" className="btn-vio">
                  Get My Free Website Review
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="#services" className="btn-ghost">
                  See What We Do
                </a>
              </div>

              {/* Trust bar */}
              <div
                style={{
                  display: 'flex',
                  gap: 28,
                  marginTop: 52,
                  paddingTop: 28,
                  borderTop: '1px solid var(--border-sub)',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { val: 'Clear scope', lbl: 'Before work starts' },
                  { val: '100%', lbl: 'Done for you' },
                  { val: 'Your assets', lbl: 'After final payment' },
                ].map(({ val, lbl }) => (
                  <div key={val}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-serif), Georgia, serif',
                      }}
                    >
                      {val}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--sub)', marginTop: 2 }}>
                      {lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Geometric visual */}
          <ScrollReveal delay={2} className="hero-right">
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 420,
              }}
            >
              {/* Outer glow ring */}
              <div
                style={{
                  position: 'absolute',
                  width: 360,
                  height: 360,
                  borderRadius: '50%',
                  border: '1px solid rgba(16,185,129,.12)',
                  animation: 'spin-slow 20s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: 280,
                  height: 280,
                  borderRadius: '50%',
                  border: '1px solid rgba(16,185,129,.08)',
                  animation: 'spin-slow 14s linear infinite reverse',
                }}
              />

              {/* Center card stack */}
              <div style={{ position: 'relative', zIndex: 1, width: 260 }}>
                {/* Main card */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid rgba(16,185,129,.2)',
                    borderRadius: 'var(--r-xl)',
                    padding: '28px 24px',
                    boxShadow: '0 0 60px rgba(16,185,129,.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: 'var(--accent)',
                        borderRadius: 9,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1rem',
                        color: '#fff',
                        fontFamily: 'var(--font-serif), Georgia, serif',
                      }}
                    >
                      Π
                    </div>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      PLOUTOS
                    </span>
                  </div>

                  {[
                    { label: 'Website', value: 'Built for calls' },
                    { label: 'Local search', value: 'Maps-ready' },
                    { label: 'Google Ads', value: 'Tracked' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        background: 'rgba(0,0,0,.025)',
                        borderRadius: 7,
                        marginBottom: 6,
                        border: '1px solid var(--border-sub)',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', color: 'var(--sub)' }}>{label}</span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--accent)',
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Floating badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -18,
                    right: -18,
                    background: '#1A1A2E',
                    border: '1px solid rgba(16,185,129,.3)',
                    borderRadius: 12,
                    padding: '10px 16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,.15)',
                  }}
                >
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2 }}>
                    One connected system
                  </div>
                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      color: 'var(--accent)',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    Site · SEO · Ads
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}
