/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
export function Footer() {
  const year = new Date().getFullYear()

  const links = [
    ['Services', '#services'],
    ['How It Works', '#process'],
    ['Our Work', '#work'],
    ['Pricing', '#pricing'],
    ['Free Website Review', '#contact'],
  ]

  return (
    <footer
      style={{
        background: '#0c0f17',
        borderTop: '1px solid rgba(255,255,255,.06)',
        padding: '56px 0 32px',
      }}
    >
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 48,
            flexWrap: 'wrap',
            gap: 32,
          }}
          className="foot-top"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'var(--accent)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#fff',
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  boxShadow: '0 0 16px rgba(16,185,129,.25)',
                }}
              >
                Π
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#e2e8f0',
                  textTransform: 'uppercase',
                }}
              >
                PLOUTOS
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.7, maxWidth: 280 }}>
              Websites, local SEO, and Google Ads for U.S. service businesses that want a clearer
              path to more qualified calls.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                marginTop: 14,
                background: 'rgba(16,185,129,.08)',
                border: '1px solid rgba(16,185,129,.22)',
                color: 'var(--accent)',
                fontSize: '0.69rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: 99,
              }}
            >
              <span className="dot dot-pulse" />
              Taking on new projects
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#475569',
                marginBottom: 16,
              }}
            >
              Navigate
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(([label, href]) => (
                <a key={label} href={href} className="foot-link">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#475569',
                marginBottom: 16,
              }}
            >
              Contact
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:admin@ploutos.llc" className="foot-link">
                admin@ploutos.llc
              </a>
              <a href="#contact" className="foot-link">
                Start a project →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="foot-bottom">
          <span>© {year} Ploutos. All Rights Reserved.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="/privacy" className="foot-legal-link">
              Privacy
            </a>
            <a href="/terms" className="foot-legal-link">
              Terms
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .foot-link {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          font-size: .84rem;
          color: #64748b;
          transition: color .2s;
          text-decoration: none;
        }
        .foot-link:hover { color: #e2e8f0; }
        .foot-legal-link {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          color: #475569;
          transition: color .2s;
          text-decoration: none;
          font-size: .77rem;
        }
        .foot-legal-link:hover { color: #64748b; }
        .foot-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,.05);
          font-size: .77rem;
          color: #475569;
        }
        @media (max-width: 768px) {
          .foot-top { flex-direction: column; }
          .foot-bottom { flex-direction: column; gap: 10px; text-align: center; }
        }
      `}</style>
    </footer>
  )
}
