/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { ScrollReveal } from './ScrollReveal'

const cards = [
  {
    num: '01',
    title: 'Google AI Overviews',
    body: "Clear site structure, useful local content, and consistent business information can improve your eligibility to appear in Google's AI-powered results.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <path d="M12 3l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 12l-3.75 2.7 1.5-4.5L6 7.5h4.5L12 3z" />
        <path d="M5 19h14" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'ChatGPT & Copilot',
    body: 'When customers ask for a local provider, complete directory listings, reviews, and consistent citations give AI systems stronger information to work with.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Perplexity & AI Search',
    body: 'AI search engines favor useful, attributable sources. We build the technical and content foundation that helps your business become a credible source.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={22}
        height={22}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
]

export function AiVisibilitySection() {
  return (
    <section id="ai-visibility" style={{ padding: '96px 0', background: 'var(--bg-alt)' }}>
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
                <path d="M12 3l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 12l-3.75 2.7 1.5-4.5L6 7.5h4.5L12 3z" />
              </svg>
              The New SEO
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
              Your customers are asking AI.{' '}
              <span style={{ color: 'var(--accent)' }}>We help you become easier to find.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sub)', lineHeight: 1.8 }}>
              More and more people skip Google&apos;s blue links and type their question straight
              into ChatGPT, Perplexity, or Google&apos;s AI Overview. We strengthen the website,
              authority, and local-business signals used across traditional and AI-powered search.
            </p>
          </div>
        </ScrollReveal>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}
          className="ai-vis-grid"
        >
          {cards.map(({ num, title, body, icon }, i) => (
            <ScrollReveal key={num} delay={(i + 1) as 1 | 2 | 3}>
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-xl)',
                  padding: '32px 26px',
                  transition: 'border-color .3s, transform .25s var(--ease)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="ai-vis-card"
              >
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
                    flex: 1,
                  }}
                >
                  {body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={1}>
          <div
            style={{
              marginTop: 32,
              background: 'var(--surface)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 'var(--r)',
              padding: '20px 28px',
            }}
          >
            <p
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Everything we do — your website, SEO, and Google presence — is already built with AI
              search in mind. It&apos;s not an extra. It&apos;s how we work.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <style>{`
        @media (max-width: 1024px) { .ai-vis-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 640px) { .ai-vis-grid { grid-template-columns: 1fr !important; } }
        .ai-vis-card:hover { border-color: rgba(16,185,129,.3) !important; transform: translateY(-4px); }
      `}</style>
    </section>
  )
}
