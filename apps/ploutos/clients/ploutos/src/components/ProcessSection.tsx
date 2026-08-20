/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { ScrollReveal } from './ScrollReveal'

const steps = [
  {
    number: '01',
    title: 'Review',
    body: 'We review your website, Google presence, competitors, and the path a customer takes before calling you.',
  },
  {
    number: '02',
    title: 'Plan & proposal',
    body: 'You receive a prioritized plan with a clear scope, timeline, responsibilities, and custom price before work begins.',
  },
  {
    number: '03',
    title: 'Build & launch',
    body: 'We handle the design, implementation, tracking, and launch while keeping approvals simple and visible.',
  },
  {
    number: '04',
    title: 'Improve',
    body: 'If ongoing growth is a fit, we manage local SEO and Google Ads with straightforward reporting and next actions.',
  },
]

export function ProcessSection() {
  return (
    <section id="process" style={{ padding: '96px 0', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
            <div className="eyebrow">How It Works</div>
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
              A clear path from review to&nbsp;
              <span style={{ color: 'var(--accent)' }}>results.</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--sub)', lineHeight: 1.8 }}>
              No mystery process or vague retainers. You know what is happening, who is doing it,
              and what comes next.
            </p>
          </div>
        </ScrollReveal>

        <div className="process-grid">
          {steps.map(({ number, title, body }, index) => (
            <ScrollReveal key={number} delay={((index % 3) + 1) as 1 | 2 | 3}>
              <article className="process-card">
                <span className="process-number">{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <style>{`
        .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .process-card { height: 100%; padding: 28px 24px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r-xl); }
        .process-number { display: inline-block; color: var(--accent); font-family: var(--font-serif), Georgia, serif; font-size: 1.4rem; font-weight: 800; margin-bottom: 28px; }
        .process-card h3 { color: var(--text); font-family: var(--font-serif), Georgia, serif; font-size: 1.1rem; margin-bottom: 9px; }
        .process-card p { color: var(--sub); font-size: .86rem; line-height: 1.7; }
        @media (max-width: 900px) { .process-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 540px) { .process-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  )
}
