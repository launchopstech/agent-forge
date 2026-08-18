import { ScrollReveal } from './ScrollReveal'

const tiers = [
  {
    name: 'Core Care',
    price: '$750',
    period: '/mo',
    desc: 'Everything you need to keep your website running fast, secure, and up to date — without lifting a finger.',
    features: [
      'Fast, secure hosting included',
      'Security patches & monitoring',
      'Core app updates & maintenance',
      'Monthly SEO health checkup',
      '2 hours of layout edits/month',
      'Monthly performance report',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Growth Engine',
    price: '$2,950',
    period: '/mo',
    desc: "The full package — paid ads, SEO, and conversion fixes — with a monthly call to review what's working and what to do next.",
    features: [
      'Everything in Core Care',
      'Complete Google Ads management',
      'Meta (Facebook/Instagram) campaigns',
      'Advanced Google Maps SEO',
      'Conversion page optimization',
      '1-on-1 monthly growth strategy call',
    ],
    cta: 'Book Your Audit',
    featured: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                width={11}
                height={11}
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Simple Monthly Plans
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem,3.2vw,2.6rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: 14,
              }}
            >
              Simple Monthly Plans.{' '}
              <span style={{ color: 'var(--accent)' }}>No Lock-In. No Surprises.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sub)', lineHeight: 1.8 }}>
              Month-to-month. Cancel anytime. Scope locked before billing starts.
            </p>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 24,
            maxWidth: 860,
            margin: '0 auto',
          }}
          className="pricing-grid"
        >
          {tiers.map(({ name, price, period, desc, features, cta, featured }, i) => (
            <ScrollReveal key={name} delay={(i + 1) as 1 | 2}>
              <div
                style={{
                  background: featured ? 'var(--surface)' : 'var(--bg-alt)',
                  border: featured ? '1px solid rgba(16,185,129,.5)' : '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  padding: '40px 36px',
                  position: 'relative',
                  boxShadow: featured ? '0 0 60px rgba(16,185,129,.1)' : undefined,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--accent)',
                      color: '#fff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '5px 18px',
                      borderRadius: 99,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: featured ? 'var(--accent)' : 'var(--muted)',
                      marginBottom: 10,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}
                  >
                    <span
                      className="font-serif"
                      style={{
                        fontSize: '3rem',
                        fontWeight: 800,
                        color: 'var(--text)',
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                      }}
                    >
                      {price}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{period}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--sub)', lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 11,
                    marginBottom: 36,
                    flex: 1,
                  }}
                >
                  {features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: '0.875rem',
                        color: 'var(--sub)',
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: 'rgba(16,185,129,.1)',
                          border: '1px solid rgba(16,185,129,.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          width={9}
                          height={9}
                          style={{ color: 'var(--accent)' }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '0.93rem',
                    fontWeight: 700,
                    padding: '14px 20px',
                    borderRadius: 'var(--r)',
                    textDecoration: 'none',
                    transition: 'all .2s var(--ease)',
                    ...(featured
                      ? { background: 'var(--accent)', color: '#fff' }
                      : {
                          border: '1.5px solid rgba(0,0,0,.12)',
                          color: 'var(--text)',
                          background: 'transparent',
                        }),
                  }}
                  className={featured ? 'btn-p-main' : 'btn-p-out'}
                >
                  {cta}
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <p
          style={{ textAlign: 'center', marginTop: 28, fontSize: '0.8rem', color: 'var(--muted)' }}
        >
          All retainers are month-to-month with no lock-in. Cancel with 30 days notice.
        </p>
      </div>
      <style>{`
        @media (max-width: 768px) { .pricing-grid { grid-template-columns: 1fr !important; } }
        .btn-p-main:hover { background: var(--accent-dark) !important; box-shadow: 0 4px 20px rgba(16,185,129,.3) !important; }
        .btn-p-out:hover { border-color: rgba(16,185,129,.4) !important; color: var(--accent) !important; }
      `}</style>
    </section>
  )
}
