const proofItems = [
  { num: '10+', desc: 'Products shipped across industries' },
  { num: '6 wks', desc: 'Average idea-to-live product' },
  { num: '5+', desc: 'Verticals served' },
  { num: '100%', desc: 'IP ownership transferred to you' },
]

export function ProofBar() {
  return (
    <section
      id="proof"
      style={{
        padding: 0,
        borderTop: '1px solid var(--border-sub)',
        borderBottom: '1px solid var(--border-sub)',
      }}
    >
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 0,
          }}
          className="proof-row"
        >
          {proofItems.map((item, i) => (
            <div
              key={item.num}
              className={`reveal${i > 0 ? ` d${i}` : ''}`}
              style={{
                padding: '44px 36px',
                position: 'relative',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border-sub)' : undefined,
              }}
            >
              <div
                style={{
                  fontSize: '2.6rem',
                  fontWeight: 900,
                  letterSpacing: '-.05em',
                  background: 'linear-gradient(135deg,#fff 30%,var(--violet-hi))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.num}
              </div>
              <div style={{ fontSize: '.82rem', color: 'var(--lo-sub)', marginTop: 4 }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
