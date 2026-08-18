import { ScrollReveal } from './ScrollReveal'

const cards = [
  {
    audience: 'For Growing Local Businesses',
    headline: 'Plain English. Real Results.',
    body: 'No confusing tech jargon. No management layers. We fix slow websites, build high-converting Google Ads, and do all the technical heavy lifting — so you can focus on running your business.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    points: [
      'No tech jargon — plain English throughout',
      'We handle everything, top to bottom',
      'Fast turnaround — live in days, not months',
      'You own everything — no lock-in',
    ],
  },
  {
    audience: 'For Businesses Ready to Scale',
    headline: 'Serious Tech. Simple to Work With.',
    body: 'As your business grows, your tech needs to keep up. We build clean, fast, scalable systems that handle real traffic — without the bloated agency price tag.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    points: [
      'Clean, fast websites built for real traffic',
      'Scalable setup that grows with you',
      'Secure, well-maintained infrastructure',
      'One point of contact — always',
    ],
  },
]

export function TrustSection() {
  return (
    <section id="trust" style={{ padding: '96px 0', background: 'var(--bg-alt)' }}>
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
                <polyline points="20 6 9 17 4 12" />
              </svg>
              We Fix This
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem,3.2vw,2.6rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: 28,
              }}
            >
              Whether you&apos;re a corner store or a&nbsp;growing business,{' '}
              <span style={{ color: 'var(--accent)' }}>we fix what&apos;s holding you back.</span>
            </h2>
            {/* Common problems callout */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'center',
              }}
            >
              {[
                'Slow sites losing Google rankings',
                "DIY templates that don't convert",
                "Paying for ads that aren't working",
                'No one picks up the phone',
              ].map((problem) => (
                <div
                  key={problem}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--sub)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 99,
                    padding: '6px 14px',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    width={11}
                    height={11}
                    style={{ color: 'var(--accent)', flexShrink: 0 }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {problem}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}
          className="trust-grid"
        >
          {cards.map(({ audience, headline, body, icon, points }, i) => (
            <ScrollReveal key={audience} delay={(i + 1) as 1 | 2}>
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderLeft: `3px solid var(--accent)`,
                  borderRadius: 'var(--r-xl)',
                  padding: '36px 32px',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'rgba(16,185,129,.1)',
                    border: '1px solid rgba(16,185,129,.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    marginBottom: 22,
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 8,
                  }}
                >
                  {audience}
                </div>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    marginBottom: 14,
                    color: 'var(--text)',
                  }}
                >
                  {headline}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--sub)',
                    lineHeight: 1.75,
                    marginBottom: 24,
                  }}
                >
                  {body}
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {points.map((pt) => (
                    <li
                      key={pt}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: '0.875rem',
                        color: 'var(--sub)',
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        width={14}
                        height={14}
                        style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .trust-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
