/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { ScrollReveal } from './ScrollReveal'

const pillars = [
  {
    num: '01',
    title: 'Websites That Work',
    body: 'Fast, professional, built to convert. We design and build your site so it looks great on mobile, loads quickly, and turns visitors into inquiries — then handle hosting and maintenance.',
    features: [
      'Custom design & build',
      'Mobile-first, performance-focused build',
      'Search-ready structure and metadata',
      'Hosting & maintenance included',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Local SEO That Compounds',
    body: 'We improve the signals that help your business compete in Google Maps and local search — visibility that can compound over time.',
    features: [
      'Google Business Profile optimization',
      'On-page SEO (title tags, schema, speed)',
      'Local citation building',
      'Monthly ranking report',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Google Ads That Bring Calls',
    body: 'When you need leads now, not in six months. We build and run targeted search campaigns so you show up for exactly the searches that matter — and track every call back to the dollar spent.',
    features: [
      'Search campaign build & management',
      'Keyword & negative list strategy',
      'Weekly bid optimization',
      'Call & conversion tracking',
    ],
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
]

export function ServicesSection() {
  return (
    <section id="services" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
            <div className="eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                width={11}
                height={11}
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Website. SEO. Ads. All of It.
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem,3.2vw,2.6rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: 16,
              }}
            >
              Website. SEO. Ads. <span style={{ color: 'var(--accent)' }}>All of It.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sub)', lineHeight: 1.8 }}>
              Most agencies pick one lane. A website agency can&apos;t run your ads. An SEO shop
              can&apos;t build your site. We do all three — so the whole thing works together
              instead of falling apart at the joins.
            </p>
          </div>
        </ScrollReveal>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}
          className="svc-grid"
        >
          {pillars.map(({ num, title, body, features, icon }, i) => (
            <ScrollReveal key={num} delay={(i + 1) as 1 | 2 | 3}>
              <div
                style={{
                  background: 'var(--bg-alt)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  padding: '32px 26px',
                  transition: 'border-color .3s, transform .25s var(--ease)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="svc-card"
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 22,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'rgba(16,185,129,.1)',
                        border: '1px solid rgba(16,185,129,.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                      }}
                    >
                      {icon}
                    </div>
                    <span
                      style={{
                        fontSize: '2rem',
                        fontWeight: 900,
                        color: 'rgba(16,185,129,.18)',
                        fontFamily: 'var(--font-serif), Georgia, serif',
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {num}
                    </span>
                  </div>
                  <h3
                    className="font-serif"
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      marginBottom: 10,
                      color: 'var(--text)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--sub)',
                      lineHeight: 1.75,
                      marginBottom: 22,
                    }}
                  >
                    {body}
                  </p>
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    borderTop: '1px solid var(--border-sub)',
                    paddingTop: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 9,
                    marginTop: 'auto',
                  }}
                >
                  {features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: '0.8rem',
                        color: 'var(--sub)',
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        width={12}
                        height={12}
                        style={{ color: 'var(--accent)', flexShrink: 0 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) { .svc-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) { .svc-grid { grid-template-columns: 1fr !important; } }
        .svc-card:hover { border-color: rgba(16,185,129,.3) !important; transform: translateY(-4px); }
      `}</style>
    </section>
  )
}
