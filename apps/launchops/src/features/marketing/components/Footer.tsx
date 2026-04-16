import { LogoMark } from './LogoMark'

export function Footer() {
  return (
    <footer
      id="footer"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-sub)',
        padding: '64px 0 36px',
      }}
    >
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 48,
            marginBottom: 48,
          }}
          className="foot-grid"
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '-.03em',
                marginBottom: 14,
              }}
            >
              <LogoMark size={28} />
              <span>
                <span style={{ color: 'var(--lo-text)' }}>Launch</span>
                <span style={{ color: 'var(--violet-hi)' }}>Ops</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '.85rem',
                color: 'var(--lo-sub)',
                lineHeight: 1.7,
                maxWidth: 290,
              }}
            >
              A technical studio for founders, operators, and builders who want to move fast. We
              design, build, and launch software — from MVPs to SaaS platforms and AI-powered
              systems.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 14,
                background: 'rgba(124,58,237,.08)',
                border: '1px solid rgba(124,58,237,.18)',
                color: 'var(--violet-hi)',
                fontSize: '.7rem',
                fontWeight: 600,
                padding: '4px 11px',
                borderRadius: 99,
              }}
            >
              <span className="dot dot-pulse" />
              Currently accepting projects
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div
              style={{
                fontSize: '.72rem',
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--lo-muted)',
                marginBottom: 14,
              }}
            >
              Navigate
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                ['Services', '#services'],
                ['Work', '#work'],
                ['Process', '#process'],
                ['Tech stack', '#tech'],
                ['Pricing', '#pricing'],
                ['FAQ', '#faq'],
                ['Contact', '#contact'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="foot-link">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Legal + Contact */}
          <div>
            <div
              style={{
                fontSize: '.72rem',
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--lo-muted)',
                marginBottom: 14,
              }}
            >
              Legal
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                ['Privacy policy', '#'],
                ['Terms of service', '#'],
                ['Cookie policy', '#'],
                ['GDPR / DPIA', '#'],
              ].map(([label, href]) => (
                <a key={label} href={href} className="foot-link">
                  {label}
                </a>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontSize: '.72rem',
                  fontWeight: 700,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--lo-muted)',
                  marginBottom: 14,
                }}
              >
                Contact
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <a href="mailto:hello@launchops.co" className="foot-link">
                  hello@launchops.co
                </a>
                <a href="#contact" className="foot-link">
                  Start a project →
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 20,
            borderTop: '1px solid var(--border-sub)',
            fontSize: '.78rem',
            color: 'var(--lo-muted)',
          }}
          className="foot-bottom"
        >
          <span>© {new Date().getFullYear()} LaunchOps. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 18 }}>
            {['Privacy', 'Terms', 'Cookies'].map((label) => (
              <a
                key={label}
                href="#"
                className="foot-link"
                style={{ color: 'var(--lo-muted)', fontSize: '.78rem' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
