export function Manifesto() {
  return (
    <section
      id="manifesto"
      style={{
        padding: '96px 0',
        background: 'linear-gradient(180deg,transparent,rgba(124,58,237,.04),transparent)',
      }}
    >
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(1.6rem,3vw,2.4rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-.03em',
              color: 'var(--lo-text)',
            }}
          >
            Whether you&apos;re launching your first product, scaling a business, or finally
            shipping that idea you&apos;ve been sitting on —{' '}
            <em style={{ fontStyle: 'normal', color: 'var(--violet-hi)' }}>
              speed and quality shouldn&apos;t be a trade-off.
            </em>{' '}
            We move fast and we build things that last.
          </p>
          <p
            style={{
              marginTop: 28,
              fontSize: '.875rem',
              color: 'var(--lo-muted)',
              letterSpacing: '.06em',
            }}
          >
            — The LaunchOps standard
          </p>
        </div>
      </div>
    </section>
  )
}
