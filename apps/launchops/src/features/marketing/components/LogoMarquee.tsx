const logos = [
  { icon: '◻', name: 'Next.js' },
  { icon: '◍', name: 'Stripe' },
  { icon: '⬢', name: 'Shopify' },
  { icon: '⬡', name: 'OpenAI' },
  { icon: '⊞', name: 'Webflow' },
  { icon: '▲', name: 'Vercel' },
  { icon: '◈', name: 'Anthropic' },
  { icon: '◆', name: 'Supabase' },
  { icon: '◉', name: 'HubSpot' },
  { icon: '⬦', name: 'PostHog' },
  { icon: '◎', name: 'Zapier' },
  { icon: '⬛', name: 'Resend' },
  { icon: '◎', name: 'Twilio' },
]

// Duplicate for seamless marquee loop
const track = [...logos, ...logos]

export function LogoMarquee() {
  return (
    <div
      id="logobar"
      style={{
        padding: '44px 0',
        overflow: 'hidden',
        background: 'linear-gradient(180deg,rgba(14,14,28,.5),transparent)',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontSize: '.72rem',
          fontWeight: 600,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--lo-muted)',
          marginBottom: 28,
        }}
      >
        Trusted tools &amp; ecosystems we build on
      </div>
      <div
        style={{
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)',
          maskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 56,
            width: 'max-content',
            animation: 'lo-marquee 28s linear infinite',
          }}
        >
          {track.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="mlogo">
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                {logo.icon}
              </div>
              <span
                style={{
                  fontSize: '.95rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
