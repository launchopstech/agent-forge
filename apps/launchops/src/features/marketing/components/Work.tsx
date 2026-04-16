export function Work() {
  return (
    <section id="work" style={{ padding: '112px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ marginBottom: 52 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Case studies
          </div>
          <h2 className="h2">Work that launches.</h2>
          <p className="lead">Real products. Real outcomes. No smoke-and-mirrors demos.</p>
        </div>

        <div
          className="work-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2,1fr)',
            gap: 20,
          }}
        >
          {/* CampO AI card */}
          <div
            className="reveal d1"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-sub)',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              transition: 'border-color .3s,transform .25s var(--ease)',
            }}
          >
            {/* Visual */}
            <div
              style={{
                height: 220,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg,#140426 0%,#2a1165 55%,#0f0820 100%)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 280,
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(124,58,237,.25)',
                    borderRadius: 10,
                    padding: 15,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 6,
                        background: 'linear-gradient(135deg,var(--violet),var(--indigo))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 900,
                        color: '#fff',
                      }}
                    >
                      C
                    </div>
                    <span style={{ fontSize: '.82rem', fontWeight: 700 }}>
                      CampO AI — Dashboard
                    </span>
                  </div>
                  {[
                    ['Enquiries processed / day', '1,240'],
                    ['Avg. response time', '1.8 s'],
                    ['Staff hours saved / wk', '32 hrs'],
                    ['Guardrail trigger rate', '0.3%', true],
                  ].map(([k, v, green]) => (
                    <div
                      key={k as string}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 9px',
                        background: 'rgba(255,255,255,.04)',
                        borderRadius: 6,
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: '.67rem', color: 'var(--lo-sub)' }}>{k}</span>
                      <span
                        style={{
                          fontSize: '.72rem',
                          fontWeight: 700,
                          color: green ? '#34d399' : 'var(--violet-hi)',
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 28px 32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '.72rem',
                    fontWeight: 700,
                    color: 'var(--violet-hi)',
                    background: 'rgba(124,58,237,.1)',
                    border: '1px solid rgba(124,58,237,.2)',
                    padding: '3px 9px',
                    borderRadius: 99,
                  }}
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  CampO AI
                </span>
                <span style={{ fontSize: '.72rem', color: 'var(--lo-muted)' }}>
                  AI-native app · Multi-agent
                </span>
              </div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  letterSpacing: '-.02em',
                  marginBottom: 9,
                }}
              >
                Automating camp management with an AI-first platform
              </h3>
              <p
                style={{
                  fontSize: '.875rem',
                  color: 'var(--lo-sub)',
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                CampO needed to handle thousands of parent enquiries, waitlist management, and
                schedule changes without scaling headcount. We built an orchestrator-routed,
                guardrail-protected platform shipped to production in 6 weeks.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  paddingTop: 18,
                  borderTop: '1px solid var(--border-sub)',
                }}
              >
                {[
                  ['32 hrs', 'Saved / week'],
                  ['1.8 s', 'Avg. latency'],
                  ['6 wk', 'To production'],
                ].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-.04em' }}>
                      {val}
                    </div>
                    <div style={{ fontSize: '.7rem', color: 'var(--lo-sub)' }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '.82rem',
                  fontWeight: 700,
                  color: 'var(--violet-hi)',
                  marginTop: 18,
                  textDecoration: 'none',
                  transition: 'gap .2s',
                }}
              >
                Discuss a similar project
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Placeholder card */}
          <div
            className="reveal d2"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-sub)',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: 220,
                background: 'var(--surface2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(124,58,237,.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '.72rem',
                  color: 'var(--lo-muted)',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                Your
                <br />
                project
                <br />
                here
              </div>
            </div>
            <div style={{ padding: '28px 28px 32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    fontSize: '.72rem',
                    fontWeight: 700,
                    color: 'var(--lo-muted)',
                    background: 'rgba(255,255,255,.04)',
                    border: '1px solid rgba(255,255,255,.08)',
                    padding: '3px 9px',
                    borderRadius: 99,
                  }}
                >
                  Next client
                </span>
                <span style={{ fontSize: '.72rem', color: 'var(--lo-muted)' }}>
                  Your industry · Your stack
                </span>
              </div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  letterSpacing: '-.02em',
                  marginBottom: 9,
                  color: 'var(--lo-sub)',
                }}
              >
                We&apos;re building our next case study
              </h3>
              <p
                style={{
                  fontSize: '.875rem',
                  color: 'var(--lo-sub)',
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}
              >
                Every engagement becomes a template for the next. If you&apos;re working on
                something ambitious — an internal tool, a consumer product, or an agent workflow —
                let&apos;s talk. You could be here.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  paddingTop: 18,
                  borderTop: '1px solid rgba(255,255,255,.04)',
                }}
              >
                {['Outcome', 'Metric', 'Timeline'].map((lbl) => (
                  <div key={lbl}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--lo-muted)' }}>
                      —
                    </div>
                    <div style={{ fontSize: '.7rem', color: 'var(--lo-sub)' }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '.82rem',
                  fontWeight: 700,
                  color: 'var(--violet-hi)',
                  marginTop: 18,
                  textDecoration: 'none',
                }}
              >
                Start a conversation
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
