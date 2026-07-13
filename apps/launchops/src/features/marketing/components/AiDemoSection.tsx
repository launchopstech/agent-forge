/**
 * AiDemoSection — live inline chat demo powered by Mindrithm.
 * Placed between <CtaBand> and <Contact> on the marketing page.
 *
 * Custom element types are declared in src/types/custom-elements.d.ts
 */

const WIDGET_URL =
  process.env.NODE_ENV === 'development' &&
  (!process.env.NEXT_PUBLIC_WIDGET_URL ||
    process.env.NEXT_PUBLIC_WIDGET_URL === 'http://localhost:3000/widget.js')
    ? '/widget.js'
    : (process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://mindrithm.ai/widget.js')

export function AiDemoSection() {
  const agentId = process.env.NEXT_PUBLIC_DEMO_AGENT_ID?.trim()
  const shareToken = process.env.NEXT_PUBLIC_DEMO_SHARE_TOKEN?.trim()
  const widgetUrl = WIDGET_URL
  const apiUrl =
    process.env.NEXT_PUBLIC_FORGE_API_BASE_URL ??
    process.env.NEXT_PUBLIC_FORGE_API_URL ??
    'https://api.mindrithm.ai'

  return (
    <section
      id="ai-demo"
      style={{
        padding: '100px 0',
        background:
          'linear-gradient(135deg,rgba(79,46,220,.06) 0%,rgba(124,58,237,.04) 60%,transparent 100%)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Copy column */}
        <div style={{ flex: '1', minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fc-brand, #4f2edc)',
              marginBottom: 12,
            }}
          >
            Powered by Mindrithm
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px,4vw,42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 20px',
            }}
          >
            Ask anything.
            <br />
            We&apos;re right here.
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: 'var(--muted-foreground)',
              maxWidth: 400,
              margin: '0 0 24px',
            }}
          >
            Our AI agent knows the LaunchOps playbook inside out — pricing, timelines, case studies,
            and how we work. Start chatting to see if we&apos;re the right fit.
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: 14,
              color: 'var(--muted-foreground)',
            }}
          >
            {['Available 24 / 7', 'Instant, accurate answers', 'Hand-off to a human anytime'].map(
              (item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#4f2edc',
                      color: '#fff',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Widget column */}
        <div
          style={{
            width: 360,
            flexShrink: 0,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06)',
          }}
        >
          {agentId && shareToken ? (
            /* Custom element rendered server-side; widget JS hydrates it client-side */
            <forge-chat
              data-agent-id={agentId}
              data-share-token={shareToken}
              data-api-url={apiUrl}
              data-brand-name="LaunchOps"
              data-brand-color="#4f2edc"
              data-mode="inline"
            />
          ) : (
            /* Placeholder shown when env vars aren't configured */
            <div
              style={{
                height: 480,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                background: '#f9fafb',
                border: '1px dashed #e5e7eb',
                borderRadius: 12,
                color: '#9ca3af',
                fontSize: 13,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" opacity={0.4}>
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <p style={{ margin: 0 }}>
                Chat widget not configured.
                <br />
                Set{' '}
                <code
                  style={{
                    fontSize: 11,
                    background: '#f3f4f6',
                    padding: '2px 4px',
                    borderRadius: 4,
                  }}
                >
                  NEXT_PUBLIC_DEMO_AGENT_ID
                </code>{' '}
                and{' '}
                <code
                  style={{
                    fontSize: 11,
                    background: '#f3f4f6',
                    padding: '2px 4px',
                    borderRadius: 4,
                  }}
                >
                  NEXT_PUBLIC_DEMO_SHARE_TOKEN
                </code>
                .
              </p>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>
                Widget served from:
                <br />
                <a
                  href={widgetUrl}
                  style={{ color: '#4f2edc', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {widgetUrl}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
