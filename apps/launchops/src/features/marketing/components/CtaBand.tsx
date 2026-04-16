export function CtaBand() {
  return (
    <section
      id="cta-band"
      style={{
        padding: '100px 0',
        background:
          'linear-gradient(135deg,rgba(79,46,220,.12) 0%,rgba(124,58,237,.08) 50%,rgba(49,46,129,.12) 100%)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(124,58,237,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.04) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontSize: 'clamp(2rem,4.5vw,3.6rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-.05em',
              marginBottom: 18,
            }}
          >
            Ready to ship?
            <br />
            <span className="grad">Let&apos;s launch it.</span>
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--lo-sub)',
              maxWidth: 480,
              margin: '0 auto 36px',
            }}
          >
            Whether it&apos;s your first product, a business upgrade, or a full SaaS platform — we
            take on 2–3 new projects per quarter. Slots fill fast.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a href="#contact" className="lo-btn lo-btn-vio">
              Launch your project
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                width="15"
                height="15"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#pricing" className="lo-btn lo-btn-ghost">
              View pricing
            </a>
          </div>
          <p
            style={{
              marginTop: 18,
              fontSize: '.8rem',
              color: 'var(--lo-muted)',
            }}
          >
            No sales deck. No commitment. Just an honest conversation about your project.
          </p>
        </div>
      </div>
    </section>
  )
}
