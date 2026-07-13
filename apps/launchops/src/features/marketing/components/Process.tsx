const steps = [
  {
    num: '01',
    title: 'Discovery Brief',
    body: 'Goals, stack audit, risk identification, and success metrics defined together.',
    days: 'Days 1–3',
  },
  {
    num: '02',
    title: 'Architecture',
    body: 'Agent graph design, data flows, compliance requirements, and infra decisions locked.',
    days: 'Days 4–7',
  },
  {
    num: '03',
    title: 'Core Build',
    body: 'Sprints with weekly demos. UI, agent logic, and integrations built in parallel.',
    days: 'Wk 2–5',
  },
  {
    num: '04',
    title: 'Evals & QA',
    body: 'Automated evals, adversarial testing, edge-case review, and guardrail validation.',
    days: 'Wk 5–6',
  },
  {
    num: '05',
    title: 'Compliance',
    body: 'DPIA walkthrough, audit log verification, PII sign-off, and documentation hand-off.',
    days: 'Wk 6',
  },
  {
    num: '06',
    title: 'Ship',
    body: 'Production deploy, monitoring live, and 30-day support window included.',
    days: 'Wk 6–7',
  },
]

export function Process() {
  return (
    <section id="process" style={{ padding: '112px 0', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ marginBottom: 64 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            How we work
          </div>
          <h2 className="h2">
            Brief to live.
            <br />
            Six steps. Ruthlessly efficient.
          </h2>
          <p className="lead">
            A clear, human delivery rhythm — tight feedback loops, async-first, with full visibility
            at every milestone regardless of your technical background.
          </p>
        </div>

        <div
          className="proc-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6,1fr)',
            gap: 0,
            position: 'relative',
          }}
        >
          {/* Connector line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 27,
              left: 'calc(100%/12)',
              right: 'calc(100%/12)',
              height: 1,
              background:
                'linear-gradient(90deg,transparent,var(--violet),var(--indigo),var(--violet),transparent)',
              opacity: 0.3,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`reveal d${i + 1}`}
              style={{ textAlign: 'center', padding: '0 10px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    background: i === 0 || i === 5 ? 'rgba(124,58,237,.12)' : 'var(--bg)',
                    border:
                      i === 0 || i === 5
                        ? '1px solid rgba(124,58,237,.5)'
                        : '1px solid var(--border)',
                    boxShadow: i === 0 || i === 5 ? '0 0 20px rgba(124,58,237,.25)' : 'none',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.75rem',
                    fontWeight: 800,
                    color: 'var(--violet-hi)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.num}
                </div>
              </div>
              <div
                style={{
                  fontSize: '.82rem',
                  fontWeight: 800,
                  marginBottom: 6,
                  letterSpacing: '-.01em',
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: '.75rem',
                  color: 'var(--lo-sub)',
                  lineHeight: 1.55,
                }}
              >
                {step.body}
              </div>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: 8,
                  fontSize: '.65rem',
                  fontWeight: 700,
                  color: 'var(--violet-hi)',
                  background: 'rgba(124,58,237,.1)',
                  border: '1px solid rgba(124,58,237,.2)',
                  padding: '2px 8px',
                  borderRadius: 99,
                }}
              >
                {step.days}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
