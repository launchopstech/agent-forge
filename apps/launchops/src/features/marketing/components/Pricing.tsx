const checkIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="9" height="9">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const tiers = [
  {
    tier: 'Starter',
    name: 'Discovery Sprint',
    price: '$4,500',
    priceNote: 'flat',
    desc: 'De-risk before you commit. Validate your AI hypothesis, map your data, and receive a build-ready spec and architecture doc.',
    features: [
      '5-day async intensive workshop',
      'AI feasibility & risk assessment',
      'Architecture & agent graph design',
      'Full spec doc + cost model',
      'Credited toward any MVP build',
    ],
    cta: 'Book a sprint',
    ctaStyle: 'out',
    feat: false,
  },
  {
    tier: 'Core',
    name: 'MVP Build',
    price: '$18,000',
    priceNote: 'Starting from',
    desc: 'A production-ready product, shipped in 6 weeks. Full-stack build including agent layer, UI, integrations, evals, and 30-day support.',
    features: [
      'Everything in Discovery Sprint',
      'Full-stack Next.js + agent build',
      'Multi-agent orchestration',
      'Compliance review + audit logging',
      'Evals suite + LangSmith setup',
      '30-day post-launch support',
    ],
    cta: 'Start a project',
    ctaStyle: 'main',
    feat: true,
  },
  {
    tier: 'Enterprise',
    name: 'Platform License',
    price: 'Custom',
    priceNote: null,
    desc: 'For teams that need ongoing development, a fractional CTO, or a dedicated engineering partnership scoped to your roadmap.',
    features: [
      'Everything in MVP Build',
      'Dedicated engineering resource',
      'White-label licensing options',
      'Quarterly roadmap planning',
      'SLA-backed response + uptime',
    ],
    cta: "Let's talk scope",
    ctaStyle: 'out',
    feat: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: '112px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Pricing
          </div>
          <h2 className="h2">
            Transparent.
            <br />
            Outcome-focused.
          </h2>
          <p className="lead" style={{ margin: '0 auto' }}>
            Fixed-scope engagements with clear deliverables. No surprise invoices. No retainer
            traps.
          </p>
        </div>

        <div
          className="pricing-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className={`reveal d${i + 1}`}
              style={{
                background: t.feat
                  ? 'linear-gradient(160deg,rgba(124,58,237,.08),var(--surface))'
                  : 'var(--surface)',
                border: t.feat ? '1px solid rgba(124,58,237,.45)' : '1px solid var(--border-sub)',
                borderRadius: 'var(--r-xl)',
                padding: '36px 30px',
                position: 'relative',
                transform: t.feat ? 'translateY(-10px)' : undefined,
                boxShadow: t.feat ? '0 0 50px rgba(124,58,237,.1)' : undefined,
              }}
            >
              {t.feat && (
                <div
                  style={{
                    position: 'absolute',
                    top: -13,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--violet)',
                    color: '#fff',
                    fontSize: '.7rem',
                    fontWeight: 700,
                    letterSpacing: '.06em',
                    padding: '4px 14px',
                    borderRadius: 99,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Most popular
                </div>
              )}

              <div
                style={{
                  fontSize: '.72rem',
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--lo-muted)',
                  marginBottom: 10,
                }}
              >
                {t.tier}
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '-.03em',
                  marginBottom: 8,
                }}
              >
                {t.name}
              </div>
              {t.priceNote && t.priceNote !== 'flat' && (
                <div style={{ fontSize: '.75rem', color: 'var(--lo-muted)', marginBottom: 4 }}>
                  {t.priceNote}
                </div>
              )}
              <div
                style={{
                  fontSize: t.price === 'Custom' ? '2rem' : '2.7rem',
                  fontWeight: 900,
                  letterSpacing: '-.05em',
                  lineHeight: 1,
                }}
              >
                {t.price}
                {t.priceNote === 'flat' && (
                  <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--lo-sub)' }}>
                    {' '}
                    flat
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: '.85rem',
                  color: 'var(--lo-sub)',
                  lineHeight: 1.65,
                  margin: '16px 0 24px',
                }}
              >
                {t.desc}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {t.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      fontSize: '.85rem',
                      lineHeight: 1.5,
                    }}
                  >
                    <div
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: '50%',
                        background: 'rgba(16,185,129,.13)',
                        border: '1px solid rgba(16,185,129,.28)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                        color: '#34d399',
                      }}
                    >
                      {checkIcon}
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '.9rem',
                  fontWeight: 700,
                  padding: 13,
                  borderRadius: 'var(--r)',
                  transition: 'all .2s',
                  textDecoration: 'none',
                  ...(t.ctaStyle === 'main'
                    ? { background: 'var(--violet)', color: '#fff' }
                    : {
                        border: '1px solid var(--border-sub)',
                        color: 'var(--lo-text)',
                        background: 'transparent',
                      }),
                }}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 28,
            fontSize: '.82rem',
            color: 'var(--lo-muted)',
          }}
        >
          All prices USD. Fixed scope — you approve the spec before a line of code is written.
          Sprint fee credited toward any full build.
        </p>
      </div>
    </section>
  )
}
