/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { ScrollReveal } from './ScrollReveal'

export function ArchitectSection() {
  return (
    <section id="architect" style={{ padding: '96px 0', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 28px', textAlign: 'center' }}>
        <ScrollReveal>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              width={11}
              height={11}
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Why We&apos;re Different
          </div>

          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(1.9rem,3.5vw,3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              marginBottom: 28,
            }}
          >
            You Get the Owner.{' '}
            <span style={{ color: 'var(--accent)' }}>Not an Intern. Not a Chatbot.</span>
          </h2>

          <p
            style={{ fontSize: '1.05rem', color: 'var(--sub)', lineHeight: 1.85, marginBottom: 22 }}
          >
            When you work with Ploutos, you deal directly with the person doing the work — no
            middlemen, no account managers, no playing telephone. You get a direct phone number and
            fast responses.
          </p>

          <p
            style={{ fontSize: '1.05rem', color: 'var(--sub)', lineHeight: 1.85, marginBottom: 44 }}
          >
            Changes move without an agency approval chain. Questions are answered within one
            business day. And because one person understands the full system, fewer details get lost
            between teams. That&apos;s the difference between a boutique specialist and a big
            agency.
          </p>

          {/* Capacity pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(16,185,129,.07)',
              border: '1px solid rgba(16,185,129,.25)',
              borderRadius: 99,
              padding: '10px 22px',
            }}
          >
            <span className="dot dot-pulse" style={{ width: 8, height: 8 }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
              <strong style={{ color: 'var(--accent)' }}>Founder-led delivery</strong> with a
              deliberately small client roster
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          {/* Three pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 16,
              marginTop: 64,
            }}
            className="arch-grid"
          >
            {[
              {
                icon: '🎯',
                title: 'One Point of Contact',
                body: 'The person discussing the work with you is accountable for delivering it.',
              },
              {
                icon: '⚡',
                title: 'Direct Response',
                body: 'Direct communication and a one-business-day response target.',
              },
              {
                icon: '🔒',
                title: 'Total Ownership',
                body: 'You own delivered code, credentials, and infrastructure after final payment.',
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '24px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{icon}</div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 7,
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--sub)', lineHeight: 1.6 }}>
                  {body}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
      <style>{`
        @media (max-width: 640px) { .arch-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
