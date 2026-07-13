const services = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="22"
        height="22"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Turn Your Idea Into a Product',
    body: 'You have the vision. We handle everything else — design, engineering, and launch. Perfect for executives with a side idea or first-time founders who want it done right.',
    tags: ['MVP', 'Web apps', 'Rapid launch', 'SaaS'],
    star: false,
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="22"
        height="22"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Grow Your Business Online',
    body: 'For local shops, restaurants, service businesses, and ecommerce operators. A proper online presence, booking system, or store that actually brings in customers and revenue.',
    tags: ['Ecommerce', 'Online store', 'Bookings', 'Local business'],
    star: false,
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="22"
        height="22"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Build & Scale Your SaaS',
    body: 'From zero to a product people pay for. We architect subscription platforms, auth, billing, and multi-tenant systems — built to handle growth from day one.',
    tags: ['SaaS', 'Subscriptions', 'Multi-tenant', 'Billing'],
    star: false,
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="22"
        height="22"
      >
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <path d="M12 8v3M9.5 17.5l-2-2.5M14.5 17.5l2-2.5M10 11H7l-2 6M14 11h3l2 6" />
      </svg>
    ),
    title: 'AI & Automation That Works',
    body: 'Save hours, reduce errors, and serve customers faster. We add intelligent automation to your business — AI chat, smart workflows, document handling — built in where it actually helps.',
    tags: ['AI agents', 'Automations', 'Chat & copilots', 'Integrations'],
    star: true,
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="22"
        height="22"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Data, Reporting & Dashboards',
    body: "Stop guessing. We build the dashboards and reporting tools that show you what's actually happening in your business — in real time, in plain English.",
    tags: ['Dashboards', 'Analytics', 'Reports', 'BI'],
    star: false,
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        width="22"
        height="22"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Fractional CTO & Advisory',
    body: "Need a technical co-founder without the equity cost? We join your team, own the architecture, manage vendors, and make the technology decisions so you don't have to.",
    tags: ['Fractional CTO', 'Strategy', 'Cloud', 'Startup partner'],
    star: false,
  },
]

export function Services() {
  return (
    <section id="services" style={{ padding: '112px 0' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ marginBottom: 56 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            What we do
          </div>
          <h2 className="h2">
            Whatever stage you&apos;re at,
            <br />
            we&apos;ll launch it.
          </h2>
          <p className="lead">
            From a first idea to a growing business — we cover the full range of digital product
            work, with the latest technology (including AI) powering everything we ship.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 18,
          }}
          className="svc-grid"
        >
          {services.map((svc, i) => (
            <div
              key={svc.title}
              className={`svc-card-spotlight reveal d${(i % 3) + 1}${svc.star ? ' star' : ''}`}
              style={{
                background: 'var(--surface)',
                border: svc.star ? '1px solid rgba(124,58,237,.25)' : '1px solid var(--border-sub)',
                borderRadius: 'var(--r-lg)',
                padding: '32px 28px',
                transition: 'border-color .3s,transform .25s var(--ease),box-shadow .3s',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
              }}
            >
              {svc.star && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontSize: '.65rem',
                    fontWeight: 700,
                    letterSpacing: '.07em',
                    background: 'rgba(124,58,237,.15)',
                    border: '1px solid rgba(124,58,237,.3)',
                    color: 'var(--violet-hi)',
                    padding: '3px 9px',
                    borderRadius: 99,
                  }}
                >
                  Specialty
                </div>
              )}

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 11,
                  background: 'rgba(124,58,237,.12)',
                  border: '1px solid rgba(124,58,237,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22,
                  color: 'var(--violet-hi)',
                }}
              >
                {svc.icon}
              </div>

              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  marginBottom: 10,
                  letterSpacing: '-.02em',
                }}
              >
                {svc.title}
              </h3>
              <p
                style={{
                  color: 'var(--lo-sub)',
                  fontSize: '.88rem',
                  lineHeight: 1.7,
                  marginBottom: 18,
                }}
              >
                {svc.body}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '.7rem',
                      fontWeight: 600,
                      color: 'var(--lo-muted)',
                      background: 'rgba(255,255,255,.04)',
                      border: '1px solid var(--border-sub)',
                      padding: '3px 9px',
                      borderRadius: 99,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
