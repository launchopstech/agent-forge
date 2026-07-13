const personas = [
  {
    emoji: '💼',
    title: 'The Executive with an Idea',
    body: "You've spotted a gap in your industry. You know what needs to exist — you just don't have the time or team to build it. We become your technical co-founder for the project.",
    cta: '→ Side project · Internal tool · Spin-out',
    delay: 'd1',
  },
  {
    emoji: '🏪',
    title: 'The Local or Small Business',
    body: 'Your business runs on relationships and word of mouth. We help you add the digital layer — a proper website, online ordering, booking system, or customer portal — that extends your reach without changing what makes you great.',
    cta: '→ Ecommerce · Bookings · Local presence',
    delay: 'd2',
  },
  {
    emoji: '🚀',
    title: 'The SaaS Founder',
    body: 'You have the market, the customers, and the clarity. You need a technical partner who can move fast, make good architecture decisions, and ship something people actually pay for.',
    cta: '→ MVP · Product-market fit · Scale',
    delay: 'd3',
  },
  {
    emoji: '⚡',
    title: 'The Vibe Coder',
    body: "You've got Cursor open, a working prototype, and a genuine vision — but you know it needs real engineering to go from demo to product. We come in as the senior layer that gets it to production.",
    cta: '→ Prototype to product · Code review · Launch',
    delay: 'd4',
  },
  {
    emoji: '🏬',
    title: 'The Ecommerce Operator',
    body: "You sell online and want to do it better. Smarter product recommendations, faster checkout, automated customer support, better inventory visibility — we build the integrations and custom logic your platform can't do out of the box.",
    cta: '→ Shopify · Custom store · Automation',
    delay: 'd5',
  },
  {
    emoji: '🏢',
    title: 'The Operator Going Digital',
    body: 'Your business works — you just know it could work better with the right software. We build the internal tools, client portals, and workflow automations that remove the friction from your day-to-day operations.',
    cta: '→ Internal tools · Portals · Workflow automation',
    delay: 'd6',
  },
]

export function Audience() {
  return (
    <section id="audience" style={{ padding: '112px 0', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Who we work with
          </div>
          <h2 className="h2">Do you see yourself here?</h2>
          <p className="lead" style={{ margin: '0 auto' }}>
            We work with a wide range of people — the common thread is that they all have something
            worth building.
          </p>
        </div>

        <div
          className="aud-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 18,
          }}
        >
          {personas.map((p) => (
            <div
              key={p.title}
              className={`reveal ${p.delay}`}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-sub)',
                borderLeft: '2px solid rgba(124,58,237,.4)',
                borderRadius: 'var(--r-lg)',
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{p.emoji}</div>
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  marginBottom: 10,
                  letterSpacing: '-.02em',
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  color: 'var(--lo-sub)',
                  fontSize: '.88rem',
                  lineHeight: 1.7,
                }}
              >
                {p.body}
              </p>
              <p
                style={{
                  fontSize: '.78rem',
                  color: 'var(--violet-hi)',
                  fontWeight: 600,
                  marginTop: 12,
                }}
              >
                {p.cta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
