export function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '130px 0 90px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.28,
            background: 'radial-gradient(circle,var(--violet),transparent 65%)',
            top: -160,
            right: -140,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 450,
            height: 450,
            borderRadius: '50%',
            filter: 'blur(100px)',
            opacity: 0.28,
            background: 'radial-gradient(circle,var(--indigo),transparent 65%)',
            bottom: -80,
            left: -60,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(124,58,237,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,.04) 1px,transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '0 28px',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
          className="hero-inner"
        >
          {/* Left — copy */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--violet-hi)',
                background: 'rgba(124,58,237,.1)',
                border: '1px solid rgba(124,58,237,.25)',
                padding: '6px 14px',
                borderRadius: 99,
                marginBottom: 30,
              }}
            >
              <span className="dot dot-pulse" />
              Build faster. Launch smarter. Operate better.
            </div>

            <h1
              style={{
                fontSize: 'clamp(3rem,5.5vw,5rem)',
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: '-.05em',
                marginBottom: 26,
              }}
            >
              From idea
              <br />
              to <span className="grad">live product.</span>
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--lo-sub)',
                lineHeight: 1.8,
                maxWidth: 460,
                marginBottom: 40,
              }}
            >
              LaunchOps is your technical co-founder on demand. We design, build, and ship software
              products — from first idea to live in production — without the overhead of a
              traditional agency.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#contact" className="lo-btn lo-btn-vio">
                Launch your project
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#work" className="lo-btn lo-btn-ghost">
                See our work
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 36,
                marginTop: 52,
                paddingTop: 36,
                borderTop: '1px solid var(--border-sub)',
              }}
            >
              {[
                ['6 wk', 'Avg. delivery'],
                ['<120 kb', 'JS budget'],
                ['100%', 'IP transferred'],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <div
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 900,
                      letterSpacing: '-.04em',
                    }}
                  >
                    {val}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--lo-sub)', marginTop: 2 }}>
                    {lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — agent stack diagram */}
          <div className="hero-right" style={{ position: 'relative', height: 500 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Agent nodes */}
              {[
                {
                  bg: 'rgba(124,58,237,.2)',
                  label: 'Orchestrator Agent',
                  sub: 'Task routing · State mgmt',
                  status: '● Active',
                  statusCls: 'st-a',
                  delay: '.1s',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                    </svg>
                  ),
                },
                {
                  bg: 'rgba(79,70,229,.2)',
                  label: 'Planner Agent',
                  sub: 'Decomposition · Priority',
                  status: '◌ Thinking',
                  statusCls: 'st-t',
                  delay: '.22s',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                },
                {
                  bg: 'rgba(16,185,129,.15)',
                  label: 'Executor Agent',
                  sub: 'Tool calls · API actions',
                  status: '● Running',
                  statusCls: 'st-a',
                  delay: '.34s',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                },
                {
                  bg: 'rgba(245,158,11,.15)',
                  label: 'Memory Layer',
                  sub: 'Vector store · Recall',
                  status: '● Ready',
                  statusCls: 'st-r',
                  delay: '.46s',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
                    </svg>
                  ),
                },
                {
                  bg: 'rgba(239,68,68,.12)',
                  label: 'Guardrails',
                  sub: 'Compliance · PII · Audit',
                  status: '● Monitoring',
                  statusCls: 'st-a',
                  delay: '.58s',
                  icon: (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                },
              ].map((node, i) => (
                <div
                  key={node.label}
                  style={{
                    width: 330,
                    padding: '13px 18px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 13,
                    position: 'relative',
                    boxShadow: '0 4px 28px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.04)',
                    marginTop: i > 0 ? 18 : 0,
                    animation: `lo-nf .5s var(--ease) ${node.delay} both`,
                  }}
                >
                  {/* connector line */}
                  {i < 4 && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 1,
                        height: 18,
                        background: 'linear-gradient(to bottom,rgba(124,58,237,.5),transparent)',
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: node.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: 'var(--lo-text)',
                    }}
                  >
                    {node.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '.8rem', fontWeight: 700 }}>{node.label}</div>
                    <div
                      style={{
                        fontSize: '.7rem',
                        color: 'var(--lo-sub)',
                        marginTop: 1,
                      }}
                    >
                      {node.sub}
                    </div>
                  </div>
                  <span
                    style={{
                      marginLeft: 'auto',
                      fontSize: '.62rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 99,
                      flexShrink: 0,
                      ...(node.statusCls === 'st-a'
                        ? {
                            background: 'rgba(16,185,129,.14)',
                            color: '#34d399',
                            animation: 'lo-sp 3s infinite',
                          }
                        : node.statusCls === 'st-t'
                          ? {
                              background: 'rgba(124,58,237,.14)',
                              color: 'var(--violet-hi)',
                              animation: 'lo-sp 2s infinite .4s',
                            }
                          : {
                              background: 'rgba(255,255,255,.05)',
                              color: 'var(--lo-muted)',
                            }),
                    }}
                  >
                    {node.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Chip 1 */}
            <div
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r)',
                padding: '11px 15px',
                animation: 'lo-nf .5s var(--ease) .85s both',
              }}
            >
              <div
                style={{
                  fontSize: '.65rem',
                  color: 'var(--lo-sub)',
                  textTransform: 'uppercase',
                  letterSpacing: '.09em',
                }}
              >
                Tokens / run
              </div>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  color: 'var(--violet-hi)',
                  marginTop: 2,
                }}
              >
                2,847
              </div>
            </div>

            {/* Chip 2 */}
            <div
              style={{
                position: 'absolute',
                bottom: 22,
                left: 18,
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r)',
                padding: '11px 15px',
                animation: 'lo-nf .5s var(--ease) .95s both',
              }}
            >
              <div
                style={{
                  fontSize: '.65rem',
                  color: 'var(--lo-sub)',
                  textTransform: 'uppercase',
                  letterSpacing: '.09em',
                }}
              >
                P95 latency
              </div>
              {[
                { w: 110, label: 'Plan', delay: '1.1s' },
                { w: 74, label: 'Exec', delay: '1.25s' },
                { w: 92, label: 'Guard', delay: '1.4s' },
              ].map(({ w, label, delay }) => (
                <div
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}
                >
                  <div
                    style={{
                      height: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg,var(--violet),var(--violet-hi))',
                      animation: `lo-bg-grow 2s var(--ease) ${delay} both`,
                      width: w,
                    }}
                  />
                  <span style={{ fontSize: '.62rem', color: 'var(--lo-sub)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
