const techLayers = [
  { label: 'UI', pills: ['Next.js', 'Vercel AI SDK', 'shadcn/ui'] },
  { label: 'API', pills: ['tRPC', 'Clerk', 'Zod'] },
  { label: 'Agent', pills: ['LangGraph', 'OpenAI', 'Anthropic', 'Guardrails AI'] },
  { label: 'Memory', pills: ['Supabase', 'pgvector', 'Pinecone', 'Redis'] },
  { label: 'Infra', pills: ['Vercel', 'Docker', 'Railway', 'AWS'] },
  { label: 'Observability', pills: ['LangSmith', 'PostHog', 'Sentry'] },
]

export function TechStack() {
  return (
    <section id="tech" style={{ padding: '112px 0', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Technology
          </div>
          <h2 className="h2">
            A stack chosen
            <br />
            for production AI.
          </h2>
          <p className="lead" style={{ margin: '0 auto' }}>
            Six layers, each selected for reliability, observability, and real-world performance —
            not hype.
          </p>
        </div>

        <div
          className="tech-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 14,
          }}
        >
          {techLayers.map((layer, i) => (
            <div
              key={layer.label}
              className={`reveal d${(i % 3) + 1}`}
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--border-sub)',
                borderRadius: 'var(--r)',
                padding: '20px 22px',
                transition: 'border-color .3s',
              }}
            >
              <div
                style={{
                  fontSize: '.67rem',
                  fontWeight: 800,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--lo-muted)',
                  marginBottom: 13,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--violet)',
                    boxShadow: '0 0 5px var(--violet)',
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
                {layer.label}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {layer.pills.map((pill) => (
                  <span
                    key={pill}
                    style={{
                      fontSize: '.77rem',
                      fontWeight: 500,
                      color: 'var(--lo-sub)',
                      background: 'rgba(255,255,255,.04)',
                      border: '1px solid var(--border-sub)',
                      padding: '4px 11px',
                      borderRadius: 99,
                      transition: 'color .2s,border-color .2s',
                    }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
